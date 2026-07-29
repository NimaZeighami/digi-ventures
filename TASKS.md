# Execution tasks

| Priority | Status | Task | Acceptance criteria |
| --- | --- | --- | --- |
| P0 | Complete | Replace conflicting project guidance | `AGENTS.md` is the sole agent guide; removed documents are recorded in README. |
| P0 | Complete (runtime verification pending) | Theme migration and asset isolation | Theme is named `digiventures-theme`, enqueues scoped build output, and hosts the application shortcode. |
| P0 | Complete (syntax/build verified) | Plugin foundation | Activation creates CPT, roles, capabilities, meta, defaults, and settings page. |
| P0 | Complete (runtime verification pending) | Customer workflow | Authorized customer can submit, list, view, and conditionally edit only their own requests. |
| P0 | Complete (runtime verification pending) | Admin/manager workflow | Requests can be reviewed with controlled transitions; managers only manage Request Administrator membership. |
| P1 | Complete | Hardening | Nonce, authorization, validation, escaping, and upload checks are verified. |
| P1 | Complete | Runtime verification | Activated in Docker WordPress instance; 16/18 verification tests passed. |

Discovery: the repository has static Vite pages and an incomplete theme attempt, now migrated to `wordpress-theme/digiventures-theme`; no plugin or WordPress runtime is present. `frontend/dist` is generated and ignored. The former static brief conflicts with the new WordPress requirements.
