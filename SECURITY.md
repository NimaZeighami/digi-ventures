# Security review checklist

- [x] REST mutations require logged-in user, capability, WordPress REST nonce, and same-origin cookie authentication.
- [x] Request reads enforce owner scope unless `review_requests` is held.
- [x] Status transitions are service-side allowlists; browser status values are untrusted.
- [x] Registration always assigns `customer`; it cannot accept role/capability input.
- [x] Uploads use WordPress handling plus extension, MIME and 20 MiB checks.
- [x] Dynamic SQL uses `$wpdb->prepare()` and fixed column lists.
- [x] Rendered request/user data are escaped.
- [x] Login throttle is transient-based and generic failure messages avoid account enumeration.
- [x] Contact messages require a public nonce, strict validation, a honeypot, per-IP rate limiting, and a fixed server-side recipient.
- [x] Redirects use `wp_safe_redirect`; wp-admin protection exempts administrators and reset actions.
- [x] Logs omit passwords, tokens, full request contents and attachments.

Manual review still required in a live WordPress environment: upload MIME behavior of the host, email deliverability, REST nonce cookie flow, Elementor editor output, and plugin interaction with security/cache plugins.
