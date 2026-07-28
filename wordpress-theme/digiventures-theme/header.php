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
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-center gap-2 text-xl font-bold text-white">
			<svg class="h-8 w-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
				<path d="M16 4L28 26H4L16 4Z" fill="#00B140"/>
				<path d="M16 10L22 22H10L16 10Z" fill="#050807"/>
			</svg>
			<span>DigiVentures</span>
		</a>

		<nav class="hidden items-center gap-8 lg:flex" aria-label="<?php esc_attr_e( 'منوی اصلی', 'digiventures' ); ?>">
			<a href="<?php echo esc_url( digiventures_page_url( 'home' ) ); ?>" class="nav-link<?php echo esc_attr( digiventures_nav_active_class( 'home' ) ); ?>"><?php esc_html_e( 'خانه', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'about' ) ); ?>" class="nav-link<?php echo esc_attr( digiventures_nav_active_class( 'about' ) ); ?>"><?php esc_html_e( 'درباره ما', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'team' ) ); ?>" class="nav-link<?php echo esc_attr( digiventures_nav_active_class( 'team' ) ); ?>"><?php esc_html_e( 'تیم', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'contact' ) ); ?>" class="nav-link<?php echo esc_attr( digiventures_nav_active_class( 'contact' ) ); ?>"><?php esc_html_e( 'تماس', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'investment-request' ) ); ?>" class="nav-link<?php echo esc_attr( digiventures_nav_active_class( 'investment-request' ) ); ?>"><?php esc_html_e( 'درخواست سرمایه‌گذاری', 'digiventures' ); ?></a>
		</nav>

		<div class="hidden lg:block">
			<a href="<?php echo esc_url( digiventures_page_url( 'investment-request' ) ); ?>" class="btn-primary text-sm"><?php esc_html_e( 'ثبت درخواست سرمایه‌گذاری', 'digiventures' ); ?></a>
		</div>

		<button
			id="mobile-menu-toggle"
			type="button"
			class="flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden"
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
			<a href="<?php echo esc_url( digiventures_page_url( 'about' ) ); ?>" class="<?php echo esc_attr( digiventures_mobile_nav_class( 'about' ) ); ?>"><?php esc_html_e( 'درباره ما', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'team' ) ); ?>" class="<?php echo esc_attr( digiventures_mobile_nav_class( 'team' ) ); ?>"><?php esc_html_e( 'تیم', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'contact' ) ); ?>" class="<?php echo esc_attr( digiventures_mobile_nav_class( 'contact' ) ); ?>"><?php esc_html_e( 'تماس', 'digiventures' ); ?></a>
			<a href="<?php echo esc_url( digiventures_page_url( 'investment-request' ) ); ?>" class="<?php echo esc_attr( digiventures_mobile_nav_class( 'investment-request' ) ); ?>"><?php esc_html_e( 'درخواست سرمایه‌گذاری', 'digiventures' ); ?></a>
			<div class="mt-4 px-4">
				<a href="<?php echo esc_url( digiventures_page_url( 'investment-request' ) ); ?>" class="btn-primary w-full text-center"><?php esc_html_e( 'ثبت درخواست سرمایه‌گذاری', 'digiventures' ); ?></a>
			</div>
		</div>
	</nav>
</header>
