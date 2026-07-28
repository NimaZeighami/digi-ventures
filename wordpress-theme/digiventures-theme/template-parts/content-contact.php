<?php
/**
 * Contact page content.
 *
 * @package DigiVentures
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$invest_url = esc_url( digiventures_page_url( 'investment-request' ) );
?>

<section class="hero-bg py-20 lg:py-28">
	<div class="tri-pattern absolute inset-0 opacity-40" aria-hidden="true"></div>
	<div class="hero-accent-line" aria-hidden="true"></div>
	<div class="container-dv relative z-10 text-center">
		<span class="section-label"><?php esc_html_e( 'تماس با ما', 'digiventures' ); ?></span>
		<h1 class="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"><?php esc_html_e( 'در ارتباط باشید', 'digiventures' ); ?></h1>
		<p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70">
			<?php esc_html_e( 'برای پرسش‌های مربوط به فرآیند سرمایه‌گذاری، همکاری یا اطلاعات بیشتر، از طریق راه‌های زیر با تیم دیجی‌ونچرز در تماس باشید.', 'digiventures' ); ?>
		</p>
	</div>
</section>

<section class="bg-white py-20 lg:py-28">
	<div class="container-dv">
		<div class="grid gap-12 lg:grid-cols-2">
			<div class="reveal">
				<span class="section-label"><?php esc_html_e( 'اطلاعات تماس', 'digiventures' ); ?></span>
				<h2 class="section-title"><?php esc_html_e( 'راه‌های ارتباطی', 'digiventures' ); ?></h2>
				<div class="mt-8 space-y-6">
					<div class="flex items-start gap-4">
						<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
						</div>
						<div>
							<h3 class="font-semibold text-brand-darkText"><?php esc_html_e( 'آدرس', 'digiventures' ); ?></h3>
							<p class="mt-1 text-sm text-brand-muted"><?php esc_html_e( 'تهران، ایران', 'digiventures' ); ?></p>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
						</div>
						<div>
							<h3 class="font-semibold text-brand-darkText"><?php esc_html_e( 'ایمیل', 'digiventures' ); ?></h3>
							<a href="mailto:info@digiventures.ir" class="mt-1 block text-sm text-brand-green hover:underline">info@digiventures.ir</a>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
						</div>
						<div>
							<h3 class="font-semibold text-brand-darkText"><?php esc_html_e( 'تلفن', 'digiventures' ); ?></h3>
							<p class="mt-1 text-sm text-brand-muted" dir="ltr">+98 21 0000 0000</p>
						</div>
					</div>
				</div>

				<div class="mt-10 rounded-2xl border border-brand-green/20 bg-brand-green/5 p-6">
					<h3 class="font-semibold text-brand-darkText"><?php esc_html_e( 'درخواست سرمایه‌گذاری', 'digiventures' ); ?></h3>
					<p class="mt-2 text-sm leading-relaxed text-brand-muted">
						<?php esc_html_e( 'اگر استارتاپ شما آماده دریافت سرمایه است، مستقیماً از طریق فرم درخواست سرمایه‌گذاری اقدام کنید. این سریع‌ترین راه برای بررسی پرونده شماست.', 'digiventures' ); ?>
					</p>
					<a href="<?php echo $invest_url; ?>" class="btn-primary mt-4 inline-flex text-sm"><?php esc_html_e( 'ثبت درخواست سرمایه‌گذاری', 'digiventures' ); ?></a>
				</div>
			</div>

			<div class="reveal">
				<div class="rounded-2xl border border-gray-100 bg-brand-light p-6 shadow-card lg:p-8">
					<h2 class="text-xl font-bold text-brand-darkText"><?php esc_html_e( 'فرم تماس', 'digiventures' ); ?></h2>
					<p class="mt-2 text-sm text-brand-muted"><?php esc_html_e( 'برای ارسال پیام عمومی، فرم زیر را تکمیل کنید.', 'digiventures' ); ?></p>

					<?php
					// Replace with Contact Form 7 shortcode or custom handler when ready.
					if ( shortcode_exists( 'contact-form-7' ) ) {
						echo do_shortcode( '[contact-form-7 id="contact" title="Contact"]' );
					} else {
						?>
						<form class="mt-6 space-y-5" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" novalidate>
							<?php wp_nonce_field( 'digiventures_contact', 'digiventures_contact_nonce' ); ?>
							<input type="hidden" name="action" value="digiventures_contact" />
							<div>
								<label for="contact_name" class="form-label"><?php esc_html_e( 'نام و نام خانوادگی', 'digiventures' ); ?></label>
								<input type="text" id="contact_name" name="contact_name" class="form-input" placeholder="<?php esc_attr_e( 'نام خود را وارد کنید', 'digiventures' ); ?>" autocomplete="name" required />
							</div>
							<div>
								<label for="contact_email" class="form-label"><?php esc_html_e( 'ایمیل', 'digiventures' ); ?></label>
								<input type="email" id="contact_email" name="contact_email" class="form-input" placeholder="example@email.com" dir="ltr" autocomplete="email" required />
							</div>
							<div>
								<label for="contact_subject" class="form-label"><?php esc_html_e( 'موضوع', 'digiventures' ); ?></label>
								<input type="text" id="contact_subject" name="contact_subject" class="form-input" placeholder="<?php esc_attr_e( 'موضوع پیام', 'digiventures' ); ?>" />
							</div>
							<div>
								<label for="contact_message" class="form-label"><?php esc_html_e( 'پیام', 'digiventures' ); ?></label>
								<textarea id="contact_message" name="contact_message" rows="5" class="form-textarea" placeholder="<?php esc_attr_e( 'پیام خود را بنویسید...', 'digiventures' ); ?>" required></textarea>
							</div>
							<button type="submit" class="btn-primary w-full"><?php esc_html_e( 'ارسال پیام', 'digiventures' ); ?></button>
						</form>
						<?php
					}
					?>
				</div>
			</div>
		</div>
	</div>
</section>
