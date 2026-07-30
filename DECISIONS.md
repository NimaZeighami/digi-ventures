# Decisions

1. **Custom table for requests.** The request workflow, ownership filters, status index, internal notes and reporting access are transactional application data; a narrow custom table is simpler and safer than post meta.
2. **WordPress users, not a second users table.** This preserves password hashing, sessions, reset tokens and administrator recovery.
3. **Elementor Free is optional, not mandatory.** Widgets integrate when installed; shortcodes permit secure operation and Setup without it. No unverified Elementor JSON is generated.
4. **Pages use shortcodes initially.** This makes setup reliable and page content editable. A site owner can place the registered widgets in Elementor and save verified layouts.
5. **Application roles use capabilities.** Role names are display/grouping aids; every sensitive operation checks a specific capability.
6. **Email uses `wp_mail`.** Template subjects/bodies are configurable. Production SMTP configuration remains an administrator/hosting responsibility.
