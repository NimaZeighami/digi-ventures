<?php
/**
 * Plugin Name: DigiVentures Application
 * Description: Secure frontend investment-request application with optional Elementor widgets.
 * Version: 1.1.13
 * Requires at least: 6.4
 * Requires PHP: 8.1
 * Author: DigiVentures
 * Text Domain: digiventures-application
 */

defined( 'ABSPATH' ) || exit;

define( 'DV_APP_VERSION', '1.1.13' );
define( 'DV_APP_SCHEMA_VERSION', '1.0.0' );
define( 'DV_APP_FILE', __FILE__ );
define( 'DV_APP_DIR', plugin_dir_path( __FILE__ ) );
define( 'DV_APP_URL', plugin_dir_url( __FILE__ ) );

spl_autoload_register(
	static function ( $class ) {
		$prefix = 'DigiVentures\\Application\\';
		if ( 0 !== strpos( $class, $prefix ) ) {
			return;
		}
		$path = DV_APP_DIR . 'src/' . str_replace( '\\', '/', substr( $class, strlen( $prefix ) ) ) . '.php';
		if ( is_readable( $path ) ) {
			require_once $path;
		}
	}
);

register_activation_hook( __FILE__, array( 'DigiVentures\\Application\\Bootstrap', 'activate' ) );

add_action(
	'plugins_loaded',
	static function () {
		DigiVentures\Application\Bootstrap::instance()->boot();
	}
);
