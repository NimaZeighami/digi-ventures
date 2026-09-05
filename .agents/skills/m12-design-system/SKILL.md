---
name: m12-design-system
description: >-
  Use this skill when designing, building, or auditing high-end venture capital and tech enterprise interfaces, specifically replicating the layout, typography, 3D flip-cards, infinite marquee, and ambient gradient textures of M12 (m12.vc).
---

# M12 (m12.vc) Design System & UI Cloning Guide

This skill provides the comprehensive design tokens, component specifications, layout rules, and interaction patterns required to produce an authentic, pixel-accurate clone of the M12 venture capital website (https://m12.vc/).

---

## 1. Core Visual Principles

1. **Ultra-Clean Canvas with Ambient Textures**:
   - The foundation is pure white (`#FFFFFF`) layered with subtle, high-resolution organic gradient mesh textures (`gradient-hero.webp`, `gradient-focus.webp`, `gradient-power.webp`, `gradient-casestudy.webp`).
   - Never use muddy solid dark or heavy gray background blocks. Sections flow seamlessly into one another.

2. **Crisp High-Contrast Typography**:
   - **Headlines**: Deep slate/black (`#0F172A` / `#111827`), font weights `600` to `700`, line height `1.15` to `1.25`, with generous tracking and text-balance.
   - **Body Copy**: Refined slate (`#475569` / `#64748B`), font weights `300` to `400`, generous line-height (`1.7` to `1.9`).
   - **Kickers / Pre-titles**: Bold uppercase or pill tags with subtle borders (`border-slate-200/80 bg-slate-50`).

3. **Signature Interactive Components**:
   - **3D Flip Tiles**: 5-column grid of tiles with light neutral fronts (`#FFFFFF` or `#F8FAFC`) that smoothly rotate 180° on the Y-axis to reveal rich, solid brand-color backs (`#00B140` green, `#059669` emerald, `#0078D4` blue, `#0D9488` teal, `#7C3AED` purple) with descriptive copy and action arrows (`tile-arrow.svg`).
   - **The Power Of... Metric Row**: Massive typography numbers (e.g. `140+`, `Seed - B`, `50+`) paired with a continuous, infinite marquee of monochrome/grayscale portfolio logos that pauses on user hover.
   - **Split Case Studies ("Investing in Innovation")**: High-impact split blocks alternating between narrative text (with company logo and tags) and large full-bleed photo cards.
   - **Executive Testimonial**: Minimalist layout anchored by a clean quotation mark SVG (`quote-icon.svg`) and oversized statement typography.
   - **Full-Bleed Image News Tiles**: 3-column grid of vertical cards (`min-h-[480px]`) featuring high-resolution photography with dark gradient overlays (`from-slate-950 via-slate-950/65 to-slate-900/30`), pill tags, publish dates, and headlines that zoom smoothly on hover.

---

## 2. Layout Structure & Section Matrix

| Section | M12 Reference Element | Key CSS / Visual Tokens |
| :--- | :--- | :--- |
| **Sticky Header** | `header.elementor-location-header` | Height `76px`, `bg-white/95 backdrop-blur-md`, subtle `border-b border-slate-100`, crisp nav items, search trigger. |
| **Hero** | `.hero-bg-19-1-home` | 2-column split, `gradient-hero.webp` ambient texture, 60px headline, subtext, primary CTA button, animated geometric hub on the side. |
| **Focus Areas** | `.home-intro-section` | Introduction text paragraph + 5 `m12-flip-card` elements with 3D perspective flip and vibrant color backs. |
| **Stats & Marquee** | `.home-power-section` | Centered kicker, 3 huge metrics, `m12-marquee` continuous loop with duplicate track for seamless wrap. |
| **Case Studies** | `.home-case-study-section` | Alternating 2-column cards, `rounded-3xl border border-slate-200/80 bg-white p-10`, company logo, narrative copy, action CTA. |
| **Quote** | `.testimonial-section` | Centered `quote-icon.svg`, 32px font-light statement, executive title. |
| **News / Insights** | `.news-loop-grid` | 3 cards, dark gradient overlay, image scale-105 on hover, category pill. |
| **Footer** | `footer.elementor-location-footer` | Top divider, 5 columns: Bio, Focus Areas, Portfolio, Insights, Stay Connected (social links). |

---

## 3. CSS Component Specifications

```css
/* 3D Flip Card Specification */
.m12-flip-card {
  perspective: 1200px;
  height: 320px;
}
.m12-flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
  cursor: pointer;
}
.m12-flip-card:hover .m12-flip-inner {
  transform: rotateY(180deg);
}
.m12-flip-front,
.m12-flip-back {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 1.25rem;
}
.m12-flip-front {
  background-color: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);
}
.m12-flip-back {
  transform: rotateY(180deg);
  box-shadow: 0 20px 30px -10px rgba(15, 23, 42, 0.2);
}

/* Infinite Marquee */
@keyframes marquee-scroll {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.m12-marquee {
  display: flex;
  overflow: hidden;
  user-select: none;
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}
.m12-marquee-track {
  display: flex;
  align-items: center;
  gap: 3rem;
  animation: marquee-scroll 35s linear infinite;
}
.m12-marquee:hover .m12-marquee-track {
  animation-play-state: paused;
}
```

---

## 4. Verification Checklist

When building or updating pages:
- [ ] Ensure all background textures use authentic webp gradient overlays.
- [ ] Verify 3D flip card rotation on all 5 focus tiles on desktop.
- [ ] Confirm infinite marquee scrolls seamlessly without layout jumps.
- [ ] Check RTL / Persian typography alignment, ensuring proper letter-spacing and hierarchy.
- [ ] Run `npm run build` in `frontend/` to verify zero postcss or bundler errors.
- [ ] Synchronize build outputs with `wordpress/wp-content/plugins/digiventures-application/`.
