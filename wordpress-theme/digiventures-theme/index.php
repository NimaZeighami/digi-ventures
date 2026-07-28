<?php
/**
 * Fallback template.
 *
 * @package DigiVentures
 */

get_header();
?>

<main class="pt-[72px]">
	<div class="container-dv py-20">
		<?php
		if ( have_posts() ) :
			while ( have_posts() ) :
				the_post();
				?>
				<article <?php post_class(); ?>>
					<h1 class="section-title"><?php the_title(); ?></h1>
					<div class="mt-6 prose max-w-none"><?php the_content(); ?></div>
				</article>
				<?php
			endwhile;
		else :
			?>
			<p><?php esc_html_e( 'محتوایی یافت نشد.', 'digiventures' ); ?></p>
			<?php
		endif;
		?>
	</div>
</main>

<?php
get_footer();
