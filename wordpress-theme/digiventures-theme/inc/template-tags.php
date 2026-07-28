<?php
/**
 * Template helper functions.
 *
 * @package DigiVentures
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Theme asset URI (images, favicon, etc.).
 *
 * @param string $path Path relative to theme assets directory.
 */
function digiventures_asset_uri( $path = '' ) {
	return trailingslashit( get_template_directory_uri() . '/assets' ) . ltrim( $path, '/' );
}

/**
 * Permalink for a page by slug, with fallback URL.
 *
 * @param string $slug Page slug.
 */
function digiventures_page_url( $slug ) {
	if ( 'home' === $slug ) {
		return home_url( '/' );
	}

	$page = get_page_by_path( $slug );
	if ( $page ) {
		return get_permalink( $page );
	}

	return home_url( '/' . $slug . '/' );
}

/**
 * Whether the current view matches a page slug (or front page for "home").
 *
 * @param string $slug Page slug or "home".
 */
function digiventures_is_page( $slug ) {
	if ( 'home' === $slug ) {
		return is_front_page();
	}

	return is_page( $slug );
}

/**
 * CSS class for active nav link.
 *
 * @param string $slug Page slug or "home".
 */
function digiventures_nav_active_class( $slug ) {
	return digiventures_is_page( $slug ) ? ' nav-link-active' : '';
}

/**
 * CSS class for active mobile nav link.
 *
 * @param string $slug Page slug or "home".
 */
function digiventures_mobile_nav_class( $slug ) {
	if ( digiventures_is_page( $slug ) ) {
		return 'rounded-lg px-4 py-3 text-base font-medium text-brand-green';
	}

	return 'rounded-lg px-4 py-3 text-base font-medium text-white/80 hover:bg-white/5 hover:text-brand-green';
}

/**
 * Startup slider image URI by index (01–19).
 *
 * @param int $index Image number.
 */
function digiventures_startup_image_uri( $index ) {
	return digiventures_asset_uri( sprintf( 'images/startups/startup-%02d.jpg', $index ) );
}
