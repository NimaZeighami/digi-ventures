# DigiVentures contributor guide

## Repository map

- `frontend/` is the visual reference; do not treat its client-side forms as the production security boundary.
- `SPECIFICATION.md` is the application contract.
- `wordpress/wp-content/plugins/digiventures-application/` is the deployable product.
- `docs/` records discovery, decisions, contracts, and release evidence.

## Boundaries

Elementor and WordPress pages own editable presentation. The DigiVentures plugin owns roles, authentication integration, validation, uploads, persistence, authorization, notifications, migrations, and diagnostics. Never place application logic in a theme, Elementor HTML widget, Elementor JSON, browser-only code, or WordPress core.

## Required practices

- Target PHP 8.1+ and WordPress 6.4+; use namespaces, WordPress APIs, and WordPress coding standards.
- Authenticate, check a capability, verify a nonce, validate ownership and server-side input on every state change.
- Use `$wpdb->prepare()` for dynamic SQL; sanitize inputs and escape all HTML/URLs/attributes at output.
- Use WordPress users and password APIs only. Never store a password, secret, or role selected by a browser request.
- Validate uploads by extension, MIME, WordPress file type, and 20 MiB size; never execute uploads.
- Use repeat-safe migrations and installers. Do not make direct production schema changes or overwrite user page content silently.
- Keep normal users out of wp-admin and hide their toolbar; preserve administrator login and reset routes.
- Log non-sensitive failures through the plugin logger. Never commit production secrets or debug logs.
- Do not invent Elementor template JSON. Register plugin widgets and verify templates in a real Elementor install before exporting them.

## Verification and definition of done

Run `php -l` on every PHP source file, `scripts/validate-release.sh`, and `scripts/package-plugin.sh` before delivery. Run WordPress/Elementor integration and browser checks only in the documented disposable environment; label anything not run as unverified. A change is done only when its docs, relevant tests, migration impact, release package, and security review are updated.
