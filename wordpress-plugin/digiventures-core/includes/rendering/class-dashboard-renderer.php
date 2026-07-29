<?php
/**
 * Customer dashboard renderer.
 * Used by both the dv_customer_dashboard shortcode and the Elementor widget.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Rendering;

use DV_Core\Request_Type;
use DV_Core\Page_Resolver;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Dashboard_Renderer {

	/**
	 * Render the customer's own request list.
	 *
	 * @return string HTML
	 */
	public static function render() {
		if ( ! is_user_logged_in() ) {
			return Render_Service::login_required();
		}

		if ( ! current_user_can( 'dv_read_own_requests' ) ) {
			return Render_Service::forbidden();
		}

		$requests = get_posts( array(
			'post_type'      => Request_Type::POST_TYPE,
			'author'         => get_current_user_id(),
			'posts_per_page' => 50,
			'orderby'        => 'date',
			'order'          => 'DESC',
		) );

		return Render_Service::notice() . Render_Service::render( 'customer-dashboard.php', array(
			'requests'      => $requests,
			'dashboard_url' => Render_Service::current_url(),
			'form_url'      => Page_Resolver::url( 'investment-request' ),
			'status_labels' => Request_Type::status_labels_fa(),
		) );
	}
}
