<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<main class="pt-[72px]">
	<?php get_template_part( 'template-parts/content', 'portfolio' ); ?>
</main>
<?php
get_footer();
