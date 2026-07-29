<section class="dv-app-panel">
	<h1>مدیریت درخواست‌ها</h1>
	<form class="dv-filter" method="get"><label for="dv-status-filter">وضعیت</label><select id="dv-status-filter" name="status"><option value="">همه</option><?php foreach ( \DV_Core\Request_Type::statuses() as $key => $label ) : ?><option value="<?php echo esc_attr( $key ); ?>" <?php selected( $selected_status, $key ); ?>><?php echo esc_html( $label ); ?></option><?php endforeach; ?></select><button type="submit">فیلتر</button></form>
	<?php if ( empty( $requests ) ) : ?><p class="dv-empty-state">درخواستی یافت نشد.</p><?php endif; ?>
	<?php foreach ( $requests as $request ) : $status = \DV_Core\Request_Type::get_status( $request->ID ); ?>
		<article class="dv-request-card">
			<h2><?php echo esc_html( get_the_title( $request ) ); ?> <small>#<?php echo esc_html( $request->ID ); ?></small></h2>
			<dl><dt>بنیان‌گذار</dt><dd><?php echo esc_html( get_post_meta( $request->ID, '_dv_founder_name', true ) ); ?></dd><dt>ایمیل</dt><dd><?php echo esc_html( get_post_meta( $request->ID, '_dv_email', true ) ); ?></dd><dt>تلفن</dt><dd><?php echo esc_html( get_post_meta( $request->ID, '_dv_phone', true ) ); ?></dd><dt>شرح</dt><dd><?php echo nl2br( esc_html( get_post_meta( $request->ID, '_dv_description', true ) ) ); ?></dd></dl>
			<?php $deck_id = absint( get_post_meta( $request->ID, '_dv_pitch_deck_id', true ) ); if ( $deck_id ) : ?><p><a href="<?php echo esc_url( wp_get_attachment_url( $deck_id ) ); ?>">Pitch Deck</a></p><?php endif; ?>
			<form class="dv-form" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
				<?php wp_nonce_field( 'dv_core_update_status', 'dv_core_nonce' ); ?><input type="hidden" name="action" value="dv_core_update_status" /><input type="hidden" name="request_id" value="<?php echo esc_attr( $request->ID ); ?>" />
				<p><label>وضعیت <select name="status"><?php foreach ( \DV_Core\Request_Type::admin_statuses() as $candidate ) : ?><option value="<?php echo esc_attr( $candidate ); ?>" <?php selected( $status, $candidate ); ?>><?php echo esc_html( \DV_Core\Request_Type::statuses()[ $candidate ] ); ?></option><?php endforeach; ?></select></label></p>
				<p><label>پیام قابل مشاهده برای مشتری <textarea name="admin_message" rows="3"><?php echo esc_textarea( get_post_meta( $request->ID, '_dv_customer_response', true ) ); ?></textarea></label></p>
				<p><label>یادداشت داخلی <textarea name="internal_note" rows="3"><?php echo esc_textarea( get_post_meta( $request->ID, '_dv_internal_note', true ) ); ?></textarea></label></p>
				<button type="submit" class="btn-primary">ذخیره تصمیم</button>
			</form>
		</article>
	<?php endforeach; ?>
</section>
