<?php
/**
 * Native settings page and safe message-template support.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Settings {
	const OPTION = 'dv_core_settings';

	/**
	 * Register settings hooks.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'register_menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'register' ) );
	}

	/**
	 * Defaults keep all screens usable before configuration.
	 *
	 * @return array<string,string>
	 */
	public static function defaults() {
		return array(
			'login_title' => 'ورود به حساب کاربری',
			'login_description' => 'برای پیگیری درخواست‌های سرمایه‌گذاری وارد حساب کاربری خود شوید.',
			'request_form_title' => 'فرم درخواست سرمایه‌گذاری',
			'request_form_instructions' => 'لطفاً تمام فیلدهای الزامی را با دقت تکمیل کنید.',
			'dashboard_welcome' => 'در این بخش می‌توانید درخواست‌های سرمایه‌گذاری خود را پیگیری کنید.',
			'empty_requests' => 'هنوز درخواستی ثبت نکرده‌اید.',
			'edit_request_label' => 'ویرایش درخواست',
			'contact_message' => 'برای پرسش‌های عمومی با تیم دیجی‌ونچرز در تماس باشید.',
			'acceptance_template' => 'سلام {customer_name}، درخواست «{request_title}» با شناسه {request_id} پذیرفته شد. {admin_message}',
			'rejection_template' => 'سلام {customer_name}، درخواست «{request_title}» با شناسه {request_id} در این مرحله پذیرفته نشد. {admin_message}',
		);
	}

	/**
	 * Persist defaults once.
	 *
	 * @return void
	 */
	public static function install_defaults() {
		$settings = get_option( self::OPTION, null );
		if ( null === $settings ) {
			add_option( self::OPTION, self::defaults() );
		}
	}

	/**
	 * Get a settings value.
	 *
	 * @param string $key Key.
	 * @return string
	 */
	public static function get( $key ) {
		$settings = wp_parse_args( (array) get_option( self::OPTION, array() ), self::defaults() );
		return isset( $settings[ $key ] ) ? (string) $settings[ $key ] : '';
	}

	/**
	 * Register settings screen.
	 *
	 * @return void
	 */
	public static function register_menu() {
		add_menu_page(
			__( 'DigiVentures', 'digiventures-core' ),
			__( 'DigiVentures', 'digiventures-core' ),
			'dv_manage_settings',
			'dv-core-settings',
			array( __CLASS__, 'render_page' ),
			'dashicons-clipboard',
			58
		);
	}

	/**
	 * Register sanitization.
	 *
	 * @return void
	 */
	public static function register() {
		register_setting( 'dv_core_settings_group', self::OPTION, array( __CLASS__, 'sanitize' ) );
	}

	/**
	 * Sanitize saved application copy.
	 *
	 * @param mixed $input Request input.
	 * @return array<string,string>
	 */
	public static function sanitize( $input ) {
		$input = is_array( $input ) ? $input : array();
		$output = array();
		foreach ( self::defaults() as $key => $default ) {
			$value = isset( $input[ $key ] ) ? (string) $input[ $key ] : $default;
			$output[ $key ] = in_array( $key, array( 'acceptance_template', 'rejection_template' ), true ) ? wp_kses_post( $value ) : sanitize_textarea_field( $value );
		}
		return $output;
	}

	/**
	 * Render settings page.
	 *
	 * @return void
	 */
	public static function render_page() {
		if ( ! current_user_can( 'dv_manage_settings' ) ) {
			wp_die( esc_html__( 'You are not allowed to manage these settings.', 'digiventures-core' ) );
		}
		$settings = wp_parse_args( (array) get_option( self::OPTION, array() ), self::defaults() );
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'DigiVentures application settings', 'digiventures-core' ); ?></h1>
			<p><?php esc_html_e( 'Supported message placeholders: {customer_name}, {request_id}, {request_title}, {contact_date}, {contact_phone}, {admin_message}.', 'digiventures-core' ); ?></p>
			<form action="options.php" method="post">
				<?php settings_fields( 'dv_core_settings_group' ); ?>
				<table class="form-table" role="presentation">
					<?php foreach ( self::defaults() as $key => $default ) : ?>
						<tr>
							<th scope="row"><label for="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( ucwords( str_replace( '_', ' ', $key ) ) ); ?></label></th>
							<td><textarea class="large-text" rows="<?php echo esc_attr( false !== strpos( $key, 'template' ) ? 5 : 2 ); ?>" id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( self::OPTION . '[' . $key . ']' ); ?>"><?php echo esc_textarea( $settings[ $key ] ); ?></textarea></td>
						</tr>
					<?php endforeach; ?>
				</table>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Resolve only explicitly registered placeholders.
	 *
	 * @param string $template Template.
	 * @param int    $request_id Request ID.
	 * @param string $admin_message Admin message.
	 * @return string
	 */
	public static function render_message( $template, $request_id, $admin_message ) {
		$user = get_user_by( 'id', (int) get_post_field( 'post_author', $request_id ) );
		$replacements = array(
			'{customer_name}' => $user ? $user->display_name : '',
			'{request_id}' => (string) $request_id,
			'{request_title}' => get_the_title( $request_id ),
			'{contact_date}' => wp_date( get_option( 'date_format' ) ),
			'{contact_phone}' => get_post_meta( $request_id, '_dv_phone', true ),
			'{admin_message}' => $admin_message,
		);
		return strtr( wp_strip_all_tags( $template ), $replacements );
	}
}
