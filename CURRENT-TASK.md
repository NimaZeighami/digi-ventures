# Current Cursor Task - Build Static DigiVentures UI

Build only the static frontend for DigiVentures.

Do not build WordPress yet.
Do not build backend logic yet.
Do not build plugin logic yet.

## Goal

Create a premium, responsive, Persian-first RTL static website for DigiVentures using Vite and Tailwind CSS.

The website must look like a serious corporate venture capital and innovation investment website. It should feel visually aligned with the DigiVentures brand book and the innovation/investment tone of DigiNext: strategic, technology-focused, clean, dark, green-accented, and trustworthy.

## Tech Requirements

- Use Vite
- Use Tailwind CSS
- Use vanilla JavaScript only when needed
- Do not use React
- Do not use Bootstrap
- Do not use jQuery
- Do not use GSAP
- Do not use Framer Motion
- Do not use AOS
- Do not use Lottie
- Do not use Three.js
- Do not use any animation library

## Brand And Design Requirements

Use this palette:

```text
Primary green: #00B140
Dark background: #050807
Dark section: #0B1110
Light background: #F5F7F5
Dark text: #101413
Muted text: #6B7280
White: #FFFFFF
```

Design style:

- premium corporate venture capital
- dark hero section
- bright green accent
- clean white/light-gray content sections
- geometric triangular patterns inspired by the logo
- subtle grid lines
- fine borders
- soft shadows
- modern but not flashy
- Persian-first RTL typography
- English brand name: DigiVentures

Avoid:

- purple/orange/blue accent colors
- unrelated colorful gradients
- cartoon startup illustrations
- generic SaaS template look
- heavy animation
- fake dashboard visuals that do not belong to the product

## Animation Requirements

The site should have polished motion, but only with CSS and minimal vanilla JS.

Implement:

- hero text fade-up on load
- subtle CTA hover animation
- card hover lift
- section reveal on scroll using IntersectionObserver
- subtle moving background grid or green accent line with CSS keyframes
- respect `prefers-reduced-motion`

Do not implement:

- scroll hijacking
- parallax that breaks mobile
- animation libraries
- 3D canvas
- complex page transitions

## Pages

Create these pages:

- Home
- About
- Team
- Contact
- Investment Request

All pages must share one consistent header and footer.

## Home Page Sections

1. Header
   - Logo text: DigiVentures
   - Persian navigation
   - CTA button: ثبت درخواست سرمایه گذاری

2. Hero
   - Dark premium background
   - Main headline in Persian
   - Short supporting paragraph
   - Primary CTA: ثبت درخواست سرمایه گذاری
   - Secondary CTA: آشنایی با فرآیند سرمایه گذاری
   - Add a visual geometric pattern, not a stock image

Suggested hero headline:

```text
سرمایه گذاری جسورانه برای استارتاپ هایی که آینده اقتصاد دیجیتال را می سازند
```

3. About CVC
   - Explain corporate venture capital simply
   - Mention strategic partnership, capital, network, and market access

4. Investment Focus Areas
   Include cards for:
   - تجارت الکترونیک
   - فین تک
   - لجستیک هوشمند
   - هوش مصنوعی و داده
   - راهکارهای ابری
   - اتوماسیون و اینترنت اشیا

5. Why DigiVentures
   Include 3 or 4 value points:
   - دسترسی به اکوسیستم دیجیتال
   - تجربه رشد و مقیاس پذیری
   - ارزیابی تخصصی و شفاف
   - همکاری استراتژیک فراتر از سرمایه

6. Investment Process
   Steps:
   - ارسال درخواست
   - بررسی اولیه
   - جلسه شناخت و ارزیابی
   - تصمیم سرمایه گذاری
   - شروع همکاری و رشد

7. Team Preview
   Use elegant placeholder cards without fake personal claims.

8. Final CTA
   Encourage startups to submit an investment request.

## Investment Request Page

Build the form UI only. No backend.

Fields:

- نام استارتاپ
- نام و نام خانوادگی
- ایمیل
- شماره تماس
- حوزه فعالیت
- مرحله کسب و کار
- مبلغ سرمایه درخواستی
- لینک وب سایت یا شبکه اجتماعی
- توضیح کوتاه
- آپلود Pitch Deck

Upload helper text:

```text
فرمت های مجاز: PDF, PPT, PPTX - حداکثر حجم فایل: 20 مگابایت
```

Add mock states:

- normal form
- success message
- error message
- logged-out notice
- wrong file type notice

Success message:

```text
درخواست جذب سرمایه شما با موفقیت دریافت شد. پس از بررسی اولیه، نتیجه از طریق ایمیل به شما اطلاع داده خواهد شد.
```

## Structure

Create a clean section-based structure:

```text
frontend/
  index.html
  about.html
  team.html
  contact.html
  investment-request.html
  src/
    main.js
    styles.css
  assets/
    images/
    icons/
```

Use section comments in HTML so the files are easy to convert into WordPress template parts later.

## Quality Requirements

- No Lorem Ipsum
- No broken image references
- No console errors
- No horizontal scroll
- Fully responsive
- Header works on mobile
- Form is accessible and readable
- Text does not overlap
- Buttons are easy to tap on mobile
- The first viewport must look professional and complete

## Stop Condition

Stop after the static frontend is complete.

Do not convert to WordPress in this task.
Do not create a plugin in this task.
Do not add backend form handling in this task.

