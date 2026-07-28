# Architecture

## Overview

`digiventures-theme` is a classic WordPress presentation theme. `digiventures-core` is the application plugin and owns all request-domain logic. Static Vite pages remain visual source material; `npm run build:theme` writes compiled assets for the theme.

## Request model

Private CPT: `service_request`. Its author is the customer. Registered meta: `startup_name`, `founder_name`, `email`, `phone`, `sector`, `stage`, `description`, `pitch_deck_id`, `status`, `customer_response`, and `internal_note`. The former static-only requested-capital and website fields are intentionally not stored.

Statuses: `draft`, `submitted`, `under_review`, `needs_revision`, `accepted`, `rejected`.

- Customer: creates `draft`/`submitted`; edits only `draft` or `needs_revision`; never changes administrative statuses.
- Request Admin: reviews submitted requests; moves requests to `under_review`, `needs_revision`, `accepted`, or `rejected`; supplies a customer-visible message.
- Request Manager: has Request Admin access plus controlled Request Administrator role management.

## Capabilities

`dv_submit_requests`, `dv_read_own_requests`, `dv_edit_own_requests`, `dv_read_all_requests`, `dv_manage_requests`, `dv_manage_request_users`, and `dv_manage_settings` are centrally assigned by the plugin. The native Administrator role receives these capabilities only for compatibility; managers cannot alter that role.

## Editable settings

Native Settings API fields provide login copy, request instructions, dashboard text, empty state, status labels, contact text, and acceptance/rejection templates. Registered placeholders are `{customer_name}`, `{request_id}`, `{request_title}`, `{contact_date}`, `{contact_phone}`, and `{admin_message}`. Stored text is never executed as code or shortcodes.

## Rendering and authentication

Public content is theme-controlled. The plugin exposes `[dv_request_form]`, `[dv_customer_dashboard]`, `[dv_request_management]`, and `[dv_request_user_management]`; each renders a code-controlled PHP template. Login uses `wp_login_form`; password recovery uses the core WordPress password-reset endpoint. Forms use `admin-post.php`, nonces, PRG redirects, and WordPress authentication APIs.

## Security model

All mutations verify nonce, login, capability, ownership where relevant, and strict allowlists. Query arguments always constrain customer views to the author ID. File uploads use WordPress upload APIs, PDF/PPT/PPTX allowlists, and a 20MB limit. The CPT is private and no custom REST endpoint is registered.

## Asset strategy and Elementor

Tailwind preflight is disabled for the theme build and styles are scoped under `.dv-site`. Assets are enqueued by the theme on the front end only. Elementor may author public pages or contain shortcodes; the plugin application UI remains PHP-controlled. Vite’s fixed output is versioned using file modification times.

## Extension points and trade-offs

The MVP uses CPT + registered meta instead of custom tables for reliable WordPress ownership and admin tooling. Notifications are sent through `wp_mail`, so production email delivery depends on WordPress SMTP configuration. Templates and status policy are centralized to make later workflow expansion safe.
