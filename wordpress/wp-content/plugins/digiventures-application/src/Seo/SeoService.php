<?php
namespace DigiVentures\Application\Seo;

use DigiVentures\Application\Capabilities\Roles;

defined( 'ABSPATH' ) || exit;

/**
 * Handles search engine optimization, meta tags, Schema.org structured data,
 * robots directives, sitemap exclusion, and interoperability with WordPress SEO plugins.
 */
final class SeoService {

	/**
	 * Metadata for public pages (used as native fallback when no SEO plugin is active).
	 *
	 * @var array<string, array{title: string, description: string}>
	 */
	public const PUBLIC_PAGES = array(
		'home' => array(
			'title'       => 'دیجی‌ونچرز | صندوق سرمایه‌گذاری جسورانه شرکتی (CVC)',
			'description' => 'دیجی‌ونچرز — صندوق سرمایه‌گذاری جسورانه شرکتی (CVC) گروه دیجی‌کالا بر آینده تجارت الکترونیک، فین‌تک، لجستیک هوشمند و هوش مصنوعی.',
		),
		'about' => array(
			'title'       => 'درباره دیجی‌ونچرز | صندوق سرمایه‌گذاری شرکتی گروه دیجی‌کالا',
			'description' => 'درباره دیجی‌ونچرز — بازوی سرمایه‌گذاری خطرپذیر شرکتی (CVC) گروه دیجی‌کالا؛ هم‌افزایی استراتژیک، تجربه عملیاتی و زیرساخت‌های مقیاس‌پذیری.',
		),
		'portfolio' => array(
			'title'       => 'پورتفولیو دیجی‌ونچرز | استارتاپ‌ها و سرمایه‌گذاری‌ها',
			'description' => 'پورتفولیو سرمایه‌گذاری دیجی‌ونچرز — همراهی با کسب‌وکارهای پیشرو در حوزه‌های تجارت الکترونیک، فین‌تک، لجستیک هوشمند و هوش مصنوعی.',
		),
		'team' => array(
			'title'       => 'تیم دیجی‌ونچرز | متخصصان سرمایه‌گذاری و توسعه اکوسیستم',
			'description' => 'تیم دیجی‌ونچرز — ترکیبی از متخصصان سرمایه‌گذاری جسورانه، مدیران ارشد عملیاتی و کارشناسان فناوری در اکوسیستم نوآوری ایران.',
		),
		'news' => array(
			'title'       => 'تازه‌ها و دیدگاه‌ها | اخبار سرمایه‌گذاری دیجی‌ونچرز',
			'description' => 'تازه‌ها، گزارش‌ها، دیدگاه‌ها و آخرین رویدادهای سرمایه‌گذاری خطرپذیر دیجی‌ونچرز و استارتاپ‌های پورتفولیو گروه دیجی‌کالا.',
		),
		'contact' => array(
			'title'       => 'ارتباط با ما | تماس با تیم دیجی‌ونچرز',
			'description' => 'ارتباط با تیم سرمایه‌گذاری دیجی‌ونچرز — ارسال پیام، اطلاعات تماس، آدرس دفتر و شروع گفتگو برای همکاری و سرمایه‌گذاری.',
		),
		'investment-request' => array(
			'title'       => 'درخواست سرمایه‌گذاری | جذب سرمایه از دیجی‌ونچرز',
			'description' => 'ثبت آنلاین طرح و درخواست جذب سرمایه از دیجی‌ونچرز — معرفی استارتاپ، بنیان‌گذاران و بارگذاری فایل ارائه (Pitch Deck).',
		),
	);

	/**
	 * Slugs of private / auth / management pages that must NEVER be indexed.
	 *
	 * @var array<int, string>
	 */
	public const PRIVATE_PAGES = array(
		'login',
		'logout',
		'register',
		'forgot-password',
		'reset-password',
		'my-requests',
		'request-management',
		'user-management',
		'email-management',
		'unauthorized',
	);

	/**
	 * Register WordPress hooks.
	 */
	public function register(): void {
		add_action( 'wp_head', array( $this, 'render_head' ), 1 );
		add_filter( 'wp_robots', array( $this, 'filter_robots' ), 99 );
		add_filter( 'pre_get_document_title', array( $this, 'filter_title' ), 15 );
		add_filter( 'wp_sitemaps_posts_query_args', array( $this, 'filter_sitemaps' ), 10, 2 );
		add_filter( 'robots_txt', array( $this, 'filter_robots_txt' ), 10, 2 );
	}

	/**
	 * Check whether a third-party SEO plugin is active.
	 * When active, meta tags, canonicals, and OpenGraph are left to the plugin.
	 */
	public static function is_seo_plugin_active(): bool {
		return defined( 'WPSEO_VERSION' )
			|| defined( 'RANK_MATH_VERSION' )
			|| defined( 'AIOSEO_VERSION' )
			|| defined( 'SEOPRESS_VERSION' )
			|| class_exists( 'WPSEO_Frontend' )
			|| class_exists( 'RankMath' )
			|| class_exists( 'AIOSEO\\Plugin\\Common\\Main' )
			|| class_exists( 'The_SEO_Framework\\Bootstrap' );
	}

	/**
	 * Return the human-readable name of the active SEO handler.
	 */
	public static function get_active_seo_handler(): string {
		if ( defined( 'RANK_MATH_VERSION' ) || class_exists( 'RankMath' ) ) {
			return 'Rank Math SEO';
		}
		if ( defined( 'WPSEO_VERSION' ) || class_exists( 'WPSEO_Frontend' ) ) {
			return 'Yoast SEO';
		}
		if ( defined( 'AIOSEO_VERSION' ) || class_exists( 'AIOSEO\\Plugin\\Common\\Main' ) ) {
			return 'All in One SEO';
		}
		if ( defined( 'SEOPRESS_VERSION' ) ) {
			return 'SEOPress';
		}
		if ( class_exists( 'The_SEO_Framework\\Bootstrap' ) ) {
			return 'The SEO Framework';
		}
		return 'سیستم بومی دیجی‌ونچرز (Native Fallback)';
	}

	/**
	 * Check whether the current request is a private / authenticated application page.
	 */
	public function is_current_page_private(): bool {
		if ( ! is_singular() ) {
			return false;
		}

		$post_id = get_queried_object_id();
		$pages   = (array) get_option( 'dv_app_pages', array() );

		foreach ( self::PRIVATE_PAGES as $key ) {
			if ( ! empty( $pages[ $key ] ) && (int) $pages[ $key ] === $post_id ) {
				return true;
			}
		}

		$post = get_post( $post_id );
		if ( $post && $this->is_private_content( (string) $post->post_content ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Identify the managed page key for the current request.
	 */
	public function get_current_page_key(): ?string {
		if ( ! is_singular() ) {
			return null;
		}

		$post_id = get_queried_object_id();
		$pages   = (array) get_option( 'dv_app_pages', array() );

		foreach ( $pages as $key => $id ) {
			if ( (int) $id === $post_id ) {
				return (string) $key;
			}
		}

		return null;
	}

	/**
	 * Filter WordPress core robots directives (wp_robots hook, WordPress 5.7+).
	 *
	 * @param array<string, bool|string> $robots
	 * @return array<string, bool|string>
	 */
	public function filter_robots( array $robots ): array {
		if ( $this->is_current_page_private() ) {
			return array(
				'noindex'   => true,
				'nofollow'  => true,
				'noarchive' => true,
			);
		}

		$key = $this->get_current_page_key();
		if ( $key && isset( self::PUBLIC_PAGES[ $key ] ) ) {
			$robots['max-snippet']       = -1;
			$robots['max-image-preview'] = 'large';
			$robots['max-video-preview'] = -1;
		}

		return $robots;
	}

	/**
	 * Filter document title for managed pages when no SEO plugin overrides it.
	 */
	public function filter_title( string $title ): string {
		if ( self::is_seo_plugin_active() || is_admin() ) {
			return $title;
		}

		$key = $this->get_current_page_key();
		if ( $key && isset( self::PUBLIC_PAGES[ $key ] ) ) {
			return self::PUBLIC_PAGES[ $key ]['title'];
		}

		return $title;
	}

	/**
	 * Output SEO tags in wp_head:
	 * - If private: outputs strict noindex meta fallback.
	 * - If third-party SEO plugin is active: defers to plugin (preventing duplicates).
	 * - If no SEO plugin: outputs meta description, canonical, OpenGraph, Twitter cards, and JSON-LD schema.
	 */
	public function render_head(): void {
		if ( is_admin() ) {
			return;
		}

		if ( $this->is_current_page_private() ) {
			echo "\n<!-- DigiVentures Application: Private Page Protected from Search Indexing -->\n";
			echo "<meta name=\"robots\" content=\"noindex, nofollow, noarchive\">\n";
			return;
		}

		// If a full SEO plugin is active, yield meta tags to it so the SEO specialist has full control.
		if ( self::is_seo_plugin_active() ) {
			return;
		}

		$key = $this->get_current_page_key();
		if ( ! $key || ! isset( self::PUBLIC_PAGES[ $key ] ) ) {
			return;
		}

		$post_id     = get_queried_object_id();
		$post        = get_post( $post_id );
		$meta        = self::PUBLIC_PAGES[ $key ];
		$canonical   = get_permalink( $post_id ) ?: home_url( '/' );
		$description = ( $post && ! empty( trim( (string) $post->post_excerpt ) ) )
			? trim( (string) $post->post_excerpt )
			: $meta['description'];

		$image_url  = $this->get_social_image_url( $post_id );
		$site_name  = 'دیجی‌ونچرز | DigiVentures';
		$page_title = $meta['title'];

		echo "\n<!-- DigiVentures Native SEO Meta & Structured Data -->\n";
		echo '<meta name="description" content="' . esc_attr( $description ) . "\">\n";
		echo '<link rel="canonical" href="' . esc_url( $canonical ) . "\">\n";

		// Open Graph
		echo '<meta property="og:type" content="website">' . "\n";
		echo '<meta property="og:site_name" content="' . esc_attr( $site_name ) . "\">\n";
		echo '<meta property="og:title" content="' . esc_attr( $page_title ) . "\">\n";
		echo '<meta property="og:description" content="' . esc_attr( $description ) . "\">\n";
		echo '<meta property="og:url" content="' . esc_url( $canonical ) . "\">\n";
		echo '<meta property="og:locale" content="fa_IR">' . "\n";
		if ( $image_url ) {
			echo '<meta property="og:image" content="' . esc_url( $image_url ) . "\">\n";
			echo '<meta property="og:image:alt" content="' . esc_attr( $site_name ) . "\">\n";
		}

		// Twitter Cards
		echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
		echo '<meta name="twitter:title" content="' . esc_attr( $page_title ) . "\">\n";
		echo '<meta name="twitter:description" content="' . esc_attr( $description ) . "\">\n";
		if ( $image_url ) {
			echo '<meta name="twitter:image" content="' . esc_url( $image_url ) . "\">\n";
		}

		// Schema.org JSON-LD Structured Data
		$this->render_schema_json_ld( $post_id, $page_title, $description, $canonical, $image_url );
		echo "<!-- End DigiVentures SEO -->\n\n";
	}

	/**
	 * Exclude private application pages from WordPress native XML sitemaps (/wp-sitemap.xml).
	 *
	 * @param array<string, mixed> $args
	 * @param string               $post_type
	 * @return array<string, mixed>
	 */
	public function filter_sitemaps( array $args, string $post_type ): array {
		if ( 'page' !== $post_type ) {
			return $args;
		}

		$pages = (array) get_option( 'dv_app_pages', array() );
		$private_ids = array();

		foreach ( self::PRIVATE_PAGES as $key ) {
			if ( ! empty( $pages[ $key ] ) ) {
				$private_ids[] = (int) $pages[ $key ];
			}
		}

		if ( ! empty( $private_ids ) ) {
			$existing = (array) ( $args['post__not_in'] ?? array() );
			$args['post__not_in'] = array_values( array_unique( array_merge( $existing, $private_ids ) ) );
		}

		return $args;
	}

	/**
	 * Optimize robots.txt output with clean rules and sitemap reference.
	 */
	public function filter_robots_txt( string $output, bool $public ): string {
		if ( ! $public ) {
			return $output;
		}

		$rules = "\n# DigiVentures Protected Application Routes\n";
		foreach ( self::PRIVATE_PAGES as $slug ) {
			$rules .= "Disallow: /{$slug}/\n";
		}
		$rules .= "Disallow: /wp-json/digiventures/\n";
		$rules .= "\nSitemap: " . esc_url( home_url( '/wp-sitemap.xml' ) ) . "\n";

		return $output . $rules;
	}

	/**
	 * Get the best social sharing image URL for the page.
	 */
	private function get_social_image_url( int $post_id ): string {
		if ( has_post_thumbnail( $post_id ) ) {
			$thumb = get_the_post_thumbnail_url( $post_id, 'large' );
			if ( $thumb ) {
				return $thumb;
			}
		}

		return DV_APP_URL . 'assets/images/digiventures-mark.png';
	}

	/**
	 * Output Schema.org JSON-LD structured data graph for search engines.
	 */
	private function render_schema_json_ld( int $post_id, string $title, string $description, string $canonical, string $image_url ): void {
		$home_url = home_url( '/' );
		$logo_url = DV_APP_URL . 'assets/images/digiventures-mark.png';

		$graph = array(
			array(
				'@type'              => 'Organization',
				'@id'                => esc_url( $home_url . '#organization' ),
				'name'               => 'دیجی‌ونچرز',
				'alternateName'      => 'DigiVentures',
				'url'                => esc_url( $home_url ),
				'logo'               => array(
					'@type'   => 'ImageObject',
					'@id'     => esc_url( $home_url . '#logo' ),
					'url'     => esc_url( $logo_url ),
					'caption' => 'دیجی‌ونچرز',
				),
				'parentOrganization' => array(
					'@type'         => 'Organization',
					'name'          => 'گروه دیجی‌کالا',
					'alternateName' => 'Digikala Group',
				),
			),
			array(
				'@type'              => 'FinancialService',
				'@id'                => esc_url( $home_url . '#investment-fund' ),
				'name'               => 'صندوق سرمایه‌گذاری جسورانه دیجی‌ونچرز',
				'alternateName'      => 'DigiVentures Corporate Venture Capital',
				'url'                => esc_url( $home_url ),
				'parentOrganization' => array(
					'@id' => esc_url( $home_url . '#organization' ),
				),
				'description'        => 'صندوق سرمایه‌گذاری جسورانه شرکتی (CVC) گروه دیجی‌کالا بر آینده تجارت الکترونیک، فین‌تک، لجستیک و هوش مصنوعی',
			),
			array(
				'@type'       => 'WebSite',
				'@id'         => esc_url( $home_url . '#website' ),
				'url'         => esc_url( $home_url ),
				'name'        => 'دیجی‌ونچرز',
				'publisher'   => array(
					'@id' => esc_url( $home_url . '#organization' ),
				),
				'inLanguage'  => 'fa-IR',
			),
			array(
				'@type'       => 'WebPage',
				'@id'         => esc_url( $canonical . '#webpage' ),
				'url'         => esc_url( $canonical ),
				'name'        => esc_html( $title ),
				'isPartOf'    => array(
					'@id' => esc_url( $home_url . '#website' ),
				),
				'description' => esc_html( $description ),
				'inLanguage'  => 'fa-IR',
			),
		);

		$json = wp_json_encode(
			array(
				'@context' => 'https://schema.org',
				'@graph'   => $graph,
			),
			JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT
		);

		if ( $json ) {
			echo '<script type="application/ld+json">' . "\n" . $json . "\n</script>\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	}

	/**
	 * Detect whether content contains a private application shortcode.
	 */
	private function is_private_content( string $content ): bool {
		return 1 === preg_match( '/\[dv_(?:login|logout|register|forgot_password|reset_password|customer_dashboard|request_management|request_user_management|email_management|unauthorized)\b[^\]]*\]/i', $content );
	}
}
