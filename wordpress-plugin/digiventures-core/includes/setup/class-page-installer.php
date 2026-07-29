<?php
/**
 * Creates and connects WordPress pages.
 * Idempotent — running twice never creates duplicates.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Setup;

use DV_Core\Page_Resolver;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Page_Installer {

	/**
	 * Page definitions: title, slug, shortcode fallback content, Elementor widget name.
	 *
	 * @return array<string,array{title:string,slug:string,content:string,widget:string,template:string}>
	 */
	private static function definitions() {
		return array(
			'home' => array(
				'title'    => 'خانه',
				'slug'     => 'home',
				'content'  => '',
				'widget'   => '',
				'template' => '', // WordPress uses front-page.php automatically for the static front page.
			),
			'portfolio' => array(
				'title'    => 'پورتفولیو',
				'slug'     => 'portfolio',
				'content'  => '',
				'widget'   => '',
				'template' => 'page-portfolio.php',
			),
			'team' => array(
				'title'    => 'تیم',
				'slug'     => 'team',
				'content'  => '',
				'widget'   => '',
				'template' => 'page-team.php',
			),
			'about' => array(
				'title'    => 'درباره ما',
				'slug'     => 'about',
				'content'  => '',
				'widget'   => '',
				'template' => 'page-about.php',
			),
			'contact' => array(
				'title'    => 'تماس با ما',
				'slug'     => 'contact',
				'content'  => '',
				'widget'   => '',
				'template' => 'page-contact.php',
			),
			'news' => array(
				'title'    => 'اخبار',
				'slug'     => 'news',
				'content'  => '',
				'widget'   => '',
				'template' => 'page-news.php',
			),
			'investment-request' => array(
				'title'    => 'ثبت درخواست سرمایه‌گذاری',
				'slug'     => 'investment-request',
				'content'  => '[dv_request_form]',
				'widget'   => 'dv-request-form',
				'template' => 'page-investment-request.php',
			),
			'my-requests' => array(
				'title'    => 'درخواست‌های من',
				'slug'     => 'my-requests',
				'content'  => '[dv_customer_dashboard]',
				'widget'   => 'dv-customer-dashboard',
				'template' => '',
			),
			'request-management' => array(
				'title'    => 'مدیریت درخواست‌ها',
				'slug'     => 'request-management',
				'content'  => '[dv_request_management]',
				'widget'   => 'dv-request-management',
				'template' => '',
			),
			'request-user-management' => array(
				'title'    => 'مدیریت کاربران درخواست',
				'slug'     => 'request-user-management',
				'content'  => '[dv_request_user_management]',
				'widget'   => 'dv-user-management',
				'template' => '',
			),
			'login' => array(
				'title'    => 'ورود',
				'slug'     => 'login',
				'content'  => '[dv_login]',
				'widget'   => 'dv-login',
				'template' => 'page-login.php',
			),
		);
	}

	/**
	 * Install all pages. Returns array of key => post_id for created pages,
	 * or existing post_id if the page already existed.
	 *
	 * @return array<string,int>|\WP_Error
	 */
	public static function install() {
		$results = array();

		foreach ( self::definitions() as $key => $def ) {
			$post_id = self::install_page( $key, $def );
			if ( is_wp_error( $post_id ) ) {
				return $post_id;
			}
			$results[ $key ] = $post_id;
		}

		return $results;
	}

	/**
	 * Install a single page. Idempotent.
	 *
	 * @param string               $key Page key.
	 * @param array<string,string> $def Page definition.
	 * @return int|\WP_Error Post ID.
	 */
	private static function install_page( $key, $def ) {
		// 1. Already tracked by install state?
		if ( Install_State::page_created( $key ) ) {
			$state = Install_State::get();
			$id    = absint( $state['pages_created'][ $key ] );
			if ( get_post( $id ) ) {
				Page_Resolver::set_page_id( $key, $id );
				return $id;
			}
		}

		// 2. Already exists by slug?
		$existing = get_page_by_path( $def['slug'] );
		if ( $existing ) {
			$id = $existing->ID;
			Install_State::add_page( $key, $id );
			Page_Resolver::set_page_id( $key, $id );
			self::assign_template( $id, $def['template'] );
			return $id;
		}

		// 3. Create it.
		$id = wp_insert_post(
			array(
				'post_title'   => $def['title'],
				'post_name'    => $def['slug'],
				'post_content' => $def['content'],
				'post_status'  => 'publish',
				'post_type'    => 'page',
				'post_author'  => get_current_user_id() ?: 1,
			),
			true
		);

		if ( is_wp_error( $id ) ) {
			return $id;
		}

		Install_State::add_page( $key, $id );
		Page_Resolver::set_page_id( $key, $id );
		self::assign_template( $id, $def['template'] );

		return $id;
	}

	/**
	 * Assign a page template meta value if specified.
	 *
	 * @param int    $post_id  Post ID.
	 * @param string $template Template filename, or '' to leave unchanged.
	 */
	private static function assign_template( $post_id, $template ) {
		if ( $template ) {
			update_post_meta( $post_id, '_wp_page_template', $template );
		}
	}

	/**
	 * Set the homepage in WordPress Reading Settings.
	 *
	 * @param int $home_id Post ID of the home page.
	 */
	public static function set_homepage( $home_id ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', absint( $home_id ) );
		Install_State::update( array( 'homepage_set' => true ) );
	}

	/**
	 * Get the post ID for a page key (used by setup wizard for reporting).
	 *
	 * @param string $key Page key.
	 * @return int
	 */
	public static function get_page_id( $key ) {
		return Page_Resolver::get_page_id( $key );
	}
}
