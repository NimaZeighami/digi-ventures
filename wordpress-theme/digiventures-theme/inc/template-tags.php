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
 * Permalink for a page key.
 *
 * Delegates to DV_Core\Page_Resolver when the plugin is active (preferred —
 * uses stored page IDs). Falls back to slug lookup and then a raw URL when
 * the plugin is unavailable (e.g. during a partial deployment).
 *
 * @param string $slug Page key (e.g. 'portfolio', 'investment-request').
 * @return string
 */
function digiventures_page_url( $slug ) {
	// Prefer the plugin's page resolver (stored IDs, slug backfill, safe fallback).
	if ( class_exists( '\DV_Core\Page_Resolver' ) ) {
		return \DV_Core\Page_Resolver::url( $slug );
	}

	// Plugin not loaded — fall back to slug lookup.
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

	if ( is_page( $slug ) ) {
		return true;
	}

	// Match by page ID stored in the resolver.
	if ( class_exists( '\DV_Core\Page_Resolver' ) ) {
		$id = \DV_Core\Page_Resolver::get_page_id( $slug );
		if ( $id && is_page( $id ) ) {
			return true;
		}
	}

	// Match by template file.
	$template_map = array(
		'investment-request' => 'page-investment-request.php',
		'login'              => 'page-login.php',
		'portfolio'          => 'page-portfolio.php',
		'team'               => 'page-team.php',
		'about'              => 'page-about.php',
		'contact'            => 'page-contact.php',
		'news'               => 'page-news.php',
	);
	if ( isset( $template_map[ $slug ] ) && is_page_template( $template_map[ $slug ] ) ) {
		return true;
	}

	return false;
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
