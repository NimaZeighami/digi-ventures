# cPanel deployment

1. Point the domain to the WordPress document root and enable HTTPS.
2. Select PHP 8.1 or newer; enable `mysqli`, `json`, `mbstring`, `curl`, `fileinfo`, `openssl`, and `zip`.
3. Set `memory_limit` to at least 256M, `upload_max_filesize` and `post_max_size` to at least 24M, and an appropriate `max_execution_time` (60s+).
4. Install WordPress 6.4+, Hello Elementor, and Elementor Free.
5. Under Appearance → Themes → Add New → Upload Theme, upload `digiventures-hello-child.zip`, install it, and activate **DigiVentures Hello Child**.
6. Under Plugins → Add New → Upload Plugin, upload `digiventures-application.zip`. When upgrading 1.0, click **Replace current with uploaded**. Activate the plugin.
7. Open DigiVentures → Setup and click **Run or retry setup**. This repairs the earlier placeholder pages, assigns the Canvas template, sets the static homepage, configures `/%postname%/`, and flushes rewrites.
8. Use the exact generated links shown at the bottom of the Setup screen to test Home, Login, Register, Investment Request, My Requests, Request Management, and User Management.
9. Configure SMTP through a vetted provider/plugin and test contact plus accept/reject notifications.
10. Confirm uploads directories are writable (directories 755, files 644 in typical cPanel setups), inspect WordPress/PHP logs, and clear LiteSpeed/CDN caches.
11. Take database and files backups before every upgrade. For rollback: deactivate the new plugin, restore the preceding ZIP/theme, activate them, and restore database backup only if the migration failed. For a fatal error, rename the plugin folder in File Manager, then recover via wp-admin.

No shell, Composer, Node.js, Tailwind, or Vite is required on the host. Use a real server cron only if WP-Cron is disabled; this release has no background-worker requirement.
