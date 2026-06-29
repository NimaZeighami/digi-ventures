# DigiVentures Implementation Plan

This plan must be followed step by step. Do not build everything at once.

## Phase 0 - Project Setup

Goal: prepare a clean static frontend foundation.

Tasks:

- Create a Vite + Tailwind CSS project
- Configure RTL-friendly base styles
- Add design tokens for brand colors
- Add Persian font loading plan, preferably Vazirmatn
- Create the base folder structure
- Create shared header and footer markup

Done when:

- The dev server runs without errors
- Tailwind is working
- RTL text renders correctly
- The brand color `#00B140` is available as the main accent

## Phase 1 - Static Website UI

Goal: build the full static website with realistic Persian content.

Pages:

- Home
- About
- Team
- Contact
- Investment Request

Home sections:

- Hero
- About CVC
- Investment focus areas
- Why DigiVentures
- Investment process
- Portfolio-style signal section
- Team preview
- Final CTA

Investment Request page sections:

- Intro
- Logged-out notice mock
- Form UI
- Upload pitch deck UI
- Success state mock
- Error state mock

Done when:

- All pages are responsive
- Header/footer are consistent
- UI feels premium, dark, strategic, and brand-aligned
- Animations are lightweight and CSS/vanilla JS only

## Phase 2 - Static QA And Polish

Goal: make the static site stable before WordPress conversion.

Tasks:

- Check desktop, tablet, and mobile
- Fix spacing, wrapping, and RTL issues
- Check hover states
- Check form states
- Check reduced-motion behavior
- Remove unused code

Done when:

- No visual breakage on mobile
- No console errors
- No unused animation library exists
- The static site is ready to convert into a classic WordPress theme

## Phase 3 - Convert Static UI To WordPress Theme

Goal: convert the static UI into `digiventures-theme`.

Tasks:

- Create a classic WordPress theme
- Convert header into `header.php`
- Convert footer into `footer.php`
- Convert sections into `template-parts`
- Convert pages into WordPress page templates
- Enqueue compiled CSS and JS properly
- Register menus

Done when:

- WordPress loads the theme
- Pages render correctly
- CSS/JS/images load correctly
- No business logic exists in the theme

## Phase 4 - Build Core Plugin Foundation

Goal: create `digiventures-core`.

Tasks:

- Create plugin bootstrap file
- Register custom post type `investment_request`
- Add request meta fields
- Add admin columns
- Add status meta field `request_status`
- Add admin metabox for request details

Done when:

- Investment Requests appear in WordPress admin
- Admin can view request data
- Status can be stored and displayed

## Phase 5 - Add Investment Request Form

Goal: connect frontend form to backend.

Tasks:

- Create shortcode `[dv_investment_form]`
- Require logged-in user for submission
- Add nonce verification
- Sanitize all fields
- Save request as `investment_request`
- Save meta fields
- Show success/error messages

Done when:

- A logged-in user can submit a request
- Request appears in admin
- Invalid submissions show clear errors

## Phase 6 - Add Pitch Deck Upload

Goal: safely upload pitch deck files.

Tasks:

- Allow PDF/PPT/PPTX only
- Enforce 20 MB max file size
- Use WordPress upload APIs
- Attach uploaded file to request
- Show file link in admin

Done when:

- Valid files upload correctly
- Invalid files are rejected
- File links are visible only to authorized admins

## Phase 7 - Add Email Workflow

Goal: add MVP email notifications.

Emails:

- request received
- under review
- need more info
- rejected with reason
- accepted

Tasks:

- Send automatic confirmation email after submission
- Add admin-triggered status emails
- Add editable reason/message field for rejection and more info
- Keep templates simple in MVP

Done when:

- User receives confirmation email
- Admin can change status and send email
- Email content is clear and professional

## Phase 8 - Final QA

Goal: make the MVP shippable.

Tasks:

- Test form submission
- Test file validation
- Test status changes
- Test emails
- Test permissions
- Test mobile layout
- Test logged-out state
- Check security basics

Done when:

- The site can receive and manage investment requests end to end
- The theme and plugin responsibilities are cleanly separated
- No MVP-critical issue remains

## Commit Plan

Make one commit after each stable step:

```bash
git add .
git commit -m "setup static frontend"
git commit -m "build static DigiVentures UI"
git commit -m "polish responsive UI"
git commit -m "convert static UI to WordPress theme"
git commit -m "add investment request post type"
git commit -m "add investment request shortcode form"
git commit -m "add pitch deck upload validation"
git commit -m "add request email workflow"
git commit -m "final MVP QA fixes"
```
