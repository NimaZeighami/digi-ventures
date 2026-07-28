<?php
$request = $request_id ? get_post( $request_id ) : null;
$value = static function ( $key ) use ( $request_id ) {
	return $request_id ? (string) get_post_meta( $request_id, '_dv_' . $key, true ) : '';
};
$sectors = array( 'ecommerce' => 'تجارت الکترونیک', 'fintech' => 'فین‌تک', 'platform' => 'کسب‌وکارهای پلتفرمی', 'supply_chain' => 'زنجیره تأمین', 'ai' => 'هوش مصنوعی', 'other' => 'سایر' );
$stages = array( 'seed' => 'Seed', 'early' => 'مرحله اولیه', 'growth' => 'رشد', 'scale' => 'مقیاس‌پذیری' );
?>
<section class="dv-app-panel" aria-labelledby="dv-request-title">
	<h1 id="dv-request-title"><?php echo esc_html( Settings::get( 'request_form_title' ) ); ?></h1>
	<p><?php echo esc_html( Settings::get( 'request_form_instructions' ) ); ?></p>
	<form class="dv-form" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" enctype="multipart/form-data">
		<?php wp_nonce_field( $request ? 'dv_core_update_request' : 'dv_core_submit_request', 'dv_core_nonce' ); ?>
		<input type="hidden" name="action" value="<?php echo esc_attr( $request ? 'dv_core_update_request' : 'dv_core_submit_request' ); ?>" />
		<?php if ( $request ) : ?><input type="hidden" name="request_id" value="<?php echo esc_attr( $request_id ); ?>" /><?php endif; ?>
		<p><label for="dv-startup-name">نام استارتاپ <span aria-hidden="true">*</span></label><input id="dv-startup-name" name="startup_name" required value="<?php echo esc_attr( $value( 'startup_name' ) ); ?>" /></p>
		<p><label for="dv-founder-name">نام و نام خانوادگی <span aria-hidden="true">*</span></label><input id="dv-founder-name" name="founder_name" autocomplete="name" required value="<?php echo esc_attr( $value( 'founder_name' ) ); ?>" /></p>
		<p><label for="dv-email">ایمیل <span aria-hidden="true">*</span></label><input id="dv-email" name="email" type="email" dir="ltr" autocomplete="email" required value="<?php echo esc_attr( $value( 'email' ) ); ?>" /></p>
		<p><label for="dv-phone">شماره تماس <span aria-hidden="true">*</span></label><input id="dv-phone" name="phone" type="tel" dir="ltr" autocomplete="tel" required value="<?php echo esc_attr( $value( 'phone' ) ); ?>" /></p>
		<p><label for="dv-sector">حوزه فعالیت <span aria-hidden="true">*</span></label><select id="dv-sector" name="sector" required><option value="">انتخاب کنید</option><?php foreach ( $sectors as $key => $label ) : ?><option value="<?php echo esc_attr( $key ); ?>" <?php selected( $value( 'sector' ), $key ); ?>><?php echo esc_html( $label ); ?></option><?php endforeach; ?></select></p>
		<p><label for="dv-stage">مرحله کسب‌وکار <span aria-hidden="true">*</span></label><select id="dv-stage" name="stage" required><option value="">انتخاب کنید</option><?php foreach ( $stages as $key => $label ) : ?><option value="<?php echo esc_attr( $key ); ?>" <?php selected( $value( 'stage' ), $key ); ?>><?php echo esc_html( $label ); ?></option><?php endforeach; ?></select></p>
		<p class="dv-form-wide"><label for="dv-description">توضیح کوتاه <span aria-hidden="true">*</span></label><textarea id="dv-description" name="description" rows="5" required><?php echo esc_textarea( $value( 'description' ) ); ?></textarea></p>
		<p class="dv-form-wide"><label for="dv-pitch-deck">Pitch Deck <?php if ( ! $request ) : ?><span aria-hidden="true">*</span><?php endif; ?></label><input id="dv-pitch-deck" name="pitch_deck" type="file" accept=".pdf,.ppt,.pptx" <?php echo $request ? '' : 'required'; ?> /><small>PDF، PPT یا PPTX — حداکثر ۲۰ مگابایت</small></p>
		<p class="dv-form-wide"><button class="btn-primary" type="submit"><?php echo esc_html( $request ? Settings::get( 'edit_request_label' ) : 'ارسال درخواست' ); ?></button></p>
	</form>
</section>
