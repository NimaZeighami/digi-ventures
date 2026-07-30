<?php
namespace DigiVentures\Application\Forms;

defined( 'ABSPATH' ) || exit;

final class ContactService {
	public function send( array $input ): array|\WP_Error {
		if ( $this->is_rate_limited() ) {
			return new \WP_Error( 'dv_contact_rate_limited', __( 'تعداد پیام‌ها بیش از حد است. لطفاً کمی بعد تلاش کنید.', 'digiventures-application' ), array( 'status' => 429 ) );
		}
		if ( ! empty( $input['website'] ) ) {
			return array( 'sent' => true );
		}

		$name = sanitize_text_field( $input['contact_name'] ?? '' );
		$email = sanitize_email( $input['contact_email'] ?? '' );
		$subject = sanitize_text_field( $input['contact_subject'] ?? '' );
		$message = sanitize_textarea_field( $input['contact_message'] ?? '' );
		if ( '' === $name || ! is_email( $email ) || '' === $subject || strlen( $message ) < 10 ) {
			return new \WP_Error( 'dv_invalid_contact', __( 'لطفاً همه فیلدهای فرم تماس را به‌درستی تکمیل کنید.', 'digiventures-application' ), array( 'status' => 400 ) );
		}

		$recipient = sanitize_email( (string) get_option( 'dv_contact_recipient', get_option( 'admin_email' ) ) );
		$body = sprintf( "نام: %s\nایمیل: %s\nموضوع: %s\n\n%s", $name, $email, $subject, $message );
		$sent = wp_mail(
			$recipient,
			sprintf( '[DigiVentures] %s', $subject ),
			$body,
			array( 'Reply-To: ' . $name . ' <' . $email . '>' )
		);
		if ( ! $sent ) {
			return new \WP_Error( 'dv_contact_mail_failed', __( 'ارسال پیام ممکن نشد. لطفاً دوباره تلاش کنید.', 'digiventures-application' ), array( 'status' => 500 ) );
		}
		$this->record_attempt();
		return array( 'sent' => true );
	}

	private function key(): string {
		return 'dv_contact_' . md5( (string) ( $_SERVER['REMOTE_ADDR'] ?? '' ) );
	}

	private function is_rate_limited(): bool {
		return (int) get_transient( $this->key() ) >= 3;
	}

	private function record_attempt(): void {
		$key = $this->key();
		set_transient( $key, (int) get_transient( $key ) + 1, HOUR_IN_SECONDS );
	}
}
