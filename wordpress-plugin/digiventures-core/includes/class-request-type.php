<?php
/**
 * Private request post type, metadata, and status policy.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Request_Type {
	const POST_TYPE = 'service_request';
	const META_STATUS = '_dv_status';

	/** @var string[] */
	private static $editable_statuses = array( 'draft', 'needs_revision' );

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register' ) );
		add_action( 'init', array( __CLASS__, 'register_meta' ) );
	}

	/**
	 * Register the non-public request type.
	 *
	 * @return void
	 */
	public static function register() {
		register_post_type(
			self::POST_TYPE,
			array(
				'labels' => array(
					'name' => __( 'Service Requests', 'digiventures-core' ),
					'singular_name' => __( 'Service Request', 'digiventures-core' ),
				),
				'public' => false,
				'show_ui' => false,
				'show_in_menu' => false,
				'show_in_rest' => false,
				'supports' => array( 'title', 'author' ),
				'capability_type' => 'post',
				'map_meta_cap' => true,
			)
		);
	}

	/**
	 * Register structured meta with REST intentionally disabled.
	 *
	 * @return void
	 */
	public static function register_meta() {
		$fields = array(
			'startup_name' => 'string',
			'founder_name' => 'string',
			'email' => 'string',
			'phone' => 'string',
			'sector' => 'string',
			'stage' => 'string',
			'description' => 'string',
			'pitch_deck_id' => 'integer',
			'customer_response' => 'string',
			'internal_note' => 'string',
			'status' => 'string',
		);

		foreach ( $fields as $key => $type ) {
			register_post_meta(
				self::POST_TYPE,
				'_dv_' . $key,
				array(
					'type' => $type,
					'single' => true,
					'show_in_rest' => false,
					'auth_callback' => '__return_false',
				)
			);
		}
	}

	/**
	 * Status labels.
	 *
	 * @return array<string,string>
	 */
	public static function statuses() {
		return array(
			'draft' => __( 'Draft', 'digiventures-core' ),
			'submitted' => __( 'Submitted', 'digiventures-core' ),
			'under_review' => __( 'Under review', 'digiventures-core' ),
			'needs_revision' => __( 'Needs revision', 'digiventures-core' ),
			'accepted' => __( 'Accepted', 'digiventures-core' ),
			'rejected' => __( 'Rejected', 'digiventures-core' ),
		);
	}

	/**
	 * Allowed admin statuses.
	 *
	 * @return string[]
	 */
	public static function admin_statuses() {
		return array( 'under_review', 'needs_revision', 'accepted', 'rejected' );
	}

	/**
	 * Get a validated status.
	 *
	 * @param int $request_id Request post ID.
	 * @return string
	 */
	public static function get_status( $request_id ) {
		$status = get_post_meta( $request_id, self::META_STATUS, true );
		return array_key_exists( $status, self::statuses() ) ? $status : 'submitted';
	}

	/**
	 * Whether a customer can edit this status.
	 *
	 * @param string $status Status.
	 * @return bool
	 */
	public static function customer_can_edit_status( $status ) {
		return in_array( $status, self::$editable_statuses, true );
	}

	/**
	 * Customer ownership check.
	 *
	 * @param int $request_id Request ID.
	 * @param int $user_id User ID.
	 * @return bool
	 */
	public static function user_owns_request( $request_id, $user_id ) {
		$request = get_post( $request_id );
		return $request && self::POST_TYPE === $request->post_type && (int) $request->post_author === (int) $user_id;
	}
}
