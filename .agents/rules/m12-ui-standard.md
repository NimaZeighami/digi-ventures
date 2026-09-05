# M12 (m12.vc) Authentic UI Cloning Standards

When generating, modifying, or reviewing any frontend template or style in this project:

1. **Strict M12 Visual Fidelity**:
   - Every page must strictly follow the design system of M12 (Microsoft's Venture Capital Fund, https://m12.vc/).
   - Use pure white `#FFFFFF` canvases paired with authentic ambient gradient textures (`gradient-hero.webp`, `gradient-focus.webp`, `gradient-power.webp`, `gradient-casestudy.webp`) located in `/assets/images/m12/`.
   - Never use muddy solid dark boxes or generic gray cards for major sections.

2. **Component Architecture**:
   - **Hero**: 2-column split with large 60px headline, clean subtext, primary pill/rounded button, and interactive geometric constellation visual.
   - **Focus Areas**: 5-column 3D flip tiles (`.m12-flip-card`) with authentic M12 icons (`icon-ai-apps.png`, `icon-security.png`, etc.) and vivid colored back panels (`#00B140`, `#059669`, `#0078D4`, `#0D9488`, `#7C3AED`) with arrow buttons (`tile-arrow.svg`).
   - **Power of Brand**: 3 large metric stats + seamless infinite logo marquee (`.m12-marquee`) utilizing the official monochrome portfolio logos (`logo-sgnl.png`, `logo-inworld.png`, etc.) + "See complete portfolio" button.
   - **Case Studies**: Alternating 2-column split cards with category badges, black SVG logos, and large photography (`casestudy-inworld.webp`, `casestudy-evisort.png`).
   - **Quote**: Large `quote-icon.svg` centered above 32px font-light statement.
   - **News**: 3 full-bleed image cards with dark gradient overlay, pill tag, date, and zoom on hover.
   - **Footer**: Clean 5-column layout with top divider.

3. **Code & Asset Rules**:
   - Keep `frontend/` and `wordpress/wp-content/plugins/digiventures-application/` 100% in sync.
   - Run `npm run build` in `frontend/` to ensure 0 build/postcss errors.
   - Run `php -l`, `validate-release.sh`, and `package-plugin.sh` before finalizing.
