<?php
/**
 * Central page ID storage and URL resolver.
 * Replaces all hardcoded URLs and slug-based lookups.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Page_Resolver {

	const OPTION = 'dv_page_ids';

	/**
	 * Canonical page keys and their preferred slugs.
	 * The key is what code uses; the slug is what gets created in WordPress.
	 *
	 * @return array<string,string>
	 */
	public static function page_map() {
		return array(
			'home'                     => 'home',
			'portfolio'                => 'portfolio',
			'team'                     => 'team',
			'about'                    => 'about',
			'contact'                  => 'contact',
			'news'                     => 'news',
			'investment-request'       => 'investment-request',
			'my-requests'              => 'my-requests',
			'request-management'       => 'request-management',
			'request-user-management'  => 'request-user-management',
			'login'                    => 'login',
		);
	}

	/**
	 * Plugin application pages only (subset that use plugin shortcodes/widgets).
	 *
	 * @return string[]
	 */
	public static function plugin_page_keys() {
		return array(
			'investment-request',
			'my-requests',
			'request-management',
			'request-user-management',
			'login',
		);
	}

	/**
	 * Store a page ID for a key.
	 *
	 * @param string $key Page key.
	 * @param int    $id  WordPress post ID.
	 */
	public static function set_page_id( $key, $id ) {
		$ids = self::all_ids();
		$ids[ $key ] = absint( $id );
		update_option( self::OPTION, $ids );
	}

	/**
	 * Get a stored page ID for a key.
	 *
	 * @param string $key Page key.
	 * @return int
	 */
	public static function get_page_id( $key ) {
		$ids = self::all_ids();
		return isset( $ids[ $key ] ) ? absint( $ids[ $key ] ) : 0;
	}

	/**
	 * Get all stored page IDs.
	 *
	 * @return array<string,int>
	 */
	public static function all_ids() {
		return (array) get_option( self::OPTION, array() );
	}

	/**
	 * Resolve a page key to a URL.
	 *
	 * Resolution order:
	 *   1. Stored page ID (dv_page_ids option)
	 *   2. get_page_by_path() on the canonical slug
	 *   3. home_url('/') as safe fallback
	 *
	 * @param string $key Page key from page_map().
	 * @return string
	 */
	public static function url( $key ) {
		if ( 'home' === $key ) {
			$id = self::get_page_id( 'home' );
			if ( $id ) {
				$url = get_permalink( $id );
				if ( $url ) {
					return $url;
				}
			}
			return home_url( '/' );
		}

		// 1. Stored ID.
		$id = self::get_page_id( $key );
		if ( $id ) {
			$url = get_permalink( $id );
			if ( $url ) {
				return $url;
			}
		}

		// 2. Slug lookup.
		$map  = self::page_map();
		$slug = isset( $map[ $key ] ) ? $map[ $key ] : $key;
		$page = get_page_by_path( $slug );
		if ( $page ) {
			// Backfill the stored ID so future lookups are O(1).
			self::set_page_id( $key, $page->ID );
			return get_permalink( $page );
		}

		// 3. Safe fallback.
		return home_url( '/' );
	}

	/**
	 * Whether a given post ID is one of the managed plugin pages.
	 *
	 * @param int $post_id
	 * @return bool
	 */
	public static function is_plugin_page( $post_id ) {
		foreach ( self::plugin_page_keys() as $key ) {
			if ( self::get_page_id( $key ) === absint( $post_id ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Remove all stored page IDs (used on uninstall/rollback).
	 */
	public static function flush() {
		delete_option( self::OPTION );
	}
}
