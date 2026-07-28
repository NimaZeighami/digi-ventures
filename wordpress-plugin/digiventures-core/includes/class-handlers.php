<?php
/**
 * Secure state-changing application handlers.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Handlers {
	/**
	 * Register authenticated admin-post actions.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'admin_post_dv_core_submit_request', array( __CLASS__, 'submit_request' ) );
		add_action( 'admin_post_dv_core_update_request', array( __CLASS__, 'update_request' ) );
		add_action( 'admin_post_dv_core_update_status', array( __CLASS__, 'update_status' ) );
		add_action( 'admin_post_dv_core_update_request_role', array( __CLASS__, 'update_request_role' ) );
	}

	/**
	 * Create a submitted request.
	 *
	 * @return void
	 */
	public static function submit_request() {
		self::verify( 'dv_core_submit_request', 'dv_core_nonce', 'dv_submit_requests' );
		$data = self::request_data();
		if ( is_wp_error( $data ) ) {
			self::redirect( 'error' );
		}

		$request_id = wp_insert_post(
			array(
				'post_type' => Request_Type::POST_TYPE,
				'post_status' => 'publish',
				'post_title' => $data['startup_name'],
				'post_author' => get_current_user_id(),
			),
			true
		);
		if ( is_wp_error( $request_id ) ) {
			self::redirect( 'error' );
		}

		if ( ! self::save_request_data( $request_id, $data ) ) {
			wp_delete_post( $request_id, true );
			self::redirect( 'error' );
		}
		update_post_meta( $request_id, Request_Type::META_STATUS, 'submitted' );
		self::redirect( 'submitted' );
	}

	/**
	 * Update a customer-owned request only when its state permits.
	 *
	 * @return void
	 */
	public static function update_request() {
		self::verify( 'dv_core_update_request', 'dv_core_nonce', 'dv_edit_own_requests' );
		$request_id = isset( $_POST['request_id'] ) ? absint( $_POST['request_id'] ) : 0;
		if ( ! Request_Type::user_owns_request( $request_id, get_current_user_id() ) || ! Request_Type::customer_can_edit_status( Request_Type::get_status( $request_id ) ) ) {
			self::redirect( 'error' );
		}
		$data = self::request_data();
		if ( is_wp_error( $data ) || ! self::save_request_data( $request_id, $data, false ) ) {
			self::redirect( 'error' );
		}
		wp_update_post( array( 'ID' => $request_id, 'post_title' => $data['startup_name'] ) );
		update_post_meta( $request_id, Request_Type::META_STATUS, 'submitted' );
		self::redirect( 'updated' );
	}

	/**
	 * Apply an authorized administrator decision and optional notification.
	 *
	 * @return void
	 */
	public static function update_status() {
		self::verify( 'dv_core_update_status', 'dv_core_nonce', 'dv_manage_requests' );
		$request_id = isset( $_POST['request_id'] ) ? absint( $_POST['request_id'] ) : 0;
		$status = isset( $_POST['status'] ) ? sanitize_key( wp_unslash( $_POST['status'] ) ) : '';
		if ( Request_Type::POST_TYPE !== get_post_type( $request_id ) || ! in_array( $status, Request_Type::admin_statuses(), true ) ) {
			self::redirect( 'error' );
		}

		$admin_message = isset( $_POST['admin_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['admin_message'] ) ) : '';
		$internal_note = isset( $_POST['internal_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['internal_note'] ) ) : '';
		update_post_meta( $request_id, Request_Type::META_STATUS, $status );
		update_post_meta( $request_id, '_dv_internal_note', $internal_note );

		$template = '';
		if ( 'accepted' === $status ) {
			$template = Settings::get( 'acceptance_template' );
		} elseif ( 'rejected' === $status ) {
			$template = Settings::get( 'rejection_template' );
		}
		$message = $template ? Settings::render_message( $template, $request_id, $admin_message ) : $admin_message;
		update_post_meta( $request_id, '_dv_customer_response', $message );

		$email = sanitize_email( (string) get_post_meta( $request_id, '_dv_email', true ) );
		if ( $email && $message ) {
			wp_mail( $email, sprintf( __( 'Request update #%d', 'digiventures-core' ), $request_id ), $message );
		}
		self::redirect( 'decision_saved' );
	}

	/**
	 * Promote or demote only the Request Administrator application role.
	 *
	 * @return void
	 */
	public static function update_request_role() {
		self::verify( 'dv_core_update_request_role', 'dv_core_nonce', 'dv_manage_request_users' );
		$user_id = isset( $_POST['user_id'] ) ? absint( $_POST['user_id'] ) : 0;
		$operation = isset( $_POST['operation'] ) ? sanitize_key( wp_unslash( $_POST['operation'] ) ) : '';
		$user = get_user_by( 'id', $user_id );
		if ( ! $user || Roles::is_protected_administrator( $user ) || ! in_array( $operation, array( 'promote', 'demote' ), true ) ) {
			self::redirect( 'error' );
		}
		if ( 'promote' === $operation ) {
			if ( ! in_array( Roles::CUSTOMER, (array) $user->roles, true ) && ! in_array( Roles::ADMIN, (array) $user->roles, true ) ) {
				self::redirect( 'error' );
			}
			$user->add_role( Roles::ADMIN );
		} else {
			$user->remove_role( Roles::ADMIN );
		}
		self::redirect( 'role_saved' );
	}

	/**
	 * Verify authentication, nonce, and custom capability.
	 *
	 * @param string $action Nonce action.
	 * @param string $field Nonce field.
	 * @param string $capability Capability.
	 * @return void
	 */
	private static function verify( $action, $field, $capability ) {
		if ( ! is_user_logged_in() || ! current_user_can( $capability ) ) {
			wp_die( esc_html__( 'You are not allowed to perform this action.', 'digiventures-core' ), 403 );
		}
		check_admin_referer( $action, $field );
	}

	/**
	 * Validate and sanitize request fields against explicit allowlists.
	 *
	 * @return array<string,string>|\WP_Error
	 */
	private static function request_data() {
		$data = array(
			'startup_name' => isset( $_POST['startup_name'] ) ? sanitize_text_field( wp_unslash( $_POST['startup_name'] ) ) : '',
			'founder_name' => isset( $_POST['founder_name'] ) ? sanitize_text_field( wp_unslash( $_POST['founder_name'] ) ) : '',
			'email' => isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '',
			'phone' => isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '',
			'sector' => isset( $_POST['sector'] ) ? sanitize_key( wp_unslash( $_POST['sector'] ) ) : '',
			'stage' => isset( $_POST['stage'] ) ? sanitize_key( wp_unslash( $_POST['stage'] ) ) : '',
			'description' => isset( $_POST['description'] ) ? sanitize_textarea_field( wp_unslash( $_POST['description'] ) ) : '',
		);
		$sectors = array( 'ecommerce', 'fintech', 'platform', 'supply_chain', 'ai', 'other' );
		$stages = array( 'seed', 'early', 'growth', 'scale' );
		if ( ! $data['startup_name'] || ! $data['founder_name'] || ! is_email( $data['email'] ) || ! $data['phone'] || ! in_array( $data['sector'], $sectors, true ) || ! in_array( $data['stage'], $stages, true ) || ! $data['description'] ) {
			return new \WP_Error( 'invalid_request', __( 'Invalid request data.', 'digiventures-core' ) );
		}
		return $data;
	}

	/**
	 * Save request meta and a validated optional/new pitch deck.
	 *
	 * @param int                 $request_id Request ID.
	 * @param array<string,string> $data Sanitized request data.
	 * @param bool                $require_file Require upload.
	 * @return bool
	 */
	private static function save_request_data( $request_id, $data, $require_file = true ) {
		foreach ( $data as $key => $value ) {
			update_post_meta( $request_id, '_dv_' . $key, $value );
		}
		$file_present = isset( $_FILES['pitch_deck'] ) && ! empty( $_FILES['pitch_deck']['name'] );
		if ( ! $file_present ) {
			return ! $require_file;
		}
		if ( ! isset( $_FILES['pitch_deck']['size'] ) || (int) $_FILES['pitch_deck']['size'] > 20 * 1024 * 1024 ) {
			return false;
		}
		$filename = sanitize_file_name( (string) $_FILES['pitch_deck']['name'] );
		$extension = strtolower( pathinfo( $filename, PATHINFO_EXTENSION ) );
		if ( ! in_array( $extension, array( 'pdf', 'ppt', 'pptx' ), true ) ) {
			return false;
		}
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';
		$attachment_id = media_handle_upload( 'pitch_deck', $request_id, array(), array( 'test_form' => false, 'mimes' => array( 'pdf' => 'application/pdf', 'ppt' => 'application/vnd.ms-powerpoint', 'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ) ) );
		if ( is_wp_error( $attachment_id ) ) {
			return false;
		}
		update_post_meta( $request_id, '_dv_pitch_deck_id', (int) $attachment_id );
		return true;
	}

	/**
	 * Redirect only to the same safe originating host.
	 *
	 * @param string $notice Notice key.
	 * @return void
	 */
	private static function redirect( $notice ) {
		$url = wp_get_referer();
		if ( ! $url ) {
			$url = home_url( '/' );
		}
		wp_safe_redirect( add_query_arg( 'dv_notice', $notice, $url ) );
		exit;
	}
}
