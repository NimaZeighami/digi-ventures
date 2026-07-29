<?php
/**
 * Imports Elementor JSON templates into the WordPress template library.
 * Idempotent — never creates duplicates.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Setup;

use DV_Core\Elementor\Elementor_Integration;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Template_Installer {

	/**
	 * Map page keys to their JSON template files.
	 *
	 * IMPORTANT: Only the 5 application pages get Elementor templates.
	 * Static marketing pages (home, portfolio, team, about, contact, news)
	 * keep the theme's own design — they are intentionally excluded here.
	 *
	 * @return array<string,string>
	 */
	private static function template_files() {
		return array(
			'investment-request'      => 'investment-request.json',
			'my-requests'             => 'my-requests.json',
			'request-management'      => 'request-management.json',
			'request-user-management' => 'request-user-management.json',
			'login'                   => 'login.json',
		);
	}

	/**
	 * Import all templates. Skips any that are already installed.
	 *
	 * @return array<string,int>|\WP_Error key => template post ID
	 */
	public static function install() {
		if ( ! Elementor_Integration::is_available() ) {
			return new \WP_Error(
				'elementor_missing',
				__( 'Elementor is not available. Templates cannot be imported.', 'digiventures-core' )
			);
		}

		$results = array();

		foreach ( self::template_files() as $key => $filename ) {
			$id = self::import_template( $key, $filename );
			if ( is_wp_error( $id ) ) {
				return $id;
			}
			$results[ $key ] = $id;
		}

		return $results;
	}

	/**
	 * Import a single Elementor template. Idempotent.
	 *
	 * @param string $key      Page key.
	 * @param string $filename JSON filename in templates/elementor/pages/.
	 * @return int|\WP_Error Template post ID.
	 */
	private static function import_template( $key, $filename ) {
		// Already imported?
		$state = Install_State::get();
		if ( isset( $state['template_ids'][ $key ] ) && $state['template_ids'][ $key ] > 0 ) {
			$existing_id = absint( $state['template_ids'][ $key ] );
			if ( get_post( $existing_id ) ) {
				return $existing_id;
			}
		}

		$path = DV_CORE_PATH . 'templates/elementor/pages/' . $filename;
		if ( ! file_exists( $path ) ) {
			return new \WP_Error(
				'template_missing',
				sprintf( __( 'Template file not found: %s', 'digiventures-core' ), $filename )
			);
		}

		$json = file_get_contents( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		$data = json_decode( $json, true );

		if ( ! $data ) {
			return new \WP_Error(
				'template_invalid',
				sprintf( __( 'Invalid JSON in template: %s', 'digiventures-core' ), $filename )
			);
		}

		// Create an Elementor template post.
		$post_id = wp_insert_post(
			array(
				'post_title'   => isset( $data['title'] ) ? sanitize_text_field( $data['title'] ) : $key,
				'post_status'  => 'publish',
				'post_type'    => 'elementor_library',
				'post_content' => '',
				'post_author'  => get_current_user_id() ?: 1,
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		// Store Elementor data.
		if ( isset( $data['content'] ) ) {
			update_post_meta( $post_id, '_elementor_data', wp_slash( wp_json_encode( $data['content'] ) ) );
		}
		if ( isset( $data['page_settings'] ) ) {
			update_post_meta( $post_id, '_elementor_page_settings', $data['page_settings'] );
		}
		update_post_meta( $post_id, '_elementor_template_type', 'page' );

		Install_State::add_template( $key, $post_id );

		return $post_id;
	}

	/**
	 * Apply an imported template to a WordPress page.
	 *
	 * @param int $page_id     WordPress page post ID.
	 * @param int $template_id Elementor template post ID.
	 */
	public static function apply_to_page( $page_id, $template_id ) {
		$data = get_post_meta( $template_id, '_elementor_data', true );
		if ( ! $data ) {
			return;
		}

		update_post_meta( $page_id, '_elementor_data', $data );
		update_post_meta( $page_id, '_elementor_edit_mode', 'builder' );
		update_post_meta( $page_id, '_elementor_template_type', 'wp-page' );

		$page_settings = get_post_meta( $template_id, '_elementor_page_settings', true );
		if ( $page_settings ) {
			update_post_meta( $page_id, '_elementor_page_settings', $page_settings );
		}
	}

	/**
	 * Regenerate Elementor CSS for a page (triggers Elementor's own CSS regeneration).
	 *
	 * @param int $page_id
	 */
	public static function regenerate_css( $page_id ) {
		// Modern Elementor 3.x API.
		if ( class_exists( '\Elementor\Core\Files\CSS\Post' ) ) {
			try {
				$css_file = new \Elementor\Core\Files\CSS\Post( $page_id );
				$css_file->update();
				return;
			} catch ( \Throwable $e ) {
				// Fall through to legacy handling.
			}
		}
		// Legacy Elementor (< 2.1) fallback.
		if ( class_exists( '\Elementor\Post_CSS_File' ) ) {
			try {
				$css_file = new \Elementor\Post_CSS_File( $page_id );
				$css_file->update();
			} catch ( \Throwable $e ) {
				// Ignore — CSS will regenerate on first page view anyway.
			}
		}
	}
}
