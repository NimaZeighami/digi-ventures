<?php
/**
 * DigiVentures User Management Elementor widget.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Elementor\Widgets;

use DV_Core\Rendering\User_Management_Renderer;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class User_Management_Widget extends \Elementor\Widget_Base {

	public function get_name() {
		return 'dv-user-management';
	}

	public function get_title() {
		return __( 'DigiVentures User Management', 'digiventures-core' );
	}

	public function get_icon() {
		return 'eicon-person';
	}

	public function get_categories() {
		return array( 'digiventures' );
	}

	public function get_keywords() {
		return array( 'digiventures', 'users', 'roles', 'manager', 'کاربران' );
	}

	protected function register_controls() {
		$this->start_controls_section( 'content_section', array(
			'label' => __( 'User Management Settings', 'digiventures-core' ),
			'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
		) );

		$this->add_control( 'info_notice', array(
			'type'            => \Elementor\Controls_Manager::RAW_HTML,
			'raw'             => __( 'Manager-only screen. Requires dv_manage_request_users capability.', 'digiventures-core' ),
			'content_classes' => 'elementor-descriptor',
		) );

		$this->end_controls_section();
	}

	protected function render() {
		echo User_Management_Renderer::render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	protected function content_template() {
		?>
		<div style="padding:2rem;border:2px dashed #00B140;border-radius:8px;text-align:center;background:#f0fff6;">
			<strong>DigiVentures User Management</strong><br>
			<small>Manager only. Rendered on frontend.</small>
		</div>
		<?php
	}
}
