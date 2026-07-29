<?php
/**
 * DigiVentures page setup script.
 *
 * Run once after activating the theme and plugin to create all required
 * WordPress pages with the correct slugs and shortcodes.
 *
 * Usage (WP-CLI):
 *   wp eval-file wp-content/plugins/digiventures-core/setup-pages.php
 *
 * Usage (browser, emergency):
 *   Place in WordPress root, access as admin, then delete immediately.
 *
 * @package DigiVenturesCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! current_user_can( 'manage_options' ) ) {
	wp_die( 'Unauthorized.' );
}

/**
 * Pages to create. Each entry:
 *   slug        => WordPress page slug (must match exactly what the theme nav uses)
 *   title       => Page title (Persian)
 *   shortcode   => Shortcode to place in content, or null for static pages
 *   template    => Page template filename, or '' for default
 */
$pages = array(
	array(
		'slug'      => 'portfolio',
		'title'     => 'پورتفولیو',
		'shortcode' => null,
		'template'  => '',
	),
	array(
		'slug'      => 'team',
		'title'     => 'تیم',
		'shortcode' => null,
		'template'  => '',
	),
	array(
		'slug'      => 'about',
		'title'     => 'درباره ما',
		'shortcode' => null,
		'template'  => '',
	),
	array(
		'slug'      => 'contact',
		'title'     => 'تماس با ما',
		'shortcode' => null,
		'template'  => '',
	),
	array(
		'slug'      => 'news',
		'title'     => 'اخبار',
		'shortcode' => null,
		'template'  => '',
	),
	array(
		'slug'      => 'investment-request',
		'title'     => 'ثبت درخواست سرمایه‌گذاری',
		'shortcode' => '[dv_request_form]',
		'template'  => '',
	),
	array(
		'slug'      => 'my-requests',
		'title'     => 'درخواست‌های من',
		'shortcode' => '[dv_customer_dashboard]',
		'template'  => '',
	),
	array(
		'slug'      => 'login',
		'title'     => 'ورود',
		'shortcode' => '[dv_login]',
		'template'  => 'page-login.php',
	),
	array(
		'slug'      => 'request-management',
		'title'     => 'مدیریت درخواست‌ها',
		'shortcode' => '[dv_request_management]',
		'template'  => '',
	),
	array(
		'slug'      => 'request-user-management',
		'title'     => 'مدیریت کاربران',
		'shortcode' => '[dv_request_user_management]',
		'template'  => '',
	),
);

$created = array();
$skipped = array();

foreach ( $pages as $page_def ) {
	$existing = get_page_by_path( $page_def['slug'] );

	if ( $existing ) {
		$skipped[] = $page_def['slug'];
		continue;
	}

	$content = $page_def['shortcode'] ? $page_def['shortcode'] : '';

	$post_data = array(
		'post_title'   => $page_def['title'],
		'post_name'    => $page_def['slug'],
		'post_content' => $content,
		'post_status'  => 'publish',
		'post_type'    => 'page',
		'post_author'  => get_current_user_id(),
	);

	$post_id = wp_insert_post( $post_data, true );

	if ( is_wp_error( $post_id ) ) {
		echo 'ERROR: Could not create page "' . esc_html( $page_def['slug'] ) . '": ' . esc_html( $post_id->get_error_message() ) . "\n";
		continue;
	}

	if ( $page_def['template'] ) {
		update_post_meta( $post_id, '_wp_page_template', $page_def['template'] );
	}

	$created[] = $page_def['slug'] . ' (ID: ' . $post_id . ')';
}

echo "\n=== DigiVentures Page Setup ===\n\n";

if ( ! empty( $created ) ) {
	echo "Created:\n";
	foreach ( $created as $item ) {
		echo '  ✓ ' . $item . "\n";
	}
}

if ( ! empty( $skipped ) ) {
	echo "\nAlready exists (skipped):\n";
	foreach ( $skipped as $slug ) {
		echo '  – ' . $slug . "\n";
	}
}

echo "\nDone. Set the front page under Settings → Reading if needed.\n";
echo "Remove this file after use.\n\n";
