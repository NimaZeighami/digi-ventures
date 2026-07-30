# Roles and permissions

| Capability | Customer | Admin | Manager | Super admin |
|---|---:|---:|---:|---:|
| `create_request`, `view_own_requests`, `edit_own_request` | yes | yes | yes | yes |
| `review_requests`, `change_request_status`, `manage_application_settings` | no | yes | yes | yes |
| `manage_application_users` | no | no | yes | yes |
| `manage_options` / wp-admin | no | no by default | no by default | WordPress admin only |

`super_admin` is a protected application role, distinct from WordPress multisite super-admin. Plugin role changes refuse protected users and managers; only a WordPress administrator with `manage_options` can perform recovery directly in WordPress. The supplied `admin` application role intentionally does not receive `manage_options`.
