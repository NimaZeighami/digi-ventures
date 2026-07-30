<?php
defined( 'WP_UNINSTALL_PLUGIN' ) || exit;
if ( ! get_option( 'dv_delete_data_on_uninstall' ) ) {
	return;
}
global $wpdb;
$wpdb->query( 'DROP TABLE IF EXISTS ' . $wpdb->prefix . 'dv_requests' ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
delete_option( 'dv_app_schema_version' );
delete_option( 'dv_app_last_migration' );
delete_option( 'dv_app_pages' );
delete_option( 'dv_app_setup_steps' );
delete_option( 'dv_app_last_setup_error' );
delete_option( 'dv_app_email_templates' );
delete_option( 'dv_delete_data_on_uninstall' );
