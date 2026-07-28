# DigiVentures WordPress Theme

Persian RTL WordPress theme converted from the static Vite frontend.

## Install

1. **Build theme assets** (from the `frontend` folder):

   ```bash
   cd frontend
   npm install
   npm run build:theme
   ```

2. **Copy the theme** into WordPress:

   ```bash
   cp -r wordpress-theme/digiventures /path/to/wordpress/wp-content/themes/
   ```

3. In **WordPress Admin → Appearance → Themes**, activate **DigiVentures**.

4. **Create pages** with these exact slugs (Settings → Permalinks: use “Post name”):

   | Title | Slug |
   |-------|------|
   | خانه | *(use as static front page)* |
   | درباره ما | `about` |
   | تیم | `team` |
   | تماس | `contact` |
   | درخواست سرمایه‌گذاری | `investment-request` |

5. **Settings → Reading**: set “Your homepage displays” to **A static page** and choose your home page.

6. **Startup images**: add portfolio images to:

   ```
   assets/images/startups/startup-01.jpg … startup-19.jpg
   ```

   (Same paths as the static site.)

## Development

- Static site: `cd frontend && npm run dev`
- Rebuild theme CSS/JS after style changes: `npm run build:theme`

## Structure

```
digiventures/
├── style.css              # Theme metadata
├── functions.php          # Enqueues, theme setup
├── header.php / footer.php
├── front-page.php         # Homepage
├── page-about.php         # Slug: about
├── page-team.php
├── page-contact.php
├── page-investment-request.php
├── template-parts/        # Page content sections
├── inc/template-tags.php  # URL/asset helpers
└── assets/
    ├── dist/              # Built main.css + main.js
    └── images/
```

## Forms

Contact and investment forms post to `admin-post.php` with nonces. Wire up handlers in `functions.php` or replace with **Contact Form 7** / **Gravity Forms** when ready.

## Notes

- RTL (`dir="rtl"`) and Vazirmatn font are included via the built CSS.
- Re-run `npm run build:theme` whenever you change Tailwind classes in PHP templates.
