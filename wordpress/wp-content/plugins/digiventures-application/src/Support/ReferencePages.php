<?php
namespace DigiVentures\Application\Support;

use DigiVentures\Application\Capabilities\Roles;

defined( 'ABSPATH' ) || exit;

/**
 * Renders the supplied frontend as the visual source of truth.
 *
 * Business forms are replaced with plugin-owned secure shortcodes before output.
 */
final class ReferencePages {
	private const PAGES = array( 'home', 'about', 'portfolio', 'team', 'contact', 'news', 'investment-request' );

	public function register(): void {
		add_shortcode( 'dv_reference_page', array( $this, 'shortcode' ) );
	}

	public function shortcode( array $attributes ): string {
		$page = sanitize_key( $attributes['page'] ?? 'home' );
		if ( ! in_array( $page, self::PAGES, true ) ) {
			return '';
		}

		$file = DV_APP_DIR . 'templates/reference/' . ( 'home' === $page ? 'index' : $page ) . '.html';
		if ( ! is_readable( $file ) ) {
			return '<div class="alert-error">' . esc_html__( 'قالب این صفحه در دسترس نیست.', 'digiventures-application' ) . '</div>';
		}

		$html = (string) file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		if ( preg_match( '/<body[^>]*>(.*)<\/body>/si', $html, $matches ) ) {
			$html = $matches[1];
		}

		if ( 'investment-request' === $page ) {
			$secure_form = do_shortcode( '[dv_request_form embedded="1"]' );
			$html = preg_replace( '/<form\s+id="investment-request-form".*?<\/form>/si', $secure_form, $html, 1 ) ?? $html;
		}
		if ( 'contact' === $page ) {
			$secure_form = do_shortcode( '[dv_contact_form]' );
			$html = preg_replace( '/<form\s+class="mt-6 space-y-5"\s+action="#".*?<\/form>/si', $secure_form, $html, 1 ) ?? $html;
		}

		$html = $this->replace_urls( $html );
		return '<div class="dv-reference-page dv-reference-' . esc_attr( $page ) . '">' . $html . '</div>';
	}

	private function replace_urls( string $html ): string {
		$logged_in = is_user_logged_in();
		$login_url = Roles::page_url( 'login', '/login/' );
		$logout_url = Roles::page_url( 'logout', '/logout/' );
		$pages = array(
			'/portfolio.html' => Roles::page_url( 'portfolio', '/portfolio/' ),
			'/team.html' => Roles::page_url( 'team', '/team/' ),
			'/about.html' => Roles::page_url( 'about', '/about/' ),
			'/contact.html' => Roles::page_url( 'contact', '/contact/' ),
			'/news.html' => Roles::page_url( 'news', '/news/' ),
			'/investment-request.html' => Roles::page_url( 'investment-request', '/investment-request/' ),
			'/login.html' => $logged_in ? Roles::dashboard_url() : $login_url,
			'/signup.html' => $logged_in ? $logout_url : Roles::page_url( 'register', '/register/' ),
			'/forgot-password.html' => Roles::page_url( 'forgot-password', '/forgot-password/' ),
		);

		foreach ( $pages as $source => $destination ) {
			$html = str_replace( $source, esc_url( $destination ), $html );
		}

		$html = str_replace( 'href="/#', 'href="' . esc_url( home_url( '/' ) ) . '#', $html );
		$html = str_replace( 'href="/"', 'href="' . esc_url( home_url( '/' ) ) . '"', $html );
		$html = str_replace( 'src="/assets/images/', 'src="' . esc_url( DV_APP_URL . 'assets/images/' ), $html );
		$html = str_replace( 'href="/assets/images/', 'href="' . esc_url( DV_APP_URL . 'assets/images/' ), $html );
		if ( $logged_in ) {
			$user = wp_get_current_user();
			$initial = strtoupper( substr( $user->user_email, 0, 1 ) );
			$account_url = Roles::dashboard_url( $user );
			$account_menu = '<div class="dv-account-menu dv-site-account-menu"><button class="dv-account-menu-trigger" type="button" data-dv-account-menu aria-expanded="false"><span class="dv-user-avatar" aria-hidden="true">' . esc_html( $initial ) . '</span><span dir="ltr">' . esc_html( $user->user_email ) . '</span><i aria-hidden="true">⌄</i></button><div class="dv-account-menu-popover" data-dv-account-popover hidden><a href="' . esc_url( $account_url ) . '">پروفایل و حساب</a><a href="' . esc_url( $logout_url ) . '" data-dv-auth-open="logout" aria-haspopup="dialog">خروج از حساب</a></div></div>';
			$html = preg_replace( '#<div class="header-auth-actions\b[^>]*>.*?</div>#s', $account_menu, $html, 1 ) ?? $html;
			$html = str_replace( 'href="' . esc_url( $account_url ) . '">ورود به حساب</a>', 'href="' . esc_url( $account_url ) . '">حساب کاربری</a>', $html );
		} else {
			$html = str_replace( 'href="' . esc_url( $login_url ) . '"', 'href="' . esc_url( $login_url ) . '" data-dv-auth-open="login" aria-haspopup="dialog"', $html );
		}
		return $html;
	}
}
