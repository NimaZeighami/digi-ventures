<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$invest_url = esc_url( digiventures_page_url( 'investment-request' ) );
$portfolio_items = array(
	__( 'آپ‌تایم', 'digiventures' ),
	__( 'گنجه', 'digiventures' ),
	__( 'نوروبی‌آی', 'digiventures' ),
	__( 'کارپو', 'digiventures' ),
	__( 'کیسان', 'digiventures' ),
	__( 'میاره', 'digiventures' ),
);
?>

<section class="hero-bg py-20 lg:py-28">
	<div class="tri-pattern absolute inset-0 opacity-40" aria-hidden="true"></div>
	<div class="hero-accent-line" aria-hidden="true"></div>
	<div class="container-dv relative z-10 text-center">
		<span class="section-label"><?php esc_html_e( 'پورتفولیو', 'digiventures' ); ?></span>
		<h1 class="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"><?php esc_html_e( 'استارتاپ‌هایی که با حمایت دیجی‌ونچرز ساخته شده‌اند', 'digiventures' ); ?></h1>
		<p class="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-white/70">
			<?php esc_html_e( 'دیجی‌ونچرز افتخار همراهی با تیم‌هایی را داشته است که راهکارهای نویی برای آینده تجارت الکترونیک، لجستیک و فناوری داشته‌اند.', 'digiventures' ); ?>
		</p>
	</div>
</section>

<section class="bg-white py-20 lg:py-28">
	<div class="container-dv">
		<div class="reveal mb-12 text-center">
			<span class="section-label"><?php esc_html_e( 'شرکت‌های پورتفولیو', 'digiventures' ); ?></span>
			<h2 class="section-title"><?php esc_html_e( 'همراه تیم‌هایی که آینده را می‌سازند', 'digiventures' ); ?></h2>
		</div>
		<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			<?php foreach ( $portfolio_items as $item ) : ?>
				<article class="portfolio-logo-card reveal"><span><?php echo esc_html( $item ); ?></span></article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="bg-brand-light py-20 lg:py-28">
	<div class="container-dv">
		<div class="reveal mb-12 text-center">
			<span class="section-label"><?php esc_html_e( 'از زبان بنیان‌گذاران', 'digiventures' ); ?></span>
			<h2 class="section-title"><?php esc_html_e( 'از زبان بنیان‌گذاران بشنوید', 'digiventures' ); ?></h2>
		</div>
		<div class="grid gap-6 lg:grid-cols-2">
			<blockquote class="card reveal">
				<svg class="h-8 w-8 text-brand-green" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.17 6A5.17 5.17 0 002 11.17V17h6v-5H5.17A2.17 2.17 0 017.34 9.83V6H7.17zm10 0A5.17 5.17 0 0012 11.17V17h6v-5h-2.83a2.17 2.17 0 012.17-2.17V6h-.17z"/></svg>
				<p class="mt-5 text-lg leading-relaxed text-brand-darkText"><?php esc_html_e( '«[نقل‌قول واقعی بنیان‌گذار درباره تجربه همکاری با دیجی‌ونچرز]»', 'digiventures' ); ?></p>
				<footer class="mt-6 text-sm"><strong class="block text-brand-darkText"><?php esc_html_e( 'نام بنیان‌گذار', 'digiventures' ); ?></strong><span class="text-brand-muted"><?php esc_html_e( 'بنیان‌گذار و مدیرعامل — [نام شرکت پورتفولیو]', 'digiventures' ); ?></span></footer>
			</blockquote>
			<blockquote class="card reveal">
				<svg class="h-8 w-8 text-brand-green" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.17 6A5.17 5.17 0 002 11.17V17h6v-5H5.17A2.17 2.17 0 017.34 9.83V6H7.17zm10 0A5.17 5.17 0 0012 11.17V17h6v-5h-2.83a2.17 2.17 0 012.17-2.17V6h-.17z"/></svg>
				<p class="mt-5 text-lg leading-relaxed text-brand-darkText"><?php esc_html_e( '«[نقل‌قول واقعی درباره ارزشی که علاوه بر سرمایه دریافت کرده‌اند]»', 'digiventures' ); ?></p>
				<footer class="mt-6 text-sm"><strong class="block text-brand-darkText"><?php esc_html_e( 'نام بنیان‌گذار', 'digiventures' ); ?></strong><span class="text-brand-muted"><?php esc_html_e( 'بنیان‌گذار و مدیرعامل — [نام شرکت پورتفولیو]', 'digiventures' ); ?></span></footer>
			</blockquote>
		</div>
	</div>
</section>

<section class="hero-bg py-16 lg:py-20">
	<div class="tri-pattern absolute inset-0 opacity-40" aria-hidden="true"></div>
	<div class="container-dv relative z-10 text-center">
		<h2 class="text-2xl font-bold text-white sm:text-3xl"><?php esc_html_e( 'کسب‌وکارتان را به ما معرفی کنید', 'digiventures' ); ?></h2>
		<p class="mx-auto mt-4 max-w-2xl text-white/70"><?php esc_html_e( 'اگر در حال ساخت یک کسب‌وکار نوآورانه هستید، خوشحال می‌شویم بیشتر از شما بشنویم.', 'digiventures' ); ?></p>
		<a href="<?php echo $invest_url; ?>" class="btn-primary mt-8"><?php esc_html_e( 'ثبت درخواست سرمایه‌گذاری', 'digiventures' ); ?></a>
	</div>
</section>
