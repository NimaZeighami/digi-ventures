<?php
/**
 * Elementor integration entry point.
 * Detects Elementor, registers widgets, and shows an admin notice when absent.
 * This file is safe to load even when Elementor is not installed.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Elementor_Integration {

	/**
	 * Minimum required Elementor version.
	 */
	const MIN_ELEMENTOR_VERSION = '3.0.0';

	/**
	 * Widget names that trigger plugin asset loading.
	 *
	 * @var string[]
	 */
	public static $widget_names = array(
		'dv-request-form',
		'dv-customer-dashboard',
		'dv-request-management',
		'dv-user-management',
		'dv-login',
	);

	/**
	 * Whether Elementor is available and meets the minimum version.
	 *
	 * @return bool
	 */
	public static function is_available() {
		if ( ! did_action( 'elementor/loaded' ) ) {
			return false;
		}
		if ( ! defined( 'ELEMENTOR_VERSION' ) ) {
			return false;
		}
		return version_compare( ELEMENTOR_VERSION, self::MIN_ELEMENTOR_VERSION, '>=' );
	}

	/**
	 * Register hooks. Safe to call regardless of Elementor availability.
	 */
	public static function init() {
		if ( self::is_available() ) {
			add_action( 'elementor/elements/categories_registered', array( __CLASS__, 'register_category' ) );
			add_action( 'elementor/widgets/register', array( __CLASS__, 'register_widgets' ) );
		} else {
			add_action( 'admin_notices', array( __CLASS__, 'admin_notice' ) );
		}
	}

	/**
	 * Register the DigiVentures widget category so widgets appear in the panel.
	 *
	 * @param \Elementor\Elements_Manager $elements_manager
	 */
	public static function register_category( $elements_manager ) {
		$elements_manager->add_category(
			'digiventures',
			array(
				'title' => __( 'DigiVentures', 'digiventures-core' ),
				'icon'  => 'eicon-apps',
			)
		);
	}

	/**
	 * Register all DigiVentures widgets with Elementor.
	 *
	 * @param \Elementor\Widgets_Manager $widgets_manager
	 */
	public static function register_widgets( $widgets_manager ) {
		$files = array(
			'class-request-form-widget.php'       => __NAMESPACE__ . '\Widgets\Request_Form_Widget',
			'class-dashboard-widget.php'          => __NAMESPACE__ . '\Widgets\Dashboard_Widget',
			'class-management-widget.php'         => __NAMESPACE__ . '\Widgets\Management_Widget',
			'class-user-management-widget.php'    => __NAMESPACE__ . '\Widgets\User_Management_Widget',
			'class-login-widget.php'              => __NAMESPACE__ . '\Widgets\Login_Widget',
		);

		foreach ( $files as $file => $class ) {
			$path = DV_CORE_PATH . 'includes/elementor/widgets/' . $file;
			if ( file_exists( $path ) ) {
				require_once $path;
				if ( class_exists( $class ) ) {
					$widgets_manager->register( new $class() );
				}
			}
		}
	}

	/**
	 * Admin notice when Elementor is missing or too old.
	 */
	public static function admin_notice() {
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return;
		}

		if ( ! did_action( 'elementor/loaded' ) ) {
			$message = __( 'DigiVentures Core requires Elementor to be installed and activated. Shortcode fallback is active.', 'digiventures-core' );
		} else {
			$message = sprintf(
				/* translators: %s: minimum Elementor version */
				__( 'DigiVentures Core requires Elementor version %s or higher.', 'digiventures-core' ),
				self::MIN_ELEMENTOR_VERSION
			);
		}

		printf(
			'<div class="notice notice-warning is-dismissible"><p>%s</p></div>',
			esc_html( $message )
		);
	}

	/**
	 * Check whether a post's Elementor data contains any DigiVentures widget.
	 * Used by the asset loading system to detect Elementor-rendered app pages.
	 *
	 * @param int $post_id
	 * @return bool
	 */
	public static function post_has_dv_widget( $post_id ) {
		$data = get_post_meta( $post_id, '_elementor_data', true );
		if ( ! $data ) {
			return false;
		}

		// _elementor_data may be a JSON string or an array.
		if ( is_string( $data ) ) {
			$data = json_decode( $data, true );
		}

		if ( ! is_array( $data ) ) {
			return false;
		}

		return self::search_elements_for_widget( $data );
	}

	/**
	 * Recursively search Elementor element tree for a DigiVentures widget.
	 *
	 * @param array $elements
	 * @return bool
	 */
	private static function search_elements_for_widget( $elements ) {
		foreach ( $elements as $element ) {
			if ( ! is_array( $element ) ) {
				continue;
			}

			// Widget node.
			if ( isset( $element['widgetType'] ) && in_array( $element['widgetType'], self::$widget_names, true ) ) {
				return true;
			}

			// Recurse into child elements.
			if ( isset( $element['elements'] ) && is_array( $element['elements'] ) ) {
				if ( self::search_elements_for_widget( $element['elements'] ) ) {
					return true;
				}
			}
		}
		return false;
	}
}
