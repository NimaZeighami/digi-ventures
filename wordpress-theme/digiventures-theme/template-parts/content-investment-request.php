<?php
/**
 * Application page host. Request business logic lives in digiventures-core.
 *
 * @package DigiVentures
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<section class="hero-bg py-16 lg:py-24">
	<div class="container-dv relative z-10 text-center">
		<span class="section-label"><?php esc_html_e( 'درخواست سرمایه‌گذاری', 'digiventures' ); ?></span>
		<h1 class="mt-3 text-3xl font-bold text-white sm:text-4xl"><?php esc_html_e( 'ثبت درخواست جذب سرمایه', 'digiventures' ); ?></h1>
	</div>
</section>
<section class="bg-white py-16 lg:py-24">
	<div class="container-dv max-w-5xl">
		<?php echo do_shortcode( '[dv_request_form]' ); ?>
	</div>
</section>
