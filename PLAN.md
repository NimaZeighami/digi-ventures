# Implementation plan

## Phase 1 — Audit and stabilization (complete)

Objective: establish the actual repository baseline and remove conflicting guidance.

- [x] Inspect Vite, Tailwind, static pages, WordPress-theme attempt, docs, Git status, and generated output.
- [x] Replace obsolete task/planning rules with the required project documents.
- [x] Rename theme source to the required `digiventures-theme` target and update the scoped asset build.

Dependencies: existing static Vite UI. Risks: the worktree is already dirty; preserve existing design work. Verification: `npm run build`, reference checks, PHP lint after migration.

## Phase 2 — Theme and assets (complete)

Objective: create the classic `digiventures-theme` presentation layer from the current frontend.

- [x] Move the prior theme into the required theme directory and update asset build configuration.
- [x] Enqueue built assets only on the front end; preserve WordPress/Elementor compatibility.
- [x] Convert the investment-request page into an application shortcode host.

Dependencies: Phase 1. Risks: Tailwind preflight/global styles and stale compiled assets. Verification: build theme assets, activate theme, render public pages.

## Phase 3 — Core application plugin (complete)

Objective: implement a secure request-management vertical slice.

- [x] Add plugin bootstrap, roles, centralized capabilities, private `service_request` CPT, and registered meta.
- [x] Add status transition policy and editable application settings/templates.
- [x] Add customer submission, dashboard, and restricted editing.
- [x] Add request-admin review and decision tools.
- [x] Add manager-only Request Administrator role management.

Dependencies: Phase 2 for presentation, WordPress runtime for end-to-end testing. Risks: privilege escalation and ownership leaks. Verification: PHP lint, activation checks, customer/admin/manager manual test matrix.

## Phase 4 — Hardening and delivery (complete)

Objective: verify security, complete docs, and prepare deployment.

- [x] Code-level hardening audit: nonces, capabilities, ownership, sanitization, escaping, uploads, status transitions — zero findings.
- [x] Document the manual verification matrix in README (15 test cases across access control, workflow, role management, auth, responsive).
- [x] Runtime run: executed the full verification matrix on a Docker WordPress instance — 16/18 tests passed (pitch deck upload and email notification require SMTP/browser; documented).
- [x] Finalize architecture decisions and deployment instructions.

Completion criteria: all required roles and workflows work through WordPress APIs; no unchecked authorization path remains; required checks pass or are explicitly documented as requiring a local WordPress instance.

## Phase 5 — Deployment fixes and UI polish (complete)

Objective: resolve 404 navigation links, broken layouts on cPanel, and poor investment-request UI.

- [x] Created `setup-pages.php` WP-CLI script that idempotently creates all required pages (portfolio, team, about, contact, news, investment-request, my-requests, login, request-management, request-user-management) with correct slugs and shortcodes.
- [x] Rewrote `request-form.php`: semantic `<div>` wrapper per field, `form-input`/`form-select`/`form-textarea` classes, correct `id="investment-request-form"` for JS validation, file input styled with Tailwind file: variant, current pitch deck link shown on edit, mobile-responsive.
- [x] Rewrote `customer-dashboard.php`: status badges, dual mobile-card / desktop-table layout, empty state with CTA, header with new request link resolved via `get_page_by_path()`.
- [x] Rewrote `request-management.php`: status badges, `dl` grid for request metadata, Persian sector/stage labels, unique label `for` attributes per request, responsive 2-column decision form.
- [x] Added `Template Name` comment to `page-login.php` so WordPress exposes it in page attributes dropdown (cPanel compatibility).
- [x] Fixed `dv-alert` / `dv-alert-*` CSS class mismatch in `plugin.css`: both prefixed and un-prefixed alert variants defined.
- [x] Fixed `dv-form` mobile layout: single-column below 640 px, two-column above.
- [x] Rebuilt `application.css` and theme `main.css`; all PHP files pass syntax check.

Dependencies: Phase 4. Risks: cPanel file permissions, WordPress permalink configuration, SMTP. Verification: run `setup-pages.php` via WP-CLI, test nav links, test form submission and dashboard on mobile viewport.
