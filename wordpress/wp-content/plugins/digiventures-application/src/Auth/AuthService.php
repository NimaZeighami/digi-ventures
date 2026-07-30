<?php
namespace DigiVentures\Application\Auth;

use DigiVentures\Application\Capabilities\Roles;

defined( 'ABSPATH' ) || exit;

final class AuthService {
	private const LIMIT = 5;

	public function login( string $login, string $password, string $redirect = '' ): array|\WP_Error {
		if ( $this->throttled() ) {
			return new \WP_Error( 'dv_rate_limited', __( 'تلاش‌های ورود بیش از حد است. لطفاً چند دقیقه دیگر تلاش کنید.', 'digiventures-application' ), array( 'status' => 429 ) );
		}
		$user = wp_signon( array( 'user_login' => sanitize_text_field( $login ), 'user_password' => $password, 'remember' => true ), is_ssl() );
		if ( is_wp_error( $user ) ) {
			$this->increase_attempts();
			return new \WP_Error( 'dv_invalid_login', __( 'ایمیل یا گذرواژه صحیح نیست.', 'digiventures-application' ), array( 'status' => 401 ) );
		}
		$this->clear_attempts();
		return array( 'redirect' => $this->safe_destination( $redirect, $user ) );
	}

	public function register( string $email, string $password, string $confirmation ): array|\WP_Error {
		if ( $this->throttled() ) {
			return new \WP_Error( 'dv_rate_limited', __( 'تلاش‌های بیش از حد است. لطفاً چند دقیقه دیگر تلاش کنید.', 'digiventures-application' ), array( 'status' => 429 ) );
		}
		$email = sanitize_email( $email );
		if ( ! is_email( $email ) || strlen( $password ) < 8 || $password !== $confirmation ) {
			return new \WP_Error( 'dv_invalid_registration', __( 'ایمیل یا گذرواژه معتبر نیست.', 'digiventures-application' ), array( 'status' => 400 ) );
		}
		if ( email_exists( $email ) ) {
			$this->increase_attempts();
			return new \WP_Error( 'dv_account_exists', __( 'امکان ایجاد حساب با این اطلاعات وجود ندارد.', 'digiventures-application' ), array( 'status' => 409 ) );
		}
		$user_id = wp_create_user( $email, $password, $email );
		if ( is_wp_error( $user_id ) ) {
			return new \WP_Error( 'dv_registration_failed', __( 'ساخت حساب ممکن نشد.', 'digiventures-application' ), array( 'status' => 500 ) );
		}
		$user = new \WP_User( $user_id );
		$user->set_role( Roles::CUSTOMER );
		wp_set_auth_cookie( $user_id, true, is_ssl() );
		do_action( 'wp_login', $user->user_login, $user );
		$this->clear_attempts();
		return array( 'redirect' => Roles::dashboard_url( $user ) );
	}

	public function lost_password( string $email ): void {
		$email = sanitize_email( $email );
		if ( is_email( $email ) ) {
			retrieve_password( $email );
		}
	}

	public function change_role( \WP_User $actor, int $target_id, string $role ): array|\WP_Error {
		if ( ! user_can( $actor, 'manage_application_protected' ) ) {
			return $this->forbidden();
		}
		$target = get_user_by( 'id', $target_id );
		if ( ! $target || $target->ID === $actor->ID || Roles::is_protected( $target ) || ! in_array( $role, array( Roles::CUSTOMER, Roles::ADMIN ), true ) ) {
			return $this->forbidden();
		}
		$target->set_role( $role );
		return array( 'id' => $target->ID, 'role' => $role );
	}

	private function safe_destination( string $redirect, \WP_User $user ): string {
		$redirect = wp_validate_redirect( esc_url_raw( $redirect ), '' );
		return $redirect ?: Roles::dashboard_url( $user );
	}

	private function attempt_key(): string {
		return 'dv_auth_attempts_' . md5( (string) ( $_SERVER['REMOTE_ADDR'] ?? '' ) );
	}

	private function throttled(): bool {
		return (int) get_transient( $this->attempt_key() ) >= self::LIMIT;
	}

	private function increase_attempts(): void {
		$key = $this->attempt_key();
		set_transient( $key, (int) get_transient( $key ) + 1, 15 * MINUTE_IN_SECONDS );
	}

	private function clear_attempts(): void {
		delete_transient( $this->attempt_key() );
	}

	private function forbidden(): \WP_Error {
		return new \WP_Error( 'dv_forbidden', __( 'شما اجازه انجام این عملیات را ندارید.', 'digiventures-application' ), array( 'status' => 403 ) );
	}
}
