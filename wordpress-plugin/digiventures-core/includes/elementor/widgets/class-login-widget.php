<?php
/**
 * DigiVentures Login Elementor widget.
 *
 * @package DigiVenturesCore
 */

namespace DV_Core\Elementor\Widgets;

use DV_Core\Rendering\Login_Renderer;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Login_Widget extends \Elementor\Widget_Base {

	public function get_name() {
		return 'dv-login';
	}

	public function get_title() {
		return __( 'DigiVentures Login', 'digiventures-core' );
	}

	public function get_icon() {
		return 'eicon-lock-user';
	}

	public function get_categories() {
		return array( 'digiventures' );
	}

	public function get_keywords() {
		return array( 'digiventures', 'login', 'auth', 'ورود' );
	}

	protected function register_controls() {
		$this->start_controls_section( 'content_section', array(
			'label' => __( 'Login Settings', 'digiventures-core' ),
			'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
		) );

		$this->add_control( 'info_notice', array(
			'type'            => \Elementor\Controls_Manager::RAW_HTML,
			'raw'             => __( 'Full-screen login page. If the user is already logged in, shows a dashboard link.', 'digiventures-core' ),
			'content_classes' => 'elementor-descriptor',
		) );

		$this->end_controls_section();
	}

	protected function render() {
		echo Login_Renderer::render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	protected function content_template() {
		?>
		<div style="padding:2rem;border:2px dashed #00B140;border-radius:8px;text-align:center;background:#f0fff6;">
			<strong>DigiVentures Login</strong><br>
			<small>Full login form rendered on frontend.</small>
		</div>
		<?php
	}
}
