<?php
/**
 * Request form renderer.
 * Handles capability checks and delegates to the form template.
 * Used by both the dv_request_form shortcode and the Elementor widget.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Rendering;

use DV_Core\Request_Type;
use DV_Core\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Form_Renderer {

	/**
	 * Render the investment request form.
	 *
	 * Capability chain (in order):
	 *   1. Not logged in         → login-required prompt
	 *   2. No dv_submit_requests → forbidden
	 *   3. request_id set but not owned or not editable → forbidden
	 *   4. All clear             → form template
	 *
	 * @return string HTML
	 */
	public static function render() {
		if ( ! is_user_logged_in() ) {
			return Render_Service::login_required();
		}

		if ( ! current_user_can( 'dv_submit_requests' ) ) {
			return Render_Service::forbidden();
		}

		$request_id = isset( $_GET['request_id'] ) ? absint( $_GET['request_id'] ) : 0;

		if ( $request_id ) {
			$owned    = Request_Type::user_owns_request( $request_id, get_current_user_id() );
			$editable = Request_Type::customer_can_edit_status( Request_Type::get_status( $request_id ) );
			if ( ! $owned || ! $editable ) {
				return Render_Service::forbidden();
			}
		}

		return Render_Service::notice() . Render_Service::render( 'request-form.php', array(
			'request_id' => $request_id,
			'sectors'    => Request_Type::sectors(),
			'stages'     => Request_Type::stages(),
		) );
	}
}
