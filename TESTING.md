# Testing

Available automated checks are PHP lint plus release validation. Run:

```sh
find wordpress/wp-content/plugins/digiventures-application -name '*.php' -print0 | xargs -0 -n1 php -l
wordpress/wp-content/plugins/digiventures-application/scripts/validate-release.sh
wordpress/wp-content/plugins/digiventures-application/scripts/package-plugin.sh
```

Primary integration environment: disposable WordPress 6.8.2 on PHP 8.1 with MariaDB 10.11, Hello Elementor 3.4.9, and Elementor 4.2.1. Install both ZIPs, activate the child theme and plugin, run Setup twice, and follow `docs/manual-test-matrix.md`.

Visual checks completed in the local integration environment:

- Exact source/WordPress desktop geometry comparisons at 1280 px for Home and all static public pages.
- Exact source/WordPress panel and form comparisons for Login, Register, Contact, and authenticated Investment Request.
- Elementor responsive previews at 768 px and 360 px, including full-width canvas/footer, mobile navigation, form stacking, file-input containment, and management-table horizontal scrolling.
- Public frontend console checked with no errors.
