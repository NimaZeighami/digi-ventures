<?php
/**
 * Single Post Template for DigiVentures News & Blog
 *
 * @package DigiVentures
 */

defined( 'ABSPATH' ) || exit;

use DigiVentures\Application\Capabilities\Roles;
use DigiVentures\Application\Support\ReferencePages;

$post_id     = get_the_ID();
$categories  = get_the_category( $post_id );
$cat_name    = ! empty( $categories ) ? $categories[0]->name : 'دیدگاه و تحلیل';
$cat_slug    = ! empty( $categories ) ? $categories[0]->slug : 'perspectives';
$author_id   = (int) get_post_field( 'post_author', $post_id );
$author_name = get_the_author_meta( 'display_name', $author_id );
if ( empty( $author_name ) ) {
	$author_name = 'تیم تحریریه دیجی‌ونچرز';
}
$author_desc = get_the_author_meta( 'description', $author_id );
if ( empty( $author_desc ) ) {
	$author_desc = 'تحریریه دیجی‌ونچرز — روایت نوآوری و گزارش‌های سرمایه‌گذاری جسورانه';
}

$parts    = preg_split( '/\s+/u', trim( $author_name ) ) ?: array();
$initials = '';
if ( ! empty( $parts[0] ) ) {
	$initials .= mb_substr( $parts[0], 0, 1, 'UTF-8' );
}
if ( count( $parts ) > 1 && ! empty( $parts[1] ) ) {
	$initials .= mb_substr( $parts[1], 0, 1, 'UTF-8' );
}
if ( empty( $initials ) ) {
	$initials = 'DV';
}

$en_digits = array( '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' );
$fa_digits = array( '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹' );

$post_date = str_replace( $en_digits, $fa_digits, get_the_date( 'j F Y', $post_id ) );

$content_raw = (string) get_post_field( 'post_content', $post_id );
$words_count = count( preg_split( '/\s+/u', trim( wp_strip_all_tags( $content_raw ) ) ) ?: array() );
$read_time   = str_replace( $en_digits, $fa_digits, (string) max( 1, (int) ceil( $words_count / 200 ) ) );

$home_url  = home_url( '/' );
$news_url  = Roles::page_url( 'news', '/news/' );
$permalink = get_permalink( $post_id );

?><!doctype html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'dv-canvas dv-single-post-body bg-slate-50/50 text-slate-800' ); ?>>
<?php wp_body_open(); ?>

<div id="page" class="dv-reference-page dv-single-post min-h-screen flex flex-col justify-between">

	<?php
	if ( class_exists( ReferencePages::class ) ) {
		echo ReferencePages::get_site_header(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
	?>

	<!-- ==================== MAIN EDITORIAL ARTICLE ==================== -->
	<main class="flex-grow pt-[76px]">

		<!-- Article Hero & Ambient Backdrop -->
		<article class="relative overflow-hidden bg-white pb-16 pt-8 border-b border-slate-100">
			<!-- Ambient M12 Gradient Texture -->
			<img src="<?php echo esc_url( DV_APP_URL . 'assets/images/m12/gradient-hero.webp' ); ?>" alt="" class="pointer-events-none absolute -top-40 -left-40 w-[650px] opacity-25 blur-3xl select-none" aria-hidden="true" />
			<img src="<?php echo esc_url( DV_APP_URL . 'assets/images/m12/gradient-focus.webp' ); ?>" alt="" class="pointer-events-none absolute top-60 -right-40 w-[650px] opacity-20 blur-3xl select-none" aria-hidden="true" />

			<div class="container-dv relative z-10 max-w-4xl mx-auto">

				<!-- Breadcrumb -->
				<nav class="flex items-center gap-2 text-xs text-slate-600 mb-8 overflow-x-auto whitespace-nowrap scrollbar-none" aria-label="مسیر راهنما">
					<a href="<?php echo esc_url( $home_url ); ?>" class="hover:text-brand-green transition-colors">خانه</a>
					<span>/</span>
					<a href="<?php echo esc_url( $news_url ); ?>" class="hover:text-brand-green transition-colors">تازه‌ها و دیدگاه‌ها</a>
					<span>/</span>
					<span class="text-slate-800 font-medium truncate max-w-[280px] sm:max-w-md"><?php the_title(); ?></span>
				</nav>

				<!-- Article Header Metadata -->
				<div class="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-5">
					<span class="rounded-full bg-emerald-50 px-3 py-1 font-bold text-brand-green border border-emerald-100">
						<?php echo esc_html( $cat_name ); ?>
					</span>
					<span>·</span>
					<span><?php echo esc_html( $post_date ); ?></span>
					<span>·</span>
					<span>زمان مطالعه: <?php echo esc_html( $read_time ); ?> دقیقه</span>
					<?php if ( current_user_can( 'edit_post', $post_id ) ) : ?>
						<span class="mr-auto">
							<a href="<?php echo esc_url( (string) get_edit_post_link( $post_id ) ); ?>" class="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-brand-green hover:text-white transition-colors" target="_blank" rel="noopener">
								<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
								<span>ویرایش این نوشته</span>
							</a>
						</span>
					<?php endif; ?>
				</div>

				<!-- Article H1 Title -->
				<h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-[1.25] tracking-tight mb-6">
					<?php the_title(); ?>
				</h1>

				<!-- Editorial Lead / Excerpt (if provided) -->
				<?php if ( has_excerpt( $post_id ) ) : ?>
					<p class="text-base sm:text-xl font-medium text-slate-700 leading-relaxed mb-8 border-r-2 border-brand-green pr-4">
						<?php echo esc_html( get_the_excerpt( $post_id ) ); ?>
					</p>
				<?php endif; ?>

				<!-- Author Bar & Sharing Toolbar -->
				<div class="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-slate-100 my-8">
					<div class="flex items-center gap-3">
						<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-brand-green font-bold text-sm">
							<?php echo esc_html( $initials ); ?>
						</div>
						<div>
							<p class="text-sm font-bold text-slate-900"><?php echo esc_html( $author_name ); ?></p>
							<p class="text-xs text-slate-500"><?php echo esc_html( $author_desc ); ?></p>
						</div>
					</div>

					<!-- Social Share -->
					<div class="flex items-center gap-2">
						<span class="text-xs text-slate-500 ml-1">اشتراک:</span>
						<!-- Copy Link -->
						<button
							type="button"
							id="dv-single-copy-link"
							class="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:border-brand-green hover:text-brand-green transition-colors"
							title="کپی پیوند نوشته"
						>
							<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
							</svg>
							<span>کپی لینک</span>
						</button>
						<span id="dv-single-copy-toast" class="hidden text-xs font-bold text-brand-green">کپی شد!</span>

						<!-- Telegram -->
						<a
							href="<?php echo esc_url( 'https://t.me/share/url?url=' . rawurlencode( $permalink ) . '&text=' . rawurlencode( get_the_title( $post_id ) ) ); ?>"
							target="_blank"
							rel="noopener"
							class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-brand-green hover:text-white transition-colors"
							aria-label="اشتراک‌گذاری در تلگرام"
						>
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
						</a>

						<!-- X / Twitter -->
						<a
							href="<?php echo esc_url( 'https://twitter.com/intent/tweet?url=' . rawurlencode( $permalink ) . '&text=' . rawurlencode( get_the_title( $post_id ) ) ); ?>"
							target="_blank"
							rel="noopener"
							class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-brand-green hover:text-white transition-colors"
							aria-label="اشتراک‌گذاری در اکس"
						>
							<svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
						</a>

						<!-- LinkedIn -->
						<a
							href="<?php echo esc_url( 'https://www.linkedin.com/sharing/share-offsite/?url=' . rawurlencode( $permalink ) ); ?>"
							target="_blank"
							rel="noopener"
							class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-brand-green hover:text-white transition-colors"
							aria-label="اشتراک‌گذاری در لینکدین"
						>
							<svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63c0-.9-.73-1.63-1.63-1.63z"/></svg>
						</a>
					</div>
				</div>

				<!-- Featured Image (Hero Visual) -->
				<?php if ( has_post_thumbnail( $post_id ) ) : ?>
					<div class="relative my-8 aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-3xl border border-slate-200/90 shadow-card">
						<img
							src="<?php echo esc_url( (string) get_the_post_thumbnail_url( $post_id, 'full' ) ); ?>"
							alt="<?php echo esc_attr( get_the_title( $post_id ) ); ?>"
							class="h-full w-full object-cover"
						/>
					</div>
				<?php endif; ?>

				<!-- Main Post Body Content -->
				<div class="dv-article-content prose max-w-none text-slate-700 leading-relaxed font-light my-10 space-y-6">
					<?php
					while ( have_posts() ) {
						the_post();
						the_content();
					}
					?>
				</div>

				<!-- Post Tags (if any) -->
				<?php
				$tags = get_the_tags( $post_id );
				if ( ! empty( $tags ) ) :
					?>
					<div class="flex flex-wrap items-center gap-2 pt-6 pb-8 border-t border-slate-100">
						<span class="text-xs font-semibold text-slate-500 ml-2">برچسب‌ها:</span>
						<?php foreach ( $tags as $tag ) : ?>
							<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
								#<?php echo esc_html( $tag->name ); ?>
							</span>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>

				<!-- Author Bio Box -->
				<div class="my-10 rounded-3xl bg-slate-50 p-6 sm:p-8 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-6">
					<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-brand-green font-black text-xl shadow-sm">
						<?php echo esc_html( $initials ); ?>
					</div>
					<div>
						<h4 class="text-base font-bold text-slate-950 mb-1"><?php echo esc_html( $author_name ); ?></h4>
						<p class="text-xs text-slate-500 mb-3"><?php echo esc_html( $author_desc ); ?></p>
						<p class="text-xs text-slate-600 font-light leading-relaxed">
							دیدگاه‌ها و مقالات تحلیلی ارائه‌شده بر اساس تجربیات میدانی، داده‌های عملکردی پورتفولیو و استراتژی رشد سرمایه‌گذاری خطرپذیر در زیست‌بوم نوآوری ایران تنظیم شده است.
						</p>
					</div>
				</div>

				<!-- Return to News Hub CTA -->
				<div class="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
					<a
						href="<?php echo esc_url( $news_url ); ?>"
						class="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-xs font-bold text-white shadow-sm hover:bg-brand-green hover:shadow-md transition-all"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
						</svg>
						<span>بازگشت به اتاق خبر و دیدگاه‌ها</span>
					</a>

					<div class="flex items-center gap-4 text-xs font-medium text-slate-500">
						<?php
						$prev_post = get_previous_post();
						if ( ! empty( $prev_post ) ) :
							?>
							<a href="<?php echo esc_url( get_permalink( $prev_post->ID ) ); ?>" class="hover:text-brand-green transition-colors" title="<?php echo esc_attr( get_the_title( $prev_post->ID ) ); ?>">
								← مقاله قبلی
							</a>
						<?php endif; ?>

						<?php
						$next_post = get_next_post();
						if ( ! empty( $next_post ) ) :
							?>
							<a href="<?php echo esc_url( get_permalink( $next_post->ID ) ); ?>" class="hover:text-brand-green transition-colors" title="<?php echo esc_attr( get_the_title( $next_post->ID ) ); ?>">
								مقاله بعدی →
							</a>
						<?php endif; ?>
					</div>
				</div>

			</div>
		</article>

		<!-- Newsletter CTA Section -->
		<section class="py-16 bg-slate-50/70 border-b border-slate-200">
			<div class="container-dv max-w-4xl mx-auto">
				<div class="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white sm:px-12 sm:py-16 shadow-card">
					<div class="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-green/20 blur-3xl"></div>
					<div class="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-600/15 blur-3xl"></div>

					<div class="relative z-10 max-w-2xl mx-auto text-center">
						<span class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md mb-4 border border-white/10">
							خبرنامه تخصصی سرمایه‌گذاری
						</span>
						<h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
							جدیدترین دیدگاه‌ها و گزارش‌های CVC در صندوق ایمیل شما
						</h3>
						<p class="mt-3 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
							با عضویت در خبرنامه فصلی دیجی‌ونچرز، گزیده‌ای از تحلیل‌های اقتصادی و گزارش‌های استارتاپ‌ها را دریافت کنید.
						</p>

						<form class="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onsubmit="event.preventDefault(); alert('ایمیل شما با موفقیت در خبرنامه دیجی‌ونچرز ثبت گردید.'); this.reset();">
							<input
								type="email"
								required
								placeholder="آدرس ایمیل کاری خود را وارد کنید..."
								class="flex-1 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-xs text-white placeholder-slate-400 backdrop-blur-md focus:border-brand-green focus:bg-white/15 focus:outline-none transition-all"
							/>
							<button
								type="submit"
								class="rounded-xl bg-brand-green px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-brand-greenHover transition-all whitespace-nowrap"
							>
								عضویت در خبرنامه
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>

	</main>

	<?php
	if ( class_exists( ReferencePages::class ) ) {
		echo ReferencePages::get_site_footer(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
	?>

</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
	var copyBtn = document.getElementById('dv-single-copy-link');
	var toast = document.getElementById('dv-single-copy-toast');
	if (copyBtn && toast) {
		copyBtn.addEventListener('click', function() {
			navigator.clipboard.writeText(window.location.href).then(function() {
				toast.classList.remove('hidden');
				setTimeout(function() {
					toast.classList.add('hidden');
				}, 2000);
			});
		});
	}
});
</script>

<?php wp_footer(); ?>
</body>
</html>
