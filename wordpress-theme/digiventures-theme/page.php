<?php
/**
 * Generic page template.
 *
 * @package DigiVentures
 */

get_header();
?>

<main class="pt-[72px]">
	<div class="container-dv py-20">
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<article <?php post_class( 'reveal reveal-visible' ); ?>>
				<h1 class="section-title"><?php the_title(); ?></h1>
				<div class="mt-6 max-w-none text-base leading-relaxed text-brand-muted"><?php the_content(); ?></div>
			</article>
			<?php
		endwhile;
		?>
	</div>
</main>

<?php
get_footer();
