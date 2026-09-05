<?php
namespace DigiVentures\Application\Support;

use DigiVentures\Application\Capabilities\Roles;
use DigiVentures\Application\Forms\RequestService;

defined( 'ABSPATH' ) || exit;

final class Renderer {
	public function __construct( private RequestService $requests ) {}

	public function register_shortcodes(): void {
		foreach ( array( 'dv_login' => 'login', 'dv_logout' => 'logout', 'dv_register' => 'register', 'dv_forgot_password' => 'forgot_password', 'dv_reset_password' => 'reset_password', 'dv_request_form' => 'request_form', 'dv_contact_form' => 'contact_form', 'dv_customer_dashboard' => 'customer_dashboard', 'dv_request_management' => 'request_management', 'dv_request_user_management' => 'user_management', 'dv_email_management' => 'email_management', 'dv_unauthorized' => 'unauthorized', 'dv_marketing' => 'marketing' ) as $shortcode => $method ) {
			add_shortcode( $shortcode, array( $this, $method ) );
		}
	}

	public function login(): string {
		if ( is_user_logged_in() ) {
			return $this->redirect_notice( Roles::dashboard_url(), __( 'شما وارد حساب خود شده‌اید.', 'digiventures-application' ) );
		}
		$form = '<form class="dv-form dv-source-form mt-8 space-y-5" data-dv-endpoint="auth/login">'
			. '<div><label class="form-label" for="login-email">ایمیل یا نام کاربری</label><input class="form-input" id="login-email" name="login" type="text" inputmode="email" autocomplete="username" placeholder="name@example.com" required></div>'
			. '<div><div class="mb-2 flex items-center justify-between"><label class="form-label !mb-0" for="login-password">گذرواژه</label><a class="text-xs font-medium text-brand-green hover:text-brand-dark" href="' . esc_url( Roles::page_url( 'forgot-password', '/forgot-password/' ) ) . '">گذرواژه را فراموش کرده‌اید؟</a></div><div class="auth-input-wrap"><input class="form-input pl-20" id="login-password" name="password" type="password" autocomplete="current-password" minlength="8" required><button class="auth-password-toggle" type="button" data-password-toggle="login-password" aria-label="نمایش گذرواژه">نمایش</button></div></div>'
			. '<input name="redirect" type="hidden" value="' . esc_attr( wp_unslash( $_GET['redirect_to'] ?? '' ) ) . '"><p class="dv-feedback auth-feedback" aria-live="polite"></p><button class="btn-primary w-full" type="submit">ورود</button></form>'
			. '<p class="mt-7 text-center text-sm text-brand-muted">حساب کاربری ندارید؟ <a class="font-semibold text-brand-green hover:text-brand-dark" href="' . esc_url( Roles::page_url( 'register', '/register/' ) ) . '">ثبت‌نام کنید</a></p>'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return $this->auth_shell( 'login', __( 'خوش آمدید', 'digiventures-application' ), __( 'ورود به حساب کاربری', 'digiventures-application' ), __( 'ایمیل و گذرواژه خود را وارد کنید.', 'digiventures-application' ), $form );
	}

	public function register(): string {
		if ( is_user_logged_in() ) {
			return $this->redirect_notice( Roles::dashboard_url(), __( 'شما وارد حساب خود شده‌اید.', 'digiventures-application' ) );
		}
		$form = '<form class="dv-form dv-source-form mt-7 space-y-5" data-dv-endpoint="auth/register">'
			. '<div><label class="form-label" for="signup-email">ایمیل</label><input class="form-input" id="signup-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="name@example.com" required></div>'
			. '<div><label class="form-label" for="signup-password">گذرواژه</label><div class="auth-input-wrap"><input class="form-input pl-20" id="signup-password" name="password" type="password" autocomplete="new-password" minlength="8" aria-describedby="password-help" required><button class="auth-password-toggle" type="button" data-password-toggle="signup-password" aria-label="نمایش گذرواژه">نمایش</button></div><p id="password-help" class="mt-2 text-xs text-brand-muted">حداقل ۸ کاراکتر انتخاب کنید.</p></div>'
			. '<div><label class="form-label" for="signup-password-confirmation">تکرار گذرواژه</label><div class="auth-input-wrap"><input class="form-input pl-20" id="signup-password-confirmation" name="password_confirmation" type="password" autocomplete="new-password" minlength="8" required><button class="auth-password-toggle" type="button" data-password-toggle="signup-password-confirmation" aria-label="نمایش گذرواژه">نمایش</button></div></div>'
			. '<p class="dv-feedback auth-feedback" aria-live="polite"></p><button class="btn-primary w-full" type="submit">ایجاد حساب</button></form>'
			. '<p class="mt-6 text-center text-sm text-brand-muted">حساب دارید؟ <a class="font-semibold text-brand-green hover:text-brand-dark" href="' . esc_url( Roles::page_url( 'login', '/login/' ) ) . '">وارد شوید</a></p>';
		return $this->auth_shell( 'register', __( 'ایجاد حساب', 'digiventures-application' ), __( 'ثبت‌نام', 'digiventures-application' ), __( 'با ایمیل کاری خود حساب کاربری بسازید.', 'digiventures-application' ), $form );
	}

	public function logout(): string {
		if ( ! is_user_logged_in() ) {
			return $this->redirect_notice( Roles::page_url( 'login', '/login/' ), __( 'شما وارد حسابی نشده‌اید.', 'digiventures-application' ) );
		}
		return '<section class="dv-panel dv-center dv-auth-fallback"><span class="dv-auth-fallback-icon" aria-hidden="true">↗</span><p class="dv-kicker">حساب کاربری</p><h1>خروج از حساب</h1><p>برای ادامه، خروج از حساب را تأیید کنید.</p><button class="dv-button" type="button" data-dv-auth-open="logout" aria-haspopup="dialog">خروج از حساب</button></section>';
	}

	public function forgot_password(): string {
		$form = '<form class="dv-form dv-source-form mt-8 space-y-5" data-dv-endpoint="auth/lost-password"><div><label class="form-label" for="recovery-email">ایمیل</label><input class="form-input" id="recovery-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="name@example.com" required></div><p class="dv-feedback auth-feedback" aria-live="polite"></p><button class="btn-primary w-full" type="submit">ارسال گذرواژه موقت</button></form>'
			. '<p class="mt-7 text-center text-sm text-brand-muted">گذرواژه را به یاد آوردید؟ <a class="font-semibold text-brand-green hover:text-brand-dark" href="' . esc_url( Roles::page_url( 'login', '/login/' ) ) . '">وارد شوید</a></p>';
		return $this->auth_shell( 'forgot', __( 'فراموشی گذرواژه', 'digiventures-application' ), __( 'بازیابی گذرواژه', 'digiventures-application' ), __( 'ایمیل حساب خود را وارد کنید. گذرواژه موقت به همان ایمیل ارسال می‌شود.', 'digiventures-application' ), $form );
	}

	public function reset_password(): string {
		return '<section class="dv-panel"><h1>بازیابی گذرواژه</h1><p>از لینک بازیابی ارسالی به ایمیل خود استفاده کنید.</p><a class="dv-button" href="' . esc_url( wp_lostpassword_url() ) . '">بازیابی گذرواژه</a></section>';
	}

	public function request_form( array $atts = array() ): string {
		if ( ! $this->can( 'create_request' ) ) {
			return $this->login_required( ! empty( $atts['embedded'] ) );
		}
		$id = absint( $atts['id'] ?? $_GET['request_id'] ?? 0 ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$row = array();
		if ( $id ) {
			$row = $this->requests->get( $id, wp_get_current_user() );
			if ( is_wp_error( $row ) || (int) $row['user_id'] !== get_current_user_id() || ! in_array( $row['status'], array( 'draft', 'needs_revision' ), true ) ) {
				return $this->unauthorized();
			}
		}
		$value = static fn( string $key ) => esc_attr( $row[ $key ] ?? '' );
		$textarea = esc_textarea( $row['description'] ?? '' );
		$required = $id ? '' : ' required';
		$endpoint = $id ? 'requests/' . $id : 'requests';
		$form = '<form id="investment-request-form" class="dv-form dv-source-form mt-8 space-y-6" data-dv-endpoint="' . esc_attr( $endpoint ) . '" enctype="multipart/form-data">'
			. '<div class="grid gap-6 sm:grid-cols-2"><div><label for="startup_name" class="form-label">نام استارتاپ <span class="text-brand-green">*</span></label><input type="text" id="startup_name" name="startup_name" value="' . $value( 'startup_name' ) . '" class="form-input" placeholder="نام استارتاپ خود را وارد کنید" required minlength="2" autocomplete="organization"></div><div><label for="founder_name" class="form-label">نام و نام خانوادگی <span class="text-brand-green">*</span></label><input type="text" id="founder_name" name="founder_name" value="' . $value( 'founder_name' ) . '" class="form-input" placeholder="نام بنیان‌گذار" required minlength="2" autocomplete="name"></div></div>'
			. '<div class="grid gap-6 sm:grid-cols-2"><div><label for="email" class="form-label">ایمیل <span class="text-brand-green">*</span></label><input type="email" id="email" name="email" value="' . $value( 'email' ) . '" class="form-input" placeholder="example@email.com" dir="ltr" required autocomplete="email"></div><div><label for="phone" class="form-label">شماره تماس <span class="text-brand-green">*</span></label><input type="tel" id="phone" name="phone" value="' . $value( 'phone' ) . '" class="form-input" placeholder="۰۹۱۲۳۴۵۶۷۸۹" dir="ltr" required autocomplete="tel" pattern="[0-9۰-۹]{10,15}"></div></div>'
			. '<div class="grid gap-6 sm:grid-cols-2"><div><label for="sector" class="form-label">حوزه فعالیت <span class="text-brand-green">*</span></label><select id="sector" name="sector" class="form-select" required>' . $this->options( array( 'ecommerce' => 'تجارت الکترونیک', 'fintech' => 'فین‌تک', 'platform' => 'کسب‌وکارهای پلتفرمی', 'supply_chain' => 'زنجیره تأمین', 'ai' => 'هوش مصنوعی', 'other' => 'سایر حوزه‌های مرتبط' ), $row['sector'] ?? '' ) . '</select></div><div><label for="stage" class="form-label">مرحله کسب و کار <span class="text-brand-green">*</span></label><select id="stage" name="stage" class="form-select" required>' . $this->options( array( 'seed' => 'Seed', 'early' => 'مرحله اولیه', 'growth' => 'رشد', 'scale' => 'مقیاس‌پذیری' ), $row['stage'] ?? '' ) . '</select></div></div>'
			. '<div><label for="description" class="form-label">توضیح کوتاه <span class="text-brand-green">*</span></label><textarea id="description" name="description" rows="5" class="form-textarea" placeholder="مدل کسب‌وکار، بازار هدف و مزیت رقابتی استارتاپ خود را به‌اختصار شرح دهید..." required minlength="30">' . $textarea . '</textarea></div>'
			. '<div class="dv-upload-field"><label for="pitch_deck" class="form-label">آپلود Pitch Deck' . ( $id ? '' : ' <span class="text-brand-green">*</span>' ) . '</label>'
			. '<div class="dv-upload' . ( $id && ! empty( $row['attachment_id'] ) ? ' has-existing-file' : '' ) . '" data-dv-upload data-existing-file="' . ( $id && ! empty( $row['attachment_id'] ) ? '1' : '0' ) . '">'
			. '<input type="file" id="pitch_deck" name="pitch_deck" class="sr-only" accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"' . $required . '>'
			. '<label for="pitch_deck" class="dv-upload-dropzone" tabindex="0"><span class="dv-upload-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
			. '<span class="dv-upload-copy"><strong data-upload-prompt>' . ( $id && ! empty( $row['attachment_id'] ) ? 'فایل ارائه فعلی ثبت شده است' : 'فایل ارائه را انتخاب کنید' ) . '</strong><span data-upload-hint>' . ( $id && ! empty( $row['attachment_id'] ) ? 'برای جایگزینی فایل، کلیک کنید یا فایل جدید را اینجا رها کنید.' : 'فایل را اینجا رها کنید یا برای انتخاب کلیک کنید.' ) . '</span></span>'
			. '<span class="dv-upload-action">انتخاب فایل</span></label>'
			. '<div class="dv-upload-status" data-upload-status hidden aria-live="polite">'
			. '<span class="dv-upload-status-icon" data-upload-status-icon aria-hidden="true"></span><span class="dv-upload-details"><strong data-upload-title></strong><span data-upload-meta></span></span><button type="button" class="dv-upload-remove" data-upload-remove aria-label="حذف فایل انتخاب‌شده">حذف</button>'
			. '</div><div class="dv-upload-progress" data-upload-progress hidden><span data-upload-progress-bar></span></div>'
			. '<p class="dv-upload-help">فرمت‌های مجاز: PDF، PPT و PPTX — حداکثر حجم: ۲۰ مگابایت</p></div></div>'
			. '<input type="hidden" name="idempotency_key" value="' . esc_attr( wp_generate_uuid4() ) . '"><div class="dv-feedback" role="status" aria-live="polite" hidden></div><button type="submit" class="btn-primary w-full">' . ( $id ? 'ارسال مجدد برای بررسی' : 'ارسال درخواست سرمایه‌گذاری' ) . '</button></form>';
		if ( ! empty( $atts['embedded'] ) ) {
			return $form;
		}
		return '<section class="dv-panel dv-request"><p class="dv-kicker">درخواست سرمایه‌گذاری</p><h1>' . ( $id ? 'ویرایش درخواست' : 'کسب‌وکارتان را به ما معرفی کنید' ) . '</h1><p>اطلاعات شما تنها برای بررسی فرصت سرمایه‌گذاری استفاده می‌شود.</p>' . $form . '</section>';
	}

	public function contact_form(): string {
		return '<form class="dv-form dv-source-form dv-contact-form mt-6 space-y-5" data-dv-endpoint="contact">'
			. '<div><label for="contact_name" class="form-label">نام و نام خانوادگی</label><input type="text" id="contact_name" name="contact_name" class="form-input" placeholder="نام خود را وارد کنید" autocomplete="name" required></div>'
			. '<div><label for="contact_email" class="form-label">ایمیل</label><input type="email" id="contact_email" name="contact_email" class="form-input" placeholder="example@email.com" dir="ltr" autocomplete="email" required></div>'
			. '<div><label for="contact_subject" class="form-label">موضوع</label><input type="text" id="contact_subject" name="contact_subject" class="form-input" placeholder="موضوع پیام" required></div>'
			. '<div><label for="contact_message" class="form-label">پیام</label><textarea id="contact_message" name="contact_message" rows="5" class="form-textarea" placeholder="پیام خود را بنویسید..." minlength="10" required></textarea></div>'
			. '<label class="dv-honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><p class="dv-feedback" aria-live="polite"></p><button type="submit" class="btn-primary w-full">ارسال پیام</button></form>';
	}

	public function auth_modals(): void {
		if ( is_admin() || ! \DigiVentures\Application\Bootstrap::instance()->should_enqueue_assets() ) {
			return;
		}

		echo '<div class="dv-toast-region" data-dv-toast-region aria-live="polite" aria-atomic="true"></div>';
		if ( is_user_logged_in() ) {
			$user = wp_get_current_user();
			?>
			<div class="dv-modal" data-dv-auth-modal="logout" role="dialog" aria-modal="true" aria-labelledby="dv-logout-title" aria-hidden="true" hidden>
				<button class="dv-modal-backdrop" type="button" data-dv-modal-close tabindex="-1" aria-label="<?php esc_attr_e( 'بستن پنجره', 'digiventures-application' ); ?>"></button>
				<section class="dv-modal-card dv-logout-modal-card" tabindex="-1">
					<button class="dv-modal-close" type="button" data-dv-modal-close aria-label="<?php esc_attr_e( 'بستن', 'digiventures-application' ); ?>">×</button>
					<span class="dv-modal-icon dv-modal-icon-logout" aria-hidden="true">↗</span>
					<p class="dv-modal-eyebrow"><?php esc_html_e( 'حساب کاربری', 'digiventures-application' ); ?></p>
					<h2 id="dv-logout-title"><?php esc_html_e( 'از حساب خارج می‌شوید؟', 'digiventures-application' ); ?></h2>
					<p><?php echo esc_html( sprintf( __( '%s، پس از خروج برای مشاهده و مدیریت درخواست‌ها باید دوباره وارد شوید.', 'digiventures-application' ), $user->display_name ?: $user->user_email ) ); ?></p>
					<form class="dv-modal-actions" method="post" data-dv-logout-form>
						<input type="hidden" name="dv_action" value="logout">
						<?php wp_nonce_field( 'dv_frontend_logout', '_dv_logout_nonce' ); ?>
						<button class="dv-modal-secondary" type="button" data-dv-modal-close><?php esc_html_e( 'ماندن در حساب', 'digiventures-application' ); ?></button>
						<button class="dv-modal-danger" type="submit"><?php esc_html_e( 'بله، خارج می‌شوم', 'digiventures-application' ); ?></button>
					</form>
				</section>
			</div>
			<?php
			return;
		}
		?>
		<div class="dv-modal" data-dv-auth-modal="login" role="dialog" aria-modal="true" aria-labelledby="dv-modal-login-title" aria-hidden="true" hidden>
			<button class="dv-modal-backdrop" type="button" data-dv-modal-close tabindex="-1" aria-label="<?php esc_attr_e( 'بستن پنجره', 'digiventures-application' ); ?>"></button>
			<section class="dv-modal-card dv-login-modal-card" tabindex="-1">
				<button class="dv-modal-close" type="button" data-dv-modal-close aria-label="<?php esc_attr_e( 'بستن', 'digiventures-application' ); ?>">×</button>
				<div class="dv-modal-brand" aria-hidden="true"><span class="brand-logo-mark"></span><span class="brand-logo-wordmark"></span></div>
				<p class="dv-modal-eyebrow"><?php esc_html_e( 'حساب دیجی‌ونچرز', 'digiventures-application' ); ?></p>
				<h2 id="dv-modal-login-title"><?php esc_html_e( 'خوش آمدید', 'digiventures-application' ); ?></h2>
				<p><?php esc_html_e( 'برای پیگیری درخواست‌های سرمایه‌گذاری وارد حساب خود شوید.', 'digiventures-application' ); ?></p>
				<form class="dv-form dv-source-form dv-modal-login-form" data-dv-endpoint="auth/login">
					<div><label class="form-label" for="dv-modal-login-email"><?php esc_html_e( 'ایمیل یا نام کاربری', 'digiventures-application' ); ?></label><input class="form-input" id="dv-modal-login-email" name="login" type="text" inputmode="email" autocomplete="username" placeholder="name@example.com" required></div>
					<div><div class="dv-modal-field-heading"><label class="form-label" for="dv-modal-login-password"><?php esc_html_e( 'گذرواژه', 'digiventures-application' ); ?></label><a href="<?php echo esc_url( Roles::page_url( 'forgot-password', '/forgot-password/' ) ); ?>"><?php esc_html_e( 'فراموشی گذرواژه', 'digiventures-application' ); ?></a></div><div class="auth-input-wrap"><input class="form-input pl-20" id="dv-modal-login-password" name="password" type="password" autocomplete="current-password" minlength="8" required><button class="auth-password-toggle" type="button" data-password-toggle="dv-modal-login-password" aria-label="<?php esc_attr_e( 'نمایش گذرواژه', 'digiventures-application' ); ?>"><?php esc_html_e( 'نمایش', 'digiventures-application' ); ?></button></div></div>
					<input name="redirect" type="hidden" value="<?php echo esc_attr( get_permalink( get_queried_object_id() ) ?: home_url( '/' ) ); ?>">
					<div class="dv-feedback auth-feedback" aria-live="polite" hidden></div>
					<button class="btn-primary" type="submit"><?php esc_html_e( 'ورود به حساب', 'digiventures-application' ); ?></button>
				</form>
				<p class="dv-modal-register"><?php esc_html_e( 'هنوز حساب ندارید؟', 'digiventures-application' ); ?> <a href="<?php echo esc_url( Roles::page_url( 'register', '/register/' ) ); ?>"><?php esc_html_e( 'ایجاد حساب', 'digiventures-application' ); ?></a></p>
			</section>
		</div>
		<?php
	}

	public function customer_dashboard(): string {
		if ( ! $this->can( 'view_own_requests' ) ) {
			return $this->login_required();
		}
		$rows = $this->requests->for_user( wp_get_current_user() );
		$total = count( $rows );
		$reviewing = $this->count_statuses( $rows, array( 'submitted', 'under_review' ) );
		$needs_revision = $this->count_statuses( $rows, array( 'needs_revision' ) );
		$accepted = $this->count_statuses( $rows, array( 'accepted' ) );
		$html = '<div class="dv-dashboard-stats">'
			. $this->dashboard_stat( 'همه درخواست‌ها', $total, 'از ابتدای همکاری', 'neutral' )
			. $this->dashboard_stat( 'در حال بررسی', $reviewing, 'در صف ارزیابی تیم سرمایه‌گذاری', 'blue' )
			. $this->dashboard_stat( 'نیازمند اقدام', $needs_revision, 'درخواست‌هایی که باید اصلاح شوند', 'amber' )
			. $this->dashboard_stat( 'پذیرفته‌شده', $accepted, 'فرصت‌های تأییدشده', 'green' )
			. '</div>';
		$html .= '<section class="dv-dashboard-card"><header class="dv-card-header"><div><span class="dv-card-eyebrow">پیگیری سرمایه‌گذاری</span><h2>درخواست‌های من</h2><p>آخرین وضعیت درخواست‌ها و اقدام موردنیاز را اینجا ببینید.</p></div><a class="dv-dashboard-primary" href="' . esc_url( Roles::page_url( 'investment-request', '/investment-request/' ) ) . '"><span class="dv-btn-icon" aria-hidden="true">' . $this->nav_icon( 'plus' ) . '</span> درخواست جدید</a></header>';
		if ( ! $rows ) {
			$html .= $this->dashboard_empty( 'هنوز درخواستی ثبت نکرده‌اید', 'اطلاعات استارتاپ و فایل ارائه خود را آماده کنید و اولین درخواست سرمایه‌گذاری را بسازید.', 'ثبت اولین درخواست', Roles::page_url( 'investment-request', '/investment-request/' ) );
			return $this->dashboard_shell( 'my-requests', 'نمای کلی حساب', 'درخواست‌های سرمایه‌گذاری خود را یک‌جا مدیریت کنید.', $html . '</section>' );
		}
		$html .= '<div class="dv-table-wrap"><table class="dv-dashboard-table"><thead><tr><th>استارتاپ</th><th>مرحله</th><th>وضعیت</th><th>آخرین تغییر</th><th>عملیات</th></tr></thead><tbody>';
		foreach ( $rows as $row ) {
			$editable = in_array( $row['status'], array( 'draft', 'needs_revision' ), true );
			$edit = $editable ? '<a class="dv-table-action" href="' . esc_url( add_query_arg( 'request_id', (int) $row['id'], Roles::page_url( 'investment-request', '/investment-request/' ) ) ) . '">ویرایش درخواست</a>' : '<span class="dv-table-muted">اقدامی لازم نیست</span>';
			$status_note = ! empty( $row['admin_message'] ) && 'needs_revision' === $row['status'] ? '<small class="dv-status-note">' . esc_html( $row['admin_message'] ) . '</small>' : '';
			$html .= '<tr><td data-label="استارتاپ"><strong class="dv-table-primary">' . esc_html( $row['startup_name'] ) . '</strong><small>#' . (int) $row['id'] . '</small></td><td data-label="مرحله">' . esc_html( $this->stage_label( $row['stage'] ) ) . '</td><td data-label="وضعیت"><span class="dv-status dv-status-' . esc_attr( $row['status'] ) . '">' . esc_html( $this->status_label( $row['status'] ) ) . '</span>' . $status_note . '</td><td data-label="آخرین تغییر"><time datetime="' . esc_attr( $row['updated_at'] ) . '">' . esc_html( $this->format_date( $row['updated_at'] ) ) . '</time></td><td data-label="عملیات">' . $edit . '</td></tr>';
		}
		$html .= '</tbody></table></div></section>';
		return $this->dashboard_shell( 'my-requests', 'نمای کلی حساب', 'درخواست‌های سرمایه‌گذاری خود را یک‌جا مدیریت کنید.', $html );
	}

	public function request_management(): string {
		if ( ! $this->can( 'review_requests' ) ) {
			return $this->unauthorized();
		}
		$rows = $this->requests->all();
		$total = count( $rows );
		$queue = $this->count_statuses( $rows, array( 'submitted', 'under_review' ) );
		$revision = $this->count_statuses( $rows, array( 'needs_revision' ) );
		$decided = $this->count_statuses( $rows, array( 'accepted', 'rejected' ) );
		$html = '<div class="dv-dashboard-stats">'
			. $this->dashboard_stat( 'کل درخواست‌ها', $total, 'آخرین ۲۰۰ درخواست', 'neutral' )
			. $this->dashboard_stat( 'صف بررسی', $queue, 'ثبت‌شده یا در حال بررسی', 'blue' )
			. $this->dashboard_stat( 'نیاز به اصلاح', $revision, 'منتظر اقدام بنیان‌گذار', 'amber' )
			. $this->dashboard_stat( 'تصمیم‌گیری‌شده', $decided, 'پذیرفته یا رد شده', 'green' )
			. '</div>';
		$html .= '<section class="dv-dashboard-card"><header class="dv-card-header"><div><span class="dv-card-eyebrow">فضای مدیریت</span><h2>بررسی درخواست‌ها</h2><p>درخواست‌ها را جست‌وجو، ارزیابی و نتیجه را برای بنیان‌گذار ثبت کنید.</p></div></header>';
		$html .= '<div class="dv-dashboard-toolbar"><label class="dv-search-field"><span class="sr-only">جست‌وجوی درخواست</span><span class="dv-search-icon" aria-hidden="true">' . $this->nav_icon( 'search' ) . '</span><input type="search" placeholder="جست‌وجوی استارتاپ، بنیان‌گذار یا ایمیل…" data-dv-table-search="requests"></label><label class="dv-filter-field"><span>وضعیت</span><select data-dv-table-status="requests"><option value="">همه وضعیت‌ها</option><option value="submitted">ثبت شده</option><option value="under_review">در حال بررسی</option><option value="needs_revision">نیاز به اصلاح</option><option value="accepted">پذیرفته شده</option><option value="rejected">رد شده</option></select></label></div>';
		if ( ! $rows ) {
			$html .= $this->dashboard_empty( 'درخواستی برای بررسی وجود ندارد', 'درخواست‌های جدید پس از ثبت کاربران در این بخش نمایش داده می‌شوند.' );
			return $this->dashboard_shell( 'request-management', 'مدیریت درخواست‌ها', 'فرصت‌های سرمایه‌گذاری را با تمرکز و سرعت ارزیابی کنید.', $html . '</section>' );
		}
		$html .= '<div class="dv-table-wrap"><table class="dv-dashboard-table dv-management-table" data-dv-filter-table="requests"><thead><tr><th>استارتاپ</th><th>بنیان‌گذار</th><th>وضعیت</th><th>یادداشت داخلی</th><th>به‌روزرسانی</th><th>بررسی</th></tr></thead><tbody>';
		foreach ( $rows as $row ) {
			$search = strtolower( $row['startup_name'] . ' ' . $row['founder_name'] . ' ' . $row['email'] );
			$note = ! empty( $row['internal_note'] ) ? '<div class="dv-internal-note"><strong>یادداشت تیم</strong><span>' . esc_html( $row['internal_note'] ) . '</span></div>' : '<span class="dv-note-empty">یادداشتی ثبت نشده</span>';
			$review_form = '<details class="dv-review-details"><summary><span class="dv-summary-icon" aria-hidden="true">' . $this->nav_icon( 'edit' ) . '</span> بررسی و به‌روزرسانی</summary><form class="dv-review-form dv-form" data-dv-endpoint="requests/' . (int) $row['id'] . '/status" role="dialog" aria-modal="true" aria-labelledby="dv-review-title-' . (int) $row['id'] . '">'
				. '<div class="dv-review-modal-head"><div><strong id="dv-review-title-' . (int) $row['id'] . '">بررسی درخواست ' . esc_html( $row['startup_name'] ) . '</strong><span>' . esc_html( $row['founder_name'] ) . ' · #' . (int) $row['id'] . '</span></div><button type="button" data-dv-review-close aria-label="بستن پنجره بررسی">×</button></div>'
				. '<div class="dv-review-grid"><label><span>وضعیت جدید</span><select name="status" class="form-select" required>' . $this->options( array( 'under_review' => 'در حال بررسی', 'needs_revision' => 'نیاز به اصلاح', 'accepted' => 'پذیرفته شده', 'rejected' => 'رد شده' ), $row['status'] ) . '</select></label><label><span>پیام برای بنیان‌گذار</span><textarea name="admin_message" rows="3" class="form-textarea" placeholder="این پیام در ایمیل و پنل بنیان‌گذار نمایش داده می‌شود.">' . esc_textarea( $row['admin_message'] ?? '' ) . '</textarea></label><label><span>یادداشت داخلی تیم</span><textarea name="internal_note" rows="3" class="form-textarea" placeholder="فقط مدیران و مدیر ارشد می‌بینند؛ برای ویرایش همین متن را به‌روزرسانی کنید.">' . esc_textarea( $row['internal_note'] ?? '' ) . '</textarea></label></div>'
				. '<div class="dv-review-actions"><div class="dv-feedback" aria-live="polite" hidden></div><button type="submit" class="dv-dashboard-primary">ثبت نتیجه بررسی</button></div></form></details>';
			$html .= '<tr data-dv-filter-row data-search="' . esc_attr( $search ) . '" data-status="' . esc_attr( $row['status'] ) . '"><td data-label="استارتاپ"><strong class="dv-table-primary">' . esc_html( $row['startup_name'] ) . '</strong><small>' . esc_html( $this->stage_label( $row['stage'] ) ) . ' · #' . (int) $row['id'] . '</small></td><td data-label="بنیان‌گذار"><strong>' . esc_html( $row['founder_name'] ) . '</strong><small dir="ltr">' . esc_html( $row['email'] ) . '</small></td><td data-label="وضعیت"><span class="dv-status dv-status-' . esc_attr( $row['status'] ) . '">' . esc_html( $this->status_label( $row['status'] ) ) . '</span></td><td data-label="یادداشت داخلی">' . $note . '</td><td data-label="به‌روزرسانی"><time datetime="' . esc_attr( $row['updated_at'] ) . '">' . esc_html( $this->format_date( $row['updated_at'] ) ) . '</time></td><td data-label="بررسی">' . $review_form . '</td></tr>';
		}
		$html .= '</tbody></table><p class="dv-filter-empty" data-dv-filter-empty hidden>موردی مطابق جست‌وجوی شما پیدا نشد.</p></div></section>';
		return $this->dashboard_shell( 'request-management', 'مدیریت درخواست‌ها', 'فرصت‌های سرمایه‌گذاری را با تمرکز و سرعت ارزیابی کنید.', $html );
	}

	public function user_management(): string {
		if ( ! $this->can( 'manage_application_users' ) ) {
			return $this->unauthorized();
		}
		$users = get_users( array( 'role__in' => array( Roles::CUSTOMER, Roles::ADMIN ), 'orderby' => 'registered', 'order' => 'DESC', 'number' => 200 ) );
		$admin_count = 0;
		foreach ( $users as $account ) {
			if ( in_array( Roles::ADMIN, (array) $account->roles, true ) ) {
				++$admin_count;
			}
		}
		$html = '<div class="dv-dashboard-stats dv-user-stats">'
			. $this->dashboard_stat( 'کل کاربران', count( $users ), 'مشتریان و مدیران برنامه', 'neutral' )
			. $this->dashboard_stat( 'مشتریان', count( $users ) - $admin_count, 'حساب‌های متقاضی سرمایه‌گذاری', 'blue' )
			. $this->dashboard_stat( 'مدیران بررسی', $admin_count, 'دارای دسترسی بررسی درخواست‌ها', 'green' )
			. '</div>';
		$html .= '<section class="dv-dashboard-card"><header class="dv-card-header"><div><span class="dv-card-eyebrow">کنترل دسترسی</span><h2>مدیریت کاربران</h2><p>کاربران را بین نقش مشتری و مدیر بررسی جابه‌جا کنید. حساب‌های مدیر ارشد محافظت‌شده‌اند.</p></div></header>';
		$html .= '<div class="dv-dashboard-toolbar"><label class="dv-search-field"><span class="sr-only">جست‌وجوی کاربر</span><span class="dv-search-icon" aria-hidden="true">' . $this->nav_icon( 'search' ) . '</span><input type="search" placeholder="جست‌وجوی نام یا ایمیل…" data-dv-table-search="users"></label></div>';
		if ( ! $users ) {
			$html .= $this->dashboard_empty( 'هنوز کاربری وجود ندارد', 'کاربران جدید پس از ثبت‌نام در این بخش نمایش داده می‌شوند.' );
			return $this->dashboard_shell( 'user-management', 'مدیریت کاربران', 'سطح دسترسی اعضای برنامه را شفاف کنترل کنید.', $html . '</section>' );
		}
		$html .= '<div class="dv-table-wrap"><table class="dv-dashboard-table dv-users-table" data-dv-filter-table="users"><thead><tr><th>کاربر</th><th>تاریخ عضویت</th><th>نقش فعلی</th><th>تغییر دسترسی</th></tr></thead><tbody>';
		foreach ( $users as $user ) {
			$role = in_array( Roles::ADMIN, $user->roles, true ) ? Roles::ADMIN : Roles::CUSTOMER;
			$name = $user->display_name ?: $user->user_email;
			$initial = strtoupper( substr( $user->user_email, 0, 1 ) );
			$search = strtolower( $name . ' ' . $user->user_email );
			$html .= '<tr data-dv-filter-row data-search="' . esc_attr( $search ) . '"><td data-label="کاربر"><div class="dv-user-cell"><span class="dv-user-avatar" aria-hidden="true">' . esc_html( $initial ) . '</span><span><strong class="dv-table-primary">' . esc_html( $name ) . '</strong><small dir="ltr">' . esc_html( $user->user_email ) . '</small></span></div></td><td data-label="تاریخ عضویت">' . esc_html( $this->format_date( $user->user_registered ) ) . '</td><td data-label="نقش فعلی"><span class="dv-role-badge dv-role-' . esc_attr( $role ) . '">' . esc_html( $this->role_label( $role ) ) . '</span></td><td data-label="تغییر دسترسی"><form class="dv-role-form dv-form" data-dv-endpoint="users/' . (int) $user->ID . '/role"><label class="sr-only" for="dv-role-' . (int) $user->ID . '">نقش کاربر</label><select id="dv-role-' . (int) $user->ID . '" name="role" class="form-select" required>' . $this->options( array( Roles::CUSTOMER => 'مشتری', Roles::ADMIN => 'مدیر بررسی' ), $role, false ) . '</select><button type="submit" class="dv-dashboard-primary">ذخیره نقش</button><div class="dv-feedback" aria-live="polite" hidden></div></form></td></tr>';
		}
		$html .= '</tbody></table><p class="dv-filter-empty" data-dv-filter-empty hidden>کاربری مطابق جست‌وجوی شما پیدا نشد.</p></div></section>';
		return $this->dashboard_shell( 'user-management', 'مدیریت کاربران', 'سطح دسترسی اعضای برنامه را شفاف کنترل کنید.', $html );
	}

	public function email_management(): string {
		if ( ! $this->can( 'manage_application_protected' ) ) {
			return $this->unauthorized();
		}
		$templates = $this->requests->email_templates();
		$html = '<section class="dv-dashboard-card dv-email-management"><header class="dv-card-header"><div><span class="dv-card-eyebrow">ارتباطات خودکار</span><h2>مدیریت متن ایمیل‌ها</h2><p>ایمیل دریافت درخواست فوراً ارسال می‌شود؛ هر تغییر وضعیت نیز یک ایمیل به بنیان‌گذار می‌فرستد.</p></div></header>'
			. '<form class="dv-form dv-email-template-form" data-dv-endpoint="email-templates"><div class="dv-email-template-grid">'
			. '<fieldset><legend>ایمیل دریافت درخواست</legend><label><span>موضوع</span><input name="received_subject" value="' . esc_attr( $templates['received_subject'] ) . '" class="form-input" required></label><label><span>متن ایمیل</span><textarea name="received_body" rows="8" class="form-textarea" required>' . esc_textarea( $templates['received_body'] ) . '</textarea></label></fieldset>'
			. '<fieldset><legend>ایمیل به‌روزرسانی وضعیت</legend><label><span>موضوع</span><input name="status_subject" value="' . esc_attr( $templates['status_subject'] ) . '" class="form-input" required></label><label><span>متن ایمیل</span><textarea name="status_body" rows="8" class="form-textarea" required>' . esc_textarea( $templates['status_body'] ) . '</textarea></label></fieldset>'
			. '</div><p class="dv-template-help">متغیرهای قابل استفاده: <code>{founder_name}</code>، <code>{startup_name}</code>، <code>{status}</code> و <code>{message}</code>. پیام مدیر در جایگاه <code>{message}</code>، درست پیش از بخش تشکر، قرار می‌گیرد.</p><div class="dv-email-template-actions"><div class="dv-feedback" aria-live="polite" hidden></div><button type="submit" class="dv-dashboard-primary">ذخیره متن ایمیل‌ها</button></div></form></section>';
		return $this->dashboard_shell( 'email-management', 'مدیریت ایمیل‌ها', 'پیام‌های ارسالی به بنیان‌گذاران را یک‌جا و با کنترل کامل تنظیم کنید.', $html );
	}

	public function unauthorized(): string {
		return '<section class="dv-panel dv-center"><h1>دسترسی مجاز نیست</h1><p>شما اجازه مشاهده این صفحه را ندارید.</p><a class="dv-button" href="' . esc_url( Roles::dashboard_url() ) . '">بازگشت به حساب</a></section>';
	}

	public function marketing( array $atts ): string {
		$page = sanitize_key( $atts['page'] ?? 'home' );
		$copy = array( 'home' => array( 'سرمایه‌گذاری روی آینده کسب‌وکارها', 'ما سرمایه، تجربه و اکوسیستمی را در اختیار تیم‌های آینده‌ساز می‌گذاریم.' ), 'portfolio' => array( 'پورتفولیو', 'با کسب‌وکارهایی همراهیم که آینده اقتصاد دیجیتال را می‌سازند.' ), 'team' => array( 'تیم دیجی‌ونچرز', 'تجربه سرمایه‌گذاری و ساختن کسب‌وکارهای دیجیتال.' ), 'about' => array( 'درباره دیجی‌ونچرز', 'سرمایه‌گذاری شرکتی در اکوسیستم دیجیتال.' ), 'contact' => array( 'ارتباط با ما', 'برای شروع گفت‌وگو با تیم ما در تماس باشید.' ), 'news' => array( 'تازه‌ها', 'اخبار و دیدگاه‌های دیجی‌ونچرز.' ) );
		$content = $copy[ $page ] ?? $copy['home'];
		return '<section class="dv-marketing"><p class="dv-kicker">DigiVentures</p><h1>' . esc_html( $content[0] ) . '</h1><p>' . esc_html( $content[1] ) . '</p><a class="dv-button" href="' . esc_url( Roles::page_url( 'investment-request', '/investment-request/' ) ) . '">ثبت درخواست سرمایه‌گذاری</a></section>';
	}

	private function auth_shell( string $screen, string $eyebrow, string $title, string $description, string $form ): string {
		$aside = array(
			'login' => array( 'حساب کاربری', 'همراه آینده‌سازان باشید.', 'حساب کاربری شما راهی برای پیگیری درخواست‌های سرمایه‌گذاری و ارتباط با تیم دیجی‌ونچرز است.' ),
			'register' => array( 'همراهی از ابتدا', 'برای ساختن آینده آماده‌اید؟', 'با ایجاد حساب، مسیر ارتباط با تیم سرمایه‌گذاری دیجی‌ونچرز را شروع کنید.' ),
			'forgot' => array( 'بازیابی گذرواژه', 'دوباره به حسابتان برگردید.', 'گذرواژه موقت فقط به ایمیل ثبت‌شده شما فرستاده می‌شود.' ),
		)[ $screen ] ?? array( 'حساب کاربری', 'همراه آینده‌سازان باشید.', '' );
		$back_url = 'forgot' === $screen ? Roles::page_url( 'login', '/login/' ) : home_url( '/' );
		$back_text = 'forgot' === $screen ? 'بازگشت به ورود' : 'بازگشت به سایت';
		$content_padding = 'register' === $screen ? 'py-8' : 'py-10';
		$title_id = 'forgot' === $screen ? 'forgot-title' : ( 'register' === $screen ? 'signup-title' : 'login-title' );
		return '<main class="auth-shell flex items-center justify-center"><section class="auth-panel" aria-labelledby="' . esc_attr( $title_id ) . '"><aside class="auth-aside">'
			. '<a href="' . esc_url( home_url( '/' ) ) . '" class="brand-logo relative z-10 self-start" aria-label="صفحه اصلی دیجی‌ونچرز"><span class="brand-logo-mark" aria-hidden="true"></span><span class="brand-logo-wordmark" aria-hidden="true"></span></a>'
			. '<div class="relative z-10"><span class="section-label">' . esc_html( $aside[0] ) . '</span><h1 class="mt-3 text-4xl font-bold leading-tight">' . esc_html( $aside[1] ) . '</h1><p class="mt-5 max-w-sm leading-relaxed text-white/65">' . esc_html( $aside[2] ) . '</p></div><p class="relative z-10 text-sm text-white/45">سرمایه‌گذاری بر آینده کسب‌وکارها.</p></aside>'
			. '<div class="auth-content"><div class="flex items-center justify-between"><a href="' . esc_url( $back_url ) . '" class="text-sm text-brand-muted transition-colors hover:text-brand-green">' . esc_html( $back_text ) . '</a><a href="' . esc_url( home_url( '/' ) ) . '" class="brand-logo lg:hidden" aria-label="صفحه اصلی دیجی‌ونچرز"><span class="brand-logo-mark" aria-hidden="true"></span><span class="brand-logo-wordmark !text-brand-dark" aria-hidden="true"></span></a></div>'
			. '<div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center ' . esc_attr( $content_padding ) . '"><span class="section-label">' . esc_html( $eyebrow ) . '</span><h1 id="' . esc_attr( $title_id ) . '" class="text-3xl font-bold text-brand-darkText">' . esc_html( $title ) . '</h1><p class="mt-3 leading-relaxed text-brand-muted">' . esc_html( $description ) . '</p>' . $form . '</div></div></section></main>';
	}

	private function login_required( bool $embedded = false ): string {
		if ( $embedded ) {
			return '<div class="mt-8 alert-warning" role="alert"><p class="font-medium">برای ثبت درخواست سرمایه‌گذاری باید وارد حساب کاربری خود شوید.</p><p class="mt-1">ابتدا وارد شوید یا یک حساب کاربری ایجاد کنید، سپس فرم درخواست را تکمیل نمایید.</p><div class="mt-4 flex flex-wrap gap-3"><a class="btn-primary" href="' . esc_url( Roles::page_url( 'login', '/login/' ) ) . '">ورود</a><a class="btn-secondary" href="' . esc_url( Roles::page_url( 'register', '/register/' ) ) . '">ثبت‌نام</a></div></div>';
		}
		return '<section class="dv-panel dv-center"><h1>ورود لازم است</h1><p>برای ادامه ابتدا وارد حساب کاربری خود شوید.</p><a class="dv-button" href="' . esc_url( Roles::page_url( 'login', '/login/' ) ) . '">ورود</a></section>';
	}

	private function redirect_notice( string $url, string $text ): string {
		return '<section class="dv-panel dv-center"><p>' . esc_html( $text ) . '</p><a class="dv-button" href="' . esc_url( $url ) . '">ادامه</a></section>';
	}

	private function dashboard_shell( string $active, string $title, string $description, string $content ): string {
		$user = wp_get_current_user();
		$name = $user->display_name ?: $user->user_email;
		$initial = strtoupper( substr( $user->user_email, 0, 1 ) );
		$role = $this->current_role_label( $user );
		$nav = array();
		if ( user_can( $user, 'view_own_requests' ) ) {
			$nav[] = array( 'key' => 'my-requests', 'label' => 'درخواست‌های من', 'icon' => $this->nav_icon( 'grid' ), 'url' => Roles::page_url( 'my-requests', '/my-requests/' ) );
		}
		if ( user_can( $user, 'create_request' ) ) {
			$nav[] = array( 'key' => 'investment-request', 'label' => 'درخواست جدید', 'icon' => $this->nav_icon( 'plus' ), 'url' => Roles::page_url( 'investment-request', '/investment-request/' ) );
		}
		if ( user_can( $user, 'review_requests' ) ) {
			$nav[] = array( 'key' => 'request-management', 'label' => 'بررسی درخواست‌ها', 'icon' => $this->nav_icon( 'review' ), 'url' => Roles::page_url( 'request-management', '/request-management/' ) );
		}
		if ( user_can( $user, 'manage_application_users' ) ) {
			$nav[] = array( 'key' => 'user-management', 'label' => 'مدیریت کاربران', 'icon' => $this->nav_icon( 'users' ), 'url' => Roles::page_url( 'user-management', '/user-management/' ) );
		}
		if ( user_can( $user, 'manage_application_protected' ) ) {
			$nav[] = array( 'key' => 'email-management', 'label' => 'مدیریت ایمیل‌ها', 'icon' => $this->nav_icon( 'mail' ), 'url' => Roles::page_url( 'email-management', '/email-management/' ) );
		}

		$nav_html = '';
		foreach ( $nav as $item ) {
			$nav_html .= '<a class="dv-dashboard-nav-link' . ( $active === $item['key'] ? ' is-active' : '' ) . '" href="' . esc_url( $item['url'] ) . '"' . ( $active === $item['key'] ? ' aria-current="page"' : '' ) . '><span class="dv-nav-icon" aria-hidden="true">' . $item['icon'] . '</span><span class="dv-nav-text">' . esc_html( $item['label'] ) . '</span></a>';
		}
		if ( user_can( $user, 'manage_options' ) ) {
			$nav_html .= '<a class="dv-dashboard-nav-link" href="' . esc_url( admin_url() ) . '"><span class="dv-nav-icon" aria-hidden="true">' . $this->nav_icon( 'wordpress' ) . '</span><span class="dv-nav-text">مدیریت وردپرس</span></a>';
		}

		$profile_url = user_can( $user, 'view_own_requests' ) ? Roles::page_url( 'my-requests', '/my-requests/' ) : Roles::dashboard_url( $user );
		return '<div class="dv-dashboard-shell"><header class="dv-dashboard-topbar"><div class="dv-dashboard-topbar-inner"><a class="brand-logo dv-dashboard-brand" href="' . esc_url( home_url( '/' ) ) . '" aria-label="دیجی‌ونچرز"><span class="brand-logo-mark" aria-hidden="true"></span><span class="brand-logo-wordmark" aria-hidden="true"></span></a><div class="dv-account-menu"><button class="dv-account-menu-trigger" type="button" data-dv-account-menu aria-expanded="false"><span class="dv-user-avatar" aria-hidden="true">' . esc_html( $initial ) . '</span><span class="dv-user-email-label" dir="ltr">' . esc_html( $user->user_email ) . '</span><span class="dv-account-arrow" aria-hidden="true">' . $this->nav_icon( 'chevron' ) . '</span></button><div class="dv-account-menu-popover" data-dv-account-popover hidden><a href="' . esc_url( $profile_url ) . '">پروفایل و حساب</a><a href="' . esc_url( Roles::page_url( 'logout', '/logout/' ) ) . '" data-dv-auth-open="logout" aria-haspopup="dialog">خروج از حساب</a></div></div></div></header>'
			. '<div class="dv-dashboard-layout"><aside class="dv-dashboard-sidebar"><div class="dv-dashboard-sidebar-profile"><span class="dv-user-avatar" aria-hidden="true">' . esc_html( $initial ) . '</span><span><strong>' . esc_html( $name ) . '</strong><small>' . esc_html( $user->user_email ) . '</small><em>' . esc_html( $role ) . '</em></span></div><nav aria-label="ناوبری حساب">' . $nav_html . '</nav><div class="dv-dashboard-sidebar-bottom"><a class="dv-dashboard-site-link" href="' . esc_url( home_url( '/' ) ) . '"><span aria-hidden="true">' . $this->nav_icon( 'external' ) . '</span> بازگشت به سایت</a></div></aside>'
			. '<main class="dv-dashboard-main"><div class="dv-dashboard-container"><section class="dv-dashboard-hero"><div><span class="dv-hero-badge">پنل دیجی‌ونچرز</span><h1>' . esc_html( $title ) . '</h1><p>' . esc_html( $description ) . '</p></div><span class="dv-dashboard-role">' . esc_html( $role ) . '</span></section>' . $content . '</div></main></div></div>';
	}

	private function dashboard_stat( string $label, int $value, string $note, string $tone ): string {
		return '<article class="dv-stat-card dv-stat-' . esc_attr( $tone ) . '"><div class="dv-stat-head"><span class="dv-stat-dot" aria-hidden="true"></span><p class="dv-stat-label">' . esc_html( $label ) . '</p></div><div class="dv-stat-body"><strong class="dv-stat-number">' . esc_html( (string) $value ) . '</strong><small class="dv-stat-sub">' . esc_html( $note ) . '</small></div></article>';
	}

	private function dashboard_empty( string $title, string $description, string $action = '', string $url = '' ): string {
		$button = $action && $url ? '<a class="dv-dashboard-primary" href="' . esc_url( $url ) . '">' . esc_html( $action ) . '</a>' : '';
		return '<div class="dv-dashboard-empty"><span class="dv-empty-icon" aria-hidden="true">' . $this->nav_icon( 'sparkle' ) . '</span><h3>' . esc_html( $title ) . '</h3><p>' . esc_html( $description ) . '</p>' . $button . '</div>';
	}

	private function count_statuses( array $rows, array $statuses ): int {
		$count = 0;
		foreach ( $rows as $row ) {
			if ( in_array( $row['status'] ?? '', $statuses, true ) ) {
				++$count;
			}
		}
		return $count;
	}

	private function format_date( string $date ): string {
		$timestamp = strtotime( $date . ' UTC' );
		return $timestamp ? wp_date( 'Y/m/d · H:i', $timestamp ) : $date;
	}

	private function stage_label( string $stage ): string {
		return array( 'seed' => 'Seed', 'early' => 'مرحله اولیه', 'growth' => 'رشد', 'scale' => 'مقیاس‌پذیری' )[ $stage ] ?? $stage;
	}

	private function role_label( string $role ): string {
		return array( Roles::CUSTOMER => 'مشتری', Roles::ADMIN => 'مدیر بررسی', Roles::SUPER_ADMIN => 'مدیر ارشد برنامه' )[ $role ] ?? $role;
	}

	private function current_role_label( \WP_User $user ): string {
		if ( user_can( $user, 'manage_options' ) ) {
			return 'مدیر وردپرس';
		}
		foreach ( array( Roles::SUPER_ADMIN, Roles::ADMIN, Roles::CUSTOMER ) as $role ) {
			if ( in_array( $role, (array) $user->roles, true ) ) {
				return $this->role_label( $role );
			}
		}
		return 'کاربر';
	}

	private function can( string $capability ): bool {
		return is_user_logged_in() && current_user_can( $capability );
	}

	private function options( array $items, string $selected, bool $placeholder = true ): string {
		$html = $placeholder ? '<option value="">انتخاب کنید</option>' : '';
		foreach ( $items as $value => $label ) {
			$html .= '<option value="' . esc_attr( $value ) . '"' . selected( $selected, $value, false ) . '>' . esc_html( $label ) . '</option>';
		}
		return $html;
	}

	private function status_label( string $status ): string {
		return array( 'draft' => 'پیش‌نویس', 'submitted' => 'ثبت شده', 'under_review' => 'در حال بررسی', 'needs_revision' => 'نیاز به اصلاح', 'accepted' => 'پذیرفته شده', 'rejected' => 'رد شده' )[ $status ] ?? $status;
	}

	private function nav_icon( string $name ): string {
		return match ( $name ) {
			'grid' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>',
			'plus' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
			'review' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h6m-6 4h4m5-11.5a2.5 2.5 0 0 1 2.5 2.5v13a2.5 2.5 0 0 1-2.5 2.5h-12A2.5 2.5 0 0 1 3.5 20V7a2.5 2.5 0 0 1 2.5-2.5h2.2a2.5 2.5 0 0 1 4.6 0H15Z"/><circle cx="12" cy="4.5" r="1.5"/></svg>',
			'users' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
			'mail' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
			'wordpress' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-8.48 10a8.5 8.5 0 0 1 1.7-5.07l3.6 9.87Zm10.05 7.77a8.47 8.47 0 0 1-3.57.8A8.34 8.34 0 0 1 6.55 19l2.76-8 2.05 5.92a.66.66 0 0 0 .62.45h.06a.66.66 0 0 0 .63-.44l1.9-5.54.95 2.65ZM12 11.23l-1.93-5.6a8.45 8.45 0 0 1 5.37 1.07l.2.33Zm6.56.77a8.3 8.3 0 0 1-.36 2.45l-2.85-8A8.47 8.47 0 0 1 18.56 12Z"/></svg>',
			'external' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>',
			'search' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
			'chevron' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
			'edit' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
			'sparkle' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>',
			default => '',
		};
	}
}
