<?php
namespace DigiVentures\Application\Logging;

defined( 'ABSPATH' ) || exit;

final class Logger {
	public static function write( string $level, string $message, array $context = array() ): void {
		$context = array_filter(
			$context,
			static fn( $key ) => ! in_array( strtolower( (string) $key ), array( 'password', 'token', 'nonce', 'authorization', 'email', 'description' ), true ),
			ARRAY_FILTER_USE_KEY
		);
		if ( defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
			error_log( sprintf( '[DigiVentures][%s] %s %s', strtoupper( $level ), $message, wp_json_encode( $context ) ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}
	}
}
