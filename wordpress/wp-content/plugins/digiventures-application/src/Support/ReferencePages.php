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
		add_shortcode( 'dv_header', array( self::class, 'get_site_header' ) );
		add_shortcode( 'dv_footer', array( self::class, 'get_site_footer' ) );
	}

	public static function get_site_header(): string {
		$file = DV_APP_DIR . 'templates/reference/about.html';
		if ( ! is_readable( $file ) ) {
			return '';
		}
		$html = (string) file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		if ( preg_match( '/(<header\b[^>]*>.*?<\/header>)/si', $html, $matches ) ) {
			return ( new self() )->replace_urls( $matches[1] );
		}
		return '';
	}

	public static function get_site_footer(): string {
		$file = DV_APP_DIR . 'templates/reference/about.html';
		if ( ! is_readable( $file ) ) {
			return '';
		}
		$html = (string) file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		if ( preg_match( '/(<footer\b[^>]*>.*?<\/footer>)/si', $html, $matches ) ) {
			return ( new self() )->replace_urls( $matches[1] );
		}
		return '';
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
		if ( 'news' === $page ) {
			$html = $this->inject_news_content( $html );
		}

		$html = $this->replace_urls( $html );
		return '<div class="dv-reference-page dv-reference-' . esc_attr( $page ) . '">' . $html . '</div>';
	}

	private function inject_news_content( string $html ): string {
		if ( current_user_can( 'edit_posts' ) ) {
			$admin_btn = '<a href="' . esc_url( admin_url( 'post-new.php' ) ) . '" class="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-3.5 py-1.5 text-xs font-bold text-slate-950 transition-all hover:bg-brand-green/90 shadow-sm" target="_blank" rel="noopener">'
				. '<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>'
				. '<span>افزودن خبر جدید</span>'
				. '</a>';
			$html = str_replace( '<!--dv-admin-new-post-slot-->', $admin_btn, $html );
		} else {
			$html = str_replace( '<!--dv-admin-new-post-slot-->', '', $html );
		}

		$published_posts = get_posts(
			array(
				'post_type'      => 'post',
				'post_status'    => 'publish',
				'posts_per_page' => 30,
				'orderby'        => 'date',
				'order'          => 'DESC',
			)
		);

		if ( empty( $published_posts ) ) {
			return $html;
		}

		$cards_html     = '';
		$templates_html = '';

		foreach ( $published_posts as $post ) {
			$post_id = (int) $post->ID;
			$title   = get_the_title( $post );
			$date    = $this->to_persian_num( get_the_date( 'j F Y', $post ) );

			$excerpt = has_excerpt( $post ) ? get_the_excerpt( $post ) : wp_trim_words( wp_strip_all_tags( $post->post_content ), 26, '...' );

			$categories = get_the_category( $post_id );
			$cat_slug   = ! empty( $categories ) ? sanitize_key( $categories[0]->slug ) : 'perspectives';
			$cat_name   = ! empty( $categories ) ? $categories[0]->name : 'دیدگاه و تحلیل';

			$words     = count( preg_split( '/\s+/u', trim( wp_strip_all_tags( $post->post_content ) ) ) ?: array() );
			$read_time = $this->to_persian_num( max( 1, (int) ceil( $words / 200 ) ) );

			if ( has_post_thumbnail( $post_id ) ) {
				$img_url = (string) get_the_post_thumbnail_url( $post_id, 'large' );
			} else {
				$img_url = DV_APP_URL . 'assets/images/m12/dv-news-logistics.jpg';
			}

			$author_name = get_the_author_meta( 'display_name', $post->post_author );
			if ( empty( $author_name ) ) {
				$author_name = 'تیم تحریریه دیجی‌ونچرز';
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

			$author_role = get_the_author_meta( 'description', $post->post_author );
			if ( empty( $author_role ) ) {
				$author_role = 'تحریریه دیجی‌ونچرز';
			}

			$permalink = get_permalink( $post_id );

			$cards_html .= '<article class="news-article-card reveal rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover flex flex-col justify-between" data-category="' . esc_attr( $cat_slug ) . '">'
				. '<div>'
				. '<div class="group relative aspect-[16/10] overflow-hidden cursor-pointer" data-open-modal="post-' . esc_attr( (string) $post_id ) . '">'
				. '<img src="' . esc_url( $img_url ) . '" alt="' . esc_attr( $title ) . '" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">'
				. '<div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>'
				. '<span class="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-slate-900">' . esc_html( $cat_name ) . '</span>'
				. '</div>'
				. '<div class="p-6">'
				. '<div class="flex items-center gap-2 text-xs text-slate-600 mb-3">'
				. '<span>' . esc_html( $date ) . '</span>'
				. '<span>·</span>'
				. '<span>زمان مطالعه: ' . esc_html( $read_time ) . ' دقیقه</span>'
				. '</div>'
				. '<h3 class="text-lg font-bold text-slate-950 mb-3 leading-snug hover:text-brand-green transition-colors cursor-pointer" data-open-modal="post-' . esc_attr( (string) $post_id ) . '">' . esc_html( $title ) . '</h3>'
				. '<p class="text-xs text-slate-700 font-normal leading-relaxed line-clamp-2 mb-4">' . esc_html( $excerpt ) . '</p>'
				. '</div>'
				. '</div>'
				. '<div class="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">'
				. '<div class="flex items-center gap-2.5">'
				. '<div class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-brand-green font-bold text-xs">' . esc_html( $initials ) . '</div>'
				. '<span class="text-xs font-bold text-slate-900">' . esc_html( $author_name ) . '</span>'
				. '</div>'
				. '<div class="flex items-center gap-2.5">'
				. '<a href="' . esc_url( $permalink ) . '" class="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-brand-green transition-colors" title="مشاهده در صفحه اختصاصی">'
				. '<span>صفحه اختصاصی</span>'
				. '<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M7 7h10v10"/></svg>'
				. '</a>'
				. '<button type="button" data-open-modal="post-' . esc_attr( (string) $post_id ) . '" class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-brand-green transition-colors">'
				. '<span>مطالعه</span>'
				. '<svg class="h-3.5 w-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>'
				. '</button>'
				. '</div>'
				. '</div>'
				. '</article>';

			$content_html    = apply_filters( 'the_content', $post->post_content );
			$templates_html .= '<template id="template-post-' . esc_attr( (string) $post_id ) . '">'
				. '<div class="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl">'
				. '<img src="' . esc_url( $img_url ) . '" alt="' . esc_attr( $title ) . '" class="h-full w-full object-cover">'
				. '<div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>'
				. '<span class="absolute bottom-4 right-4 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-slate-900">' . esc_html( $cat_name ) . '</span>'
				. '</div>'
				. '<div class="flex items-center gap-3 text-xs text-slate-500 mb-4">'
				. '<span>' . esc_html( $date ) . '</span>'
				. '<span>·</span>'
				. '<span>زمان مطالعه: ' . esc_html( $read_time ) . ' دقیقه</span>'
				. '<span>·</span>'
				. '<span class="text-brand-green font-semibold">' . esc_html( $cat_name ) . '</span>'
				. '<span class="mr-auto"><a href="' . esc_url( $permalink ) . '" class="text-slate-600 hover:text-brand-green underline text-xs">مشاهده در صفحه مستقل ↗</a></span>'
				. '</div>'
				. '<h1 class="text-2xl sm:text-3xl font-black text-slate-950 leading-tight mb-6">' . esc_html( $title ) . '</h1>'
				. '<div class="dv-article-content prose max-w-none text-slate-700 leading-relaxed font-light space-y-4">' . $content_html . '</div>'
				. '<div class="mt-8 rounded-2xl bg-slate-50 p-5 border border-slate-200/80 flex items-center gap-4">'
				. '<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-brand-green font-bold text-sm">' . esc_html( $initials ) . '</div>'
				. '<div><p class="text-sm font-bold text-slate-900">' . esc_html( $author_name ) . '</p><p class="text-xs text-slate-500">' . esc_html( $author_role ) . '</p></div>'
				. '</div>'
				. '</template>';
		}

		$target_grid  = '<div id="news-grid-container" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">';
		$html         = str_replace( $target_grid, $target_grid . $cards_html, $html );
		$target_modal = '<dialog id="article-reader-modal"';
		$html         = str_replace( $target_modal, $templates_html . $target_modal, $html );

		return $html;
	}

	private function to_persian_num( string|int $input ): string {
		$en = array( '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' );
		$fa = array( '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹' );
		return str_replace( $en, $fa, (string) $input );
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
