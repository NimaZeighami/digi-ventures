<?php
namespace DigiVentures\Application\Database;

use DigiVentures\Application\Logging\Logger;

defined( 'ABSPATH' ) || exit;

final class Migrations {
	public static function requests_table(): string {
		global $wpdb;
		return $wpdb->prefix . 'dv_requests';
	}

	public static function run(): void {
		if ( DV_APP_SCHEMA_VERSION === get_option( 'dv_app_schema_version' ) ) {
			return;
		}
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		$charset = $wpdb->get_charset_collate();
		$table = self::requests_table();
		$sql = "CREATE TABLE {$table} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			user_id bigint(20) unsigned NOT NULL,
			startup_name varchar(255) NOT NULL,
			founder_name varchar(255) NOT NULL,
			email varchar(255) NOT NULL,
			phone varchar(50) NOT NULL,
			sector varchar(50) NOT NULL,
			stage varchar(50) NOT NULL,
			description longtext NOT NULL,
			attachment_id bigint(20) unsigned DEFAULT NULL,
			pitch_deck_url varchar(500) DEFAULT NULL,
			status varchar(30) NOT NULL DEFAULT 'draft',
			admin_message longtext DEFAULT NULL,
			internal_note longtext DEFAULT NULL,
			idempotency_key varchar(64) DEFAULT NULL,
			created_at datetime NOT NULL,
			updated_at datetime NOT NULL,
			PRIMARY KEY  (id),
			KEY user_id (user_id),
			KEY status (status),
			KEY idempotency_key (idempotency_key)
		) {$charset};";
		dbDelta( $sql );
		update_option( 'dv_app_schema_version', DV_APP_SCHEMA_VERSION, false );
		update_option( 'dv_app_last_migration', gmdate( 'c' ), false );
		Logger::write( 'info', 'Schema migration completed.', array( 'schema' => DV_APP_SCHEMA_VERSION ) );
	}
}
