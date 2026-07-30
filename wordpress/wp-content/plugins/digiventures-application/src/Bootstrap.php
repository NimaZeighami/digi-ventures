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
		add_action( 'rest_api_init', array( new RestController( $requests, $auth, new ContactService() ), 'register' ) );
		add_action( 'wp_footer', array( $this->renderer, 'auth_modals' ), 5 );
		// Load the application presentation after the parent theme so Hello
		// Elementor cannot overwrite the supplied frontend reset and utilities.
		add_action( 'wp_enqueue_scripts', array( $this, 'assets' ), 100 );
		add_action( 'template_redirect', array( $this, 'frontend_logout' ) );
		add_action( 'admin_init', array( $this, 'redirect_application_users' ) );
		add_filter( 'show_admin_bar', array( $this, 'hide_admin_bar' ) );
		add_action( 'login_init', array( $this, 'redirect_login_screen' ) );
		( new Setup() )->register_admin();
		add_action( 'elementor/widgets/register', array( $this, 'register_elementor_widget' ) );
	}

	public function assets(): void {
		if ( ! is_singular() ) {
			return;
		}
		$page_ids = array_map( 'intval', (array) get_option( 'dv_app_pages', array() ) );
		if ( ! in_array( get_queried_object_id(), $page_ids, true ) && ! has_shortcode( (string) get_post_field( 'post_content', get_queried_object_id() ), 'dv_request_form' ) ) {
			return;
		}
		wp_enqueue_style( 'digiventures-reference', DV_APP_URL . 'assets/css/frontend-reference.css', array(), DV_APP_VERSION );
		wp_enqueue_style( 'digiventures-application', DV_APP_URL . 'assets/css/application.css', array( 'digiventures-reference' ), DV_APP_VERSION );
		wp_enqueue_script( 'digiventures-reference', DV_APP_URL . 'assets/js/frontend-reference.js', array(), DV_APP_VERSION, true );
		wp_enqueue_script( 'digiventures-application', DV_APP_URL . 'assets/js/application.js', array(), DV_APP_VERSION, true );
		wp_add_inline_script( 'digiventures-application', 'window.DV_APP=' . wp_json_encode( array( 'restUrl' => esc_url_raw( rest_url( 'digiventures/v1/' ) ), 'restNonce' => wp_create_nonce( 'wp_rest' ), 'publicNonce' => wp_create_nonce( 'dv_public_auth' ) ) ) . ';', 'before' );
	}

	public function redirect_application_users(): void {
		if ( ! is_user_logged_in() || current_user_can( 'manage_options' ) || wp_doing_ajax() || defined( 'REST_REQUEST' ) ) {
			return;
		}
		wp_safe_redirect( Roles::dashboard_url() );
		exit;
	}

	public function hide_admin_bar( bool $show ): bool {
		return current_user_can( 'manage_options' ) ? $show : false;
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
		if ( in_array( $action, array( 'logout', 'lostpassword', 'retrievepassword', 'resetpass', 'rp', 'postpass' ), true ) || current_user_can( 'manage_options' ) ) {
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
