<?php
namespace DigiVentures\Application\Capabilities;

defined( 'ABSPATH' ) || exit;

final class Roles {
	public const CUSTOMER = 'customer';
	public const ADMIN = 'admin';
	public const SUPER_ADMIN = 'super_admin';

	public static function register(): void {
		$customer = array( 'read' => true, 'create_request' => true, 'view_own_requests' => true, 'edit_own_request' => true );
		$post_caps = array(
			'edit_posts'           => true,
			'edit_others_posts'    => true,
			'publish_posts'        => true,
			'read_private_posts'   => true,
			'upload_files'         => true,
			'delete_posts'         => true,
			'edit_published_posts' => true,
		);
		$admin = array( 'read' => true, 'review_requests' => true, 'change_request_status' => true ) + $post_caps;
		$protected = $admin + array( 'manage_application_settings' => true, 'manage_application_users' => true, 'manage_application_protected' => true );
		self::upsert( self::CUSTOMER, 'DigiVentures Customer', $customer );
		self::upsert( self::ADMIN, 'DigiVentures Admin', $admin );
		self::upsert( self::SUPER_ADMIN, 'DigiVentures Super Admin', $protected );
		// Manager was an early duplicate of Super Admin. Migrate every legacy
		// account before removing it, so no team member loses access on upgrade.
		foreach ( get_users( array( 'role' => 'manager', 'fields' => 'all', 'number' => 2000 ) ) as $manager ) {
			$manager->set_role( self::SUPER_ADMIN );
		}
		remove_role( 'manager' );
		$wordpress_administrator = get_role( 'administrator' );
		if ( $wordpress_administrator ) {
			foreach ( ( $protected + $post_caps ) as $capability => $grant ) {
				if ( $grant ) {
					$wordpress_administrator->add_cap( $capability );
				}
			}
		}
	}

	private static function upsert( string $slug, string $label, array $capabilities ): void {
		$role = get_role( $slug );
		if ( ! $role ) {
			add_role( $slug, $label, $capabilities );
			return;
		}
		foreach ( array( 'create_request', 'view_own_requests', 'edit_own_request', 'review_requests', 'change_request_status', 'manage_application_settings', 'manage_application_users', 'manage_application_protected' ) as $capability ) {
			$role->remove_cap( $capability );
		}
		foreach ( $capabilities as $capability => $grant ) {
			if ( $grant ) {
				$role->add_cap( $capability );
			}
		}
	}

	public static function is_protected( \WP_User $user ): bool {
		return in_array( self::SUPER_ADMIN, (array) $user->roles, true ) || is_super_admin( $user->ID );
	}

	public static function dashboard_url( ?\WP_User $user = null ): string {
		$user = $user ?: wp_get_current_user();
		if ( user_can( $user, 'review_requests' ) ) {
			return self::page_url( 'request-management', '/my-requests/' );
		}
		return self::page_url( 'my-requests', '/' );
	}

	public static function page_url( string $key, string $fallback ): string {
		$pages = (array) get_option( 'dv_app_pages', array() );
		if ( ! empty( $pages[ $key ] ) ) {
			$url = get_permalink( (int) $pages[ $key ] );
			if ( $url ) {
				return $url;
			}
		}
		return home_url( $fallback );
	}
}
