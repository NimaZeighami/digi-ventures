# Known issues and verification gaps

- No speculative Elementor JSON is included. Exact reference layouts render through plugin-owned presentation templates, while dynamic application panels are available as a registered Elementor widget.
- Elementor 4.2.1's editor emitted JavaScript errors from WordPress `wp-auth-check` and a MutationObserver in the disposable test environment. The editor remained usable and the DigiVentures widget loaded; this appears external to the DigiVentures frontend scripts but should be retested on the production plugin/theme combination.
- Outbound email delivery requires working SMTP on the production host and was not deliverability-tested in Docker.
- A physical 1440 px browser capture and production hosting-cache/CDN comparison remain launch checks. Desktop source CSS and geometry were verified at 1280 px; Elementor tablet/mobile previews were verified at 768 px and 360 px.
