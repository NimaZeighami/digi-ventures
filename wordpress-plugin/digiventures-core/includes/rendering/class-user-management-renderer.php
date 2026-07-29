<?php
/**
 * User management renderer.
 * Used by both the dv_request_user_management shortcode and the Elementor widget.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Rendering;

use DV_Core\Roles;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class User_Management_Renderer {

	/**
	 * Render the manager-only role assignment UI.
	 *
	 * @return string HTML
	 */
	public static function render() {
		if ( ! current_user_can( 'dv_manage_request_users' ) ) {
			return Render_Service::forbidden();
		}

		$users = get_users( array(
			'orderby' => 'display_name',
			'order'   => 'ASC',
		) );

		return Render_Service::notice() . Render_Service::render( 'user-management.php', array(
			'users' => $users,
		) );
	}
}
