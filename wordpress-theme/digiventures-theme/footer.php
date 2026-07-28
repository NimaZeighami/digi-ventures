<?php
/**
 * Site footer.
 *
 * @package DigiVentures
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<footer class="border-t border-white/10 bg-brand-dark py-12 lg:py-16">
	<div class="container-dv">
		<div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
			<div class="lg:col-span-2">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-center gap-2 text-lg font-bold text-white">
					<svg class="h-7 w-7" viewBox="0 0 32 32" fill="none" aria-hidden="true">
						<path d="M16 4L28 26H4L16 4Z" fill="#00B140"/>
						<path d="M16 10L22 22H10L16 10Z" fill="#050807"/>
					</svg>
					<span>DigiVentures</span>
				</a>
				<p class="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
					<?php esc_html_e( 'دیجی‌ونچرز، واحد سرمایه‌گذاری شرکتی متعلق به اکوسیستم دیجیتال، با تمرکز بر حمایت از استارتاپ‌های نوآور در حوزه اقتصاد دیجیتال.', 'digiventures' ); ?>
				</p>
			</div>
			<div>
				<h3 class="mb-4 text-sm font-semibold text-white"><?php esc_html_e( 'دسترسی سریع', 'digiventures' ); ?></h3>
				<ul class="space-y-2">
					<li><a href="<?php echo esc_url( digiventures_page_url( 'home' ) ); ?>" class="text-sm text-white/60 transition-colors hover:text-brand-green"><?php esc_html_e( 'خانه', 'digiventures' ); ?></a></li>
					<li><a href="<?php echo esc_url( digiventures_page_url( 'about' ) ); ?>" class="text-sm text-white/60 transition-colors hover:text-brand-green"><?php esc_html_e( 'درباره ما', 'digiventures' ); ?></a></li>
					<li><a href="<?php echo esc_url( digiventures_page_url( 'team' ) ); ?>" class="text-sm text-white/60 transition-colors hover:text-brand-green"><?php esc_html_e( 'تیم', 'digiventures' ); ?></a></li>
					<li><a href="<?php echo esc_url( digiventures_page_url( 'contact' ) ); ?>" class="text-sm text-white/60 transition-colors hover:text-brand-green"><?php esc_html_e( 'تماس', 'digiventures' ); ?></a></li>
					<li><a href="<?php echo esc_url( digiventures_page_url( 'investment-request' ) ); ?>" class="text-sm text-white/60 transition-colors hover:text-brand-green"><?php esc_html_e( 'درخواست سرمایه‌گذاری', 'digiventures' ); ?></a></li>
				</ul>
			</div>
			<div>
				<h3 class="mb-4 text-sm font-semibold text-white"><?php esc_html_e( 'تماس', 'digiventures' ); ?></h3>
				<ul class="space-y-2 text-sm text-white/60">
					<li><?php esc_html_e( 'تهران، ایران', 'digiventures' ); ?></li>
					<li>
						<a href="mailto:info@digiventures.ir" class="transition-colors hover:text-brand-green">info@digiventures.ir</a>
					</li>
					<li dir="ltr" class="text-right">+98 21 0000 0000</li>
				</ul>
			</div>
		</div>
		<div class="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
			<p><?php esc_html_e( '© ۱۴۰۵ دیجی‌ونچرز. تمامی حقوق محفوظ است.', 'digiventures' ); ?></p>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
