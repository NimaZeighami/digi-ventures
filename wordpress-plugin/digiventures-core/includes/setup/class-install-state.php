<?php
/**
 * Tracks what the setup wizard has installed.
 * Enables idempotent re-runs and safe rollback.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Setup;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Install_State {

	const OPTION = 'dv_install_state';

	/**
	 * Default empty state.
	 *
	 * @return array<string,mixed>
	 */
	private static function defaults() {
		return array(
			'version'       => '',
			'installed_at'  => '',
			'pages_created' => array(),  // key => post_id
			'template_ids'  => array(),  // key => elementor template post_id
			'homepage_set'  => false,
			'completed'     => false,
		);
	}

	/**
	 * Get the current install state.
	 *
	 * @return array<string,mixed>
	 */
	public static function get() {
		return wp_parse_args(
			(array) get_option( self::OPTION, array() ),
			self::defaults()
		);
	}

	/**
	 * Persist a partial state update.
	 *
	 * @param array<string,mixed> $data Keys to update.
	 */
	public static function update( array $data ) {
		$state = self::get();
		foreach ( $data as $key => $value ) {
			if ( array_key_exists( $key, self::defaults() ) ) {
				$state[ $key ] = $value;
			}
		}
		update_option( self::OPTION, $state );
	}

	/**
	 * Record a created page.
	 *
	 * @param string $key     Page key.
	 * @param int    $post_id WordPress post ID.
	 */
	public static function add_page( $key, $post_id ) {
		$state = self::get();
		$state['pages_created'][ $key ] = absint( $post_id );
		update_option( self::OPTION, $state );
	}

	/**
	 * Record an imported Elementor template.
	 *
	 * @param string $key         Page key.
	 * @param int    $template_id Elementor template post ID.
	 */
	public static function add_template( $key, $template_id ) {
		$state = self::get();
		$state['template_ids'][ $key ] = absint( $template_id );
		update_option( self::OPTION, $state );
	}

	/**
	 * Whether the full setup has been completed.
	 *
	 * @return bool
	 */
	public static function is_complete() {
		return (bool) self::get()['completed'];
	}

	/**
	 * Whether a specific page was already created by the installer.
	 *
	 * @param string $key Page key.
	 * @return bool
	 */
	public static function page_created( $key ) {
		$state = self::get();
		return isset( $state['pages_created'][ $key ] ) && $state['pages_created'][ $key ] > 0;
	}

	/**
	 * Clear all install state (used on rollback).
	 */
	public static function flush() {
		delete_option( self::OPTION );
	}
}
