<?php
namespace DigiVentures\Application\Forms;

use DigiVentures\Application\Database\Migrations;
use DigiVentures\Application\Logging\Logger;
use DigiVentures\Application\Validation\RequestValidator;

defined( 'ABSPATH' ) || exit;

final class RequestService {
	public const STATUSES = array( 'draft', 'submitted', 'under_review', 'needs_revision', 'accepted', 'rejected' );
	public const ADMIN_STATUSES = array( 'under_review', 'needs_revision', 'accepted', 'rejected' );

	public function create( \WP_User $user, array $input, array $file ): array|\WP_Error {
		if ( ! user_can( $user, 'create_request' ) ) {
			return $this->forbidden();
		}
		$data = RequestValidator::data( $input );
		if ( is_wp_error( $data ) ) {
			return $data;
		}
		$key = sanitize_text_field( $input['idempotency_key'] ?? '' );
		if ( '' !== $key && ! preg_match( '/^[a-zA-Z0-9_-]{16,64}$/', $key ) ) {
			return new \WP_Error( 'dv_bad_idempotency_key', __( 'شناسه ارسال معتبر نیست.', 'digiventures-application' ), array( 'status' => 400 ) );
		}
		if ( $key ) {
			$existing = $this->find_by_key( $user->ID, $key );
			if ( $existing ) {
				return $existing;
			}
		}
		$attachment = $this->handle_upload( $file );
		if ( is_wp_error( $attachment ) ) {
			return $attachment;
		}
		global $wpdb;
		$now = current_time( 'mysql', true );
		$inserted = $wpdb->insert(
			Migrations::requests_table(),
			$data + array(
				'user_id' => $user->ID,
				'attachment_id' => $attachment['id'],
				'pitch_deck_url' => $attachment['url'],
				'status' => 'submitted',
				'idempotency_key' => $key ?: null,
				'created_at' => $now,
				'updated_at' => $now,
			),
			array( '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s', '%s', '%s' )
		);
		if ( false === $inserted ) {
			Logger::write( 'error', 'Request insertion failed.', array( 'user_id' => $user->ID ) );
			return new \WP_Error( 'dv_persistence_error', __( 'ذخیره درخواست ممکن نشد. دوباره تلاش کنید.', 'digiventures-application' ), array( 'status' => 500 ) );
		}
		$request = $this->get( (int) $wpdb->insert_id, $user );
		if ( ! is_wp_error( $request ) ) {
			$this->send_received_email( $request );
		}
		return $request;
	}

	public function update( int $id, \WP_User $user, array $input, array $file = array() ): array|\WP_Error {
		$request = $this->get( $id, $user );
		if ( is_wp_error( $request ) ) {
			return $request;
		}
		if ( (int) $request['user_id'] !== $user->ID || ! user_can( $user, 'edit_own_request' ) || ! in_array( $request['status'], array( 'draft', 'needs_revision' ), true ) ) {
			return $this->forbidden();
		}
		$data = RequestValidator::data( $input );
		if ( is_wp_error( $data ) ) {
			return $data;
		}
		if ( ! empty( $file['tmp_name'] ) ) {
			$attachment = $this->handle_upload( $file );
			if ( is_wp_error( $attachment ) ) {
				return $attachment;
			}
			$data['attachment_id'] = $attachment['id'];
			$data['pitch_deck_url'] = $attachment['url'];
		}
		$data['status'] = 'submitted';
		$data['updated_at'] = current_time( 'mysql', true );
		global $wpdb;
		$result = $wpdb->update( Migrations::requests_table(), $data, array( 'id' => $id ), null, array( '%d' ) );
		if ( false === $result ) {
			return new \WP_Error( 'dv_persistence_error', __( 'به‌روزرسانی درخواست ممکن نشد.', 'digiventures-application' ), array( 'status' => 500 ) );
		}
		return $this->get( $id, $user );
	}

	public function get( int $id, \WP_User $viewer ): array|\WP_Error {
		global $wpdb;
		$row = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . Migrations::requests_table() . ' WHERE id = %d', $id ), ARRAY_A ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		if ( ! $row ) {
			return new \WP_Error( 'dv_not_found', __( 'درخواست یافت نشد.', 'digiventures-application' ), array( 'status' => 404 ) );
		}
		if ( (int) $row['user_id'] !== $viewer->ID && ! user_can( $viewer, 'review_requests' ) ) {
			return $this->forbidden();
		}
		return $row;
	}

	public function for_user( \WP_User $user ): array {
		global $wpdb;
		return $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . Migrations::requests_table() . ' WHERE user_id = %d ORDER BY updated_at DESC', $user->ID ), ARRAY_A ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	}

	public function all(): array {
		global $wpdb;
		return $wpdb->get_results( 'SELECT * FROM ' . Migrations::requests_table() . ' ORDER BY updated_at DESC LIMIT 200', ARRAY_A ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	}

	public function change_status( int $id, \WP_User $user, string $status, string $message = '', string $note = '' ): array|\WP_Error {
		if ( ! user_can( $user, 'change_request_status' ) || ! in_array( $status, self::ADMIN_STATUSES, true ) ) {
			return $this->forbidden();
		}
		$request = $this->get( $id, $user );
		if ( is_wp_error( $request ) ) {
			return $request;
		}
		global $wpdb;
		$updated = $wpdb->update(
			Migrations::requests_table(),
			array(
				'status' => $status,
				'admin_message' => sanitize_textarea_field( $message ),
				'internal_note' => sanitize_textarea_field( $note ),
				'updated_at' => current_time( 'mysql', true ),
			),
			array( 'id' => $id ),
			array( '%s', '%s', '%s', '%s' ),
			array( '%d' )
		);
		if ( false === $updated ) {
			return new \WP_Error( 'dv_persistence_error', __( 'تغییر وضعیت ممکن نشد.', 'digiventures-application' ), array( 'status' => 500 ) );
		}
		$this->send_status_email( $request, $status, sanitize_textarea_field( $message ) );
		return $this->get( $id, $user );
	}

	public function email_templates(): array {
		$saved = (array) get_option( 'dv_app_email_templates', array() );
		return array_merge( self::default_email_templates(), array_intersect_key( $saved, self::default_email_templates() ) );
	}

	public function update_email_templates( \WP_User $actor, array $templates ): array|\WP_Error {
		if ( ! user_can( $actor, 'manage_application_protected' ) ) {
			return $this->forbidden();
		}
		$clean = array();
		foreach ( array_keys( self::default_email_templates() ) as $key ) {
			$clean[ $key ] = 'subject' === substr( $key, -7 )
				? sanitize_text_field( (string) ( $templates[ $key ] ?? '' ) )
				: sanitize_textarea_field( (string) ( $templates[ $key ] ?? '' ) );
		}
		update_option( 'dv_app_email_templates', $clean, false );
		return $this->email_templates();
	}

	public static function default_email_templates(): array {
		return array(
			'received_subject' => 'DigiVentures | درخواست سرمایه‌گذاری شما دریافت شد',
			'received_body' => "سلام {founder_name}،\n\nدرخواست سرمایه‌گذاری «{startup_name}» با موفقیت دریافت شد و تیم دیجی‌ونچرز آن را بررسی می‌کند.\n\nبا سپاس\nتیم دیجی‌ونچرز",
			'status_subject' => 'DigiVentures | به‌روزرسانی درخواست «{startup_name}»',
			'status_body' => "سلام {founder_name}،\n\nوضعیت درخواست سرمایه‌گذاری «{startup_name}» به «{status}» تغییر کرد.\n\n{message}\n\nبا سپاس\nتیم دیجی‌ونچرز",
		);
	}

	private function handle_upload( array $file ): array|\WP_Error {
		if ( empty( $file['tmp_name'] ) || UPLOAD_ERR_OK !== (int) ( $file['error'] ?? UPLOAD_ERR_NO_FILE ) ) {
			return new \WP_Error( 'dv_upload_required', __( 'بارگذاری فایل ارائه الزامی است.', 'digiventures-application' ), array( 'status' => 400 ) );
		}
		if ( (int) $file['size'] > 20 * 1024 * 1024 ) {
			return new \WP_Error( 'dv_upload_too_large', __( 'حجم فایل باید حداکثر ۲۰ مگابایت باشد.', 'digiventures-application' ), array( 'status' => 400 ) );
		}
		$allowed = array(
			'pdf' => 'application/pdf',
			'ppt' => 'application/vnd.ms-powerpoint',
			'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		);
		$checked = wp_check_filetype_and_ext( $file['tmp_name'], sanitize_file_name( $file['name'] ), $allowed );
		if ( empty( $checked['ext'] ) || ! isset( $allowed[ $checked['ext'] ] ) ) {
			return new \WP_Error( 'dv_upload_type', __( 'فقط فایل PDF، PPT و PPTX مجاز است.', 'digiventures-application' ), array( 'status' => 400 ) );
		}
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';
		$mime_filter = static fn() => $allowed;
		add_filter( 'upload_mimes', $mime_filter );
		$id = media_handle_upload( 'pitch_deck', 0, array(), array( 'test_form' => false, 'mimes' => $allowed ) );
		remove_filter( 'upload_mimes', $mime_filter );
		if ( is_wp_error( $id ) ) {
			Logger::write( 'warning', 'Request deck upload failed.', array( 'error' => $id->get_error_code() ) );
			return new \WP_Error( 'dv_upload_failed', __( 'بارگذاری فایل با خطا روبه‌رو شد.', 'digiventures-application' ), array( 'status' => 400 ) );
		}
		return array( 'id' => (int) $id, 'url' => (string) wp_get_attachment_url( $id ) );
	}

	private function find_by_key( int $user_id, string $key ): ?array {
		global $wpdb;
		$row = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . Migrations::requests_table() . ' WHERE user_id = %d AND idempotency_key = %s LIMIT 1', $user_id, $key ), ARRAY_A ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		return $row ?: null;
	}

	private function send_received_email( array $request ): void {
		$this->send_template( 'received', $request, '', '' );
	}

	private function send_status_email( array $request, string $status, string $message ): void {
		$this->send_template( 'status', $request, $status, $message );
	}

	private function send_template( string $type, array $request, string $status, string $message ): void {
		$templates = $this->email_templates();
		$subject = $templates[ $type . '_subject' ];
		$body = $templates[ $type . '_body' ];
		$replacements = array(
			'{founder_name}' => $request['founder_name'],
			'{startup_name}' => $request['startup_name'],
			'{status}' => $this->status_label( $status ),
			'{message}' => $message ?: 'در حال حاضر اقدام دیگری از شما لازم نیست.',
		);
		wp_mail( $request['email'], strtr( $subject, $replacements ), strtr( $body, $replacements ), array( 'Content-Type: text/plain; charset=UTF-8' ) );
	}

	private function status_label( string $status ): string {
		return array( 'under_review' => 'در حال بررسی', 'needs_revision' => 'نیاز به اصلاح', 'accepted' => 'پذیرفته شده', 'rejected' => 'رد شده' )[ $status ] ?? $status;
	}

	private function forbidden(): \WP_Error {
		return new \WP_Error( 'dv_forbidden', __( 'شما اجازه انجام این عملیات را ندارید.', 'digiventures-application' ), array( 'status' => 403 ) );
	}
}
