<?php
/**
 * Safe rollback for the setup wizard.
 * Removes only what the installer created — never touches user data.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Setup;

use DV_Core\Page_Resolver;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Rollback {

	/**
	 * Static page keys that must use the theme design, never Elementor.
	 *
	 * @var string[]
	 */
	private static $static_keys = array( 'home', 'portfolio', 'team', 'about', 'contact', 'news' );

	/**
	 * Remove Elementor data from the static marketing pages so they fall back
	 * to the theme templates. Does NOT delete the pages or any request data.
	 *
	 * Also re-assigns the correct theme page template.
	 *
	 * @return int Number of pages reset.
	 */
	public static function reset_static_pages() {
		$template_map = array(
			'home'      => '',                    // front-page.php is automatic.
			'portfolio' => 'page-portfolio.php',
			'team'      => 'page-team.php',
			'about'     => 'page-about.php',
			'contact'   => 'page-contact.php',
			'news'      => 'page-news.php',
		);

		$count = 0;

		foreach ( self::$static_keys as $key ) {
			$page_id = Page_Resolver::get_page_id( $key );

			// Fall back to slug lookup if no stored ID.
			if ( ! $page_id ) {
				$page = get_page_by_path( $key );
				if ( $page ) {
					$page_id = $page->ID;
				}
			}

			if ( ! $page_id || ! get_post( $page_id ) ) {
				continue;
			}

			// Strip all Elementor meta so WordPress renders via the theme.
			delete_post_meta( $page_id, '_elementor_data' );
			delete_post_meta( $page_id, '_elementor_edit_mode' );
			delete_post_meta( $page_id, '_elementor_template_type' );
			delete_post_meta( $page_id, '_elementor_page_settings' );
			delete_post_meta( $page_id, '_elementor_version' );
			delete_post_meta( $page_id, '_elementor_css' );

			// Re-assign the theme page template.
			if ( isset( $template_map[ $key ] ) && '' !== $template_map[ $key ] ) {
				update_post_meta( $page_id, '_wp_page_template', $template_map[ $key ] );
			} else {
				delete_post_meta( $page_id, '_wp_page_template' );
			}

			$count++;
		}

		return $count;
	}

	/**
	 * Run the full rollback sequence.
	 */
	public static function run() {
		$state = Install_State::get();

		// 1. Delete created pages (only those we tracked — never pre-existing pages).
		foreach ( (array) $state['pages_created'] as $key => $post_id ) {
			$post_id = absint( $post_id );
			if ( $post_id && get_post( $post_id ) ) {
				// Only delete if the post status is publish and it's a page.
				$post = get_post( $post_id );
				if ( $post && 'page' === $post->post_type ) {
					wp_delete_post( $post_id, true );
				}
			}
		}

		// 2. Delete imported Elementor templates.
		foreach ( (array) $state['template_ids'] as $key => $template_id ) {
			$template_id = absint( $template_id );
			if ( $template_id && get_post( $template_id ) ) {
				wp_delete_post( $template_id, true );
			}
		}

		// 3. Reset homepage if we set it.
		if ( ! empty( $state['homepage_set'] ) ) {
			update_option( 'show_on_front', 'posts' );
			delete_option( 'page_on_front' );
		}

		// 4. Clear resolver page IDs.
		Page_Resolver::flush();

		// 5. Clear install state.
		Install_State::flush();
	}
}
