# DigiVentures engineering guide

## Purpose

This repository delivers the DigiVentures Persian-first WordPress site and its private investment-request application. Public marketing pages retain the Vite/Tailwind design; authenticated request workflows are implemented by the `digiventures-core` plugin.

## Structure

- `frontend/` — Vite/Tailwind design source and static visual reference.
- `wordpress-theme/digiventures-theme/` — classic WordPress presentation theme.
- `wordpress-plugin/digiventures-core/` — roles, request workflow, settings, front-end application screens, and authorization.
- Root documentation — `README.md`, `PLAN.md`, `ARCHITECTURE.md`, and `TASKS.md` only.

## Boundaries

- Theme: WordPress setup, templates, menus, public-page presentation, and enqueueing built assets.
- Plugin: all business logic, roles/capabilities, request data, forms, workflows, settings, customer dashboard, and management UI.
- Elementor may place public content or plugin shortcodes. Do not use it for dashboards, forms, request management, authentication behavior, or role management.
- Do not modify WordPress core, `node_modules`, vendor code, or generated `dist` output by hand.

## Security and authorization

- Use capabilities, never scattered role-name checks.
- Every state-changing action requires a nonce, authenticated user, capability check, and server-side validation.
- Customers may access only requests whose `post_author` is their own ID.
- Customers may edit only `draft` and `needs_revision` requests.
- Request managers may grant/revoke only `request_admin`; never assign/remove native `administrator`, and never modify protected administrators.
- Sanitize input, allowlist statuses/actions/placeholders, use `esc_*` at output, and do not expose request data through public REST endpoints.

## Coding standards

- PHP follows WordPress Coding Standards, uses the `DV_Core` namespace or `dv_core_` prefix, and prevents direct access with `ABSPATH` checks.
- Keep classes focused and put templates in `templates/`; no business logic in theme files.
- Use translation-ready strings and semantic, accessible Persian RTL markup.
- Tailwind belongs to the front end. Keep preflight disabled and application/theme styles scoped so WordPress admin and Elementor are unaffected.

## Commands

```bash
cd frontend && npm install
cd frontend && npm run dev
cd frontend && npm run build
cd frontend && npm run build:theme
cd frontend && npm run build:plugin
find wordpress-theme wordpress-plugin -name '*.php' -print0 | xargs -0 -n1 php -l
# Docker runtime verification:
cd docker && docker compose up -d && docker compose exec wp-cli sh -c 'wp core install --url="http://localhost:8080" --title="DigiVentures" --admin_user="admin" --admin_password="admin" --admin_email="admin@example.com" --skip-email && wp theme activate digiventures-theme && wp plugin activate digiventures-core'
```

## Definition of done

Changes include appropriate tests or manual verification steps, pass available builds/syntax checks, preserve authorization boundaries, update `PLAN.md` and `TASKS.md`, and document architecture changes in `ARCHITECTURE.md`.
