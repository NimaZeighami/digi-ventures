# Implementation plan

## Phase 1 — Audit and stabilization (complete)

Objective: establish the actual repository baseline and remove conflicting guidance.

- [x] Inspect Vite, Tailwind, static pages, WordPress-theme attempt, docs, Git status, and generated output.
- [x] Replace obsolete task/planning rules with the required project documents.
- [x] Rename theme source to the required `digiventures-theme` target and update the scoped asset build.

Dependencies: existing static Vite UI. Risks: the worktree is already dirty; preserve existing design work. Verification: `npm run build`, reference checks, PHP lint after migration.

## Phase 2 — Theme and assets (in progress)

Objective: create the classic `digiventures-theme` presentation layer from the current frontend.

- [x] Move the prior theme into the required theme directory and update asset build configuration.
- [x] Enqueue built assets only on the front end; preserve WordPress/Elementor compatibility.
- [x] Convert the investment-request page into an application shortcode host.

Dependencies: Phase 1. Risks: Tailwind preflight/global styles and stale compiled assets. Verification: build theme assets, activate theme, render public pages.

## Phase 3 — Core application plugin

Objective: implement a secure request-management vertical slice.

- [x] Add plugin bootstrap, roles, centralized capabilities, private `service_request` CPT, and registered meta.
- [x] Add status transition policy and editable application settings/templates.
- [x] Add customer submission, dashboard, and restricted editing.
- [x] Add request-admin review and decision tools.
- [x] Add manager-only Request Administrator role management.

Dependencies: Phase 2 for presentation, WordPress runtime for end-to-end testing. Risks: privilege escalation and ownership leaks. Verification: PHP lint, activation checks, customer/admin/manager manual test matrix.

## Phase 4 — Hardening and delivery

Objective: verify security, complete docs, and prepare deployment.

- [ ] Test nonce, ownership, status, and protected-admin denial paths.
- [ ] Verify password-reset link behavior and responsive layouts.
- [ ] Finalize README, architecture decisions, and deployment instructions.

Completion criteria: all required roles and workflows work through WordPress APIs; no unchecked authorization path remains; required checks pass or are explicitly documented as requiring a local WordPress instance.
