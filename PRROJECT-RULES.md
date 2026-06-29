# DigiVentures Project Rules

Use this file as the permanent instruction source for Cursor. Follow it in every task unless the user explicitly changes the project direction.

## Product Identity

- Project name: DigiVentures
- Type: Persian-first RTL corporate venture capital and investment request website
- Brand relationship: inspired by the DigiVentures brand book and aligned with the innovation/investment language of DigiNext, but do not copy DigiNext UI directly
- Core message: corporate venture capital, startup investment, innovation, trustworthy evaluation process, strategic partnership
- Main user action: submit an investment request

## Visual Direction

- Primary brand color: `#00B140`
- Main dark background: `#050807`
- Secondary dark background: `#0B1110`
- Light background: `#F5F7F5`
- Main dark text: `#101413`
- Muted text: `#6B7280`
- Main accent: only brand green `#00B140`
- Use a premium dark + green + clean light layout
- Use geometric triangular patterns inspired by the logo and venture/technology language
- Use subtle grid lines, fine borders, soft shadows, glass-like dark panels, and clean spacing
- Avoid colorful unrelated gradients
- Avoid purple, orange, red, beige, and playful palettes
- Avoid cartoon illustrations and generic startup stock-looking visuals

## Tech Rules For Static Frontend

- Use Vite + Tailwind CSS
- Use vanilla JavaScript only when needed
- Do not use React
- Do not use Bootstrap
- Do not use jQuery
- Do not use animation libraries such as GSAP, Framer Motion, AOS, Anime.js, ScrollMagic, Lottie, or Three.js
- Use CSS transitions, CSS keyframes, and small IntersectionObserver-based reveal animations only
- Keep JavaScript minimal, readable, and easy to port into WordPress later
- Use semantic HTML
- Keep RTL layout correct across desktop and mobile
- Use responsive layouts from the start

## WordPress Architecture Rules

- Final theme name: `digiventures-theme`
- Final plugin name: `digiventures-core`
- Final post type: `investment_request`
- Final shortcode: `[dv_investment_form]`
- Business logic must live in the plugin, not in the theme
- Do not put form handling, upload handling, email logic, status workflow, or request management inside `functions.php`
- `functions.php` should only contain theme setup, menus, assets, image sizes, and small theme helpers
- Use a classic WordPress theme, not a block theme
- Use WordPress core APIs before custom systems
- Do not create custom database tables for the MVP unless explicitly requested

## Investment Request Statuses

Use these exact status values:

- `pending`
- `under_review`
- `accepted`
- `rejected`
- `need_more_info`

Display labels can be Persian, but internal values must stay exactly as above.

## Investment Request Fields

Use these exact field keys:

- `startup_name`
- `founder_name`
- `email`
- `phone`
- `sector`
- `stage`
- `requested_amount`
- `website`
- `description`
- `pitch_deck`

Do not rename these keys without updating every dependent template, handler, email, meta field, and admin column.

## Security Rules For The Plugin

When implementing backend logic, always use:

- nonce verification
- capability checks for admin actions
- `sanitize_text_field`
- `sanitize_email`
- `esc_html`
- `esc_attr`
- `esc_url`
- `wp_kses_post` only where rich text is intentionally allowed
- file type validation
- file size validation
- logged-in-only submission for MVP
- WordPress media/upload APIs

Allowed pitch deck file types:

- PDF
- PPT
- PPTX

Maximum pitch deck file size:

- 20 MB

## File Structure Rules

Keep the project organized like this:

```text
frontend/
  src/
    main.js
    styles.css
  pages/
  sections/
  assets/

wordpress-theme/
  digiventures-theme/
    header.php
    footer.php
    functions.php
    front-page.php
    page-about.php
    page-team.php
    page-contact.php
    page-investment-request.php
    template-parts/

wordpress-plugin/
  digiventures-core/
    digiventures-core.php
    includes/
    templates/
    assets/
```

## Static UI Rules

- Build the static UI first
- Keep header and footer visually identical across all pages
- Build reusable sections that can later become WordPress `template-parts`
- Use realistic Persian content, not Lorem Ipsum
- Build the investment form UI only in the static phase
- Include visual states for normal, error, success, logged-out, and wrong-file-type states
- Use one consistent container system: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
- Use accessible labels for form fields
- Do not overbuild a full user dashboard in the MVP

## Animation Rules

Animation should feel premium and similar in polish to a modern innovation/investment website, but must remain lightweight.

Allowed:

- fade-in on scroll
- slight upward reveal
- soft hover movement on cards
- button hover transitions
- subtle background grid movement
- CSS-only animated gradient line
- simple number/count visual without heavy libraries
- IntersectionObserver for adding reveal classes

Not allowed:

- heavy scroll hijacking
- page transitions that break navigation
- animation libraries
- 3D scenes
- canvas-only hero
- excessive motion on mobile

Respect `prefers-reduced-motion`.

## Quality Bar

- The first screen must look like a real CVC/investment website, not a generic landing page
- The primary CTA must be clear: submit an investment request
- The design must feel strategic, grounded, responsible, trustworthy, and technology-focused
- Mobile layout must be clean and usable
- No overlapping text
- No clipped buttons
- No horizontal scrolling
- No placeholder broken images
- No console errors

