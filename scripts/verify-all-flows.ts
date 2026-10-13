import { db } from "../db/index";
import { users, investmentRequests, emailOutbox, newsArticles, contactSubmissions } from "../db/schema/index";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";
import { EmailService } from "../modules/email/service";

const BASE_URL = "http://localhost:3000";

interface TestResult {
  flow: string;
  step: string;
  status: "PASS" | "FAIL";
  details?: string;
}

const results: TestResult[] = [];

function record(flow: string, step: string, pass: boolean, details?: string) {
  results.push({ flow, step, status: pass ? "PASS" : "FAIL", details });
  console.log(`[${pass ? "PASS" : "FAIL"}] [${flow}] ${step}${details ? ` -> ${details}` : ""}`);
}

async function runAllFlows() {
  console.log("==========================================================");
  console.log("DIGI VENTURES - END-TO-END FLOW VERIFICATION SUITE");
  console.log(`Target: ${BASE_URL}`);
  console.log("==========================================================\n");

  // ==========================================
  // FLOW 1: Public Pages, SEO & Visual Assets
  // ==========================================
  console.log("--- Testing Flow 1: Public Pages & Visual Assets ---");
  try {
    // 1.1 Home page
    const homeRes = await fetch(`${BASE_URL}/`);
    const homeHtml = await homeRes.text();
    record("Flow 1", "Home page HTTP 200", homeRes.status === 200);
    record("Flow 1", "Home page RTL layout", homeHtml.includes('dir="rtl"'));
    record("Flow 1", "Home page contains DigiVentures title", homeHtml.includes("دیجی‌ونچرز"));
    record("Flow 1", "Home page contains Hero Lottie container", homeHtml.includes('id="hero-lottie"') || homeHtml.includes("m12-hero-visual"));
    record("Flow 1", "Home page contains Flip cards & ecosystem logos", homeHtml.includes("دیجی‌کالا") && homeHtml.includes("دیجی‌پی") && homeHtml.includes("دیجی‌نکست"));

    // 1.2 Security Headers
    record("Flow 1", "Security header: X-Frame-Options", homeRes.headers.get("x-frame-options") === "DENY");
    record("Flow 1", "Security header: X-Content-Type-Options", homeRes.headers.get("x-content-type-options") === "nosniff");
    record("Flow 1", "Security header: Referrer-Policy", homeRes.headers.get("referrer-policy")?.includes("strict-origin") || false);

    // 1.3 Hero Lottie Animation JSON
    const lottieRes = await fetch(`${BASE_URL}/assets/images/m12/hero-animation.json`);
    const lottie = await lottieRes.json();
    record("Flow 1", "Lottie animation asset HTTP 200", lottieRes.status === 200);
    record("Flow 1", "Lottie canvas w=740, h=600", lottie.w === 740 && lottie.h === 600);
    record("Flow 1", "Lottie op=150 (single pass pause)", lottie.op === 150);

    const lDK = lottie.layers.find((l: any) => l.refId === "image_7");
    const lDP = lottie.layers.find((l: any) => l.refId === "image_8");
    const lDN = lottie.layers.find((l: any) => l.refId === "image_9");
    const lDV = lottie.layers.find((l: any) => l.refId === "image_11");
    const aDV = lottie.assets.find((a: any) => a.id === "image_11");

    const dkStart = lDK.ks.p.k[0] - lDK.ks.a.k[0];
    const dnEnd = lDN.ks.p.k[0] - lDN.ks.a.k[0] + 157;
    const dvStart = lDV.ks.p.k[0] - lDV.ks.a.k[0];
    const dvEnd = lDV.ks.p.k[0] - lDV.ks.a.k[0] + aDV.w;

    record("Flow 1", "Hero logos shifted 50px to left (390, 490, 590, 490)", lDK.ks.p.k[0] === 390 && lDP.ks.p.k[0] === 490 && lDN.ks.p.k[0] === 590 && lDV.ks.p.k[0] === 490);
    record("Flow 1", "DigiVentures starts at first logo start (312)", dvStart === 312 && dkStart === 312);
    record("Flow 1", "DigiVentures ends at last logo end (~668)", Math.abs(dvEnd - dnEnd) <= 1);
    record("Flow 1", "DigiVentures width equals sum/span (356px)", aDV.w === 356);

    // 1.4 Public content pages
    for (const page of ["about", "portfolio", "team", "news", "contact"]) {
      const pRes = await fetch(`${BASE_URL}/${page}`);
      record("Flow 1", `Public page /${page} HTTP 200`, pRes.status === 200);
    }

    // 1.5 SEO sitemap & robots
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    const robotsText = await robotsRes.text();
    record("Flow 1", "robots.txt blocks /admin and /api", robotsText.includes("Disallow: /admin") && robotsText.includes("Disallow: /api"));

    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemapText = await sitemapRes.text();
    record("Flow 1", "sitemap.xml valid XML urlset", sitemapRes.status === 200 && sitemapText.includes("<urlset"));
  } catch (err: any) {
    record("Flow 1", "Flow 1 uncaught error", false, err.message);
  }

  // ==========================================
  // FLOW 2: Contact Form & Spam Neutralization
  // ==========================================
  console.log("\n--- Testing Flow 2: Contact Form & Spam Neutralization ---");
  try {
    const timestamp = Date.now();
    const contactEmail = `contact-${timestamp}@example.com`;

    // 2.1 Valid contact submission
    const contactRes = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "علی رضایی",
        email: contactEmail,
        phone: "09121234567",
        subject: "معرفی استارتاپ جهت سرمایه‌گذاری",
        message: "سلام، مایل به همکاری و معرفی طرح سرمایه‌گذاری در دیجی‌ونچرز هستیم.",
        website: "", // empty honeypot
      }),
    });
    record("Flow 2", "Valid contact inquiry HTTP 200", contactRes.status === 200);

    // Verify DB insertion
    const [inquiry] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.email, contactEmail));
    record("Flow 2", "Inquiry saved in database", !!inquiry && inquiry.name === "علی رضایی");

    // 2.2 Honeypot bot submission
    const botEmail = `bot-${timestamp}@spambot.com`;
    const botRes = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Spambot",
        email: botEmail,
        phone: "09129999999",
        subject: "Crypto Scam Offer",
        message: "Buy cheap crypto assets right now with high returns",
        website: "https://spam.com", // filled honeypot!
      }),
    });
    record("Flow 2", "Honeypot bot returns HTTP 200 (silent drop)", botRes.status === 200);
    const [botInquiry] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.email, botEmail));
    record("Flow 2", "Spambot not stored in database", !botInquiry);

    // 2.3 Validation rejection
    const invalidRes = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "",
        email: "not-an-email",
        phone: "123",
        subject: "",
        message: "",
      }),
    });
    record("Flow 2", "Invalid contact inquiry rejected HTTP 422", invalidRes.status === 422);
  } catch (err: any) {
    record("Flow 2", "Flow 2 uncaught error", false, err.message);
  }

  // ==========================================
  // FLOW 3: Auth Lifecycle (Register, Login, Me, Logout, Reset)
  // ==========================================
  console.log("\n--- Testing Flow 3: Authentication Lifecycle ---");
  const testEmail = `founder-${Date.now()}@testcorp.ir`;
  const initialPassword = "Password123!";
  const newPassword = "NewPassword123!";
  let customerCookie = "";

  try {
    // 3.1 Register
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: initialPassword,
        fullName: "بنیان‌گذار آزمایشی",
      }),
    });
    const regJson = await regRes.json();
    record("Flow 3", "Customer registration HTTP 201", regRes.status === 201 && !!regJson.user?.id);

    // 3.2 Login to get session cookie
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: initialPassword,
      }),
    });
    record("Flow 3", "Login HTTP 200", loginRes.status === 200);
    const rawCookie = loginRes.headers.get("set-cookie") || "";
    customerCookie = rawCookie.split(";")[0];
    record("Flow 3", "Login sets session cookie (dv_session)", customerCookie.includes("dv_session="));

    // 3.3 Check session via /api/auth/me
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: customerCookie },
    });
    const meJson = await meRes.json();
    record("Flow 3", "Auth /api/auth/me returns authenticated user", meRes.status === 200 && meJson.user?.email === testEmail);
    record("Flow 3", "Default registered role is 'customer'", meJson.user?.role === "customer");

    // 3.4 Logout
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: { Cookie: customerCookie },
    });
    record("Flow 3", "Logout HTTP 200", logoutRes.status === 200);

    // 3.5 Unauthenticated check
    const unauthMeRes = await fetch(`${BASE_URL}/api/auth/me`);
    const unauthMeJson = await unauthMeRes.json();
    record("Flow 3", "Unauthenticated /api/auth/me returns null user", unauthMeRes.status === 200 && unauthMeJson.user === null);

    // 3.6 Login with wrong password
    const wrongLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: "WrongPassword999!",
      }),
    });
    record("Flow 3", "Login with invalid password returns 401", wrongLoginRes.status === 401);

    // 3.7 Forgot password request
    const forgotRes = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail }),
    });
    record("Flow 3", "Forgot password HTTP 200", forgotRes.status === 200);

    // Find password reset email in outbox
    const [resetEmail] = await db
      .select()
      .from(emailOutbox)
      .where(eq(emailOutbox.toEmail, testEmail))
      .orderBy(desc(emailOutbox.createdAt))
      .limit(1);

    record("Flow 3", "Reset email queued in outbox", !!resetEmail);

    // Extract reset token from email body or link
    const match = resetEmail?.htmlBody.match(/token=([a-zA-Z0-9_\-]+)/);
    const resetToken = match ? match[1] : "";
    record("Flow 3", "Extracted reset token from email body", !!resetToken);

    if (resetToken) {
      // 3.8 Reset password
      const resetRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken,
          password: newPassword,
        }),
      });
      record("Flow 3", "Reset password HTTP 200", resetRes.status === 200);

      // Verify login with new password
      const newLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: newPassword,
        }),
      });
      record("Flow 3", "Login with new password succeeds HTTP 200", newLoginRes.status === 200);
      customerCookie = (newLoginRes.headers.get("set-cookie") || "").split(";")[0];
    }
  } catch (err: any) {
    record("Flow 3", "Flow 3 uncaught error", false, err.message);
  }

  // ==========================================
  // FLOW 4: Customer Investment Request & Uploads
  // ==========================================
  console.log("\n--- Testing Flow 4: Customer Investment Request & Lifecycle ---");
  let requestId = "";
  let requestVersion = 1;
  let customer2Cookie = "";
  const customer2Email = `other-${Date.now()}@startup.ir`;

  try {
    // 4.1 Submit investment request
    const formData = new FormData();
    formData.append("startup_name", "استارتاپ هوش دیجی");
    formData.append("founder_name", "علی رضایی بنیان‌گذار");
    formData.append("email", testEmail);
    formData.append("phone", "09121234567");
    formData.append("sector", "ai");
    formData.append("stage", "seed");
    formData.append("description", "پلتفرم هوشمند خدمات ابری و هوش مصنوعی برای کسب‌وکارهای مدرن در مقیاس وسیع.");
    formData.append("idempotency_key", crypto.randomUUID().replace(/-/g, ""));
    
    // Valid PDF buffer with magic bytes %PDF-
    const pdfBytes = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n");
    const dummyPdf = new Blob([pdfBytes], { type: "application/pdf" });
    formData.append("pitch_deck", dummyPdf, "pitch-deck.pdf");

    const submitRes = await fetch(`${BASE_URL}/api/requests`, {
      method: "POST",
      headers: { Cookie: customerCookie },
      body: formData,
    });
    const submitJson = await submitRes.json();
    requestId = submitJson.request?.id || "";
    requestVersion = submitJson.request?.version || 1;
    record("Flow 4", "Submit investment request HTTP 201", submitRes.status === 201 && !!requestId);

    // Verify DB record
    const [dbReq] = await db.select().from(investmentRequests).where(eq(investmentRequests.id, requestId));
    record("Flow 4", "Request stored with status 'submitted'", !!dbReq && dbReq.status === "submitted");

    // Verify confirmation email in outbox
    const [confirmEmail] = await db
      .select()
      .from(emailOutbox)
      .where(eq(emailOutbox.toEmail, testEmail))
      .orderBy(desc(emailOutbox.createdAt))
      .limit(1);
    record("Flow 4", "Confirmation email queued for customer", !!confirmEmail);

    // 4.2 Customer lists own requests
    const myReqRes = await fetch(`${BASE_URL}/api/requests/my`, {
      headers: { Cookie: customerCookie },
    });
    const myReqJson = await myReqRes.json();
    const hasMyReq = myReqJson.requests?.some((r: any) => r.id === requestId);
    record("Flow 4", "Customer dashboard lists submitted request", myReqRes.status === 200 && hasMyReq);

    // 4.3 Download pitch deck
    const downloadRes = await fetch(`${BASE_URL}/api/requests/${requestId}/download`, {
      headers: { Cookie: customerCookie },
    });
    const downloadBody = await downloadRes.text();
    record("Flow 4", "Customer downloads own pitch deck HTTP 200", downloadRes.status === 200 && downloadBody.includes("%PDF-1.4"));

    // 4.4 IDOR Protection Test
    // Register Customer 2
    const reg2Res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: customer2Email,
        password: "Password123!",
        fullName: "بنیان‌گذار دوم",
      }),
    });
    const log2Res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: customer2Email,
        password: "Password123!",
      }),
    });
    customer2Cookie = (log2Res.headers.get("set-cookie") || "").split(";")[0];

    // Customer 2 attempts to get Customer 1's request
    const idorReqRes = await fetch(`${BASE_URL}/api/requests/${requestId}`, {
      headers: { Cookie: customer2Cookie },
    });
    record("Flow 4", "Cross-tenant access blocked (IDOR guard returns 403/404)", idorReqRes.status === 403 || idorReqRes.status === 404);

    // Customer 2 attempts to download Customer 1's pitch deck
    const idorDlRes = await fetch(`${BASE_URL}/api/requests/${requestId}/download`, {
      headers: { Cookie: customer2Cookie },
    });
    record("Flow 4", "Cross-tenant file download blocked (IDOR guard returns 403/404)", idorDlRes.status === 403 || idorDlRes.status === 404);
  } catch (err: any) {
    record("Flow 4", "Flow 4 uncaught error", false, err.message);
  }

  // ==========================================
  // FLOW 5: Admin RBAC & Request Review Workflow
  // ==========================================
  console.log("\n--- Testing Flow 5: Admin RBAC & Request Review ---");
  let adminCookie = "";

  try {
    // 5.1 Customer blocked from admin APIs
    const custAdminRes = await fetch(`${BASE_URL}/api/admin/requests`, {
      headers: { Cookie: customerCookie },
    });
    record("Flow 5", "Customer access to /api/admin/requests blocked (403)", custAdminRes.status === 403);

    // 5.2 Admin login
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@digiventures.ir",
        password: "Password123!",
      }),
    });
    adminCookie = (adminLoginRes.headers.get("set-cookie") || "").split(";")[0];
    record("Flow 5", "Admin login HTTP 200", adminLoginRes.status === 200);

    // 5.3 Admin lists requests
    const adminReqListRes = await fetch(`${BASE_URL}/api/admin/requests`, {
      headers: { Cookie: adminCookie },
    });
    const adminReqListJson = await adminReqListRes.json();
    const foundByAdmin = adminReqListJson.requests?.some((r: any) => r.id === requestId);
    record("Flow 5", "Admin lists all requests including new submission", adminReqListRes.status === 200 && foundByAdmin);

    // 5.4 Admin adds internal note
    const addNoteRes = await fetch(`${BASE_URL}/api/requests/${requestId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        note: "بررسی اولیه انجام شد؛ نیاز به شفاف‌سازی بیزینس‌مدل دارد.",
      }),
    });
    record("Flow 5", "Admin adds internal note HTTP 200", addNoteRes.status === 200);

    // Customer attempts to add internal note -> blocked 403
    const custAddNoteRes = await fetch(`${BASE_URL}/api/requests/${requestId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: customerCookie,
      },
      body: JSON.stringify({ note: "Malicious note injection attempt" }),
    });
    record("Flow 5", "Customer cannot add internal notes (403)", custAddNoteRes.status === 403);

    // Customer views request -> internalNote is masked as null
    const custGetReqRes = await fetch(`${BASE_URL}/api/requests/${requestId}`, {
      headers: { Cookie: customerCookie },
    });
    const custGetReqJson = await custGetReqRes.json();
    record("Flow 5", "Customer cannot view internal notes (masked as null)", custGetReqJson.request?.internalNote === null);

    // 5.5 Status transition: submitted -> under_review
    const [curReq1] = await db.select().from(investmentRequests).where(eq(investmentRequests.id, requestId));
    const status1Res = await fetch(`${BASE_URL}/api/requests/${requestId}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        targetStatus: "under_review",
        expectedVersion: curReq1.version,
      }),
    });
    record("Flow 5", "Status transition submitted -> under_review HTTP 200", status1Res.status === 200);

    // 5.6 Status transition: under_review -> needs_revision
    const [curReq2] = await db.select().from(investmentRequests).where(eq(investmentRequests.id, requestId));
    const status2Res = await fetch(`${BASE_URL}/api/requests/${requestId}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        targetStatus: "needs_revision",
        expectedVersion: curReq2.version,
        adminMessage: "لطفاً برنامه مالی ۳ ساله را نیز پیوست کنید.",
      }),
    });
    record("Flow 5", "Status transition under_review -> needs_revision HTTP 200", status2Res.status === 200);

    // Verify revision notification email in outbox
    const [revEmail] = await db
      .select()
      .from(emailOutbox)
      .where(eq(emailOutbox.toEmail, testEmail))
      .orderBy(desc(emailOutbox.createdAt))
      .limit(1);
    record("Flow 5", "needs_revision notification queued for founder", !!revEmail);

    // 5.7 Customer updates/resubmits request via PUT
    const updateFormData = new FormData();
    updateFormData.append("description", "پلتفرم ابری هوش مصنوعی - فایل مالی نیز در ویرایش جدید پیوست شد.");
    updateFormData.append("is_resubmit", "true");

    const updateRes = await fetch(`${BASE_URL}/api/requests/${requestId}`, {
      method: "PUT",
      headers: { Cookie: customerCookie },
      body: updateFormData,
    });
    record("Flow 5", "Customer resubmission HTTP 200", updateRes.status === 200);

    // Verify status is back to submitted
    const [resubReq] = await db.select().from(investmentRequests).where(eq(investmentRequests.id, requestId));
    record("Flow 5", "Resubmitted request transitioned back to 'submitted'", resubReq?.status === "submitted");

    // 5.8 Admin accepts request: submitted -> under_review -> accepted
    await fetch(`${BASE_URL}/api/requests/${requestId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ targetStatus: "under_review", expectedVersion: resubReq.version }),
    });

    const [curReq3] = await db.select().from(investmentRequests).where(eq(investmentRequests.id, requestId));
    const acceptRes = await fetch(`${BASE_URL}/api/requests/${requestId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ targetStatus: "accepted", expectedVersion: curReq3.version }),
    });
    record("Flow 5", "Final status transition -> accepted HTTP 200", acceptRes.status === 200);
  } catch (err: any) {
    record("Flow 5", "Flow 5 uncaught error", false, err.message);
  }

  // ==========================================
  // FLOW 6: News Management & Public Visibility
  // ==========================================
  console.log("\n--- Testing Flow 6: News Publishing Flow ---");
  const newsSlug = `news-test-${Date.now()}`;
  let newsId = "";

  try {
    // 6.1 Create published article
    const createNewsRes = await fetch(`${BASE_URL}/api/admin/news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        title: "گزارش سرمایه‌گذاری جدید دیجی‌ونچرز",
        slug: newsSlug,
        content: "دیجی‌ونچرز راند جدید سرمایه‌گذاری روی استارتاپ‌های پیشرو را به صورت رسمی آغاز کرد.",
        excerpt: "خلاصه خبر سرمایه‌گذاری جدید در حوزه فناوری و هوش مصنوعی",
        status: "published",
      }),
    });
    const createNewsJson = await createNewsRes.json();
    newsId = createNewsJson.article?.id || "";
    record("Flow 6", "Admin creates published news article HTTP 201", createNewsRes.status === 201 && !!newsId);

    // 6.2 Public user accesses published article
    const pubNewsRes = await fetch(`${BASE_URL}/api/news/${newsSlug}`);
    record("Flow 6", "Public access to published article HTTP 200", pubNewsRes.status === 200);

    // 6.3 Admin unpublishes article (draft)
    const draftNewsRes = await fetch(`${BASE_URL}/api/admin/news/${newsId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        title: "گزارش سرمایه‌گذاری جدید دیجی‌ونچرز",
        slug: newsSlug,
        content: "دیجی‌ونچرز راند جدید سرمایه‌گذاری روی استارتاپ‌های پیشرو را به صورت رسمی آغاز کرد.",
        excerpt: "خلاصه خبر سرمایه‌گذاری جدید در حوزه فناوری و هوش مصنوعی",
        status: "draft",
      }),
    });
    record("Flow 6", "Admin updates article to draft HTTP 200", draftNewsRes.status === 200);

    // 6.4 Public access to draft article returns 404
    const pubDraftRes = await fetch(`${BASE_URL}/api/news/${newsSlug}`);
    record("Flow 6", "Public access to draft article returns 404 Not Found", pubDraftRes.status === 404);
  } catch (err: any) {
    record("Flow 6", "Flow 6 uncaught error", false, err.message);
  }

  // ==========================================
  // FLOW 7: User Management & Role Administration
  // ==========================================
  console.log("\n--- Testing Flow 7: User Management & Roles ---");
  try {
    // 7.1 Admin lists users
    const usersRes = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { Cookie: adminCookie },
    });
    const usersJson = await usersRes.json();
    record("Flow 7", "Admin lists users HTTP 200", usersRes.status === 200 && Array.isArray(usersJson.users));

    // 7.2 Admin updates user role
    const [targetUser] = await db.select().from(users).where(eq(users.email, customer2Email));
    if (targetUser) {
      const roleRes = await fetch(`${BASE_URL}/api/admin/users/${targetUser.id}/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: adminCookie,
        },
        body: JSON.stringify({ newRole: "admin" }),
      });
      record("Flow 7", "Admin updates user role to 'admin' HTTP 200", roleRes.status === 200);

      // Verify updated role in database
      const [updatedUser] = await db.select().from(users).where(eq(users.id, targetUser.id));
      record("Flow 7", "User role persisted as 'admin' in database", updatedUser?.role === "admin");
    }
  } catch (err: any) {
    record("Flow 7", "Flow 7 uncaught error", false, err.message);
  }

  // ==========================================
  // FLOW 8: Admin Email Templates
  // ==========================================
  console.log("\n--- Testing Flow 8: Email Templates Management ---");
  try {
    // 8.1 Admin lists email templates
    const tmplRes = await fetch(`${BASE_URL}/api/admin/email-templates`, {
      headers: { Cookie: adminCookie },
    });
    const tmplJson = await tmplRes.json();
    record("Flow 8", "Admin lists email templates HTTP 200", tmplRes.status === 200 && Array.isArray(tmplJson.templates));

    // 8.2 Admin updates an email template
    const updateTmplRes = await fetch(`${BASE_URL}/api/admin/email-templates/request_received`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        subject: "درخواست سرمایه‌گذاری شما در دیجی‌ونچرز با موفقیت ثبت شد",
        body: "درود {founder_name} عزیز، درخواست شما دریافت گردید و در حال بررسی است.",
      }),
    });
    record("Flow 8", "Admin updates email template HTTP 200", updateTmplRes.status === 200);
  } catch (err: any) {
    record("Flow 8", "Flow 8 uncaught error", false, err.message);
  }

  // ==========================================
  // FLOW 9: Email Outbox Worker Processing
  // ==========================================
  console.log("\n--- Testing Flow 9: Outbox Email Delivery Worker ---");
  try {
    const workerResult = await EmailService.processOutbox(10);
    record("Flow 9", "EmailService outbox processes successfully", typeof workerResult.processed === "number");
  } catch (err: any) {
    record("Flow 9", "Flow 9 uncaught error", false, err.message);
  }

  // ==========================================
  // SUMMARY
  // ==========================================
  console.log("\n==========================================================");
  console.log("FLOW VERIFICATION SUMMARY");
  console.log("==========================================================");
  const total = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;

  console.log(`Total Checks: ${total}`);
  console.log(`Passed:       ${passed}`);
  console.log(`Failed:       ${failed}`);

  if (failed > 0) {
    console.log("\nFailed Steps:");
    results
      .filter((r) => r.status === "FAIL")
      .forEach((r) => console.log(` - [${r.flow}] ${r.step} (${r.details || "No details"})`));
  }
  console.log("==========================================================\n");

  process.exit(failed > 0 ? 1 : 0);
}

runAllFlows().catch((err) => {
  console.error("Fatal test suite error:", err);
  process.exit(1);
});
