<?php
// $requests, $selected_status, $statuses, $status_labels, $admin_statuses, $sectors, $stages
// are provided by Management_Renderer. Safety fallbacks below.
if ( ! isset( $statuses ) )       { $statuses       = \DV_Core\Request_Type::statuses(); }
if ( ! isset( $status_labels ) )  { $status_labels  = \DV_Core\Request_Type::status_labels_fa(); }
if ( ! isset( $admin_statuses ) ) { $admin_statuses = \DV_Core\Request_Type::admin_statuses(); }
if ( ! isset( $sectors ) )        { $sectors        = \DV_Core\Request_Type::sectors(); }
if ( ! isset( $stages ) )         { $stages         = \DV_Core\Request_Type::stages(); }
?>
<section class="dv-app-panel" aria-labelledby="dv-management-title">
	<h1 id="dv-management-title" class="text-2xl font-bold text-brand-darkText mb-6">مدیریت درخواست‌ها</h1>

	<form class="dv-filter" method="get">
		<label class="text-sm font-medium text-brand-darkText" for="dv-status-filter">فیلتر وضعیت:</label>
		<select class="form-select !py-2 !w-auto" id="dv-status-filter" name="status">
			<option value="">همه</option>
			<?php foreach ( $statuses as $key => $label ) : ?>
			<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $selected_status, $key ); ?>><?php echo esc_html( $label ); ?></option>
			<?php endforeach; ?>
		</select>
		<button type="submit" class="btn-primary !py-2 !px-4 text-sm">اعمال فیلتر</button>
		<?php if ( $selected_status ) : ?>
		<a href="<?php echo esc_url( remove_query_arg( 'status' ) ); ?>" class="text-sm text-brand-muted hover:text-brand-green transition-colors">× حذف فیلتر</a>
		<?php endif; ?>
	</form>

	<?php if ( empty( $requests ) ) : ?>
	<div class="dv-empty-state mt-6">
		<p class="text-sm">درخواستی با این وضعیت یافت نشد.</p>
	</div>
	<?php endif; ?>

	<div class="flex flex-col gap-5 mt-4">
	<?php foreach ( $requests as $request ) :
		$status     = \DV_Core\Request_Type::get_status( $request->ID );
		$deck_id    = absint( get_post_meta( $request->ID, '_dv_pitch_deck_id', true ) );
		$raw_sector = get_post_meta( $request->ID, '_dv_sector', true );
		$raw_stage  = get_post_meta( $request->ID, '_dv_stage', true );
		?>
	<article class="dv-request-card" aria-label="درخواست #<?php echo esc_attr( $request->ID ); ?>">
		<header class="flex items-start justify-between gap-4 mb-4 flex-wrap">
			<div>
				<h2 class="text-lg font-semibold text-brand-darkText">
					<?php echo esc_html( get_the_title( $request ) ); ?>
					<small class="text-xs font-normal text-brand-muted mr-1">#<?php echo esc_html( $request->ID ); ?></small>
				</h2>
				<p class="text-xs text-brand-muted mt-0.5"><?php echo esc_html( get_the_date( 'j F Y', $request ) ); ?></p>
			</div>
			<span class="dv-status-badge dv-status-<?php echo esc_attr( $status ); ?> shrink-0">
				<?php echo esc_html( $status_labels[ $status ] ?? $status ); ?>
			</span>
		</header>

		<dl class="grid grid-cols-2 gap-x-6 gap-y-3 mb-4 sm:grid-cols-3">
			<div>
				<dt class="text-xs font-semibold text-brand-muted mb-0.5">بنیان‌گذار</dt>
				<dd class="text-sm text-brand-darkText"><?php echo esc_html( get_post_meta( $request->ID, '_dv_founder_name', true ) ); ?></dd>
			</div>
			<div>
				<dt class="text-xs font-semibold text-brand-muted mb-0.5">ایمیل</dt>
				<dd class="text-sm text-brand-darkText" dir="ltr"><?php echo esc_html( get_post_meta( $request->ID, '_dv_email', true ) ); ?></dd>
			</div>
			<div>
				<dt class="text-xs font-semibold text-brand-muted mb-0.5">تلفن</dt>
				<dd class="text-sm text-brand-darkText" dir="ltr"><?php echo esc_html( get_post_meta( $request->ID, '_dv_phone', true ) ); ?></dd>
			</div>
			<div>
				<dt class="text-xs font-semibold text-brand-muted mb-0.5">حوزه فعالیت</dt>
				<dd class="text-sm text-brand-darkText"><?php echo esc_html( $sectors[ $raw_sector ] ?? $raw_sector ); ?></dd>
			</div>
			<div>
				<dt class="text-xs font-semibold text-brand-muted mb-0.5">مرحله</dt>
				<dd class="text-sm text-brand-darkText"><?php echo esc_html( $stages[ $raw_stage ] ?? $raw_stage ); ?></dd>
			</div>
			<?php if ( $deck_id ) : ?>
			<div>
				<dt class="text-xs font-semibold text-brand-muted mb-0.5">Pitch Deck</dt>
				<dd class="text-sm"><a href="<?php echo esc_url( wp_get_attachment_url( $deck_id ) ); ?>" target="_blank" rel="noopener" class="text-brand-green hover:text-brand-dark font-medium transition-colors">دانلود &darr;</a></dd>
			</div>
			<?php endif; ?>
		</dl>

		<div class="border-t border-gray-100 pt-4 mb-4">
			<p class="text-xs font-semibold text-brand-muted mb-1">توضیحات</p>
			<p class="text-sm text-brand-darkText leading-relaxed"><?php echo nl2br( esc_html( get_post_meta( $request->ID, '_dv_description', true ) ) ); ?></p>
		</div>

		<form class="border-t border-gray-100 pt-4" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
			<?php wp_nonce_field( 'dv_core_update_status', 'dv_core_nonce' ); ?>
			<input type="hidden" name="action" value="dv_core_update_status" />
			<input type="hidden" name="request_id" value="<?php echo esc_attr( $request->ID ); ?>" />

			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label class="form-label" for="dv-status-<?php echo esc_attr( $request->ID ); ?>">وضعیت جدید</label>
					<select class="form-select" id="dv-status-<?php echo esc_attr( $request->ID ); ?>" name="status">
						<?php foreach ( $admin_statuses as $candidate ) : ?>
						<option value="<?php echo esc_attr( $candidate ); ?>" <?php selected( $status, $candidate ); ?>>
							<?php echo esc_html( $statuses[ $candidate ] ?? $candidate ); ?>
						</option>
						<?php endforeach; ?>
					</select>
				</div>
				<div>
					<label class="form-label" for="dv-msg-<?php echo esc_attr( $request->ID ); ?>">پیام قابل مشاهده برای مشتری</label>
					<textarea class="form-textarea" id="dv-msg-<?php echo esc_attr( $request->ID ); ?>" name="admin_message" rows="3"><?php echo esc_textarea( get_post_meta( $request->ID, '_dv_customer_response', true ) ); ?></textarea>
				</div>
				<div class="sm:col-span-2">
					<label class="form-label" for="dv-note-<?php echo esc_attr( $request->ID ); ?>">یادداشت داخلی</label>
					<textarea class="form-textarea" id="dv-note-<?php echo esc_attr( $request->ID ); ?>" name="internal_note" rows="2"><?php echo esc_textarea( get_post_meta( $request->ID, '_dv_internal_note', true ) ); ?></textarea>
				</div>
			</div>

			<div class="mt-4">
				<button type="submit" class="btn-primary">ذخیره تصمیم</button>
			</div>
		</form>
	</article>
	<?php endforeach; ?>
	</div>
</section>
