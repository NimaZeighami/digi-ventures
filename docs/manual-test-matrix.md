# Manual test matrix

| Scenario | Expected result | Status |
|---|---|---|
| Fresh activation and Setup twice | pages/roles/table once, no duplicate pages | passed |
| Customer creates request with valid PDF deck | submitted request and attachment | passed |
| Customer changes URL/request ID | cannot read another request | passed, 403 |
| Customer changes status | rejected server-side | passed, 403 |
| Admin changes status | only review statuses accepted; email on accepted/rejected | pending live WP |
| Manager changes customer/admin role | succeeds; manager/super_admin protected | pending live WP |
| Frontend registration/login/logout | WordPress cookies and correct redirects | passed |
| Login throttle / bad credentials | generic error and 429 after threshold | pending |
| wp-admin redirects | app users redirected, administrators preserved | passed |
| Elementor editor | editor opens and DigiVentures widget is visible | passed with external console warnings documented |
| Desktop visual render | full reference home/contact/auth pages render | passed |
| 375/768 device comparison | no clipped RTL text/menu/form controls | pending launch QA |
