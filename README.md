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
| `login` | `[dv_login]` |

Use WordPress’s standard Login and Lost Password URLs. Configure application copy under **DigiVentures → Settings**. Production password-reset and notification mail require a correctly configured WordPress mail/SMTP provider.

## Commands

```bash
cd frontend && npm run dev
cd frontend && npm run build
cd frontend && npm run build:theme
find wordpress-theme wordpress-plugin -name '*.php' -print0 | xargs -0 -n1 php -l
```

## Deployment

```bash
cd frontend && npm run build:theme
```

Copy `wordpress-theme/digiventures-theme` to `wp-content/themes/` and `wordpress-plugin/digiventures-core` to `wp-content/plugins/`. Activate both from WordPress admin. Set the front page in Reading Settings. Create pages per the shortcode table above.

## Manual verification matrix

Run these tests after deployment on a fresh WordPress instance.

### Access control

| Test | Steps | Expected |
|---|---|---|
| Unauthenticated form | Visit `/investment-request` | Sees login prompt, not the form |
| Unauthenticated POST | Submit `admin-post.php` directly with `action=dv_core_submit_request` | 403 die or redirect |
| Nonce rejection | Log in as customer, tamper `dv_core_nonce` value on form submit | Action rejected, error notice |
| Wrong capability | Log in as subscriber (no role), visit shortcode pages | Sees "forbidden" message |
| Ownership isolation | User A creates a request; User B visits `/?request_id=N` | Sees forbidden (not User A's request) |
| Edit past submission | Customer edits a request after admin set it to `under_review` | Forbidden (only `draft`/`needs_revision` editable) |
| Protected admin | Manager promotes a native `administrator` user | Error; `manage_options` users are protected |

### Request workflow

| Test | Steps | Expected |
|---|---|---|
| Customer submission | Fill form, upload PDF pitch deck, submit | Request created, status `submitted`, redirect with success notice |
| Customer dashboard | Visit `/my-requests` | Lists only own requests with correct status labels |
| Request admin review | Log in as request admin, visit `/request-management` | Sees all requests, can filter by status |
| Status transition | Admin sets request to `accepted` with a message | Status changes, customer-visible message saved |
| Email notification | Admin decision on a request with valid email | `wp_mail` called (check mail log) |
| Pitch deck download | Admin clicks Pitch Deck link in management view | PDF/PPT downloads correctly |

### Role management

| Test | Steps | Expected |
|---|---|---|
| Manager promotes user | Manager promotes a customer to request admin | User gains `request_admin` role |
| Manager demotes user | Manager demotes a request admin back to customer | User loses `request_admin` role |
| Non-manager access | Request admin visits `/request-user-management` | Sees forbidden (no `dv_manage_request_users`) |

### Authentication

| Test | Steps | Expected |
|---|---|---|
| Login page | Visit login shortcode page | WP login form rendered with custom title/description |
| Password reset | Click "Forgot password" link | Redirects to core `wp-login.php?action=lostpassword` |

### Responsive

| Test | Steps | Expected |
|---|---|---|
| Mobile nav | Resize viewport < 1280px | Hamburger menu visible, desktop nav hidden |
| Form on mobile | Submit request on small screen | Layout stacks vertically, no overflow |
