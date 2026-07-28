<section class="dv-app-panel">
	<h1>مدیریت مدیران درخواست</h1><p>فقط نقش «مدیر درخواست» قابل اعطا یا حذف است. نقش مدیر اصلی وردپرس در این بخش محافظت شده است.</p>
	<table class="dv-table"><thead><tr><th>کاربر</th><th>ایمیل</th><th>نقش برنامه</th><th>عملیات</th></tr></thead><tbody>
	<?php foreach ( $users as $user ) : if ( Roles::is_protected_administrator( $user ) ) { continue; } $is_admin = in_array( Roles::ADMIN, (array) $user->roles, true ); ?>
		<tr><td><?php echo esc_html( $user->display_name ); ?></td><td><?php echo esc_html( $user->user_email ); ?></td><td><?php echo esc_html( $is_admin ? 'مدیر درخواست' : 'کاربر درخواست' ); ?></td><td><form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post"><?php wp_nonce_field( 'dv_core_update_request_role', 'dv_core_nonce' ); ?><input type="hidden" name="action" value="dv_core_update_request_role" /><input type="hidden" name="user_id" value="<?php echo esc_attr( $user->ID ); ?>" /><input type="hidden" name="operation" value="<?php echo esc_attr( $is_admin ? 'demote' : 'promote' ); ?>" /><button type="submit"><?php echo esc_html( $is_admin ? 'حذف نقش مدیر درخواست' : 'ارتقا به مدیر درخواست' ); ?></button></form></td></tr>
	<?php endforeach; ?>
	</tbody></table>
</section>
