<?php
/**
 * Application roles and capabilities.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Roles {
	const CUSTOMER = 'request_customer';
	const ADMIN    = 'request_admin';
	const MANAGER  = 'request_manager';

	/** @var string[] */
	private static $capabilities = array(
		'dv_submit_requests',
		'dv_read_own_requests',
		'dv_edit_own_requests',
		'dv_read_all_requests',
		'dv_manage_requests',
		'dv_manage_request_users',
		'dv_manage_settings',
	);

	/**
	 * Keep newly registered users in the customer role when no role is supplied.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'user_register', array( __CLASS__, 'ensure_customer_role' ) );
	}

	/**
	 * Add all application roles and grant native administrators compatibility caps.
	 *
	 * @return void
	 */
	public static function install() {
		self::add_role( self::CUSTOMER, __( 'Request Customer', 'digiventures-core' ), array(
			'dv_submit_requests',
			'dv_read_own_requests',
			'dv_edit_own_requests',
		) );

		self::add_role( self::ADMIN, __( 'Request Administrator', 'digiventures-core' ), array(
			'dv_read_all_requests',
			'dv_manage_requests',
			'dv_manage_settings',
		) );

		self::add_role( self::MANAGER, __( 'Request Manager', 'digiventures-core' ), array(
			'dv_read_all_requests',
			'dv_manage_requests',
			'dv_manage_request_users',
			'dv_manage_settings',
		) );

		$administrator = get_role( 'administrator' );
		if ( $administrator ) {
			foreach ( self::$capabilities as $capability ) {
				$administrator->add_cap( $capability );
			}
		}
	}

	/**
	 * Add caps idempotently to an application role.
	 *
	 * @param string   $slug Role slug.
	 * @param string   $label Display name.
	 * @param string[] $capabilities Capabilities.
	 * @return void
	 */
	private static function add_role( $slug, $label, $capabilities ) {
		$role = get_role( $slug );
		if ( ! $role ) {
			$role = add_role( $slug, $label, array( 'read' => true ) );
		}

		if ( ! $role ) {
			return;
		}

		$role->add_cap( 'read' );
		foreach ( $capabilities as $capability ) {
			$role->add_cap( $capability );
		}
	}

	/**
	 * Ensure users created by the app can use customer screens.
	 *
	 * @param int $user_id User ID.
	 * @return void
	 */
	public static function ensure_customer_role( $user_id ) {
		$user = get_user_by( 'id', $user_id );
		if ( $user && ! self::is_protected_administrator( $user ) && ! in_array( self::CUSTOMER, (array) $user->roles, true ) ) {
			$user->add_role( self::CUSTOMER );
		}
	}

	/**
	 * Check whether a user is protected by native administrator privileges.
	 *
	 * @param \WP_User $user User.
	 * @return bool
	 */
	public static function is_protected_administrator( $user ) {
		return $user instanceof \WP_User && user_can( $user, 'manage_options' );
	}
}
