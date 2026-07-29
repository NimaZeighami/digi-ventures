<?php
// $requests, $dashboard_url, $form_url, $status_labels provided by Dashboard_Renderer.
if ( ! isset( $status_labels ) ) { $status_labels = \DV_Core\Request_Type::status_labels_fa(); }
if ( ! isset( $form_url ) )      { $form_url      = \DV_Core\Page_Resolver::url( 'investment-request' ); }
?>
<section class="dv-app-panel" aria-labelledby="dv-dashboard-title">
	<div class="flex items-start justify-between gap-4 mb-6 flex-wrap">
		<div>
			<h1 id="dv-dashboard-title" class="text-2xl font-bold text-brand-darkText">درخواست‌های من</h1>
			<?php
			$welcome = \DV_Core\Settings::get( 'dashboard_welcome' );
			if ( $welcome ) :
				?>
			<p class="mt-1 text-sm text-brand-muted"><?php echo esc_html( $welcome ); ?></p>
			<?php endif; ?>
		</div>
		<a href="<?php echo esc_url( $form_url ); ?>" class="btn-primary shrink-0">
			+ ثبت درخواست جدید
		</a>
	</div>

	<?php if ( empty( $requests ) ) : ?>
	<div class="dv-empty-state">
		<p class="text-lg font-semibold text-brand-darkText mb-2">هنوز درخواستی ثبت نشده</p>
		<p class="text-sm text-brand-muted mb-6"><?php echo esc_html( \DV_Core\Settings::get( 'empty_requests' ) ); ?></p>
		<a href="<?php echo esc_url( $form_url ); ?>" class="btn-primary inline-flex">ثبت اولین درخواست</a>
	</div>
	<?php else : ?>

	<?php /* Mobile card list — shown below md breakpoint */ ?>
	<div class="flex flex-col gap-4 md:hidden">
		<?php foreach ( $requests as $request ) :
			$status = \DV_Core\Request_Type::get_status( $request->ID );
			$can_edit = \DV_Core\Request_Type::customer_can_edit_status( $status );
			$response = get_post_meta( $request->ID, '_dv_customer_response', true );
			?>
		<article class="rounded-xl border border-gray-100 bg-brand-light p-4">
			<div class="flex items-start justify-between gap-2 mb-3">
				<h2 class="text-sm font-semibold text-brand-darkText"><?php echo esc_html( get_the_title( $request ) ); ?></h2>
				<span class="dv-status-badge dv-status-<?php echo esc_attr( $status ); ?> shrink-0">
					<?php echo esc_html( $status_labels[ $status ] ?? $status ); ?>
				</span>
			</div>
			<?php if ( $response ) : ?>
			<p class="text-xs text-brand-muted leading-relaxed mb-3"><?php echo esc_html( $response ); ?></p>
			<?php endif; ?>
			<?php if ( $can_edit ) : ?>
			<a href="<?php echo esc_url( add_query_arg( 'request_id', $request->ID, $dashboard_url ) ); ?>" class="text-xs font-semibold text-brand-green hover:text-brand-dark transition-colors">
				<?php echo esc_html( \DV_Core\Settings::get( 'edit_request_label' ) ); ?> &larr;
			</a>
			<?php endif; ?>
		</article>
		<?php endforeach; ?>
	</div>

	<?php /* Desktop table — shown from md breakpoint */ ?>
	<div class="hidden md:block overflow-x-auto">
		<table class="dv-table" aria-label="لیست درخواست‌ها">
			<thead>
				<tr>
					<th scope="col">درخواست</th>
					<th scope="col">وضعیت</th>
					<th scope="col">پاسخ</th>
					<th scope="col">عملیات</th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ( $requests as $request ) :
					$status = \DV_Core\Request_Type::get_status( $request->ID );
					$can_edit = \DV_Core\Request_Type::customer_can_edit_status( $status );
					$response = get_post_meta( $request->ID, '_dv_customer_response', true );
					?>
				<tr>
					<td class="font-medium text-brand-darkText"><?php echo esc_html( get_the_title( $request ) ); ?></td>
					<td>
						<span class="dv-status-badge dv-status-<?php echo esc_attr( $status ); ?>">
							<?php echo esc_html( $status_labels[ $status ] ?? $status ); ?>
						</span>
					</td>
					<td class="text-brand-muted max-w-xs truncate"><?php echo esc_html( $response ); ?></td>
					<td>
						<?php if ( $can_edit ) : ?>
						<a href="<?php echo esc_url( add_query_arg( 'request_id', $request->ID, $dashboard_url ) ); ?>" class="text-sm font-semibold text-brand-green hover:text-brand-dark transition-colors">
							<?php echo esc_html( \DV_Core\Settings::get( 'edit_request_label' ) ); ?>
						</a>
						<?php else : ?>
						<span class="text-xs text-brand-muted">—</span>
						<?php endif; ?>
					</td>
				</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	</div>

	<?php endif; ?>
</section>
