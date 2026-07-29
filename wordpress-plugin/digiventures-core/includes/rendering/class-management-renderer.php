<?php
/**
 * Admin request management renderer.
 * Used by both the dv_request_management shortcode and the Elementor widget.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Rendering;

use DV_Core\Request_Type;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Management_Renderer {

	/**
	 * Render the admin request list with decision forms.
	 *
	 * @return string HTML
	 */
	public static function render() {
		if ( ! current_user_can( 'dv_read_all_requests' ) || ! current_user_can( 'dv_manage_requests' ) ) {
			return Render_Service::forbidden();
		}

		$status = isset( $_GET['status'] ) ? sanitize_key( wp_unslash( $_GET['status'] ) ) : '';

		$args = array(
			'post_type'      => Request_Type::POST_TYPE,
			'posts_per_page' => 100,
			'orderby'        => 'date',
			'order'          => 'DESC',
		);

		if ( array_key_exists( $status, Request_Type::statuses() ) ) {
			$args['meta_key']   = Request_Type::META_STATUS;
			$args['meta_value'] = $status;
		}

		return Render_Service::notice() . Render_Service::render( 'request-management.php', array(
			'requests'        => get_posts( $args ),
			'selected_status' => $status,
			'statuses'        => Request_Type::statuses(),
			'status_labels'   => Request_Type::status_labels_fa(),
			'admin_statuses'  => Request_Type::admin_statuses(),
			'sectors'         => Request_Type::sectors(),
			'stages'          => Request_Type::stages(),
		) );
	}
}
