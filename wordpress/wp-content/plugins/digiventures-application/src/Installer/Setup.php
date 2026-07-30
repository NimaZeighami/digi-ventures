<?php
namespace DigiVentures\Application\Installer;

use DigiVentures\Application\Capabilities\Roles;
use DigiVentures\Application\Database\Migrations;
use DigiVentures\Application\Logging\Logger;

defined( 'ABSPATH' ) || exit;

final class Setup {
	public function register_admin(): void {
		add_action( 'admin_menu', array( $this, 'menu' ) );
		add_action( 'admin_post_dv_run_setup', array( $this, 'handle' ) );
	}

	public function menu(): void {
		add_menu_page( 'DigiVentures', 'DigiVentures', 'manage_options', 'digiventures-setup', array( $this, 'screen' ), 'dashicons-chart-line', 58 );
	}

	public function handle(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'دسترسی مجاز نیست.', 'digiventures-application' ) );
		}
		check_admin_referer( 'dv_run_setup' );
		try {
			$this->run();
			update_option( 'dv_app_last_setup_error', '', false );
			$state = 'success';
		} catch ( \Throwable $exception ) {
			Logger::write( 'critical', 'Setup failed.', array( 'type' => get_class( $exception ) ) );
			update_option( 'dv_app_last_setup_error', $exception->getMessage(), false );
			$state = 'error';
		}
		wp_safe_redirect( add_query_arg( 'dv_setup', $state, admin_url( 'admin.php?page=digiventures-setup' ) ) );
		exit;
	}

	public function run(): void {
		if ( version_compare( PHP_VERSION, '8.1', '<' ) || version_compare( get_bloginfo( 'version' ), '6.4', '<' ) ) {
			throw new \RuntimeException( 'PHP 8.1+ and WordPress 6.4+ are required.' );
		}
		Roles::register();
		Migrations::run();
		$pages = (array) get_option( 'dv_app_pages', array() );
		foreach ( $this->pages() as $key => $page ) {
			$existing = ! empty( $pages[ $key ] ) ? get_post( (int) $pages[ $key ] ) : null;
			$existing = $existing ?: get_page_by_path( $page['slug'], OBJECT, 'page' );
			if ( ! $existing ) {
				$id = wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => $page['title'], 'post_name' => $page['slug'], 'post_content' => $page['content'] ), true );
				$managed = true;
			} else {
				$id = (int) $existing->ID;
				$managed = '1' === get_post_meta( $id, '_dv_managed_page', true ) || $this->is_generated_content( (string) $existing->post_content );
				if ( ! $managed ) {
					throw new \RuntimeException( sprintf( 'The /%s/ slug is already used by a page not managed by DigiVentures. Rename that page, then retry setup.', $page['slug'] ) );
				}
				if ( $managed ) {
					$id = wp_update_post(
						array(
							'ID' => $id,
							'post_status' => 'publish',
							'post_name' => $page['slug'],
							'post_content' => $this->is_generated_content( (string) $existing->post_content ) ? $page['content'] : $existing->post_content,
						),
						true
					);
				}
			}
			if ( is_wp_error( $id ) ) {
				throw new \RuntimeException( $id->get_error_message() );
			}
			$pages[ $key ] = (int) $id;
			if ( $managed ) {
				update_post_meta( (int) $id, '_dv_managed_page', '1' );
				update_post_meta( (int) $id, '_wp_page_template', 'dv-canvas.php' );
			}
		}
		update_option( 'dv_app_pages', $pages, false );
		if ( ! empty( $pages['home'] ) ) {
			update_option( 'show_on_front', 'page' );
			update_option( 'page_on_front', (int) $pages['home'] );
		}
		if ( '' === (string) get_option( 'permalink_structure', '' ) ) {
			global $wp_rewrite;
			$wp_rewrite->set_permalink_structure( '/%postname%/' );
		}
		update_option( 'dv_app_setup_steps', array( 'roles' => true, 'migrations' => true, 'pages' => true, 'front_page' => true, 'permalinks' => true, 'elementor' => did_action( 'elementor/loaded' ) > 0, 'theme' => wp_get_theme()->get_stylesheet(), 'completed_at' => gmdate( 'c' ) ), false );
		flush_rewrite_rules( false );
	}

	public function screen(): void {
		$steps = (array) get_option( 'dv_app_setup_steps', array() );
		$error = (string) get_option( 'dv_app_last_setup_error', '' );
		?>
		<div class="wrap"><h1>DigiVentures Setup &amp; Diagnostics</h1>
		<?php if ( 'success' === ( $_GET['dv_setup'] ?? '' ) ) : ?> <div class="notice notice-success"><p>Setup completed. It is safe to run again.</p></div><?php endif; ?>
		<?php if ( $error ) : ?><div class="notice notice-error"><p><?php echo esc_html( $error ); ?> Safe to retry after correcting the cause.</p></div><?php endif; ?>
		<p>This creates or repairs plugin-managed pages, assigns the DigiVentures Canvas template, sets the static front page, and refreshes permalinks. Existing custom page content is preserved.</p>
		<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post"><?php wp_nonce_field( 'dv_run_setup' ); ?><input type="hidden" name="action" value="dv_run_setup"><button class="button button-primary">Run or retry setup</button></form>
		<h2>Diagnostics</h2><table class="widefat striped"><tbody>
		<tr><td>Plugin version</td><td><?php echo esc_html( DV_APP_VERSION ); ?></td></tr><tr><td>Schema version</td><td><?php echo esc_html( (string) get_option( 'dv_app_schema_version', 'not installed' ) ); ?></td></tr><tr><td>WordPress / PHP</td><td><?php echo esc_html( get_bloginfo( 'version' ) . ' / ' . PHP_VERSION ); ?></td></tr><tr><td>Theme</td><td><?php echo esc_html( wp_get_theme()->get( 'Name' ) . ' (' . wp_get_theme()->get_stylesheet() . ')' ); ?></td></tr><tr><td>Elementor</td><td><?php echo did_action( 'elementor/loaded' ) ? 'Active' : 'Not active' ; ?></td></tr><tr><td>Permalinks</td><td><code><?php echo esc_html( (string) get_option( 'permalink_structure', 'plain' ) ); ?></code></td></tr><tr><td>Front page</td><td><?php echo esc_html( (string) get_option( 'page_on_front', 'not set' ) ); ?></td></tr><tr><td>REST</td><td><?php echo rest_url() ? 'Available' : 'Unavailable'; ?></td></tr><tr><td>Setup steps</td><td><code><?php echo esc_html( wp_json_encode( $steps ) ); ?></code></td></tr></tbody></table>
		<h2>Generated page URLs</h2><ul><?php foreach ( (array) get_option( 'dv_app_pages', array() ) as $key => $id ) : ?><li><strong><?php echo esc_html( $key ); ?>:</strong> <a href="<?php echo esc_url( get_permalink( (int) $id ) ); ?>" target="_blank" rel="noopener"><?php echo esc_html( get_permalink( (int) $id ) ); ?></a></li><?php endforeach; ?></ul></div>
		<?php
	}

	private function pages(): array {
		return array(
			'home' => array( 'title' => 'دیجی‌ونچرز', 'slug' => 'home', 'content' => '[dv_reference_page page="home"]' ),
			'portfolio' => array( 'title' => 'پورتفولیو', 'slug' => 'portfolio', 'content' => '[dv_reference_page page="portfolio"]' ),
			'team' => array( 'title' => 'تیم', 'slug' => 'team', 'content' => '[dv_reference_page page="team"]' ),
			'about' => array( 'title' => 'درباره ما', 'slug' => 'about', 'content' => '[dv_reference_page page="about"]' ),
			'contact' => array( 'title' => 'ارتباط با ما', 'slug' => 'contact', 'content' => '[dv_reference_page page="contact"]' ),
			'news' => array( 'title' => 'تازه‌ها', 'slug' => 'news', 'content' => '[dv_reference_page page="news"]' ),
			'login' => array( 'title' => 'ورود', 'slug' => 'login', 'content' => '[dv_login]' ),
			'logout' => array( 'title' => 'خروج', 'slug' => 'logout', 'content' => '[dv_logout]' ),
			'register' => array( 'title' => 'ثبت‌نام', 'slug' => 'register', 'content' => '[dv_register]' ),
			'forgot-password' => array( 'title' => 'بازیابی گذرواژه', 'slug' => 'forgot-password', 'content' => '[dv_forgot_password]' ),
			'reset-password' => array( 'title' => 'تنظیم گذرواژه', 'slug' => 'reset-password', 'content' => '[dv_reset_password]' ),
			'investment-request' => array( 'title' => 'درخواست سرمایه‌گذاری', 'slug' => 'investment-request', 'content' => '[dv_reference_page page="investment-request"]' ),
			'my-requests' => array( 'title' => 'درخواست‌های من', 'slug' => 'my-requests', 'content' => '[dv_customer_dashboard]' ),
			'request-management' => array( 'title' => 'مدیریت درخواست‌ها', 'slug' => 'request-management', 'content' => '[dv_request_management]' ),
			'user-management' => array( 'title' => 'مدیریت کاربران', 'slug' => 'user-management', 'content' => '[dv_request_user_management]' ),
			'email-management' => array( 'title' => 'مدیریت ایمیل‌ها', 'slug' => 'email-management', 'content' => '[dv_email_management]' ),
			'unauthorized' => array( 'title' => 'دسترسی مجاز نیست', 'slug' => 'unauthorized', 'content' => '[dv_unauthorized]' ),
		);
	}

	private function is_generated_content( string $content ): bool {
		$content = trim( $content );
		return 1 === preg_match( '/^\[dv_(?:marketing|reference_page|login|logout|register|forgot_password|reset_password|request_form|customer_dashboard|request_management|request_user_management|email_management|unauthorized)\b[^\]]*\]$/', $content );
	}
}
