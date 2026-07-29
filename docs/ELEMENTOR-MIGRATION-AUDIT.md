# Elementor Migration Audit — DigiVentures

Generated: 2026-07-29
Scope: wordpress-theme/digiventures-theme, wordpress-plugin/digiventures-core, frontend/

---

## 1. Plugin Bootstrap (`digiventures-core.php`)

**File:** `wordpress-plugin/digiventures-core/digiventures-core.php` — 72 lines

**What it does:**
- Defines 4 constants: `DV_CORE_VERSION`, `DV_CORE_FILE`, `DV_CORE_PATH`, `DV_CORE_URL`
- Loads 5 class files from `includes/` via `require_once`
- `Plugin::init()` calls `::init()` on all 5 classes
- `Plugin::activate()` calls `Roles::install()`, `Settings::install_defaults()`, `Request_Type::register()`, `flush_rewrite_rules()`
- `Plugin::deactivate()` calls `flush_rewrite_rules()`

**What is missing for Elementor:**
- No Elementor detection or conditional loading
- No Elementor integration class
- No page installation system
- No page ID resolver

---

## 2. All PHP Classes

### 2.1 `Roles` (`includes/class-roles.php`)

Constants: `CUSTOMER='request_customer'`, `ADMIN='request_admin'`, `MANAGER='request_manager'`

Capabilities per role:
- `request_customer`: `dv_submit_requests`, `dv_read_own_requests`, `dv_edit_own_requests`
- `request_admin`: `dv_read_all_requests`, `dv_manage_requests`, `dv_manage_settings`
- `request_manager`: all of admin's caps + `dv_manage_request_users`
- Native `administrator`: all 7 caps (compat only, managers cannot modify)

Key methods: `init()`, `install()` (idempotent), `ensure_customer_role()`, `is_protected_administrator()`

### 2.2 `Request_Type` (`includes/class-request-type.php`)

CPT: `service_request` — `public=false`, `show_ui=false`, `show_in_rest=false`, `show_in_menu=false`
Supports: `title`, `author`. Capability type: `post`, `map_meta_cap=true`

Meta fields (all `_dv_` prefixed, `show_in_rest=false`, `auth_callback=__return_false`):
`startup_name`, `founder_name`, `email`, `phone`, `sector`, `stage`, `description`, `pitch_deck_id`, `customer_response`, `internal_note`, `status`

Statuses: `draft`, `submitted`, `under_review`, `needs_revision`, `accepted`, `rejected`
Customer-editable: `draft`, `needs_revision` only
Admin-settable: `under_review`, `needs_revision`, `accepted`, `rejected`

### 2.3 `Settings` (`includes/class-settings.php`)

Storage: single option `dv_core_settings` (10 string values)
Fields: `login_title`, `login_description`, `request_form_title`, `request_form_instructions`, `dashboard_welcome`, `empty_requests`, `edit_request_label`, `contact_message`, `acceptance_template`, `rejection_template`
Placeholders: `{customer_name}`, `{request_id}`, `{request_title}`, `{contact_date}`, `{contact_phone}`, `{admin_message}`
Admin page capability: `dv_manage_settings`

### 2.4 `Shortcodes` (`includes/class-shortcodes.php`)

Five shortcodes registered. Asset loading via 3 detection paths (see Section 5).

**HARDCODED URL:** `$dashboard_url = home_url('/my-requests/')` in `login()` method.

### 2.5 `Handlers` (`includes/class-handlers.php`)

Four `admin_post_` actions. Every handler calls `verify()` (nonce + login + capability). All input sanitized. Upload via `media_handle_upload()` with mime allowlist and 20MB limit.

---

## 3. All Templates

### `templates/request-form.php`
Investment form. Uses `form-input`/`form-select`/`form-textarea` classes. `id="investment-request-form"` for JS. Sector/stage arrays defined inline — duplicated with `request-management.php`.

### `templates/customer-dashboard.php`
Mobile card + desktop table views. Status badges. Edit link gated by `customer_can_edit_status()`.

### `templates/request-management.php`
Filter form + per-request cards. Sector/stage arrays defined inline — duplicated with `request-form.php`. Unique field IDs per request for accessibility.

### `templates/user-management.php`
User table with promote/demote forms. Posts to `admin-post.php` with nonce.

### `templates/forbidden.php`
Access denied using `dv-alert dv-alert-error` classes.

### `templates/login-required.php`
Login prompt with `$login_url` variable.

---

## 4. All Redirects

All handler redirects use `wp_get_referer()` + `?dv_notice={key}`. Falls back to `home_url('/')` if referer missing.

**Known issue:** `Shortcodes::login()` hardcodes `home_url('/my-requests/')` for the already-logged-in state.

---

## 5. All Asset Loading Logic

### Theme (`functions.php`)
Always enqueues `assets/dist/main.css` + `main.js` on front end. Scoped to `.dv-site`.

### Plugin (`class-shortcodes.php` → `enqueue_assets()`)

Three detection paths:
1. `has_shortcode( $post->post_content, ... )` — post content check
2. `is_page_template( 'page-investment-request.php' | 'page-login.php' )` — theme template check
3. `is_page( ... )` — known plugin page slug check

**Critical Elementor gap:** Elementor stores widget data in `_elementor_data` post meta, not `post_content`. `has_shortcode()` will always return `false` on Elementor-built pages. Must add Path 4: parse `_elementor_data` for DigiVentures widget names.

---

## 6. All Security Checks

| Check | Location | Method |
|---|---|---|
| Authentication | `Handlers::verify()` | `is_user_logged_in()` |
| Capability | `Handlers::verify()` | `current_user_can()` |
| Nonce | `Handlers::verify()` | `check_admin_referer()` |
| Ownership | `Handlers::update_request()` | `Request_Type::user_owns_request()` |
| Edit state | `Handlers::update_request()` | `Request_Type::customer_can_edit_status()` |
| Status allowlist | `Handlers::update_status()` | `in_array(..., admin_statuses(), true)` |
| Sector/stage allowlist | `Handlers::request_data()` | `in_array(..., allowlist, true)` |
| Email | `Handlers::request_data()` | `is_email()` |
| File ext/size | `Handlers::save_request_data()` | extension allowlist + 20MB check |
| Admin protection | `Handlers::update_request_role()` | `Roles::is_protected_administrator()` |
| Meta REST auth | `Request_Type::register_meta()` | `auth_callback = '__return_false'` |
| CPT REST | `Request_Type::register()` | `show_in_rest = false` |
| Escaping | All templates | `esc_html()`, `esc_attr()`, `esc_url()`, `esc_textarea()` |
| Sanitization | `Handlers::request_data()` | `sanitize_*` functions |
| Upload mimes | `Handlers::save_request_data()` | explicit mime map in `media_handle_upload()` |

---

## 7. All Hardcoded URLs

| URL | Location | Severity |
|---|---|---|
| `home_url('/my-requests/')` | `Shortcodes::login()` | HIGH — no setting, breaks on slug change |
| `home_url('/')` | multiple | LOW — always correct |
| `home_url('/' . $slug . '/')` | `template-tags.php` fallback | MEDIUM — produces dead URL if page missing |
| `site_url('wp-login.php', 'login_post')` | `Shortcodes::login()` | LOW — correct |
| `admin_url('admin-post.php')` | All form templates | LOW — correct |

---

## 8. Known Bugs and Limitations

| Bug | Root cause | Fix needed |
|---|---|---|
| 404 on nav links | Pages not created / permalink = Plain | Page installer must create pages + set permalink hint |
| Unstyled form on cPanel | `has_shortcode()` misses PHP template shortcode | Add template detection (done) + Elementor data detection |
| Hardcoded `/my-requests/` | `Shortcodes::login()` line 183 | Replace with `DV_Page_Resolver` |
| Duplicate sector/stage arrays | `request-form.php` + `request-management.php` | Centralize in `Request_Type` or new helper |
| No Elementor asset detection | `_elementor_data` not checked | Add to `enqueue_assets()` |
| No Elementor notice | Plugin silently does nothing without Elementor | Add `admin_notices` hook |
| `setup-pages.php` requires WP-CLI | CLI only | Replace with admin-accessible Setup Wizard |
| Status labels in English | `Request_Type::statuses()` uses `__()` | Should be Persian strings |
| No page ID storage | Pages referenced by slug only | Store IDs in `dv_page_ids` option |

---

## 9. Migration Requirements Summary

1. **Shared rendering layer** — extract all template logic into renderer classes so shortcodes AND Elementor widgets use the same code path
2. **DV_Page_Resolver** — store page IDs, resolve all URLs via `get_permalink($id)`, remove all hardcoded slugs
3. **Elementor integration** — detect Elementor, register 5 widgets, add `_elementor_data` asset detection
4. **Setup wizard** — admin UI to create all pages, assign templates, store page IDs, idempotent
5. **Rollback** — uninstall cleanup that removes created pages and options without touching user data
6. **Graceful degradation** — shortcodes must work without Elementor; show admin notice if Elementor missing

---

## 10. What Must NOT Change

- `Handlers` class — all 4 handlers, nonce actions, capability checks
- `Request_Type` class — CPT registration, meta, status policy
- `Roles` class — role slugs, capabilities, protection logic
- `Settings` class — option key, defaults, sanitization, placeholder system
- All 5 shortcode names and their capability gates
- CPT `service_request` and all `_dv_*` meta keys
- `admin-post.php` as the form handler endpoint
- File upload logic in `save_request_data()`
- `wp_mail()` notification in `update_status()`
