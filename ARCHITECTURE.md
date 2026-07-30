# Architecture

The product consists of the `digiventures-application` plugin and the `digiventures-hello-child` presentation theme, whose parent is Hello Elementor. It has no Composer/runtime Node dependency. WordPress stores users and credentials; a plugin-owned `{$wpdb->prefix}dv_requests` table stores workflow-centric investment submissions.

The child theme supplies a clean, RTL, full-width Canvas page template. The plugin renders the complete inspected frontend through trusted reference templates and replaces business forms with plugin-owned secure forms before output. Elementor can open every managed page and the DigiVentures Application widget is available for dynamic views. No guessed Elementor JSON is shipped.

`Bootstrap` composes roles, migrations, setup, HTTP handlers, rendering, authentication redirects, and diagnostics. Form posts use registered REST routes with WordPress nonces. Server services perform all authorization, validation, transitions, idempotency and upload checks. Static presentation assets are packaged in the plugin and enqueued only for plugin pages/widgets.

Target platform: WordPress 6.4+, PHP 8.1+, MySQL 5.7+/MariaDB 10.4+, Hello Elementor parent theme, DigiVentures Hello Child, and Elementor Free. The verified disposable environment used WordPress 6.8.2, PHP 8.1, Hello Elementor 3.4.9, Elementor 4.2.1, and MariaDB 10.11.
