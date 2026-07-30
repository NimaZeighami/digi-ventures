<?php
namespace DigiVentures\Application\Elementor\Widgets;

defined( 'ABSPATH' ) || exit;

final class ApplicationWidget extends \Elementor\Widget_Base {
	public function get_name(): string { return 'digiventures_application'; }
	public function get_title(): string { return 'DigiVentures Application'; }
	public function get_icon(): string { return 'eicon-form-horizontal'; }
	public function get_categories(): array { return array( 'general' ); }
	protected function register_controls(): void {
		$this->start_controls_section( 'content', array( 'label' => 'DigiVentures' ) );
		$this->add_control( 'view', array( 'label' => 'View', 'type' => \Elementor\Controls_Manager::SELECT, 'default' => 'request_form', 'options' => array( 'request_form' => 'Investment request form', 'customer_dashboard' => 'Customer dashboard', 'request_management' => 'Request management', 'user_management' => 'User management', 'email_management' => 'Email management', 'login' => 'Login', 'logout' => 'Logout', 'register' => 'Register', 'forgot_password' => 'Password recovery' ) ) );
		$this->add_control( 'title', array( 'label' => 'Optional editor label', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => '' ) );
		$this->end_controls_section();
	}
	protected function render(): void {
		$view = sanitize_key( $this->get_settings_for_display()['view'] ?? 'request_form' );
		$codes = array( 'request_form' => 'dv_request_form', 'customer_dashboard' => 'dv_customer_dashboard', 'request_management' => 'dv_request_management', 'user_management' => 'dv_request_user_management', 'email_management' => 'dv_email_management', 'login' => 'dv_login', 'logout' => 'dv_logout', 'register' => 'dv_register', 'forgot_password' => 'dv_forgot_password' );
		echo do_shortcode( '[' . ( $codes[ $view ] ?? 'dv_unauthorized' ) . ']' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
