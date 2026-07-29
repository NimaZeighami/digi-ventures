<?php
/**
 * Application shortcodes.
 * All rendering is delegated to the shared rendering layer.
 * Shortcodes and Elementor widgets use identical render paths.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core;

use DV_Core\Rendering\Form_Renderer;
use DV_Core\Rendering\Dashboard_Renderer;
use DV_Core\Rendering\Management_Renderer;
use DV_Core\Rendering\User_Management_Renderer;
use DV_Core\Rendering\Login_Renderer;
use DV_Core\Elementor\Elementor_Integration;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Shortcodes {

	/**
	 * Register application shortcodes.
	 *
	 * @return void
	 */
	public static function init() {
		add_shortcode( 'dv_request_form',            array( __CLASS__, 'request_form' ) );
		add_shortcode( 'dv_customer_dashboard',      array( __CLASS__, 'customer_dashboard' ) );
		add_shortcode( 'dv_request_management',      array( __CLASS__, 'request_management' ) );
		add_shortcode( 'dv_request_user_management', array( __CLASS__, 'user_management' ) );
		add_shortcode( 'dv_login',                   array( __CLASS__, 'login' ) );
		add_action( 'wp_enqueue_scripts',            array( __CLASS__, 'enqueue_assets' ) );
	}

	/**
	 * Load application CSS/JS wherever an application screen will render.
	 *
	 * Detection paths (in order):
	 *   1. has_shortcode() on post_content — editor-placed shortcodes
	 *   2. is_page_template() — theme templates that call do_shortcode() directly
	 *   3. is_page() — known plugin page slugs
	 *   4. Elementor _elementor_data — pages built with Elementor containing DV widgets
	 *
	 * @return void
	 */
	public static function enqueue_assets() {
		$should_load = false;

		// Path 1: shortcode in post_content.
		if ( ! $should_load && is_singular() ) {
			$post = get_post();
			if ( $post ) {
				$tags = array( 'dv_request_form', 'dv_customer_dashboard', 'dv_request_management', 'dv_request_user_management', 'dv_login' );
				foreach ( $tags as $tag ) {
					if ( has_shortcode( $post->post_content, $tag ) ) {
						$should_load = true;
						break;
					}
				}
			}
		}

		// Path 2: theme template that calls do_shortcode() directly.
		if ( ! $should_load ) {
			$templates = array( 'page-investment-request.php', 'page-login.php' );
			foreach ( $templates as $template ) {
				if ( is_page_template( $template ) ) {
					$should_load = true;
					break;
				}
			}
		}

		// Path 3: known plugin page slugs.
		if ( ! $should_load && is_page() ) {
			$slugs = array( 'investment-request', 'login', 'my-requests', 'request-management', 'request-user-management' );
			foreach ( $slugs as $slug ) {
				if ( is_page( $slug ) ) {
					$should_load = true;
					break;
				}
			}
		}

		// Path 4: Elementor-rendered page containing a DigiVentures widget.
		if ( ! $should_load && is_singular() ) {
			$post_id = get_the_ID();
			if ( $post_id && Elementor_Integration::post_has_dv_widget( $post_id ) ) {
				$should_load = true;
			}
		}

		if ( ! $should_load ) {
			return;
		}

		$css_path = DV_CORE_PATH . 'assets/css/application.css';
		$js_path  = DV_CORE_PATH . 'assets/application.js';

		if ( file_exists( $css_path ) ) {
			wp_enqueue_style( 'dv-core-application', DV_CORE_URL . 'assets/css/application.css', array(), filemtime( $css_path ) );
		}
		if ( file_exists( $js_path ) ) {
			wp_enqueue_script( 'dv-core-application', DV_CORE_URL . 'assets/application.js', array(), filemtime( $js_path ), true );
		}
	}

	/**
	 * Investment request submission/edit form.
	 *
	 * @return string
	 */
	public static function request_form() {
		return Form_Renderer::render();
	}

	/**
	 * Customer-owned requests only.
	 *
	 * @return string
	 */
	public static function customer_dashboard() {
		return Dashboard_Renderer::render();
	}

	/**
	 * Request-admin management view.
	 *
	 * @return string
	 */
	public static function request_management() {
		return Management_Renderer::render();
	}

	/**
	 * Manager-only Request Administrator membership UI.
	 *
	 * @return string
	 */
	public static function user_management() {
		return User_Management_Renderer::render();
	}

	/**
	 * Full-screen login form with Persian text.
	 *
	 * @return string
	 */
	public static function login() {
		return Login_Renderer::render();
	}
}
