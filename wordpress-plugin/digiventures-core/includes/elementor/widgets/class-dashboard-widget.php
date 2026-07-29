<?php
/**
 * DigiVentures Customer Dashboard Elementor widget.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Elementor\Widgets;

use DV_Core\Rendering\Dashboard_Renderer;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Dashboard_Widget extends \Elementor\Widget_Base {

	public function get_name() {
		return 'dv-customer-dashboard';
	}

	public function get_title() {
		return __( 'DigiVentures Customer Dashboard', 'digiventures-core' );
	}

	public function get_icon() {
		return 'eicon-dashboard';
	}

	public function get_categories() {
		return array( 'digiventures' );
	}

	public function get_keywords() {
		return array( 'digiventures', 'dashboard', 'requests', 'درخواست' );
	}

	protected function register_controls() {
		$this->start_controls_section( 'content_section', array(
			'label' => __( 'Dashboard Settings', 'digiventures-core' ),
			'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
		) );

		$this->add_control( 'info_notice', array(
			'type'            => \Elementor\Controls_Manager::RAW_HTML,
			'raw'             => __( 'Shows the logged-in customer\'s own requests. Customers only see their own data.', 'digiventures-core' ),
			'content_classes' => 'elementor-descriptor',
		) );

		$this->end_controls_section();
	}

	protected function render() {
		echo Dashboard_Renderer::render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	protected function content_template() {
		?>
		<div style="padding:2rem;border:2px dashed #00B140;border-radius:8px;text-align:center;background:#f0fff6;">
			<strong>DigiVentures Customer Dashboard</strong><br>
			<small>Rendered on frontend. Login required.</small>
		</div>
		<?php
	}
}
