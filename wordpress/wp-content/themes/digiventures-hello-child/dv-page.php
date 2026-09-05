<?php
/**
 * Template Name: DigiVentures Standard Page
 * Template Post Type: page, post
 */
defined( 'ABSPATH' ) || exit;
?><!doctype html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'dv-canvas dv-standard-page-body' ); ?>>
<?php wp_body_open(); ?>
<div id="page" class="dv-canvas-content dv-standard-page-wrap">
	<?php
	if ( class_exists( '\\DigiVentures\\Application\\Support\\ReferencePages' ) ) {
		echo \DigiVentures\Application\Support\ReferencePages::get_site_header(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
	?>
	<main class="dv-standard-main pt-[100px] pb-20 min-h-[65vh] bg-white">
		<div class="container-dv mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-10">
			<?php
			while ( have_posts() ) {
				the_post();
				if ( ! is_front_page() ) {
					the_title( '<h1 class="text-3xl sm:text-4xl font-extrabold text-slate-950 mb-8 leading-tight">', '</h1>' );
				}
				?>
				<article id="post-<?php the_ID(); ?>" <?php post_class( 'dv-entry-content' ); ?>>
					<?php the_content(); ?>
				</article>
				<?php
				if ( comments_open() || get_comments_number() ) {
					comments_template();
				}
			}
			?>
		</div>
	</main>
	<?php
	if ( class_exists( '\\DigiVentures\\Application\\Support\\ReferencePages' ) ) {
		echo \DigiVentures\Application\Support\ReferencePages::get_site_footer(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
	?>
</div>
<?php wp_footer(); ?>
</body>
</html>
