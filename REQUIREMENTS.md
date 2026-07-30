# Requirements baseline

Implemented scope is derived from `SPECIFICATION.md`: customer, admin, manager and protected super-admin roles; frontend registration/login/logout/reset; investment request creation/editing; own/all request dashboards; manager-only customer/admin role changes; strict workflow; PDF/PPT/PPTX uploads up to 20 MiB; and accept/reject email notification.

Public visual-reference routes are `/`, `/portfolio`, `/team`, `/about`, `/contact`, `/news`; application routes are `/login`, `/register`, `/forgot-password`, `/reset-password`, `/investment-request`, `/my-requests`, `/request-management`, `/user-management`, and `/unauthorized`. The supplied requirement that anonymous visitors can only see login conflicts with the supplied public marketing site. This implementation uses the safer, commercially normal interpretation: public marketing pages remain public, while every application page and API operation requires login.
