<?php
namespace DigiVentures\Application\Validation;

defined( 'ABSPATH' ) || exit;

final class RequestValidator {
	public const SECTORS = array( 'ecommerce', 'fintech', 'platform', 'supply_chain', 'ai', 'other' );
	public const STAGES = array( 'seed', 'early', 'growth', 'scale' );

	public static function data( array $input ): array|\WP_Error {
		$data = array(
			'startup_name' => sanitize_text_field( $input['startup_name'] ?? '' ),
			'founder_name' => sanitize_text_field( $input['founder_name'] ?? '' ),
			'email' => sanitize_email( $input['email'] ?? '' ),
			'phone' => sanitize_text_field( $input['phone'] ?? '' ),
			'sector' => sanitize_key( $input['sector'] ?? '' ),
			'stage' => sanitize_key( $input['stage'] ?? '' ),
			'description' => sanitize_textarea_field( $input['description'] ?? '' ),
		);
		foreach ( array( 'startup_name', 'founder_name', 'email', 'phone', 'sector', 'stage', 'description' ) as $field ) {
			if ( '' === $data[ $field ] ) {
				return new \WP_Error( 'dv_invalid_request', __( 'لطفاً همه فیلدهای الزامی را تکمیل کنید.', 'digiventures-application' ), array( 'status' => 400 ) );
			}
		}
		if ( ! is_email( $data['email'] ) || ! in_array( $data['sector'], self::SECTORS, true ) || ! in_array( $data['stage'], self::STAGES, true ) ) {
			return new \WP_Error( 'dv_invalid_request', __( 'اطلاعات درخواست معتبر نیست.', 'digiventures-application' ), array( 'status' => 400 ) );
		}
		return $data;
	}
}
