<?php
/**
 * Setup wizard admin page.
 * Accessible from WordPress Admin → DigiVentures → Setup.
 * Runs the full installation sequence and reports results.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Setup;

use DV_Core\Elementor\Elementor_Integration;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Setup_Wizard {

	const PAGE_SLUG = 'dv-setup-wizard';

	/**
	 * Register admin menu.
	 */
	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'register_menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'handle_actions' ) );
	}

	/**
	 * Add the setup page under the DigiVentures menu.
	 */
	public static function register_menu() {
		add_submenu_page(
			'dv-core-settings',
			__( 'DigiVentures Setup', 'digiventures-core' ),
			__( 'Setup', 'digiventures-core' ),
			'manage_options',
			self::PAGE_SLUG,
			array( __CLASS__, 'render_page' )
		);
	}

	/**
	 * Handle POST actions from the setup wizard.
	 */
	public static function handle_actions() {
		if ( ! isset( $_POST['dv_setup_action'] ) ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Unauthorized.', 'digiventures-core' ) );
		}

		check_admin_referer( 'dv_setup_wizard', 'dv_setup_nonce' );

		$action = sanitize_key( wp_unslash( $_POST['dv_setup_action'] ) );

		switch ( $action ) {
			case 'install_pages':
				$result = Page_Installer::install();
				if ( is_wp_error( $result ) ) {
					self::redirect( 'error', $result->get_error_message() );
				}
				// Set homepage.
				if ( isset( $result['home'] ) ) {
					Page_Installer::set_homepage( $result['home'] );
				}
				Install_State::update( array(
					'version'      => DV_CORE_VERSION,
					'installed_at' => current_time( 'mysql' ),
					'completed'    => true,
				) );
				self::redirect( 'pages_installed' );
				break;

			case 'import_templates':
				$result = Template_Installer::install();
				if ( is_wp_error( $result ) ) {
					self::redirect( 'error', $result->get_error_message() );
				}
				self::redirect( 'templates_imported' );
				break;

			case 'apply_templates':
				$state         = Install_State::get();
				$pages_created = $state['pages_created'];
				$template_ids  = $state['template_ids'];
				foreach ( $pages_created as $key => $page_id ) {
					if ( isset( $template_ids[ $key ] ) ) {
						Template_Installer::apply_to_page( $page_id, $template_ids[ $key ] );
						Template_Installer::regenerate_css( $page_id );
					}
				}
				self::redirect( 'templates_applied' );
				break;

			case 'reset_static':
				$count = Rollback::reset_static_pages();
				self::redirect( 'static_reset', (string) $count );
				break;

			case 'rollback':
				Rollback::run();
				self::redirect( 'rolled_back' );
				break;
		}
	}

	/**
	 * Render the setup wizard admin page.
	 */
	public static function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Unauthorized.', 'digiventures-core' ) );
		}

		$state     = Install_State::get();
		$elementor = Elementor_Integration::is_available();
		$notice    = isset( $_GET['dv_setup_notice'] ) ? sanitize_key( $_GET['dv_setup_notice'] ) : '';
		$message   = isset( $_GET['dv_setup_message'] ) ? sanitize_text_field( $_GET['dv_setup_message'] ) : '';

		$notices = array(
			'pages_installed'     => array( 'success', __( 'Pages created successfully. Homepage has been set.', 'digiventures-core' ) ),
			'templates_imported'  => array( 'success', __( 'Elementor templates imported.', 'digiventures-core' ) ),
			'templates_applied'   => array( 'success', __( 'Templates applied to pages and CSS regenerated.', 'digiventures-core' ) ),
			'static_reset'        => array( 'success', sprintf( __( 'Static pages reset to theme design (%s pages). They now use the original theme templates.', 'digiventures-core' ), $message ) ),
			'rolled_back'         => array( 'success', __( 'Rollback complete. Created pages and templates removed.', 'digiventures-core' ) ),
			'error'               => array( 'error',   $message ?: __( 'An error occurred.', 'digiventures-core' ) ),
		);
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'DigiVentures Setup Wizard', 'digiventures-core' ); ?></h1>

			<?php if ( isset( $notices[ $notice ] ) ) : ?>
			<div class="notice notice-<?php echo esc_attr( $notices[ $notice ][0] ); ?> is-dismissible">
				<p><?php echo esc_html( $notices[ $notice ][1] ); ?></p>
			</div>
			<?php endif; ?>

			<h2><?php esc_html_e( 'Environment', 'digiventures-core' ); ?></h2>
			<table class="widefat" style="max-width:600px;margin-bottom:2rem;">
				<tbody>
					<tr>
						<td><strong><?php esc_html_e( 'Elementor', 'digiventures-core' ); ?></strong></td>
						<td><?php echo $elementor ? '<span style="color:green;">✓ ' . esc_html( ELEMENTOR_VERSION ) . '</span>' : '<span style="color:red;">✗ Not available</span>'; ?></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'Setup completed', 'digiventures-core' ); ?></strong></td>
						<td><?php echo $state['completed'] ? '<span style="color:green;">✓ ' . esc_html( $state['installed_at'] ) . '</span>' : '<span style="color:orange;">Not yet</span>'; ?></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'Permalink structure', 'digiventures-core' ); ?></strong></td>
						<td><?php echo get_option( 'permalink_structure' ) ? esc_html( get_option( 'permalink_structure' ) ) : '<span style="color:red;">Plain — change to Post name!</span>'; ?></td>
					</tr>
				</tbody>
			</table>

			<div style="background:#fff8e1;border:1px solid #ffc107;border-radius:4px;padding:1rem 1.5rem;margin-bottom:1.5rem;max-width:700px;">
				<h3 style="margin-top:0;">⚠ <?php esc_html_e( 'Static pages show placeholder content?', 'digiventures-core' ); ?></h3>
				<p><?php esc_html_e( 'If your homepage or marketing pages show blank placeholder text instead of the theme design, click below. This removes Elementor data from the static pages (home, portfolio, team, about, contact, news) so they use the original theme templates. Your application pages and request data are NOT affected.', 'digiventures-core' ); ?></p>
				<form method="post">
					<?php wp_nonce_field( 'dv_setup_wizard', 'dv_setup_nonce' ); ?>
					<input type="hidden" name="dv_setup_action" value="reset_static" />
					<button type="submit" class="button button-primary"><?php esc_html_e( 'Reset Static Pages to Theme Design', 'digiventures-core' ); ?></button>
				</form>
			</div>

			<h2><?php esc_html_e( 'Steps', 'digiventures-core' ); ?></h2>

			<?php self::render_step( 1, __( 'Create Pages', 'digiventures-core' ), __( 'Creates all 11 required WordPress pages and sets the homepage. Static pages use the theme design; only the 5 app pages use Elementor. Safe to run multiple times.', 'digiventures-core' ), 'install_pages', __( 'Create Pages', 'digiventures-core' ) ); ?>

			<?php if ( $elementor ) : ?>
			<?php self::render_step( 2, __( 'Import App Templates', 'digiventures-core' ), __( 'Imports the 5 application-page Elementor templates (form, dashboard, management, users, login). Static marketing pages are intentionally excluded. Safe to run multiple times.', 'digiventures-core' ), 'import_templates', __( 'Import Templates', 'digiventures-core' ) ); ?>
			<?php self::render_step( 3, __( 'Apply Templates to App Pages', 'digiventures-core' ), __( 'Connects imported templates to the 5 application pages and regenerates CSS.', 'digiventures-core' ), 'apply_templates', __( 'Apply Templates', 'digiventures-core' ) ); ?>
			<?php else : ?>
			<p><em><?php esc_html_e( 'Elementor not available — template steps hidden. Shortcode fallback is active.', 'digiventures-core' ); ?></em></p>
			<?php endif; ?>

			<hr style="margin:2rem 0;">

			<h2><?php esc_html_e( 'Pages', 'digiventures-core' ); ?></h2>
			<table class="widefat" style="max-width:700px;">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Page', 'digiventures-core' ); ?></th>
						<th><?php esc_html_e( 'Slug', 'digiventures-core' ); ?></th>
						<th><?php esc_html_e( 'Status', 'digiventures-core' ); ?></th>
						<th><?php esc_html_e( 'Edit', 'digiventures-core' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( \DV_Core\Page_Resolver::page_map() as $key => $slug ) : ?>
					<?php
						$page_id    = \DV_Core\Page_Resolver::get_page_id( $key );
						$exists     = $page_id && get_post( $page_id );
						$by_slug    = ! $exists ? get_page_by_path( $slug ) : null;
						$exists     = $exists || $by_slug;
						$display_id = $page_id ?: ( $by_slug ? $by_slug->ID : 0 );
					?>
					<tr>
						<td><?php echo esc_html( $key ); ?></td>
						<td><code><?php echo esc_html( $slug ); ?></code></td>
						<td><?php echo $exists ? '<span style="color:green;">✓</span>' : '<span style="color:red;">✗</span>'; ?></td>
						<td>
							<?php if ( $display_id ) : ?>
							<a href="<?php echo esc_url( get_edit_post_link( $display_id ) ); ?>"><?php esc_html_e( 'Edit', 'digiventures-core' ); ?></a>
							&nbsp;
							<a href="<?php echo esc_url( get_permalink( $display_id ) ); ?>" target="_blank"><?php esc_html_e( 'View', 'digiventures-core' ); ?></a>
							<?php else : ?>
							—
							<?php endif; ?>
						</td>
					</tr>
					<?php endforeach; ?>
				</tbody>
			</table>

			<hr style="margin:2rem 0;">

			<h2 style="color:#cc0000;"><?php esc_html_e( 'Danger Zone', 'digiventures-core' ); ?></h2>
			<p><?php esc_html_e( 'Rollback removes all pages and templates created by this wizard. Existing data (users, requests, settings) is NOT touched.', 'digiventures-core' ); ?></p>
			<form method="post" onsubmit="return confirm('<?php esc_attr_e( 'Are you sure? This will delete all pages created by the setup wizard.', 'digiventures-core' ); ?>')">
				<?php wp_nonce_field( 'dv_setup_wizard', 'dv_setup_nonce' ); ?>
				<input type="hidden" name="dv_setup_action" value="rollback" />
				<button type="submit" class="button" style="color:#cc0000;border-color:#cc0000;">
					<?php esc_html_e( 'Rollback Installation', 'digiventures-core' ); ?>
				</button>
			</form>
		</div>
		<?php
	}

	/**
	 * Render a single setup step form.
	 *
	 * @param int    $step    Step number.
	 * @param string $title   Step title.
	 * @param string $desc    Step description.
	 * @param string $action  POST action value.
	 * @param string $button  Button label.
	 */
	private static function render_step( $step, $title, $desc, $action, $button ) {
		?>
		<div style="background:#fff;border:1px solid #ddd;border-radius:4px;padding:1rem 1.5rem;margin-bottom:1rem;max-width:600px;">
			<h3 style="margin-top:0;"><?php echo esc_html( $step . '. ' . $title ); ?></h3>
			<p><?php echo esc_html( $desc ); ?></p>
			<form method="post">
				<?php wp_nonce_field( 'dv_setup_wizard', 'dv_setup_nonce' ); ?>
				<input type="hidden" name="dv_setup_action" value="<?php echo esc_attr( $action ); ?>" />
				<button type="submit" class="button button-primary"><?php echo esc_html( $button ); ?></button>
			</form>
		</div>
		<?php
	}

	/**
	 * Redirect back to the wizard with a notice.
	 *
	 * @param string $notice  Notice key.
	 * @param string $message Optional extra message.
	 */
	private static function redirect( $notice, $message = '' ) {
		$args = array(
			'page'            => self::PAGE_SLUG,
			'dv_setup_notice' => $notice,
		);
		if ( $message ) {
			$args['dv_setup_message'] = $message;
		}
		wp_safe_redirect( add_query_arg( $args, admin_url( 'admin.php' ) ) );
		exit;
	}
}
