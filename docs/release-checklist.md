# Release checklist

- [x] Run lint and release validation.
- [x] Build and inspect both ZIPs; confirm no `node_modules`, `.git`, logs or secrets.
- [x] Install plugin and child-theme ZIPs in clean disposable WordPress.
- [x] Run Setup twice and verify 1.0 placeholder migration.
- [ ] Check PHP/WordPress/Elementor/browser logs and outbound email.
- [x] Confirm Elementor page editor, custom widget, and desktop rendering.
- [ ] Complete 375px/768px physical-device rendering checks.
- [ ] Take backup, record package checksum, and retain preceding ZIP.
