<?php
/**
 * Login page renderer.
 * Used by both the dv_login shortcode and the Elementor widget.
 * No business logic — presentation only.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Rendering;

use DV_Core\Settings;
use DV_Core\Page_Resolver;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Login_Renderer {

	/**
	 * Render the login screen or already-logged-in state.
	 *
	 * @return string HTML
	 */
	public static function render() {
		if ( is_user_logged_in() ) {
			$user          = wp_get_current_user();
			$dashboard_url = Page_Resolver::url( 'my-requests' );
			return '<section class="dv-app-panel">'
				. '<p>' . sprintf(
					esc_html__( 'You are signed in as %s.', 'digiventures-core' ),
					esc_html( $user->display_name )
				) . '</p>'
				. '<p><a class="btn-primary" href="' . esc_url( $dashboard_url ) . '">'
				. esc_html__( 'Dashboard', 'digiventures-core' )
				. '</a></p></section>';
		}

		$redirect_to = Render_Service::current_url();

		ob_start();
		?>
		<section class="auth-shell flex items-center justify-center">
			<section class="auth-panel" aria-labelledby="login-title">
				<aside class="auth-aside">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="brand-logo relative z-10 self-start" aria-label="DigiVentures">
						<span class="brand-logo-mark" aria-hidden="true"></span>
						<span class="brand-logo-wordmark" aria-hidden="true"></span>
					</a>
					<div class="relative z-10">
						<span class="section-label">حساب کاربری</span>
						<h1 class="mt-3 text-4xl font-bold leading-tight">همراه آینده‌سازان باشید.</h1>
						<p class="mt-5 max-w-sm leading-relaxed text-white/65">حساب کاربری شما راهی امن برای پیگیری درخواست‌های سرمایه‌گذاری و ارتباط با تیم دیجی‌ونچرز است.</p>
					</div>
					<p class="relative z-10 text-sm text-white/45">سرمایه‌گذاری بر آینده کسب‌وکارها.</p>
				</aside>
				<div class="auth-content">
					<div class="flex items-center justify-between">
						<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="text-sm text-brand-muted transition-colors hover:text-brand-green">بازگشت به سایت</a>
						<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="brand-logo lg:hidden" aria-label="DigiVentures">
							<span class="brand-logo-mark" aria-hidden="true"></span>
							<span class="brand-logo-wordmark !text-brand-dark" aria-hidden="true"></span>
						</a>
					</div>
					<div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
						<span class="section-label">خوش آمدید</span>
						<h1 id="login-title" class="text-3xl font-bold text-brand-darkText"><?php echo esc_html( Settings::get( 'login_title' ) ); ?></h1>
						<p class="mt-3 leading-relaxed text-brand-muted"><?php echo esc_html( Settings::get( 'login_description' ) ); ?></p>
						<form class="mt-8 space-y-5" method="post" action="<?php echo esc_url( site_url( 'wp-login.php', 'login_post' ) ); ?>">
							<input type="hidden" name="redirect_to" value="<?php echo esc_attr( $redirect_to ); ?>" />
							<div>
								<label class="form-label" for="login-email">ایمیل</label>
								<input class="form-input" id="login-email" name="log" type="text" inputmode="email" autocomplete="username" placeholder="name@example.com" required />
							</div>
							<div>
								<div class="mb-2 flex items-center justify-between">
									<label class="form-label !mb-0" for="login-password">گذرواژه</label>
									<a class="text-xs font-medium text-brand-green hover:text-brand-dark" href="<?php echo esc_url( wp_lostpassword_url( $redirect_to ) ); ?>">گذرواژه را فراموش کرده‌اید؟</a>
								</div>
								<div class="auth-input-wrap">
									<input class="form-input !pl-20" id="login-password" name="pwd" type="password" autocomplete="current-password" required />
									<button class="auth-password-toggle" type="button" data-password-toggle="login-password">نمایش</button>
								</div>
							</div>
							<label class="flex items-center gap-2 text-sm text-brand-muted">
								<input type="checkbox" name="rememberme" value="forever" checked />
								مرا به خاطر بسپار
							</label>
							<button class="btn-primary w-full" type="submit">ورود</button>
						</form>
						<p class="mt-7 text-center text-sm text-brand-muted">حساب کاربری ندارید؟ <a class="font-semibold text-brand-green hover:text-brand-dark" href="<?php echo esc_url( wp_registration_url() ); ?>">ثبت‌نام کنید</a></p>
					</div>
				</div>
			</section>
		</section>
		<?php
		return (string) ob_get_clean();
	}
}
