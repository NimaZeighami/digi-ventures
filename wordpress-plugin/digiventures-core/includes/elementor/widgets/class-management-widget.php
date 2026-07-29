<?php
/**
 * DigiVentures Request Management Elementor widget.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Elementor\Widgets;

use DV_Core\Rendering\Management_Renderer;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Management_Widget extends \Elementor\Widget_Base {

	public function get_name() {
		return 'dv-request-management';
	}

	public function get_title() {
		return __( 'DigiVentures Request Management', 'digiventures-core' );
	}

	public function get_icon() {
		return 'eicon-clipboard';
	}

	public function get_categories() {
		return array( 'digiventures' );
	}

	public function get_keywords() {
		return array( 'digiventures', 'management', 'admin', 'requests', 'مدیریت' );
	}

	protected function register_controls() {
		$this->start_controls_section( 'content_section', array(
			'label' => __( 'Management Settings', 'digiventures-core' ),
			'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
		) );

		$this->add_control( 'info_notice', array(
			'type'            => \Elementor\Controls_Manager::RAW_HTML,
			'raw'             => __( 'Admin-only screen. Requires dv_read_all_requests and dv_manage_requests capabilities.', 'digiventures-core' ),
			'content_classes' => 'elementor-descriptor',
		) );

		$this->end_controls_section();
	}

	protected function render() {
		echo Management_Renderer::render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	protected function content_template() {
		?>
		<div style="padding:2rem;border:2px dashed #00B140;border-radius:8px;text-align:center;background:#f0fff6;">
			<strong>DigiVentures Request Management</strong><br>
			<small>Admin only. Rendered on frontend.</small>
		</div>
		<?php
	}
}
