<?php
/**
 * Team page content.
 *
 * @package DigiVentures
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contact_url = esc_url( digiventures_page_url( 'contact' ) );
$invest_url  = esc_url( digiventures_page_url( 'investment-request' ) );

$team_members = array(
	array(
		'title' => __( 'مدیریت سرمایه‌گذاری', 'digiventures' ),
		'role'  => 'Investment Lead',
		'desc'  => __( 'رهبری استراتژی سرمایه‌گذاری، مدیریت پرتفوی و تصمیم‌گیری نهایی در فرآیند ارزیابی استارتاپ‌ها', 'digiventures' ),
	),
	array(
		'title' => __( 'تحلیل و ارزیابی', 'digiventures' ),
		'role'  => 'Due Diligence Analyst',
		'desc'  => __( 'تحلیل مالی، فنی و بازار استارتاپ‌های متقاضی و تهیه گزارش‌های ارزیابی جامع', 'digiventures' ),
	),
	array(
		'title' => __( 'توسعه اکوسیستم', 'digiventures' ),
		'role'  => 'Ecosystem Manager',
		'desc'  => __( 'ایجاد ارتباط بین استارتاپ‌ها و واحدهای تجاری گروه، شبکه‌سازی و فراهم‌سازی دسترسی به بازار', 'digiventures' ),
	),
	array(
		'title' => __( 'مشاوره فنی', 'digiventures' ),
		'role'  => 'Technical Advisor',
		'desc'  => __( 'ارزیابی فناوری، معماری محصول و پتانسیل فنی راهکارهای پیشنهادی استارتاپ‌ها', 'digiventures' ),
	),
	array(
		'title' => __( 'حقوقی و قراردادها', 'digiventures' ),
		'role'  => 'Legal Counsel',
		'desc'  => __( 'تدوین و بررسی قراردادهای سرمایه‌گذاری و اطمینان از رعایت الزامات حقوقی', 'digiventures' ),
	),
	array(
		'title' => __( 'ارتباطات و روابط', 'digiventures' ),
		'role'  => 'Communications Lead',
		'desc'  => __( 'مدیریت ارتباط با بنیان‌گذاران، پیگیری درخواست‌ها و هماهنگی جلسات ارزیابی', 'digiventures' ),
	),
);
?>

<section class="hero-bg py-20 lg:py-28">
	<div class="tri-pattern absolute inset-0 opacity-40" aria-hidden="true"></div>
	<div class="hero-accent-line" aria-hidden="true"></div>
	<div class="container-dv relative z-10 text-center">
		<span class="section-label"><?php esc_html_e( 'تیم سرمایه‌گذاری', 'digiventures' ); ?></span>
		<h1 class="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"><?php esc_html_e( 'متخصصان پشت دیجی‌ونچرز', 'digiventures' ); ?></h1>
		<p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70">
			<?php esc_html_e( 'تیمی متشکل از متخصصان سرمایه‌گذاری، تحلیل فنی و توسعه اکوسیستم که با تجربه عملی در حوزه فناوری و کسب‌وکار دیجیتال، استارتاپ‌ها را در مسیر رشد همراهی می‌کنند.', 'digiventures' ); ?>
		</p>
	</div>
</section>

<section class="bg-white py-20 lg:py-28">
	<div class="container-dv">
		<div class="reveal mb-12 text-center">
			<span class="section-label"><?php esc_html_e( 'ساختار تیم', 'digiventures' ); ?></span>
			<h2 class="section-title"><?php esc_html_e( 'تیم اجرایی', 'digiventures' ); ?></h2>
			<p class="section-desc mx-auto"><?php esc_html_e( 'نقش‌های کلیدی در فرآیند ارزیابی، سرمایه‌گذاری و توسعه پرتفوی', 'digiventures' ); ?></p>
		</div>

		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			<?php foreach ( $team_members as $member ) : ?>
				<div class="card reveal text-center">
					<div class="team-avatar">
						<svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
					</div>
					<h3 class="text-lg font-semibold text-brand-darkText"><?php echo esc_html( $member['title'] ); ?></h3>
					<p class="mt-1 text-sm font-medium text-brand-green"><?php echo esc_html( $member['role'] ); ?></p>
					<p class="mt-3 text-sm leading-relaxed text-brand-muted"><?php echo esc_html( $member['desc'] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="bg-brand-light py-20 lg:py-28">
	<div class="container-dv">
		<div class="reveal mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-card lg:p-12">
			<span class="section-label"><?php esc_html_e( 'هیئت مشاوره', 'digiventures' ); ?></span>
			<h2 class="section-title mt-2"><?php esc_html_e( 'شبکه مشاوران تخصصی', 'digiventures' ); ?></h2>
			<p class="mt-4 text-base leading-relaxed text-brand-muted">
				<?php esc_html_e( 'علاوه بر تیم اجرایی، دیجی‌ونچرز از شبکه‌ای از مشاوران متخصص در حوزه‌های فناوری، مالی، حقوقی و بازار بهره می‌برد. این مشاوران در مراحل ارزیابی عمیق و تصمیم‌گیری نهایی، دیدگاه تخصصی خود را ارائه می‌دهند.', 'digiventures' ); ?>
			</p>
			<p class="mt-4 text-sm text-brand-muted">
				<?php esc_html_e( 'اطلاعات اعضای هیئت مشاوره به‌زودی در این بخش منتشر خواهد شد.', 'digiventures' ); ?>
			</p>
		</div>
	</div>
</section>

<section class="hero-bg py-16 lg:py-20">
	<div class="tri-pattern absolute inset-0 opacity-40" aria-hidden="true"></div>
	<div class="container-dv relative z-10 text-center">
		<div class="reveal">
			<h2 class="text-2xl font-bold text-white sm:text-3xl"><?php esc_html_e( 'با تیم ما در ارتباط باشید', 'digiventures' ); ?></h2>
			<p class="mx-auto mt-4 max-w-lg text-base text-white/70"><?php esc_html_e( 'برای پرسش‌های مربوط به فرآیند سرمایه‌گذاری یا همکاری، با ما تماس بگیرید.', 'digiventures' ); ?></p>
			<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a href="<?php echo $contact_url; ?>" class="btn-secondary"><?php esc_html_e( 'تماس با ما', 'digiventures' ); ?></a>
				<a href="<?php echo $invest_url; ?>" class="btn-primary"><?php esc_html_e( 'ثبت درخواست سرمایه‌گذاری', 'digiventures' ); ?></a>
			</div>
		</div>
	</div>
</section>
