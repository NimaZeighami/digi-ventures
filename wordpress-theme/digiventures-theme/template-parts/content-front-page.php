<?php
/**
 * Front page content.
 *
 * @package DigiVentures
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$invest_url = esc_url( digiventures_page_url( 'investment-request' ) );
$team_url   = esc_url( digiventures_page_url( 'team' ) );

$focus_areas = array(
	array(
		'title' => __( 'تجارت الکترونیک', 'digiventures' ),
		'desc'  => __( 'پلتفرم‌های خرید آنلاین، مارکت‌پلیس‌ها و زیرساخت‌های تجارت دیجیتال', 'digiventures' ),
		'icon'  => 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
	),
	array(
		'title' => __( 'فین‌تک', 'digiventures' ),
		'desc'  => __( 'پرداخت دیجیتال، لندتک، بیمه‌تک و راهکارهای مالی نوآورانه', 'digiventures' ),
		'icon'  => 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
	),
	array(
		'title' => __( 'لجستیک هوشمند', 'digiventures' ),
		'desc'  => __( 'زنجیره تأمین دیجیتال، مدیریت انبار و بهینه‌سازی توزیع', 'digiventures' ),
		'icon'  => 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
	),
	array(
		'title' => __( 'هوش مصنوعی و داده', 'digiventures' ),
		'desc'  => __( 'تحلیل داده، یادگیری ماشین و راهکارهای مبتنی بر هوش مصنوعی', 'digiventures' ),
		'icon'  => 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
	),
	array(
		'title' => __( 'راهکارهای ابری', 'digiventures' ),
		'desc'  => __( 'زیرساخت ابری، SaaS و پلتفرم‌های مدیریت ابری', 'digiventures' ),
		'icon'  => 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
	),
	array(
		'title' => __( 'اتوماسیون و اینترنت اشیا', 'digiventures' ),
		'desc'  => __( 'اتوماسیون صنعتی، IoT و راهکارهای هوشمندسازی فرآیندها', 'digiventures' ),
		'icon'  => 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
	),
);

$why_items = array(
	array(
		'title' => __( 'دسترسی به اکوسیستم دیجیتال', 'digiventures' ),
		'desc'  => __( 'اتصال به شبکه گسترده کسب‌وکارهای دیجیتال و زیرساخت‌های عملیاتی گروه', 'digiventures' ),
		'icon'  => 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
	),
	array(
		'title' => __( 'تجربه رشد و مقیاس‌پذیری', 'digiventures' ),
		'desc'  => __( 'همراهی تیم‌هایی با سابقه موفق در رشد و توسعه کسب‌وکارهای فناوری‌محور', 'digiventures' ),
		'icon'  => 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
	),
	array(
		'title' => __( 'ارزیابی تخصصی و شفاف', 'digiventures' ),
		'desc'  => __( 'فرآیند ارزیابی ساختارمند با معیارهای روشن و بازخورد شفاف به تمام متقاضیان', 'digiventures' ),
		'icon'  => 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
	),
	array(
		'title' => __( 'همکاری استراتژیک فراتر از سرمایه', 'digiventures' ),
		'desc'  => __( 'مشاوره استراتژیک، معرفی مشتری و حمایت عملیاتی در کنار تأمین مالی', 'digiventures' ),
		'icon'  => 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
	),
);

$process_steps = array(
	array( __( 'ارسال درخواست', 'digiventures' ), __( 'تکمیل فرم درخواست و ارسال Pitch Deck', 'digiventures' ) ),
	array( __( 'بررسی اولیه', 'digiventures' ), __( 'ارزیابی اولیه مدل کسب‌وکار و تیم', 'digiventures' ) ),
	array( __( 'جلسه شناخت و ارزیابی', 'digiventures' ), __( 'ملاقات با تیم و بررسی عمیق‌تر', 'digiventures' ) ),
	array( __( 'تصمیم سرمایه‌گذاری', 'digiventures' ), __( 'تصمیم‌گیری نهایی و اعلام نتیجه', 'digiventures' ) ),
	array( __( 'شروع همکاری و رشد', 'digiventures' ), __( 'امضای قرارداد و آغاز همکاری استراتژیک', 'digiventures' ) ),
);

$portfolio_signals = array(
	array( __( 'تیم بنیان‌گذار قوی', 'digiventures' ), __( 'ترکیبی از تخصص فنی، تجربه بازار و تعهد بلندمدت به رشد کسب‌وکار', 'digiventures' ) ),
	array( __( 'مدل درآمدی روشن', 'digiventures' ), __( 'شواهد اولیه از پذیرش بازار، traction و مسیر واضح به سمت سودآوری', 'digiventures' ) ),
	array( __( 'پتانسیل مقیاس‌پذیری', 'digiventures' ), __( 'قابلیت رشد سریع با حداقل وابستگی به منابع محدود و بازار قابل توسعه', 'digiventures' ) ),
);

$team_preview = array(
	array( __( 'مدیریت سرمایه‌گذاری', 'digiventures' ), 'Investment Lead', __( 'ارزیابی و مدیریت پرتفوی سرمایه‌گذاری', 'digiventures' ) ),
	array( __( 'تحلیل و ارزیابی', 'digiventures' ), 'Due Diligence', __( 'تحلیل مالی و فنی استارتاپ‌ها', 'digiventures' ) ),
	array( __( 'توسعه اکوسیستم', 'digiventures' ), 'Ecosystem Development', __( 'ایجاد ارتباط و شبکه‌سازی استراتژیک', 'digiventures' ) ),
);

$startup_alts = array(
	1  => 'استارتاپ Vira Smart Label',
	3  => 'استارتاپ Dezhino',
);
?>

<main>

<section class="hero-bg min-h-screen pt-[72px]">
	<div class="hero-grid" aria-hidden="true"></div>
	<div class="tri-pattern absolute inset-0 opacity-60" aria-hidden="true"></div>
	<div class="hero-accent-line" aria-hidden="true"></div>

	<div class="container-dv relative z-10 flex min-h-[calc(100vh-72px)] flex-col items-center justify-center py-20 text-center">
		<div class="hero-content max-w-4xl">
			<p class="mb-6 inline-block rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-1.5 text-sm font-medium text-brand-green">
				<?php esc_html_e( 'سرمایه‌گذاری شرکتی در اکوسیستم دیجیتال', 'digiventures' ); ?>
			</p>
			<h1 class="text-balance text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
				<?php esc_html_e( 'سرمایه‌گذاری جسورانه برای استارتاپ‌هایی که آینده اقتصاد دیجیتال را می‌سازند', 'digiventures' ); ?>
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
				<?php esc_html_e( 'دیجی‌ونچرز با تمرکز بر حوزه‌های فناوری‌محور، به استارتاپ‌های نوپا سرمایه، شبکه ارتباطی و دسترسی به بازار ارائه می‌دهد تا مسیر رشد پایدار را هموار کند.', 'digiventures' ); ?>
			</p>
			<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a href="<?php echo $invest_url; ?>" class="btn-primary w-full sm:w-auto"><?php esc_html_e( 'ثبت درخواست سرمایه‌گذاری', 'digiventures' ); ?></a>
				<a href="#investment-process" class="btn-secondary w-full sm:w-auto"><?php esc_html_e( 'آشنایی با فرآیند سرمایه‌گذاری', 'digiventures' ); ?></a>
			</div>
		</div>

		<div class="mt-16 grid w-full max-w-3xl grid-cols-3 gap-6 border-t border-white/10 pt-10" aria-label="<?php esc_attr_e( 'آمار کلیدی', 'digiventures' ); ?>">
			<div class="text-center">
				<p class="text-2xl font-bold text-brand-green sm:text-3xl">+۱۵</p>
				<p class="mt-1 text-xs text-white/60 sm:text-sm"><?php esc_html_e( 'حوزه تخصصی', 'digiventures' ); ?></p>
			</div>
			<div class="text-center">
				<p class="text-2xl font-bold text-brand-green sm:text-3xl">۵</p>
				<p class="mt-1 text-xs text-white/60 sm:text-sm"><?php esc_html_e( 'مرحله ارزیابی', 'digiventures' ); ?></p>
			</div>
			<div class="text-center">
				<p class="text-2xl font-bold text-brand-green sm:text-3xl">CVC</p>
				<p class="mt-1 text-xs text-white/60 sm:text-sm"><?php esc_html_e( 'سرمایه‌گذاری شرکتی', 'digiventures' ); ?></p>
			</div>
		</div>
	</div>
</section>

<section class="bg-white py-20 lg:py-28" id="about-cvc">
	<div class="container-dv">
		<div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
			<div class="reveal">
				<span class="section-label"><?php esc_html_e( 'سرمایه‌گذاری شرکتی', 'digiventures' ); ?></span>
				<h2 class="section-title"><?php esc_html_e( 'CVC چیست و چرا مهم است؟', 'digiventures' ); ?></h2>
				<p class="section-desc">
					<?php esc_html_e( 'سرمایه‌گذاری شرکتی (Corporate Venture Capital) رویکردی استراتژیک است که در آن شرکت‌های بزرگ، علاوه بر سرمایه مالی، شبکه ارتباطی، دانش بازار و زیرساخت‌های عملیاتی خود را در اختیار استارتاپ‌های نوآور قرار می‌دهند.', 'digiventures' ); ?>
				</p>
				<p class="mt-4 text-base leading-relaxed text-brand-muted">
					<?php esc_html_e( 'دیجی‌ونچرز با این رویکرد، فراتر از تأمین مالی عمل می‌کند و به عنوان شریک استراتژیک، مسیر ورود به بازار، توسعه محصول و مقیاس‌پذیری را برای استارتاپ‌های منتخب هموار می‌سازد.', 'digiventures' ); ?>
				</p>
			</div>
			<div class="reveal grid grid-cols-2 gap-4">
				<?php
				$cvc_cards = array(
					array( 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', __( 'سرمایه', 'digiventures' ), __( 'تأمین مالی هدفمند', 'digiventures' ) ),
					array( 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', __( 'شبکه', 'digiventures' ), __( 'دسترسی به اکوسیستم', 'digiventures' ) ),
					array( 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', __( 'بازار', 'digiventures' ), __( 'دسترسی به بازار هدف', 'digiventures' ) ),
					array( 'M13 10V3L4 14h7v7l9-11h-7z', __( 'رشد', 'digiventures' ), __( 'همراهی در مقیاس‌پذیری', 'digiventures' ) ),
				);
				foreach ( $cvc_cards as $card ) :
					?>
					<div class="card text-center">
						<div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="<?php echo esc_attr( $card[0] ); ?>"/></svg>
						</div>
						<h3 class="font-semibold text-brand-darkText"><?php echo esc_html( $card[1] ); ?></h3>
						<p class="mt-1 text-xs text-brand-muted"><?php echo esc_html( $card[2] ); ?></p>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>

<section class="relative overflow-hidden bg-brand-dark py-16 lg:py-24" id="stats">
	<div class="tri-pattern absolute inset-0 opacity-30" aria-hidden="true"></div>
	<div class="hero-accent-line" aria-hidden="true"></div>
	<div class="container-dv relative z-10">
		<div class="reveal mb-12 text-center">
			<span class="section-label"><?php esc_html_e( 'دیجی‌ونچرز در یک نگاه', 'digiventures' ); ?></span>
			<h2 class="section-title text-white"><?php esc_html_e( 'عملکرد ما در اعداد', 'digiventures' ); ?></h2>
			<p class="section-desc mx-auto text-white/60">
				<?php esc_html_e( 'مسیر رشد استارتاپ‌ها را با سرمایه، تخصص و شبکه‌ای گسترده همراهی می‌کنیم.', 'digiventures' ); ?>
			</p>
		</div>

		<div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
			<div class="reveal rounded-2xl border border-white/10 bg-brand-darkSection/80 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/30 lg:p-8">
				<div class="stat-number text-4xl font-bold text-brand-green sm:text-5xl" data-count="25">۲۵</div>
				<p class="mt-3 text-sm leading-relaxed text-white/70 sm:text-base"><?php esc_html_e( 'تعداد استارت‌آپ‌های فعال', 'digiventures' ); ?></p>
			</div>
			<div class="reveal rounded-2xl border border-white/10 bg-brand-darkSection/80 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/30 lg:p-8">
				<div class="stat-number text-4xl font-bold text-brand-green sm:text-5xl" data-count="670">۶۷۰</div>
				<p class="mt-3 text-sm leading-relaxed text-white/70 sm:text-base"><?php esc_html_e( 'درخواست‌های جذب سرمایه', 'digiventures' ); ?></p>
			</div>
			<div class="reveal rounded-2xl border border-white/10 bg-brand-darkSection/80 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/30 lg:p-8">
				<div class="stat-number text-4xl font-bold text-brand-green sm:text-5xl" data-count="45">۴۵</div>
				<p class="mt-3 text-sm leading-relaxed text-white/70 sm:text-base"><?php esc_html_e( 'تعداد سرمایه‌گذاری‌ها', 'digiventures' ); ?></p>
			</div>
			<div class="reveal rounded-2xl border border-white/10 bg-brand-darkSection/80 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/30 lg:p-8">
				<div class="flex items-baseline justify-center gap-2">
					<span class="stat-number text-4xl font-bold text-brand-green sm:text-5xl" data-count="5">۵</span>
					<span class="text-sm font-medium text-white/70"><?php esc_html_e( 'میلیارد تومان', 'digiventures' ); ?></span>
				</div>
				<p class="mt-3 text-sm leading-relaxed text-white/70 sm:text-base"><?php esc_html_e( 'سقف سرمایه‌گذاری', 'digiventures' ); ?></p>
			</div>
		</div>
	</div>
</section>

<section class="bg-brand-light py-20 lg:py-28" id="investment-focus">
	<div class="container-dv">
		<div class="reveal mb-12 text-center">
			<span class="section-label"><?php esc_html_e( 'حوزه‌های تمرکز', 'digiventures' ); ?></span>
			<h2 class="section-title"><?php esc_html_e( 'کجا سرمایه‌گذاری می‌کنیم؟', 'digiventures' ); ?></h2>
			<p class="section-desc mx-auto">
				<?php esc_html_e( 'تمرکز ما بر حوزه‌هایی است که پتانسیل تحول در اقتصاد دیجیتال ایران را دارند و با استراتژی کلان گروه هم‌راستا هستند.', 'digiventures' ); ?>
			</p>
		</div>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<?php foreach ( $focus_areas as $area ) : ?>
				<div class="card reveal">
					<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="<?php echo esc_attr( $area['icon'] ); ?>"/></svg>
					</div>
					<h3 class="text-lg font-semibold text-brand-darkText"><?php echo esc_html( $area['title'] ); ?></h3>
					<p class="mt-2 text-sm leading-relaxed text-brand-muted"><?php echo esc_html( $area['desc'] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="bg-brand-darkSection py-20 lg:py-28" id="why-digiventures">
	<div class="container-dv">
		<div class="reveal mb-12 text-center">
			<span class="section-label"><?php esc_html_e( 'مزیت رقابتی', 'digiventures' ); ?></span>
			<h2 class="section-title text-white"><?php esc_html_e( 'چرا دیجی‌ونچرز؟', 'digiventures' ); ?></h2>
			<p class="section-desc mx-auto text-white/60">
				<?php esc_html_e( 'ما فراتر از یک سرمایه‌گذار مالی عمل می‌کنیم و به عنوان شریک استراتژیک در مسیر رشد استارتاپ‌ها حضور داریم.', 'digiventures' ); ?>
			</p>
		</div>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			<?php foreach ( $why_items as $item ) : ?>
				<div class="card-dark reveal text-center">
					<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green/10">
						<svg class="h-7 w-7 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="<?php echo esc_attr( $item['icon'] ); ?>"/></svg>
					</div>
					<h3 class="text-lg font-semibold text-white"><?php echo esc_html( $item['title'] ); ?></h3>
					<p class="mt-2 text-sm leading-relaxed text-white/60"><?php echo esc_html( $item['desc'] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="bg-white py-20 lg:py-28" id="investment-process">
	<div class="container-dv">
		<div class="reveal mb-12 text-center">
			<span class="section-label"><?php esc_html_e( 'فرآیند سرمایه‌گذاری', 'digiventures' ); ?></span>
			<h2 class="section-title"><?php esc_html_e( 'مسیر همکاری با دیجی‌ونچرز', 'digiventures' ); ?></h2>
			<p class="section-desc mx-auto">
				<?php esc_html_e( 'فرآیند ارزیابی و سرمایه‌گذاری ما شفاف، ساختارمند و با احترام به زمان بنیان‌گذاران طراحی شده است.', 'digiventures' ); ?>
			</p>
		</div>

		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
			<?php
			$persian_nums = array( '۱', '۲', '۳', '۴', '۵' );
			foreach ( $process_steps as $i => $step ) :
				?>
				<div class="process-step reveal">
					<div class="process-number"><?php echo esc_html( $persian_nums[ $i ] ); ?></div>
					<h3 class="font-semibold text-brand-darkText"><?php echo esc_html( $step[0] ); ?></h3>
					<p class="mt-2 text-sm text-brand-muted"><?php echo esc_html( $step[1] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="bg-brand-light py-20 lg:py-28" id="portfolio-signal">
	<div class="container-dv">
		<div class="reveal mb-12 text-center">
			<span class="section-label"><?php esc_html_e( 'سیگنال‌های سرمایه‌گذاری', 'digiventures' ); ?></span>
			<h2 class="section-title"><?php esc_html_e( 'به دنبال چه استارتاپ‌هایی هستیم؟', 'digiventures' ); ?></h2>
			<p class="section-desc mx-auto">
				<?php esc_html_e( 'استارتاپ‌هایی که مدل کسب‌وکار اثبات‌شده، تیم قوی و پتانسیل رشد در بازار دیجیتال دارند، در اولویت ما قرار دارند.', 'digiventures' ); ?>
			</p>
		</div>

		<div class="grid gap-6 md:grid-cols-3">
			<?php foreach ( $portfolio_signals as $signal ) : ?>
				<div class="card reveal">
					<h3 class="font-semibold text-brand-darkText"><?php echo esc_html( $signal[0] ); ?></h3>
					<p class="mt-2 text-sm leading-relaxed text-brand-muted"><?php echo esc_html( $signal[1] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="bg-brand-light py-20 lg:py-28" id="startups">
	<div class="container-dv">
		<div class="reveal mb-12 text-center">
			<span class="section-label"><?php esc_html_e( 'پرتفوی سرمایه‌گذاری', 'digiventures' ); ?></span>
			<h2 class="section-title"><?php esc_html_e( 'استارتاپ‌های دیجی‌ونچرز', 'digiventures' ); ?></h2>
			<p class="section-desc mx-auto">
				<?php esc_html_e( 'مجموعه‌ای از استارتاپ‌های نوآور که با همراهی دیجی‌ونچرز، مسیر رشد و توسعه خود را طی می‌کنند.', 'digiventures' ); ?>
			</p>
		</div>

		<div class="startup-slider reveal" data-slider>
			<div class="startup-track" data-slider-track>
				<?php for ( $i = 1; $i <= 19; $i++ ) : ?>
					<?php
					$alt = isset( $startup_alts[ $i ] )
						? $startup_alts[ $i ]
						: __( 'استارتاپ پرتفوی دیجی‌ونچرز', 'digiventures' );
					?>
					<div class="startup-slide">
						<div class="startup-card">
							<img src="<?php echo esc_url( digiventures_startup_image_uri( $i ) ); ?>" alt="<?php echo esc_attr( $alt ); ?>" loading="lazy" width="1325" height="858" />
						</div>
					</div>
				<?php endfor; ?>
			</div>

			<button type="button" class="slider-btn slider-prev" data-slider-prev aria-label="<?php esc_attr_e( 'قبلی', 'digiventures' ); ?>">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
			</button>
			<button type="button" class="slider-btn slider-next" data-slider-next aria-label="<?php esc_attr_e( 'بعدی', 'digiventures' ); ?>">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
			</button>

			<div class="slider-dots" data-slider-dots aria-label="<?php esc_attr_e( 'ناوبری اسلایدر', 'digiventures' ); ?>"></div>
		</div>
	</div>
</section>

<section class="bg-white py-20 lg:py-28" id="team-preview">
	<div class="container-dv">
		<div class="reveal mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row">
			<div>
				<span class="section-label"><?php esc_html_e( 'تیم', 'digiventures' ); ?></span>
				<h2 class="section-title"><?php esc_html_e( 'تیم سرمایه‌گذاری', 'digiventures' ); ?></h2>
				<p class="section-desc"><?php esc_html_e( 'ترکیبی از متخصصان سرمایه‌گذاری، فناوری و توسعه کسب‌وکار', 'digiventures' ); ?></p>
			</div>
			<a href="<?php echo $team_url; ?>" class="btn-outline shrink-0"><?php esc_html_e( 'مشاهده تیم', 'digiventures' ); ?></a>
		</div>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<?php foreach ( $team_preview as $member ) : ?>
				<div class="card reveal text-center">
					<div class="team-avatar">
						<svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
					</div>
					<h3 class="font-semibold text-brand-darkText"><?php echo esc_html( $member[0] ); ?></h3>
					<p class="mt-1 text-sm text-brand-green"><?php echo esc_html( $member[1] ); ?></p>
					<p class="mt-2 text-xs text-brand-muted"><?php echo esc_html( $member[2] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="hero-bg py-20 lg:py-28" id="final-cta">
	<div class="tri-pattern absolute inset-0 opacity-40" aria-hidden="true"></div>
	<div class="hero-accent-line" aria-hidden="true"></div>
	<div class="container-dv relative z-10 text-center">
		<div class="reveal mx-auto max-w-2xl">
			<h2 class="text-2xl font-bold text-white sm:text-3xl lg:text-4xl"><?php esc_html_e( 'آماده‌اید مسیر رشد را با ما شروع کنید؟', 'digiventures' ); ?></h2>
			<p class="mt-4 text-base leading-relaxed text-white/70">
				<?php esc_html_e( 'اگر استارتاپ شما در حوزه‌های فناوری‌محور فعالیت می‌کند و به دنبال شریک استراتژیک برای رشد هستید، درخواست خود را ثبت کنید.', 'digiventures' ); ?>
			</p>
			<div class="mt-8">
				<a href="<?php echo $invest_url; ?>" class="btn-primary"><?php esc_html_e( 'ثبت درخواست سرمایه‌گذاری', 'digiventures' ); ?></a>
			</div>
		</div>
	</div>
</section>

</main>
