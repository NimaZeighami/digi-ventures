<?php
/**
 * Shared rendering service.
 * Both shortcodes and Elementor widgets call these methods.
 * No business logic lives here — only presentation assembly.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Rendering;

use DV_Core\Request_Type;
use DV_Core\Roles;
use DV_Core\Settings;
use DV_Core\Page_Resolver;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Render_Service {

	/**
	 * Render a plugin template with controlled variables.
	 * Centralises the ob_start/extract/include pattern so both
	 * shortcodes and widgets share the same implementation.
	 *
	 * @param string               $template Template filename relative to templates/.
	 * @param array<string,mixed>  $data     Variables to extract into template scope.
	 * @return string
	 */
	public static function render( $template, $data = array() ) {
		$path = DV_CORE_PATH . 'templates/' . $template;
		if ( ! file_exists( $path ) ) {
			return '';
		}
		extract( $data, EXTR_SKIP );
		ob_start();
		include $path;
		return (string) ob_get_clean();
	}

	/**
	 * Display an allowlisted request notice.
	 * Shared by all application screens.
	 *
	 * @return string
	 */
	public static function notice() {
		$notices = array(
			'submitted'      => array( 'success', __( 'Your request was submitted successfully.', 'digiventures-core' ) ),
			'updated'        => array( 'success', __( 'Your request was updated.', 'digiventures-core' ) ),
			'decision_saved' => array( 'success', __( 'The request decision was saved.', 'digiventures-core' ) ),
			'role_saved'     => array( 'success', __( 'The user role was updated.', 'digiventures-core' ) ),
			'error'          => array( 'error',   __( 'The request could not be completed. Please review the form and try again.', 'digiventures-core' ) ),
		);
		$key = isset( $_GET['dv_notice'] ) ? sanitize_key( wp_unslash( $_GET['dv_notice'] ) ) : '';
		if ( ! isset( $notices[ $key ] ) ) {
			return '';
		}
		return sprintf(
			'<div class="dv-alert dv-alert-%1$s" role="status">%2$s</div>',
			esc_attr( $notices[ $key ][0] ),
			esc_html( $notices[ $key ][1] )
		);
	}

	/**
	 * Forbidden message — shared by all screens.
	 *
	 * @return string
	 */
	public static function forbidden() {
		return self::render( 'forbidden.php' );
	}

	/**
	 * Login-required message.
	 *
	 * @return string
	 */
	public static function login_required() {
		return self::render( 'login-required.php', array(
			'login_url' => wp_login_url( self::current_url() ),
		) );
	}

	/**
	 * Current public URL for safe redirects.
	 *
	 * @return string
	 */
	public static function current_url() {
		global $wp;
		if ( isset( $wp->request ) && '' !== $wp->request ) {
			$url = home_url( add_query_arg( array(), $wp->request ) );
		} elseif ( ! empty( $_SERVER['REQUEST_URI'] ) ) {
			$url = home_url( wp_unslash( $_SERVER['REQUEST_URI'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		} else {
			$url = home_url( '/' );
		}
		return is_ssl() ? set_url_scheme( $url, 'https' ) : $url;
	}
}
