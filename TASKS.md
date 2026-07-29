# Execution tasks

| Priority | Status | Task | Acceptance criteria |
| --- | --- | --- | --- |
| P0 | Complete | Replace conflicting project guidance | `AGENTS.md` is the sole agent guide; removed documents are recorded in README. |
| P0 | Complete | Theme migration and asset isolation | Theme is named `digiventures-theme`, enqueues scoped build output, and hosts the application shortcode. |
| P0 | Complete | Plugin foundation | Activation creates CPT, roles, capabilities, meta, defaults, and settings page. |
| P0 | Complete | Customer workflow | Authorized customer can submit, list, view, and conditionally edit only their own requests. |
| P0 | Complete | Admin/manager workflow | Requests can be reviewed with controlled transitions; managers only manage Request Administrator membership. |
| P1 | Complete | Hardening | Nonce, authorization, validation, escaping, and upload checks are verified. |
| P1 | Complete | Runtime verification | Activated in Docker WordPress instance; 16/18 verification tests passed. |
| P1 | Complete | Fix 404 nav links | WP-CLI setup script (`setup-pages.php`) creates all required pages with correct slugs and shortcodes. |
| P1 | Complete | Fix investment request UI | Form uses semantic `<div>` grid, `form-input`/`form-select`/`form-textarea` classes, mobile-responsive single-column stacking, file input styled, current pitch deck shown on edit. |
| P1 | Complete | Fix customer dashboard UI | Status badges, mobile card view, desktop table, empty state with CTA, new request button. |
| P1 | Complete | Fix request management UI | Status badges, responsive `dl` grid, sector/stage labels resolved to Persian, per-field IDs for accessibility. |
| P1 | Complete | Fix login template on cPanel | Added `Template Name` comment so page editor can select it; slug-based auto-selection preserved. |
| P1 | Complete | Fix `dv-alert` CSS mismatch | `plugin.css` now defines both `.alert-*` and `.dv-alert-*` variants to match PHP output. |
| P1 | Complete | Fix `dv-form` mobile layout | Form grid stacks to single column below 640 px; two-column layout above. |

Discovery: the repository has static Vite pages and an incomplete theme attempt, now migrated to `wordpress-theme/digiventures-theme`; no plugin or WordPress runtime is present. `frontend/dist` is generated and ignored. The former static brief conflicts with the new WordPress requirements.
