# DigiVentures Plugin Specification

## 1. User Roles

| Role | Slug | Description |
|---|---|---|
| Customer | `customer` | Can submit and manage own investment requests |
| Admin | `admin` | Can review all requests, change statuses, manage settings |
| Manager | `manager` | Inherits Admin permissions + can promote/demote Admins |
| Super Admin | `super_admin` | Full access (platform-level, protected from role changes) |

## 2. Form Fields — Investment Request

| Field | Type | Required | Validation |
|---|---|---|---|
| `startup_name` | text | yes | sanitized string |
| `founder_name` | text | yes | sanitized string |
| `email` | email | yes | valid email format |
| `phone` | tel | yes | sanitized string |
| `sector` | select (6 options) | yes | must be in allowlist |
| `stage` | select (4 options) | yes | must be in allowlist |
| `description` | textarea | yes | sanitized text |
| `pitch_deck` | file upload | yes (create) / no (edit) | PDF, PPT, PPTX only, max 20MB |

### Sector Options
- `ecommerce` — تجارت الکترونیک
- `fintech` — فین‌تک
- `platform` — کسب‌وکارهای پلتفرمی
- `supply_chain` — زنجیره تأمین
- `ai` — هوش مصنوعی
- `other` — سایر

### Stage Options
- `seed` — Seed
- `early` — مرحله اولیه
- `growth` — رشد
- `scale` — مقیاس‌پذیری

## 3. Request Statuses & Workflow

| Status | Label (EN) | Label (FA) | Description |
|---|---|---|---|
| `draft` | Draft | پیش‌نویس | Initial unsaved state |
| `submitted` | Submitted | ثبت شده | Customer submitted for review |
| `under_review` | Under Review | در حال بررسی | Admin is reviewing |
| `needs_revision` | Needs Revision | نیاز به اصلاح | Admin requested changes |
| `accepted` | Accepted | پذیرفته شده | Request approved |
| `rejected` | Rejected | رد شده | Request declined |

### Transitions
- Customer submits → `submitted`
- Customer edits `draft` or `needs_revision` → resets to `submitted`
- Admin sets any status → `under_review`, `needs_revision`, `accepted`, `rejected`
- Customer can only edit when status is `draft` or `needs_revision`

## 4. Access Levels

### Unauthenticated User
- Can see login page only
- All other pages show "login required"
- POST requests rejected with 403

### Customer (`customer`)
| Feature | Access |
|---|---|
| Submit new request | ✅ |
| View own requests | ✅ |
| Edit own request (draft/needs_revision) | ✅ |
| View all requests | ❌ |
| Change request status | ❌ |
| Manage other users | ❌ |
| Access settings | ❌ |

### Admin (`admin`)
| Feature | Access |
|---|---|
| Submit new request | ✅ |
| View own requests | ✅ |
| View all requests | ✅ |
| Change any request's status | ✅ (to under_review, needs_revision, accepted, rejected) |
| Manage other users (promote/demote) | ❌ |
| Access settings | ✅ |

### Manager (`manager`)
| Feature | Access |
|---|---|
| All Admin permissions | ✅ |
| Promote Customer → Admin | ✅ |
| Demote Admin → Customer | ✅ |
| Protected from demotion | ✅ (cannot be demoted by other Managers) |

### Super Admin (`super_admin`)
| Feature | Access |
|---|---|
| All permissions | ✅ |
| Protected from role management | ✅ (cannot be promoted/demoted by Managers) |

## 5. Pages / Endpoints

| Page | Shortcode | Purpose |
|---|---|---|
| Investment Request | `[dv_request_form]` | Submit/edit investment requests |
| My Requests | `[dv_customer_dashboard]` | View own requests with status |
| Request Management | `[dv_request_management]` | Admin review of all requests |
| User Management | `[dv_request_user_management]` | Manager role management |
| Login | `[dv_login]` | Authentication form |

## 6. Security Rules
- All state changes require: authentication + capability check + nonce verification
- Customer queries are scoped to `author_id`
- Status transitions use a strict allowlist (admins can only set `under_review`, `needs_revision`, `accepted`, `rejected`)
- File uploads restricted to PDF/PPT/PPTX, max 20MB
- Email notification sent on accept/reject using configurable templates

## 7. MySQL Schema (Custom Tables if needed)

If not using WordPress CPT, the equivalent schema:

```sql
CREATE TABLE requests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  startup_name VARCHAR(255) NOT NULL,
  founder_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  sector VARCHAR(50) NOT NULL,
  stage VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  pitch_deck_url VARCHAR(500),
  status ENUM('draft','submitted','under_review','needs_revision','accepted','rejected') DEFAULT 'draft',
  admin_message TEXT,
  internal_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer','admin','manager','super_admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_role (role)
);
```
