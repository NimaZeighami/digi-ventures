<?php
namespace DigiVentures\Application;

use DigiVentures\Application\Auth\AuthService;
use DigiVentures\Application\Capabilities\Roles;
use DigiVentures\Application\Database\Migrations;
use DigiVentures\Application\Elementor\Widgets\ApplicationWidget;
use DigiVentures\Application\Forms\RequestService;
use DigiVentures\Application\Forms\ContactService;
use DigiVentures\Application\Http\RestController;
use DigiVentures\Application\Installer\Setup;
use DigiVentures\Application\Seo\SeoService;
use DigiVentures\Application\Support\Renderer;
use DigiVentures\Application\Support\ReferencePages;

defined( 'ABSPATH' ) || exit;

final class Bootstrap {
	private static ?self $instance = null;
	private Renderer $renderer;

	public static function instance(): self {
		return self::$instance ??= new self();
	}

	public static function activate(): void {
		Roles::register();
		Migrations::run();
	}

	public function boot(): void {
		add_action( 'init', array( Roles::class, 'register' ), 1 );
		$requests = new RequestService();
		$this->renderer = new Renderer( $requests );
		$auth = new AuthService();
		add_action( 'init', array( $this->renderer, 'register_shortcodes' ) );
		add_action( 'init', array( new ReferencePages(), 'register' ) );
		( new SeoService() )->register();
		add_action( 'rest_api_init', array( new RestController( $requests, $auth, new ContactService() ), 'register' ) );
		add_action( 'wp_footer', array( $this->renderer, 'auth_modals' ), 5 );
		// Load the application presentation after the parent theme so Hello
		// Elementor cannot overwrite the supplied frontend reset and utilities.
		add_action( 'wp_enqueue_scripts', array( $this, 'assets' ), 100 );
		add_action( 'template_redirect', array( $this, 'frontend_logout' ) );
		add_action( 'admin_init', array( $this, 'redirect_application_users' ) );
		add_filter( 'show_admin_bar', array( $this, 'hide_admin_bar' ) );
		add_action( 'admin_menu', array( $this, 'customize_admin_menu' ) );
		add_action( 'login_init', array( $this, 'redirect_login_screen' ) );
		( new Setup() )->register_admin();
		add_action( 'elementor/widgets/register', array( $this, 'register_elementor_widget' ) );
	}

	public function should_enqueue_assets(): bool {
		if ( is_admin() ) {
			return false;
		}

		$filtered = apply_filters( 'dv_enqueue_application_assets', null );
		if ( null !== $filtered ) {
			return (bool) $filtered;
		}

		if ( is_singular() ) {
			$post_id  = get_queried_object_id();
			$page_ids = array_map( 'intval', (array) get_option( 'dv_app_pages', array() ) );

			// Core DigiVentures managed pages.
			if ( in_array( $post_id, $page_ids, true ) ) {
				return true;
			}

			// Single blog / news posts.
			if ( is_singular( 'post' ) ) {
				return true;
			}

			// Templates belonging to DigiVentures child theme.
			$template = (string) get_post_meta( $post_id, '_wp_page_template', true );
			if ( in_array( $template, array( 'dv-canvas.php', 'dv-page.php' ), true ) ) {
				return true;
			}

			// Any post/page containing any DigiVentures shortcode.
			$content = (string) get_post_field( 'post_content', $post_id );
			if ( 1 === preg_match( '/\[dv_[a-z0-9_]+/i', $content ) ) {
				return true;
			}
		}

		// Blog index, search, or archives if child theme is active.
		if ( is_home() || is_archive() || is_search() ) {
			if ( is_child_theme() && 'digiventures-hello-child' === get_stylesheet() ) {
				return true;
			}
		}

		return false;
	}

	public function assets(): void {
		if ( ! $this->should_enqueue_assets() ) {
			return;
		}
		wp_enqueue_style( 'digiventures-reference', DV_APP_URL . 'assets/css/frontend-reference.css', array(), DV_APP_VERSION );
		wp_enqueue_style( 'digiventures-application', DV_APP_URL . 'assets/css/application.css', array( 'digiventures-reference' ), DV_APP_VERSION );
		wp_enqueue_script( 'digiventures-reference', DV_APP_URL . 'assets/js/frontend-reference.js', array(), DV_APP_VERSION, true );
		wp_enqueue_script( 'digiventures-application', DV_APP_URL . 'assets/js/application.js', array(), DV_APP_VERSION, true );
		wp_add_inline_script( 'digiventures-application', 'window.DV_APP=' . wp_json_encode( array( 'restUrl' => esc_url_raw( rest_url( 'digiventures/v1/' ) ), 'restNonce' => wp_create_nonce( 'wp_rest' ), 'publicNonce' => wp_create_nonce( 'dv_public_auth' ) ) ) . ';', 'before' );
	}

	public function redirect_application_users(): void {
		if ( ! is_user_logged_in() || wp_doing_ajax() || wp_doing_cron() || defined( 'REST_REQUEST' ) ) {
			return;
		}
		$allowed = current_user_can( 'manage_options' ) || current_user_can( 'edit_posts' );
		if ( apply_filters( 'dv_allow_wp_admin_access', $allowed, wp_get_current_user() ) ) {
			return;
		}
		wp_safe_redirect( Roles::dashboard_url() );
		exit;
	}

	public function hide_admin_bar( bool $show ): bool {
		$allowed = current_user_can( 'manage_options' ) || current_user_can( 'edit_posts' );
		return (bool) apply_filters( 'dv_show_admin_bar', $allowed, wp_get_current_user() ) ? $show : false;
	}

	public function customize_admin_menu(): void {
		global $menu, $submenu;
		if ( is_array( $menu ) ) {
			foreach ( $menu as $key => $item ) {
				if ( isset( $item[2] ) && 'edit.php' === $item[2] ) {
					$menu[ $key ][0] = 'اخبار و وبلاگ';
					break;
				}
			}
		}
		if ( isset( $submenu['edit.php'] ) ) {
			if ( isset( $submenu['edit.php'][5] ) ) {
				$submenu['edit.php'][5][0] = 'همه اخبار و مقالات';
			}
			if ( isset( $submenu['edit.php'][10] ) ) {
				$submenu['edit.php'][10][0] = 'افزودن خبر / نوشته جدید';
			}
			if ( isset( $submenu['edit.php'][15] ) ) {
				$submenu['edit.php'][15][0] = 'دسته‌بندی‌ها';
			}
		}
	}

	public function frontend_logout(): void {
		if ( 'POST' !== strtoupper( (string) ( $_SERVER['REQUEST_METHOD'] ?? '' ) ) || 'logout' !== sanitize_key( $_POST['dv_action'] ?? '' ) ) {
			return;
		}
		if ( ! is_user_logged_in() || ! isset( $_POST['_dv_logout_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['_dv_logout_nonce'] ) ), 'dv_frontend_logout' ) ) {
			wp_die( esc_html__( 'درخواست خروج معتبر نیست.', 'digiventures-application' ), '', array( 'response' => 403 ) );
		}
		wp_logout();
		wp_safe_redirect( add_query_arg( 'dv_notice', 'logged_out', home_url( '/' ) ) );
		exit;
	}

	public function redirect_login_screen(): void {
		$action = sanitize_key( $_REQUEST['action'] ?? 'login' ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( in_array( $action, array( 'logout', 'lostpassword', 'retrievepassword', 'resetpass', 'rp', 'postpass' ), true ) || current_user_can( 'manage_options' ) || isset( $_GET['dv_admin'] ) ) {
			return;
		}
		if ( ! apply_filters( 'dv_redirect_login_screen', true ) ) {
			return;
		}
		wp_safe_redirect( Roles::page_url( 'login', '/login/' ) );
		exit;
	}

	public function register_elementor_widget( $manager ): void {
		if ( ! class_exists( '\\Elementor\\Widget_Base' ) ) {
			return;
		}
		$manager->register( new ApplicationWidget() );
	}
}
