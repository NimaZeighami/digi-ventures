<section class="dv-app-panel">
	<h1>درخواست‌های من</h1><p><?php echo esc_html( \DV_Core\Settings::get( 'dashboard_welcome' ) ); ?></p>
	<?php if ( empty( $requests ) ) : ?><p class="dv-empty-state"><?php echo esc_html( \DV_Core\Settings::get( 'empty_requests' ) ); ?></p><?php else : ?>
	<table class="dv-table"><thead><tr><th>درخواست</th><th>وضعیت</th><th>پاسخ</th><th>عملیات</th></tr></thead><tbody><?php foreach ( $requests as $request ) : $status = \DV_Core\Request_Type::get_status( $request->ID ); ?><tr><td><?php echo esc_html( get_the_title( $request ) ); ?></td><td><?php echo esc_html( \DV_Core\Request_Type::statuses()[ $status ] ); ?></td><td><?php echo esc_html( get_post_meta( $request->ID, '_dv_customer_response', true ) ); ?></td><td><?php if ( \DV_Core\Request_Type::customer_can_edit_status( $status ) ) : ?><a href="<?php echo esc_url( add_query_arg( 'request_id', $request->ID, $dashboard_url ) ); ?>"><?php echo esc_html( \DV_Core\Settings::get( 'edit_request_label' ) ); ?></a><?php endif; ?></td></tr><?php endforeach; ?></tbody></table>
	<?php endif; ?>
</section>
