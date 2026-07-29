<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<main class="pt-[72px]">
	<?php get_template_part( 'template-parts/content', 'news' ); ?>
</main>
<?php
get_footer();
