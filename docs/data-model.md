# Data model

`wp_users` and `wp_usermeta` retain identities, credentials and role assignments. Migration `1.0.0` creates `{$prefix}dv_requests`: bigint id/user id; startup/founder/email/phone; allowlisted sector/stage; longtext description; attachment id/url; status; admin message/internal note; opaque idempotency key; created/updated timestamps. Indexed columns: `user_id`, `status`, `idempotency_key`.

This custom table avoids slow or unsafe post-meta workflow queries. Attachments use WordPress media storage, but public attachment URLs are not exposed in customer dashboards; reviewers receive a nonce-protected download endpoint after authorization.
