<?php
/**
 * About page content.
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
		<span class="section-label"><?php esc_html_e( 'درباره دیجی‌ونچرز', 'digiventures' ); ?></span>
		<h1 class="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"><?php esc_html_e( 'شریک استراتژیک رشد استارتاپ‌ها', 'digiventures' ); ?></h1>
		<p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70">
			<?php esc_html_e( 'دیجی‌ونچرز واحد سرمایه‌گذاری شرکتی (CVC) اکوسیستم دیجیتال است که با رویکردی مسئولانه و استراتژیک، در استارتاپ‌های نوآور سرمایه‌گذاری می‌کند.', 'digiventures' ); ?>
		</p>
	</div>
</section>

<section class="bg-white py-20 lg:py-28">
	<div class="container-dv">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div class="reveal">
				<span class="section-label"><?php esc_html_e( 'مأموریت', 'digiventures' ); ?></span>
				<h2 class="section-title"><?php esc_html_e( 'مأموریت ما', 'digiventures' ); ?></h2>
				<p class="section-desc">
					<?php esc_html_e( 'شناسایی، حمایت و توانمندسازی استارتاپ‌هایی که با نوآوری فناورانه، تحول پایدار در اقتصاد دیجیتال ایران ایجاد می‌کنند.', 'digiventures' ); ?>
				</p>
				<p class="mt-4 text-base leading-relaxed text-brand-muted">
					<?php esc_html_e( 'ما معتقدیم سرمایه‌گذاری موفق، فراتر از تأمین مالی است. دیجی‌ونچرز با بهره‌گیری از تجربه عملیاتی، شبکه ارتباطی و زیرساخت‌های اکوسیستم دیجیتال، به استارتاپ‌های منتخب کمک می‌کند تا مسیر رشد خود را با اطمینان طی کنند.', 'digiventures' ); ?>
				</p>
			</div>
			<div class="reveal rounded-2xl border border-gray-100 bg-brand-light p-8">
				<h3 class="text-lg font-semibold text-brand-darkText"><?php esc_html_e( 'ارزش‌های کلیدی', 'digiventures' ); ?></h3>
				<ul class="mt-6 space-y-4">
					<li class="flex items-start gap-3">
						<span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-xs font-bold text-brand-green">۱</span>
						<div>
							<p class="font-medium text-brand-darkText"><?php esc_html_e( 'شفافیت', 'digiventures' ); ?></p>
							<p class="text-sm text-brand-muted"><?php esc_html_e( 'فرآیند ارزیابی روشن و بازخورد صادقانه', 'digiventures' ); ?></p>
						</div>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-xs font-bold text-brand-green">۲</span>
						<div>
							<p class="font-medium text-brand-darkText"><?php esc_html_e( 'مسئولیت‌پذیری', 'digiventures' ); ?></p>
							<p class="text-sm text-brand-muted"><?php esc_html_e( 'تعهد به رشد پایدار و ارزش‌آفرینی بلندمدت', 'digiventures' ); ?></p>
						</div>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-xs font-bold text-brand-green">۳</span>
						<div>
							<p class="font-medium text-brand-darkText"><?php esc_html_e( 'نوآوری', 'digiventures' ); ?></p>
							<p class="text-sm text-brand-muted"><?php esc_html_e( 'حمایت از ایده‌های جسورانه و فناوری‌های نوظهور', 'digiventures' ); ?></p>
						</div>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-xs font-bold text-brand-green">۴</span>
						<div>
							<p class="font-medium text-brand-darkText"><?php esc_html_e( 'همکاری', 'digiventures' ); ?></p>
							<p class="text-sm text-brand-muted"><?php esc_html_e( 'ساختن روابط استراتژیک مبتنی بر اعتماد متقابل', 'digiventures' ); ?></p>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<section class="bg-brand-light py-20 lg:py-28">
	<div class="container-dv">
		<div class="reveal mb-12 text-center">
			<span class="section-label"><?php esc_html_e( 'فلسفه سرمایه‌گذاری', 'digiventures' ); ?></span>
			<h2 class="section-title"><?php esc_html_e( 'رویکرد سرمایه‌گذاری شرکتی', 'digiventures' ); ?></h2>
			<p class="section-desc mx-auto">
				<?php esc_html_e( 'دیجی‌ونچرز با ترکیب دیدگاه استراتژیک یک شرکت بزرگ و چابکی یک سرمایه‌گذار جسورانه، ارزش منحصربه‌فردی برای استارتاپ‌ها ایجاد می‌کند.', 'digiventures' ); ?>
			</p>
		</div>
		<div class="grid gap-6 md:grid-cols-3">
			<div class="card reveal">
				<h3 class="font-semibold text-brand-darkText"><?php esc_html_e( 'هم‌راستایی استراتژیک', 'digiventures' ); ?></h3>
				<p class="mt-2 text-sm leading-relaxed text-brand-muted"><?php esc_html_e( 'سرمایه‌گذاری در حوزه‌هایی که با استراتژی کلان گروه و چشم‌انداز اقتصاد دیجیتال هم‌راستا هستند.', 'digiventures' ); ?></p>
			</div>
			<div class="card reveal">
				<h3 class="font-semibold text-brand-darkText"><?php esc_html_e( 'ارزش افزوده عملیاتی', 'digiventures' ); ?></h3>
				<p class="mt-2 text-sm leading-relaxed text-brand-muted"><?php esc_html_e( 'فراتر از سرمایه، دسترسی به مشتریان، زیرساخت فنی و تجربه عملیاتی بازار را فراهم می‌کنیم.', 'digiventures' ); ?></p>
			</div>
			<div class="card reveal">
				<h3 class="font-semibold text-brand-darkText"><?php esc_html_e( 'دید بلندمدت', 'digiventures' ); ?></h3>
				<p class="mt-2 text-sm leading-relaxed text-brand-muted"><?php esc_html_e( 'تمرکز بر ایجاد ارزش پایدار و رشد تدریجی، نه خروج سریع و کوتاه‌مدت.', 'digiventures' ); ?></p>
			</div>
		</div>
	</div>
</section>

<section class="bg-brand-darkSection py-20 lg:py-28">
	<div class="container-dv">
		<div class="reveal mb-12 text-center">
			<span class="section-label"><?php esc_html_e( 'فرآیند', 'digiventures' ); ?></span>
			<h2 class="section-title text-white"><?php esc_html_e( 'چگونه با ما همکاری کنید؟', 'digiventures' ); ?></h2>
			<p class="section-desc mx-auto text-white/60"><?php esc_html_e( 'فرآیند ساده و شفاف از ارسال درخواست تا شروع همکاری', 'digiventures' ); ?></p>
		</div>
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
			<?php
			$steps = array(
				__( 'ارسال درخواست', 'digiventures' ),
				__( 'بررسی اولیه', 'digiventures' ),
				__( 'جلسه ارزیابی', 'digiventures' ),
				__( 'تصمیم نهایی', 'digiventures' ),
				__( 'شروع همکاری', 'digiventures' ),
			);
			$persian_nums = array( '۱', '۲', '۳', '۴', '۵' );
			foreach ( $steps as $i => $label ) :
				?>
				<div class="card-dark reveal text-center">
					<div class="process-number mx-auto"><?php echo esc_html( $persian_nums[ $i ] ); ?></div>
					<h3 class="font-semibold text-white"><?php echo esc_html( $label ); ?></h3>
				</div>
			<?php endforeach; ?>
		</div>
		<div class="reveal mt-10 text-center">
			<a href="<?php echo $invest_url; ?>" class="btn-primary"><?php esc_html_e( 'ثبت درخواست سرمایه‌گذاری', 'digiventures' ); ?></a>
		</div>
	</div>
</section>
