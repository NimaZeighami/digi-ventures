<?php
// $request_id, $sectors, $stages are provided by Form_Renderer.
$request = $request_id ? get_post( $request_id ) : null;
$value   = static function ( $key ) use ( $request_id ) {
	return $request_id ? (string) get_post_meta( $request_id, '_dv_' . $key, true ) : '';
};
// Safety fallbacks in case template is included without renderer.
if ( ! isset( $sectors ) ) { $sectors = \DV_Core\Request_Type::sectors(); }
if ( ! isset( $stages ) )  { $stages  = \DV_Core\Request_Type::stages(); }
?>
<section class="dv-app-panel" aria-labelledby="dv-request-title">
	<h1 id="dv-request-title" class="text-2xl font-bold text-brand-darkText mb-2"><?php echo esc_html( \DV_Core\Settings::get( 'request_form_title' ) ); ?></h1>
	<?php
	$instructions = \DV_Core\Settings::get( 'request_form_instructions' );
	if ( $instructions ) :
		?>
	<p class="text-sm text-brand-muted mb-6 leading-relaxed"><?php echo esc_html( $instructions ); ?></p>
	<?php endif; ?>

	<form id="investment-request-form" class="dv-form" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" enctype="multipart/form-data">
		<?php wp_nonce_field( $request ? 'dv_core_update_request' : 'dv_core_submit_request', 'dv_core_nonce' ); ?>
		<input type="hidden" name="action" value="<?php echo esc_attr( $request ? 'dv_core_update_request' : 'dv_core_submit_request' ); ?>" />
		<?php if ( $request ) : ?>
		<input type="hidden" name="request_id" value="<?php echo esc_attr( $request_id ); ?>" />
		<?php endif; ?>

		<div>
			<label class="form-label" for="dv-startup-name">نام استارتاپ <span class="text-red-500" aria-hidden="true">*</span></label>
			<input class="form-input" id="dv-startup-name" name="startup_name" required value="<?php echo esc_attr( $value( 'startup_name' ) ); ?>" placeholder="مثال: دیجی‌کالا" />
		</div>

		<div>
			<label class="form-label" for="dv-founder-name">نام و نام خانوادگی <span class="text-red-500" aria-hidden="true">*</span></label>
			<input class="form-input" id="dv-founder-name" name="founder_name" autocomplete="name" required value="<?php echo esc_attr( $value( 'founder_name' ) ); ?>" />
		</div>

		<div>
			<label class="form-label" for="dv-email">ایمیل <span class="text-red-500" aria-hidden="true">*</span></label>
			<input class="form-input" id="dv-email" name="email" type="email" dir="ltr" autocomplete="email" required value="<?php echo esc_attr( $value( 'email' ) ); ?>" placeholder="name@example.com" />
		</div>

		<div>
			<label class="form-label" for="dv-phone">شماره تماس <span class="text-red-500" aria-hidden="true">*</span></label>
			<input class="form-input" id="dv-phone" name="phone" type="tel" dir="ltr" autocomplete="tel" required value="<?php echo esc_attr( $value( 'phone' ) ); ?>" placeholder="09xxxxxxxxx" />
		</div>

		<div>
			<label class="form-label" for="dv-sector">حوزه فعالیت <span class="text-red-500" aria-hidden="true">*</span></label>
			<select class="form-select" id="dv-sector" name="sector" required>
				<option value="">انتخاب کنید</option>
				<?php foreach ( $sectors as $key => $label ) : ?>
				<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $value( 'sector' ), $key ); ?>><?php echo esc_html( $label ); ?></option>
				<?php endforeach; ?>
			</select>
		</div>

		<div>
			<label class="form-label" for="dv-stage">مرحله کسب‌وکار <span class="text-red-500" aria-hidden="true">*</span></label>
			<select class="form-select" id="dv-stage" name="stage" required>
				<option value="">انتخاب کنید</option>
				<?php foreach ( $stages as $key => $label ) : ?>
				<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $value( 'stage' ), $key ); ?>><?php echo esc_html( $label ); ?></option>
				<?php endforeach; ?>
			</select>
		</div>

		<div class="dv-form-wide">
			<label class="form-label" for="dv-description">توضیح کوتاه <span class="text-red-500" aria-hidden="true">*</span></label>
			<textarea class="form-textarea" id="dv-description" name="description" rows="5" required placeholder="در چند جمله کسب‌وکار خود را توضیح دهید..."><?php echo esc_textarea( $value( 'description' ) ); ?></textarea>
		</div>

		<div class="dv-form-wide">
			<label class="form-label" for="dv-pitch-deck">
				Pitch Deck
				<?php if ( ! $request ) : ?>
				<span class="text-red-500" aria-hidden="true">*</span>
				<?php endif; ?>
			</label>
			<input id="dv-pitch-deck" name="pitch_deck" type="file" accept=".pdf,.ppt,.pptx" <?php echo $request ? '' : 'required'; ?>
				class="block w-full text-sm text-brand-muted file:ml-4 file:rounded-lg file:border-0 file:bg-brand-green/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-green hover:file:bg-brand-green/20" />
			<p class="mt-1.5 text-xs text-brand-muted">PDF، PPT یا PPTX — حداکثر ۲۰ مگابایت</p>
			<?php
			$existing_deck = $request ? absint( get_post_meta( $request_id, '_dv_pitch_deck_id', true ) ) : 0;
			if ( $existing_deck ) :
				?>
			<p class="mt-2 text-xs text-brand-muted">فایل فعلی: <a href="<?php echo esc_url( wp_get_attachment_url( $existing_deck ) ); ?>" target="_blank" rel="noopener" class="text-brand-green hover:underline">دانلود</a></p>
			<?php endif; ?>
		</div>

		<div class="dv-form-wide">
			<button class="btn-primary" type="submit"><?php echo esc_html( $request ? \DV_Core\Settings::get( 'edit_request_label' ) : 'ارسال درخواست' ); ?></button>
		</div>
	</form>
</section>
