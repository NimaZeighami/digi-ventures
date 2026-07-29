<?php
/**
 * Template Name: Login (Full-screen, no site header/footer)
 *
 * Used automatically when the page slug is "login" and as a selectable
 * template from the WordPress page editor (Page Attributes → Template).
 *
 * @package DigiVentures
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'dv-app' ); ?>>
<?php
while ( have_posts() ) :
	the_post();
	the_content();
endwhile;
wp_footer();
?>
</body>
</html>
