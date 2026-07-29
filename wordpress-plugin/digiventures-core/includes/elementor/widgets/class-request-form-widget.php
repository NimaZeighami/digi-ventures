<?php
/**
 * DigiVentures Request Form Elementor widget.
 * Thin wrapper — all logic lives in Form_Renderer.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Elementor\Widgets;

use DV_Core\Rendering\Form_Renderer;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Request_Form_Widget extends \Elementor\Widget_Base {

	public function get_name() {
		return 'dv-request-form';
	}

	public function get_title() {
		return __( 'DigiVentures Request Form', 'digiventures-core' );
	}

	public function get_icon() {
		return 'eicon-form-horizontal';
	}

	public function get_categories() {
		return array( 'digiventures' );
	}

	public function get_keywords() {
		return array( 'digiventures', 'request', 'investment', 'form', 'درخواست' );
	}

	protected function register_controls() {
		$this->start_controls_section( 'content_section', array(
			'label' => __( 'Form Settings', 'digiventures-core' ),
			'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
		) );

		$this->add_control( 'info_notice', array(
			'type'            => \Elementor\Controls_Manager::RAW_HTML,
			'raw'             => __( 'This form is powered by the DigiVentures plugin. Logic, validation, and security are managed server-side.', 'digiventures-core' ),
			'content_classes' => 'elementor-descriptor',
		) );

		$this->end_controls_section();
	}

	protected function render() {
		echo Form_Renderer::render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- renderer handles escaping
	}

	protected function content_template() {
		// Elementor editor preview — show placeholder.
		?>
		<div style="padding:2rem;border:2px dashed #00B140;border-radius:8px;text-align:center;background:#f0fff6;">
			<strong>DigiVentures Request Form</strong><br>
			<small>Rendered on frontend. Login required to see the actual form.</small>
		</div>
		<?php
	}
}
