<?php
/**
 * DigiVentures theme functions.
 *
 * @package DigiVentures
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'DIGIVENTURES_VERSION', '1.0.0' );

require get_template_directory() . '/inc/template-tags.php';

/**
 * Theme setup.
 */
function digiventures_setup() {
	load_theme_textdomain( 'digiventures', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', 'digiventures' ),
		)
	);
}
add_action( 'after_setup_theme', 'digiventures_setup' );

function digiventures_body_classes( $classes ) {
	if ( ! is_admin() ) {
		$classes[] = 'dv-site';
		$classes[] = 'dv-app';
	}
	return $classes;
}
add_filter( 'body_class', 'digiventures_body_classes' );

/**
 * Enqueue styles and scripts.
 */
function digiventures_enqueue_assets() {
	$dist = get_template_directory() . '/assets/dist';
	$uri  = get_template_directory_uri() . '/assets/dist';

	$css_file = $dist . '/main.css';
	$js_file  = $dist . '/main.js';

	if ( file_exists( $css_file ) ) {
		wp_enqueue_style(
			'digiventures-main',
			$uri . '/main.css',
			array(),
			filemtime( $css_file )
		);
	}

	if ( file_exists( $js_file ) ) {
		wp_enqueue_script(
			'digiventures-main',
			$uri . '/main.js',
			array(),
			filemtime( $js_file ),
			true
		);
		wp_script_add_data( 'digiventures-main', 'type', 'module' );
	}
}
add_action( 'wp_enqueue_scripts', 'digiventures_enqueue_assets' );

/**
 * Add favicon link tag.
 */
function digiventures_favicon() {
	printf(
		'<link rel="icon" type="image/svg+xml" href="%s" />' . "\n",
		esc_url( digiventures_asset_uri( 'images/favicon.svg' ) )
	);
}
add_action( 'wp_head', 'digiventures_favicon', 1 );

/**
 * Set document language and direction on html element.
 */
function digiventures_html_attributes( $output ) {
	if ( is_admin() ) {
		return $output;
	}

	return 'lang="fa" dir="rtl"';
}
add_filter( 'language_attributes', 'digiventures_html_attributes' );
