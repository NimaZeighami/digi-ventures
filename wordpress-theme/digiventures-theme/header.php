<?php
/**
 * Site header.
 *
 * @package DigiVentures
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="fixed top-0 z-50 w-full border-b border-white/10 bg-brand-dark/95 backdrop-blur-md">
	<div class="container-dv flex h-[72px] items-center justify-between">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-header-brand brand-logo" aria-label="DigiVentures">
			<span class="brand-logo-mark" aria-hidden="true"></span>
			<span class="brand-logo-wordmark" aria-hidden="true"></span>
		</a>

		<nav class="hidden items-center gap-6 xl:flex" aria-label="<?php esc_attr_e( 'منوی اصلی', 'digiventures' ); ?>">
			<a href="<?php echo esc_url( digiventures_page_url( 'home' ) ); ?>" class="nav-link<?php echo esc_attr( digiventures_nav_active_class( 'home' ) ); ?>"><?php esc_html_e( 'خانه', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'portfolio' ) ); ?>" class="nav-link<?php echo esc_attr( digiventures_nav_active_class( 'portfolio' ) ); ?>"><?php esc_html_e( 'پورتفولیو', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'team' ) ); ?>" class="nav-link<?php echo esc_attr( digiventures_nav_active_class( 'team' ) ); ?>"><?php esc_html_e( 'تیم', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'about' ) ); ?>" class="nav-link<?php echo esc_attr( digiventures_nav_active_class( 'about' ) ); ?>"><?php esc_html_e( 'درباره ما', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'contact' ) ); ?>" class="nav-link<?php echo esc_attr( digiventures_nav_active_class( 'contact' ) ); ?>"><?php esc_html_e( 'ارتباط با ما', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'news' ) ); ?>" class="nav-link<?php echo esc_attr( digiventures_nav_active_class( 'news' ) ); ?>"><?php esc_html_e( 'تازه‌ها', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'investment-request' ) ); ?>" class="nav-link<?php echo esc_attr( digiventures_nav_active_class( 'investment-request' ) ); ?>"><?php esc_html_e( 'درخواست سرمایه‌گذاری', 'digiventures' ); ?></a>
		</nav>

		<div class="hidden items-center gap-3 xl:flex">
			<a href="<?php echo esc_url( digiventures_page_url( 'login' ) ); ?>" class="btn-login"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M18.75 12H9m9.75 0-3-3m3 3-3 3"/></svg><?php esc_html_e( 'ورود', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'investment-request' ) ); ?>" class="btn-primary !px-4 !py-2.5"><?php esc_html_e( 'ثبت درخواست', 'digiventures' ); ?></a>
		</div>

		<button
			id="mobile-menu-toggle"
			type="button"
			class="flex h-10 w-10 items-center justify-center rounded-lg text-white xl:hidden"
			aria-expanded="false"
			aria-controls="mobile-menu"
			aria-label="<?php esc_attr_e( 'باز کردن منو', 'digiventures' ); ?>"
		>
			<svg id="icon-menu-open" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
			</svg>
			<svg id="icon-menu-close" class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
			</svg>
		</button>
	</div>

	<nav
		id="mobile-menu"
		class="mobile-menu mobile-menu-hidden"
		aria-label="<?php esc_attr_e( 'منوی موبایل', 'digiventures' ); ?>"
		aria-hidden="true"
	>
		<div class="container-dv flex flex-col gap-1 py-6">
			<a href="<?php echo esc_url( digiventures_page_url( 'home' ) ); ?>" class="<?php echo esc_attr( digiventures_mobile_nav_class( 'home' ) ); ?>"><?php esc_html_e( 'خانه', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'portfolio' ) ); ?>" class="<?php echo esc_attr( digiventures_mobile_nav_class( 'portfolio' ) ); ?>"><?php esc_html_e( 'پورتفولیو', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'team' ) ); ?>" class="<?php echo esc_attr( digiventures_mobile_nav_class( 'team' ) ); ?>"><?php esc_html_e( 'تیم', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'about' ) ); ?>" class="<?php echo esc_attr( digiventures_mobile_nav_class( 'about' ) ); ?>"><?php esc_html_e( 'درباره ما', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'contact' ) ); ?>" class="<?php echo esc_attr( digiventures_mobile_nav_class( 'contact' ) ); ?>"><?php esc_html_e( 'ارتباط با ما', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'news' ) ); ?>" class="<?php echo esc_attr( digiventures_mobile_nav_class( 'news' ) ); ?>"><?php esc_html_e( 'تازه‌ها', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'investment-request' ) ); ?>" class="<?php echo esc_attr( digiventures_mobile_nav_class( 'investment-request' ) ); ?>"><?php esc_html_e( 'درخواست سرمایه‌گذاری', 'digiventures' ); ?></a>
			<div class="mt-4 px-4">
				<a href="<?php echo esc_url( digiventures_page_url( 'login' ) ); ?>" class="btn-login mb-3 w-full justify-center"><?php esc_html_e( 'ورود به حساب', 'digiventures' ); ?></a>
				<a href="<?php echo esc_url( digiventures_page_url( 'investment-request' ) ); ?>" class="btn-primary w-full text-center"><?php esc_html_e( 'ثبت درخواست سرمایه‌گذاری', 'digiventures' ); ?></a>
			</div>
		</div>
	</nav>
</header>
