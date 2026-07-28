<?php
/**
 * Code-controlled application screens.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core;

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
		add_shortcode( 'dv_request_form', array( __CLASS__, 'request_form' ) );
		add_shortcode( 'dv_customer_dashboard', array( __CLASS__, 'customer_dashboard' ) );
		add_shortcode( 'dv_request_management', array( __CLASS__, 'request_management' ) );
		add_shortcode( 'dv_request_user_management', array( __CLASS__, 'user_management' ) );
		add_shortcode( 'dv_login', array( __CLASS__, 'login' ) );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
	}

	/**
	 * Load application CSS only where an application shortcode is present.
	 *
	 * @return void
	 */
	public static function enqueue_assets() {
		if ( ! is_singular() ) {
			return;
		}
		$post = get_post();
		if ( ! $post ) {
			return;
		}
		$shortcodes = array( 'dv_request_form', 'dv_customer_dashboard', 'dv_request_management', 'dv_request_user_management', 'dv_login' );
		foreach ( $shortcodes as $shortcode ) {
			if ( has_shortcode( $post->post_content, $shortcode ) ) {
				wp_enqueue_style( 'dv-core-application', DV_CORE_URL . 'assets/css/application.css', array(), DV_CORE_VERSION );
				break;
			}
		}
	}

	/**
	 * Render a plugin template with controlled variables.
	 *
	 * @param string               $template Template filename.
	 * @param array<string,mixed> $data Data.
	 * @return string
	 */
	private static function render( $template, $data = array() ) {
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
	 *
	 * @return string
	 */
	public static function notice() {
		$notices = array(
			'submitted' => array( 'success', __( 'Your request was submitted successfully.', 'digiventures-core' ) ),
			'updated' => array( 'success', __( 'Your request was updated.', 'digiventures-core' ) ),
			'decision_saved' => array( 'success', __( 'The request decision was saved.', 'digiventures-core' ) ),
			'role_saved' => array( 'success', __( 'The user role was updated.', 'digiventures-core' ) ),
			'error' => array( 'error', __( 'The request could not be completed. Please review the form and try again.', 'digiventures-core' ) ),
		);
		$key = isset( $_GET['dv_notice'] ) ? sanitize_key( wp_unslash( $_GET['dv_notice'] ) ) : '';
		if ( ! isset( $notices[ $key ] ) ) {
			return '';
		}
		return sprintf( '<div class="dv-alert dv-alert-%1$s" role="status">%2$s</div>', esc_attr( $notices[ $key ][0] ), esc_html( $notices[ $key ][1] ) );
	}

	/**
	 * Request submission/editing form.
	 *
	 * @return string
	 */
	public static function request_form() {
		if ( ! is_user_logged_in() ) {
			return self::render( 'login-required.php', array( 'login_url' => wp_login_url( self::current_url() ) ) );
		}
		if ( ! current_user_can( 'dv_submit_requests' ) ) {
			return self::render( 'forbidden.php' );
		}

		$request_id = isset( $_GET['request_id'] ) ? absint( $_GET['request_id'] ) : 0;
		if ( $request_id && ( ! Request_Type::user_owns_request( $request_id, get_current_user_id() ) || ! Request_Type::customer_can_edit_status( Request_Type::get_status( $request_id ) ) ) ) {
			return self::render( 'forbidden.php' );
		}

		return self::notice() . self::render( 'request-form.php', array( 'request_id' => $request_id ) );
	}

	/**
	 * Customer-owned requests only.
	 *
	 * @return string
	 */
	public static function customer_dashboard() {
		if ( ! is_user_logged_in() ) {
			return self::render( 'login-required.php', array( 'login_url' => wp_login_url( self::current_url() ) ) );
		}
		if ( ! current_user_can( 'dv_read_own_requests' ) ) {
			return self::render( 'forbidden.php' );
		}
		$requests = get_posts( array(
			'post_type' => Request_Type::POST_TYPE,
			'author' => get_current_user_id(),
			'posts_per_page' => 50,
			'orderby' => 'date',
			'order' => 'DESC',
		) );
		return self::notice() . self::render( 'customer-dashboard.php', array( 'requests' => $requests, 'dashboard_url' => self::current_url() ) );
	}

	/**
	 * Request-admin management view.
	 *
	 * @return string
	 */
	public static function request_management() {
		if ( ! current_user_can( 'dv_read_all_requests' ) || ! current_user_can( 'dv_manage_requests' ) ) {
			return self::render( 'forbidden.php' );
		}
		$status = isset( $_GET['status'] ) ? sanitize_key( wp_unslash( $_GET['status'] ) ) : '';
		$args = array(
			'post_type' => Request_Type::POST_TYPE,
			'posts_per_page' => 100,
			'orderby' => 'date',
			'order' => 'DESC',
		);
		if ( array_key_exists( $status, Request_Type::statuses() ) ) {
			$args['meta_key'] = Request_Type::META_STATUS;
			$args['meta_value'] = $status;
		}
		return self::notice() . self::render( 'request-management.php', array( 'requests' => get_posts( $args ), 'selected_status' => $status ) );
	}

	/**
	 * Manager-only Request Administrator membership UI.
	 *
	 * @return string
	 */
	public static function user_management() {
		if ( ! current_user_can( 'dv_manage_request_users' ) ) {
			return self::render( 'forbidden.php' );
		}
		$users = get_users( array( 'orderby' => 'display_name', 'order' => 'ASC' ) );
		return self::notice() . self::render( 'user-management.php', array( 'users' => $users ) );
	}

	/**
	 * WordPress-native login form and reset link.
	 *
	 * @return string
	 */
	public static function login() {
		if ( is_user_logged_in() ) {
			return '<p>' . esc_html__( 'You are already signed in.', 'digiventures-core' ) . '</p>';
		}
		ob_start();
		?>
		<section class="dv-app-panel dv-login-panel">
			<h1><?php echo esc_html( Settings::get( 'login_title' ) ); ?></h1>
			<p><?php echo esc_html( Settings::get( 'login_description' ) ); ?></p>
			<?php wp_login_form( array( 'remember' => true, 'redirect' => self::current_url() ) ); ?>
			<p><a href="<?php echo esc_url( wp_lostpassword_url( self::current_url() ) ); ?>"><?php esc_html_e( 'Forgot your password?', 'digiventures-core' ); ?></a></p>
		</section>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Current public URL for safe login redirects.
	 *
	 * @return string
	 */
	private static function current_url() {
		return is_ssl() ? set_url_scheme( home_url( add_query_arg( array(), $GLOBALS['wp']->request ) ), 'https' ) : home_url( add_query_arg( array(), $GLOBALS['wp']->request ) );
	}
}
