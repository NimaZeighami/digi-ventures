<?php
/**
 * Template Name: DigiVentures Canvas
 * Template Post Type: page
 */
defined( 'ABSPATH' ) || exit;
?><!doctype html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'dv-canvas' ); ?>>
<?php wp_body_open(); ?>
<div id="page" class="dv-canvas-content">
	<?php
	while ( have_posts() ) {
		the_post();
		the_content();
	}
	?>
</div>
<?php wp_footer(); ?>
</body>
</html>
