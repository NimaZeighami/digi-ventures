<?php
namespace DigiVentures\Application\Http;

use DigiVentures\Application\Auth\AuthService;
use DigiVentures\Application\Forms\RequestService;
use DigiVentures\Application\Forms\ContactService;

defined( 'ABSPATH' ) || exit;

final class RestController {
	public function __construct( private RequestService $requests, private AuthService $auth, private ContactService $contact ) {}

	public function register(): void {
		$ns = 'digiventures/v1';
		register_rest_route( $ns, '/auth/login', array( 'methods' => 'POST', 'callback' => array( $this, 'login' ), 'permission_callback' => array( $this, 'public_nonce' ) ) );
		register_rest_route( $ns, '/auth/register', array( 'methods' => 'POST', 'callback' => array( $this, 'signup' ), 'permission_callback' => array( $this, 'public_nonce' ) ) );
		register_rest_route( $ns, '/auth/lost-password', array( 'methods' => 'POST', 'callback' => array( $this, 'lost_password' ), 'permission_callback' => array( $this, 'public_nonce' ) ) );
		register_rest_route( $ns, '/contact', array( 'methods' => 'POST', 'callback' => array( $this, 'contact' ), 'permission_callback' => array( $this, 'public_nonce' ) ) );
		register_rest_route( $ns, '/requests', array( 'methods' => 'POST', 'callback' => array( $this, 'create_request' ), 'permission_callback' => array( $this, 'capability' ) ) );
		register_rest_route( $ns, '/requests/(?P<id>\\d+)', array( 'methods' => 'GET', 'callback' => array( $this, 'get_request' ), 'permission_callback' => array( $this, 'capability' ) ) );
		register_rest_route( $ns, '/requests/(?P<id>\\d+)', array( 'methods' => 'POST', 'callback' => array( $this, 'update_request' ), 'permission_callback' => array( $this, 'capability' ) ) );
		register_rest_route( $ns, '/requests/(?P<id>\\d+)/status', array( 'methods' => 'POST', 'callback' => array( $this, 'change_status' ), 'permission_callback' => array( $this, 'capability' ) ) );
		register_rest_route( $ns, '/requests/(?P<id>\\d+)/download', array( 'methods' => 'GET', 'callback' => array( $this, 'download' ), 'permission_callback' => array( $this, 'capability' ) ) );
		register_rest_route( $ns, '/users/(?P<id>\\d+)/role', array( 'methods' => 'POST', 'callback' => array( $this, 'change_role' ), 'permission_callback' => array( $this, 'capability' ) ) );
		register_rest_route( $ns, '/email-templates', array( 'methods' => 'POST', 'callback' => array( $this, 'update_email_templates' ), 'permission_callback' => array( $this, 'capability' ) ) );
	}

	public function public_nonce( \WP_REST_Request $request ): bool|\WP_Error {
		$nonce = (string) $request->get_header( 'X-DV-Nonce' );
		if ( ! $nonce || ! wp_verify_nonce( $nonce, 'dv_public_auth' ) ) {
			return new \WP_Error( 'dv_bad_nonce', __( 'درخواست نامعتبر است.', 'digiventures-application' ), array( 'status' => 403 ) );
		}
		return true;
	}

	public function capability( \WP_REST_Request $request ): bool|\WP_Error {
		if ( ! is_user_logged_in() ) {
			return new \WP_Error( 'rest_forbidden', __( 'ورود لازم است.', 'digiventures-application' ), array( 'status' => 401 ) );
		}
		$nonce = (string) $request->get_header( 'X-WP-Nonce' );
		if ( ! $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new \WP_Error( 'dv_bad_nonce', __( 'درخواست نامعتبر است.', 'digiventures-application' ), array( 'status' => 403 ) );
		}
		return true;
	}

	public function login( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$result = $this->auth->login( (string) $request['login'], (string) $request['password'], (string) $request['redirect'] );
		return $this->response( $result, __( 'ورود با موفقیت انجام شد.', 'digiventures-application' ) );
	}

	public function signup( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$result = $this->auth->register( (string) $request['email'], (string) $request['password'], (string) $request['password_confirmation'] );
		return $this->response( $result, __( 'حساب شما ساخته شد.', 'digiventures-application' ) );
	}

	public function lost_password( \WP_REST_Request $request ): \WP_REST_Response {
		$this->auth->lost_password( (string) $request['email'] );
		return new \WP_REST_Response( array( 'message' => __( 'اگر حسابی با این ایمیل وجود داشته باشد، راهنمای بازیابی برای آن ارسال می‌شود.', 'digiventures-application' ) ) );
	}

	public function contact( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		return $this->response( $this->contact->send( $request->get_params() ), __( 'پیام شما با موفقیت ارسال شد.', 'digiventures-application' ) );
	}

	public function create_request( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$result = $this->requests->create( wp_get_current_user(), $request->get_params(), $_FILES['pitch_deck'] ?? array() ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
		return $this->response( $result, __( 'درخواست شما ثبت شد.', 'digiventures-application' ) );
	}

	public function get_request( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		return $this->response( $this->requests->get( (int) $request['id'], wp_get_current_user() ), '' );
	}

	public function update_request( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$result = $this->requests->update( (int) $request['id'], wp_get_current_user(), $request->get_params(), $_FILES['pitch_deck'] ?? array() ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
		return $this->response( $result, __( 'درخواست شما دوباره برای بررسی ارسال شد.', 'digiventures-application' ) );
	}

	public function change_status( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$result = $this->requests->change_status( (int) $request['id'], wp_get_current_user(), sanitize_key( $request['status'] ), (string) $request['admin_message'], (string) $request['internal_note'] );
		return $this->response( $result, __( 'وضعیت درخواست به‌روزرسانی شد.', 'digiventures-application' ) );
	}

	public function download( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$row = $this->requests->get( (int) $request['id'], wp_get_current_user() );
		if ( is_wp_error( $row ) ) {
			return $row;
		}
		$url = ! empty( $row['attachment_id'] ) ? wp_get_attachment_url( (int) $row['attachment_id'] ) : '';
		if ( ! $url ) {
			return new \WP_Error( 'dv_no_attachment', __( 'فایل یافت نشد.', 'digiventures-application' ), array( 'status' => 404 ) );
		}
		return new \WP_REST_Response( array( 'url' => esc_url_raw( $url ) ) );
	}

	public function change_role( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$result = $this->auth->change_role( wp_get_current_user(), (int) $request['id'], sanitize_key( $request['role'] ) );
		return $this->response( $result, __( 'نقش کاربر به‌روزرسانی شد.', 'digiventures-application' ) );
	}

	public function update_email_templates( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$result = $this->requests->update_email_templates( wp_get_current_user(), $request->get_params() );
		return $this->response( $result, __( 'محتوای ایمیل‌ها ذخیره شد.', 'digiventures-application' ) );
	}

	private function response( array|\WP_Error $result, string $message ): \WP_REST_Response|\WP_Error {
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		return new \WP_REST_Response( array( 'message' => $message, 'data' => $result ) );
	}
}
