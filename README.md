# DigiVentures

Persian RTL corporate-venture website and WordPress investment-request application.

## Requirements

- PHP 7.4+ and WordPress 6.0+.
- Node.js 18+ and npm for frontend assets.
- A local WordPress installation for application verification.

## Setup

```bash
cd frontend
npm install
npm run build:theme
```

Copy `wordpress-theme/digiventures-theme` to `wp-content/themes/` and `wordpress-plugin/digiventures-core` to `wp-content/plugins/`. Activate both from WordPress administration.

Create pages and place these shortcodes:

| Slug | Shortcode |
| --- | --- |
| `investment-request` | `[dv_request_form]` |
| `my-requests` | `[dv_customer_dashboard]` |
| `request-management` | `[dv_request_management]` |
| `request-user-management` | `[dv_request_user_management]` |

Use WordPress’s standard Login and Lost Password URLs. Configure application copy under **DigiVentures → Settings**. Production password-reset and notification mail require a correctly configured WordPress mail/SMTP provider.

## Commands

```bash
cd frontend && npm run dev
cd frontend && npm run build
cd frontend && npm run build:theme
find wordpress-theme wordpress-plugin -name '*.php' -print0 | xargs -0 -n1 php -l
```

## Deployment and verification

Build assets before deploying, activate the plugin before assigning application users, and set the intended front page in WordPress Reading settings. Verify customer ownership, request transitions, role-management restrictions, password reset links, mail delivery, and responsive rendering using the checklist in `PLAN.md`.

## Documentation cleanup

Removed `CURRENT-TASK.md`, the old static-only `PLAN.md`, and `PRROJECT-RULES.md`: each conflicted with the current WordPress application requirements and was unreferenced. The stale `wordpress-theme/digiventures.zip` archive (including macOS metadata) and ignored `frontend/dist` output were moved to Trash; the source theme was retained and renamed to `digiventures-theme`.
