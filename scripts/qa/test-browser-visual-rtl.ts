import puppeteer, { Browser, Page } from "puppeteer-core";

const BASE_URL = process.env.APP_URL || "http://localhost:3000";
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const VIEWPORTS = [
  { name: "Mobile iPhone 15", width: 390, height: 844 },
  { name: "Mobile iPhone 15 Pro Max", width: 430, height: 932 },
  { name: "Tablet iPad Mini", width: 768, height: 1024 },
  { name: "Laptop Small 1024", width: 1024, height: 768 },
  { name: "Desktop 1440", width: 1440, height: 900 },
];

const PAGES_TO_TEST = [
  { path: "/", name: "Homepage" },
  { path: "/portfolio", name: "Portfolio Hub" },
  { path: "/about", name: "About DigiVentures" },
  { path: "/team", name: "Team Page" },
  { path: "/contact", name: "Contact Page" },
  { path: "/news", name: "News Hub" },
  { path: "/news/digiventures-annual-report-1402", name: "News Reader" },
  { path: "/login", name: "Login Screen" },
  { path: "/register", name: "Registration Screen" },
  { path: "/forgot-password", name: "Password Recovery" },
];

class VisualTestSuite {
  passed = 0;
  failed = 0;
  failures: string[] = [];

  assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      this.passed++;
      console.log(`  \x1b[32m✓\x1b[0m ${testName}`);
    } else {
      this.failed++;
      const msg = `FAIL: ${testName}${detail ? ` -> ${detail}` : ""}`;
      this.failures.push(msg);
      console.error(`  \x1b[31m✗\x1b[0m ${msg}`);
    }
  }

  summary() {
    console.log(`\n========================================`);
    console.log(`Browser QA Results: ${this.passed} passed, ${this.failed} failed`);
    if (this.failures.length > 0) {
      console.log(`Failures:`);
      this.failures.forEach((f) => console.log(` - ${f}`));
    }
    console.log(`========================================\n`);
    return this.failed === 0;
  }
}

const suite = new VisualTestSuite();

async function run() {
  console.log(`\n======================================================`);
  console.log(`STAGE 5: REAL HEADLESS CHROME BROWSER QA & VISUAL SUITE`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Using Chrome: ${CHROME_PATH}`);
  console.log(`======================================================\n`);

  let browser: Browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
  } catch (err: any) {
    console.error("Failed to launch Chrome:", err.message);
    process.exit(1);
  }

  const page = await browser.newPage();

  // Listen to console errors
  const pageErrors: string[] = [];
  page.on("pageerror", (err: any) => {
    pageErrors.push(err?.message || String(err));
  });

  // --------------------------------------------------------------------------
  // 1. RTL & PERSIAN TYPOGRAPHY FOUNDATIONS
  // --------------------------------------------------------------------------
  console.log(`\n--- 1. RTL Layout & Persian Typography Checks ---`);
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });

  const htmlDir = await page.$eval("html", (el) => el.getAttribute("dir"));
  const htmlLang = await page.$eval("html", (el) => el.getAttribute("lang"));
  suite.assert(htmlDir === "rtl", "Document <html> has dir='rtl'");
  suite.assert(htmlLang === "fa", "Document <html> has lang='fa'");

  const computedFont = await page.$eval("body", (el) => {
    return window.getComputedStyle(el).fontFamily;
  });
  suite.assert(
    computedFont.toLowerCase().includes("vazirmatn") || computedFont.includes("Vazirmatn"),
    `Body uses Vazirmatn font family (Computed: ${computedFont.slice(0, 30)}...)`
  );

  // --------------------------------------------------------------------------
  // 2. VIEWPORT RESPONSIVENESS & HORIZONTAL OVERFLOW ACROSS ALL PAGES
  // --------------------------------------------------------------------------
  console.log(`\n--- 2. Viewport Responsiveness & Horizontal Overflow Matrix ---`);

  for (const p of PAGES_TO_TEST) {
    const targetUrl = `${BASE_URL}${p.path}`;
    await page.goto(targetUrl, { waitUntil: "networkidle0" });

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise((r) => setTimeout(r, 100)); // Allow layout reflow

      const overflowData = await page.evaluate(() => {
        const docWidth = document.documentElement.offsetWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const windowWidth = window.innerWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        return {
          windowWidth,
          scrollWidth,
          bodyScrollWidth,
          hasOverflow: scrollWidth > windowWidth + 1 || bodyScrollWidth > windowWidth + 1,
        };
      });

      suite.assert(
        !overflowData.hasOverflow,
        `[${vp.name}] ${p.name} (${p.path}) has NO horizontal overflow (scrollWidth: ${overflowData.scrollWidth}px, viewport: ${vp.width}px)`
      );
    }
  }

  // --------------------------------------------------------------------------
  // 3. IMAGE INTEGRITY & ASSET HEALTH
  // --------------------------------------------------------------------------
  console.log(`\n--- 3. Image Loading & Asset Health Matrix ---`);

  for (const p of PAGES_TO_TEST) {
    await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "networkidle0" });

    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      return imgs
        .filter((img) => img.complete && img.naturalWidth === 0 && img.src && !img.src.startsWith("data:"))
        .map((img) => img.src);
    });

    suite.assert(
      brokenImages.length === 0,
      `${p.name} (${p.path}) has 0 broken images (Checked: ${await page.$$eval("img", (imgs) => imgs.length)} images)`
    );
  }

  // --------------------------------------------------------------------------
  // 4. INTERACTIVE COMPONENT AUDIT: 3D FLIP CARDS ON HOMEPAGE
  // --------------------------------------------------------------------------
  console.log(`\n--- 4. Interactive 3D Focus Area Flip Cards ---`);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });

  const flipCardExists = await page.evaluate(() => {
    const cards = document.querySelectorAll("[data-flip-card]");
    return cards.length > 0;
  });
  suite.assert(flipCardExists, "Homepage renders 3D Focus Area cards container with perspective");

  // Hover over or inspect the first card and check for 3D transform effect
  const cardHasTransform = await page.evaluate(() => {
    const card = document.querySelector("[data-flip-card]");
    if (!card) return false;
    const style = window.getComputedStyle(card);
    const inner = card.firstElementChild;
    const innerStyle = inner ? window.getComputedStyle(inner) : null;
    return style.perspective !== "none" || (innerStyle && innerStyle.transformStyle === "preserve-3d");
  });
  suite.assert(Boolean(cardHasTransform), "3D Focus Area card applies hardware-accelerated 3D transform perspective");

  // --------------------------------------------------------------------------
  // 5. MOBILE NAVIGATION DRAWER INTERACTION (390px Viewport)
  // --------------------------------------------------------------------------
  console.log(`\n--- 5. Mobile Navigation Drawer Interaction ---`);
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });

  const menuButton = await page.$("button[aria-label*='منو'], button[aria-label*='menu'], header button");
  suite.assert(!!menuButton, "Mobile hamburger menu button is rendered on 390px viewport");

  if (menuButton) {
    await menuButton.click();
    await new Promise((r) => setTimeout(r, 200));

    // Verify navigation links are visible
    const mobileLinksVisible = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("header a, [role='dialog'] a"));
      return links.some((a) => (a.textContent || "").includes("پورتفولیو") || (a.textContent || "").includes("درباره"));
    });
    suite.assert(mobileLinksVisible, "Clicking mobile menu toggles navigation drawer with navigation links");
  }

  // --------------------------------------------------------------------------
  // 6. CONTACT FORM LIVE VALIDATION INTERACTION
  // --------------------------------------------------------------------------
  console.log(`\n--- 6. Contact Form Interactive Validation ---`);
  await page.setViewport({ width: 1024, height: 768 });
  await page.goto(`${BASE_URL}/contact`, { waitUntil: "networkidle0" });

  // Try submitting without filling fields
  const submitButton = await page.$("button[type='submit']");
  suite.assert(!!submitButton, "Contact page renders submit button");

  if (submitButton) {
    await submitButton.click();
    await new Promise((r) => setTimeout(r, 300));

    // Verify client-side or HTML5 validation triggers
    const hasValidationError = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll("input, textarea"));
      const isInvalid = inputs.some((input: any) => input.validity && !input.validity.valid);
      const errorText = document.body.textContent || "";
      return isInvalid || errorText.includes("الزامی") || errorText.includes("معتبر نیست");
    });
    suite.assert(hasValidationError, "Submitting empty contact form triggers validation prevention");
  }

  // --------------------------------------------------------------------------
  // 7. ACCESSIBILITY & SEMANTIC LANDMARKS
  // --------------------------------------------------------------------------
  console.log(`\n--- 7. Accessibility & Semantic Landmarks ---`);
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });

  const landmarks = await page.evaluate(() => {
    return {
      hasHeader: !!document.querySelector("header"),
      hasMain: !!document.querySelector("main"),
      hasFooter: !!document.querySelector("footer"),
      hasNav: !!document.querySelector("nav"),
      headingsCount: document.querySelectorAll("h1, h2, h3").length,
      h1Count: document.querySelectorAll("h1").length,
    };
  });

  suite.assert(landmarks.hasHeader, "Semantic <header> landmark is present");
  suite.assert(landmarks.hasMain, "Semantic <main> landmark is present");
  suite.assert(landmarks.hasFooter, "Semantic <footer> landmark is present");
  suite.assert(landmarks.hasNav, "Semantic <nav> landmark is present");
  suite.assert(landmarks.h1Count >= 1, `Document contains primary <h1> heading (Count: ${landmarks.h1Count})`);

  // Check buttons have accessible names
  const unnamedButtons = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    return buttons.filter((btn) => {
      const text = (btn.textContent || "").trim();
      const ariaLabel = btn.getAttribute("aria-label");
      const title = btn.getAttribute("title");
      return !text && !ariaLabel && !title;
    }).length;
  });
  suite.assert(unnamedButtons === 0, `All interactive buttons have accessible text/aria-labels (Unnamed: ${unnamedButtons})`);

  // --------------------------------------------------------------------------
  // 8. CONSOLE ERRORS AUDIT
  // --------------------------------------------------------------------------
  console.log(`\n--- 8. Runtime Console Error Audit ---`);
  suite.assert(pageErrors.length === 0, `Pages rendered with 0 uncaught client runtime errors (Errors: ${pageErrors.length})`);

  await browser.close();

  const success = suite.summary();
  process.exit(success ? 0 : 1);
}

run().catch((err) => {
  console.error("Browser test suite fatal error:", err);
  process.exit(1);
});
