<?php
/**
 * Plugin Name: DigiVentures Core
 * Description: Secure investment request workflow for DigiVentures.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Text Domain: digiventures-core
 *
 * @package DigiVenturesCore
 */

namespace DV_Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'DV_CORE_VERSION', '1.0.0' );
define( 'DV_CORE_FILE', __FILE__ );
define( 'DV_CORE_PATH', plugin_dir_path( __FILE__ ) );
define( 'DV_CORE_URL', plugin_dir_url( __FILE__ ) );

require_once DV_CORE_PATH . 'includes/class-roles.php';
require_once DV_CORE_PATH . 'includes/class-request-type.php';
require_once DV_CORE_PATH . 'includes/class-settings.php';
require_once DV_CORE_PATH . 'includes/class-shortcodes.php';
require_once DV_CORE_PATH . 'includes/class-handlers.php';

/**
 * Plugin composition root.
 */
final class Plugin {
	/**
	 * Register runtime hooks.
	 *
	 * @return void
	 */
	public static function init() {
		Roles::init();
		Request_Type::init();
		Settings::init();
		Shortcodes::init();
		Handlers::init();
	}

	/**
	 * Install roles, defaults, and rewrite rules.
	 *
	 * @return void
	 */
	public static function activate() {
		Roles::install();
		Settings::install_defaults();
		Request_Type::register();
		flush_rewrite_rules();
	}

	/**
	 * Flush rules after unregistering the type.
	 *
	 * @return void
	 */
	public static function deactivate() {
		flush_rewrite_rules();
	}
}

register_activation_hook( DV_CORE_FILE, array( __NAMESPACE__ . '\\Plugin', 'activate' ) );
register_deactivation_hook( DV_CORE_FILE, array( __NAMESPACE__ . '\\Plugin', 'deactivate' ) );

Plugin::init();
