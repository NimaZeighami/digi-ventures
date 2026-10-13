import { db } from "../../db";
import { users, investmentRequests, contactSubmissions, emailOutbox } from "../../db/schema";
import { eq } from "drizzle-orm";

const BASE_URL = process.env.APP_URL || "http://localhost:3000";

interface TestContext {
  customer1Cookie: string;
  customer1Id: string;
  customer2Cookie: string;
  customer2Id: string;
  reviewerCookie: string;
  superAdminCookie: string;
  requestId?: string;
}

class TestSuite {
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
    console.log(`Test Results: ${this.passed} passed, ${this.failed} failed`);
    if (this.failures.length > 0) {
      console.log(`Failures:`);
      this.failures.forEach((f) => console.log(` - ${f}`));
    }
    console.log(`========================================\n`);
    return this.failed === 0;
  }
}

const suite = new TestSuite();

function createDummyPdfBuffer(text = "Valid PDF content"): Buffer {
  const header = Buffer.from("%PDF-1.4\n%âãÏÓ\n");
  const body = Buffer.from(`1 0 obj\n<< /Title (${text}) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n`);
  return Buffer.concat([header, body]);
}

async function extractCookie(res: Response): Promise<string> {
  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) return "";
  const match = setCookie.match(/dv_session=([^;]+)/);
  return match ? `dv_session=${match[1]}` : "";
}

async function run() {
  console.log(`\n======================================================`);
  console.log(`STAGE 5: E2E MULTI-PERSONA & SECURITY PENETRATION SUITE`);
  console.log(`Testing Live Target: ${BASE_URL}`);
  console.log(`======================================================\n`);

  const ctx: TestContext = {
    customer1Cookie: "",
    customer1Id: "",
    customer2Cookie: "",
    customer2Id: "",
    reviewerCookie: "",
    superAdminCookie: "",
  };

  const ts = Date.now();
  const c1Email = `c1-${ts}@startup.ir`;
  const c2Email = `c2-${ts}@startup.ir`;
  const password = "ValidSecurePass#2026";

  // --------------------------------------------------------------------------
  // 1. PERSONA SETUP & REGISTRATION
  // --------------------------------------------------------------------------
  console.log(`\n--- 1. Persona Registration & Authentication ---`);

  // Register Customer 1
  const reg1Res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "مؤسس الف", email: c1Email, password }),
  });
  const reg1Data = await reg1Res.json();
  suite.assert(reg1Res.status === 201 && !!reg1Data.user?.id, "Customer 1 registration returns 201 Created");
  ctx.customer1Id = reg1Data.user?.id;

  // Login Customer 1 to obtain session cookie
  const login1Res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: c1Email, password }),
  });
  ctx.customer1Cookie = await extractCookie(login1Res);
  suite.assert(login1Res.status === 200 && ctx.customer1Cookie.length > 0, "Customer 1 login returns 200 OK with session cookie");

  // Register Customer 2
  const reg2Res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "مؤسس ب", email: c2Email, password }),
  });
  const reg2Data = await reg2Res.json();
  suite.assert(reg2Res.status === 201 && !!reg2Data.user?.id, "Customer 2 registration returns 201 Created");
  ctx.customer2Id = reg2Data.user?.id;

  // Login Customer 2 to obtain session cookie
  const login2Res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: c2Email, password }),
  });
  ctx.customer2Cookie = await extractCookie(login2Res);
  suite.assert(login2Res.status === 200 && ctx.customer2Cookie.length > 0, "Customer 2 login returns 200 OK with session cookie");

  // Login Reviewer (seeded password: Password123!)
  const revLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "reviewer@digiventures.ir", password: "Password123!" }),
  });
  ctx.reviewerCookie = await extractCookie(revLoginRes);
  suite.assert(revLoginRes.status === 200 && ctx.reviewerCookie.length > 0, "Reviewer login returns 200 OK with session cookie");

  // Login Super Admin (seeded password: Password123!)
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@digiventures.ir", password: "Password123!" }),
  });
  ctx.superAdminCookie = await extractCookie(adminLoginRes);
  suite.assert(adminLoginRes.status === 200 && ctx.superAdminCookie.length > 0, "Super Admin login returns 200 OK with session cookie");

  // --------------------------------------------------------------------------
  // 2. INVESTMENT REQUEST LIFECYCLE (Customer 1)
  // --------------------------------------------------------------------------
  console.log(`\n--- 2. Investment Request Lifecycle (Draft -> Submit -> Review -> Revision -> Accept) ---`);

  // Customer 1: Create Draft Request with PDF
  const draftForm = new FormData();
  draftForm.append("startup_name", "هوش مصنوعی نگین");
  draftForm.append("founder_name", "مؤسس الف");
  draftForm.append("email", c1Email);
  draftForm.append("phone", "۰۹۱۲۳۴۵۶۷۸۹"); // Persian numerals
  draftForm.append("sector", "ai");
  draftForm.append("stage", "seed");
  draftForm.append("description", "سامانه هوشمند تشخیص ناهنجاری صنعتی با الگوریتم‌های یادگیری عمیق");
  draftForm.append("idempotency_key", crypto.randomUUID());
  draftForm.append("is_draft", "true");
  const pdfBlob = new Blob([new Uint8Array(createDummyPdfBuffer("Initial Pitch Deck"))], { type: "application/pdf" });
  draftForm.append("pitch_deck", pdfBlob, "pitch_deck_v1.pdf");

  const draftRes = await fetch(`${BASE_URL}/api/requests`, {
    method: "POST",
    headers: { Cookie: ctx.customer1Cookie },
    body: draftForm,
  });
  const draftData = await draftRes.json();
  suite.assert(draftRes.status === 201 && draftData.request?.status === "draft", "Customer 1 creates draft request (status: draft)");
  ctx.requestId = draftData.request?.id;

  // Customer 1: Update Draft
  const updateForm = new FormData();
  updateForm.append("startup_name", "هوش مصنوعی نگین شرق");
  updateForm.append("founder_name", "مؤسس الف ویرایش شده");
  updateForm.append("email", c1Email);
  updateForm.append("phone", "09123456789");
  updateForm.append("sector", "ai");
  updateForm.append("stage", "seed");
  updateForm.append("description", "سامانه هوشمند تشخیص ناهنجاری صنعتی پیشرفته");
  updateForm.append("is_resubmit", "false");

  const updateDraftRes = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}`, {
    method: "PUT",
    headers: { Cookie: ctx.customer1Cookie },
    body: updateForm,
  });
  const updateDraftData = await updateDraftRes.json();
  suite.assert(updateDraftRes.status === 200 && updateDraftData.request?.startupName === "هوش مصنوعی نگین شرق", "Customer 1 updates draft successfully");

  // Customer 1: Submit Request (Transitions draft -> submitted)
  const submitForm = new FormData();
  submitForm.append("startup_name", "هوش مصنوعی نگین شرق");
  submitForm.append("founder_name", "مؤسس الف ویرایش شده");
  submitForm.append("email", c1Email);
  submitForm.append("phone", "09123456789");
  submitForm.append("sector", "ai");
  submitForm.append("stage", "seed");
  submitForm.append("description", "سامانه هوشمند نسخه نهایی جهت ارزیابی");
  submitForm.append("is_resubmit", "true"); // trigger submit transition

  const submitRes = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}`, {
    method: "PUT",
    headers: { Cookie: ctx.customer1Cookie },
    body: submitForm,
  });
  const submitData = await submitRes.json();
  suite.assert(submitRes.status === 200 && submitData.request?.status === "submitted", "Customer 1 submits request (status: submitted)");

  // Customer 1: Attempt to edit submitted request directly -> must be rejected
  const illegalEditForm = new FormData();
  illegalEditForm.append("startup_name", "تغییر غیرمجاز");
  illegalEditForm.append("is_resubmit", "false");
  const illegalEditRes = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}`, {
    method: "PUT",
    headers: { Cookie: ctx.customer1Cookie },
    body: illegalEditForm,
  });
  suite.assert(
    illegalEditRes.status === 409 || illegalEditRes.status === 400 || illegalEditRes.status === 403,
    "Editing a submitted request is blocked for founder (status != draft/needs_revision returns 409 Conflict)"
  );

  // --------------------------------------------------------------------------
  // 3. IDOR & CROSS-TENANT ISOLATION TESTS
  // --------------------------------------------------------------------------
  console.log(`\n--- 3. IDOR & Boundary Isolation (Customer 2 on Customer 1's Data) ---`);

  // Customer 2 attempts to GET Customer 1's request details
  const idorGetRes = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}`, {
    headers: { Cookie: ctx.customer2Cookie },
  });
  suite.assert(idorGetRes.status === 403 || idorGetRes.status === 404, "Customer 2 GET Customer 1 request blocked (403/404)");

  // Customer 2 attempts to download Customer 1's pitch deck
  const idorDownloadRes = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}/download`, {
    headers: { Cookie: ctx.customer2Cookie },
  });
  suite.assert(idorDownloadRes.status === 403 || idorDownloadRes.status === 404, "Customer 2 deck download blocked (403/404)");

  // Customer 2 attempts to update Customer 1's request
  const idorPutRes = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}`, {
    method: "PUT",
    headers: { Cookie: ctx.customer2Cookie },
    body: updateForm,
  });
  suite.assert(idorPutRes.status === 403 || idorPutRes.status === 404, "Customer 2 PUT Customer 1 request blocked (403/404)");

  // --------------------------------------------------------------------------
  // 4. REVIEWER & DILIGENCE OPERATIONS
  // --------------------------------------------------------------------------
  console.log(`\n--- 4. Reviewer Operations & State Machine Verification ---`);

  // Reviewer downloads Customer 1's pitch deck
  const revDownloadRes = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}/download`, {
    headers: { Cookie: ctx.reviewerCookie },
  });
  suite.assert(revDownloadRes.status === 200 && revDownloadRes.headers.get("content-type")?.includes("pdf") === true, "Reviewer downloads pitch deck with valid content-type: application/pdf");

  // Reviewer adds an internal private note
  const noteRes = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: ctx.reviewerCookie,
    },
    body: JSON.stringify({ note: "یادداشت محرمانه: تیم فنی قوی دارند اما برنامه رشد نیازمند شفاف‌سازی است." }),
  });
  suite.assert(noteRes.status === 200, "Reviewer adds confidential internal note");

  // Verify internal note is NOT visible to Customer 1
  const c1GetDetailsRes = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}`, {
    headers: { Cookie: ctx.customer1Cookie },
  });
  const c1GetDetails = await c1GetDetailsRes.json();
  suite.assert(!c1GetDetails.internalNotes || c1GetDetails.internalNotes.length === 0, "Confidential internal note is NOT leaked to customer");

  // Get current version for optimistic concurrency
  const revReqDetailsRes = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}`, {
    headers: { Cookie: ctx.reviewerCookie },
  });
  const revReqDetails = await revReqDetailsRes.json();
  const currentVersion = revReqDetails.request.version;

  // Reviewer transitions: submitted -> under_review
  const trans1Res = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: ctx.reviewerCookie,
    },
    body: JSON.stringify({
      targetStatus: "under_review",
      expectedVersion: currentVersion,
    }),
  });
  const trans1Data = await trans1Res.json();
  suite.assert(trans1Res.status === 200 && trans1Data.request?.status === "under_review", "Reviewer transitions status to under_review");

  // Reviewer transitions: under_review -> needs_revision (without message -> MUST fail)
  const invalidRevRes = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: ctx.reviewerCookie,
    },
    body: JSON.stringify({
      targetStatus: "needs_revision",
      expectedVersion: trans1Data.request?.version,
      adminMessage: "", // empty message is forbidden
    }),
  });
  suite.assert(invalidRevRes.status === 422 || invalidRevRes.status === 400, "needs_revision transition requires mandatory admin message");

  // Reviewer transitions: under_review -> needs_revision (with valid message)
  const validRevRes = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: ctx.reviewerCookie,
    },
    body: JSON.stringify({
      targetStatus: "needs_revision",
      expectedVersion: trans1Data.request?.version,
      adminMessage: "لطفاً تحلیل رقبای بازار را در اسلاید ۴ پیچ‌دک تکمیل و فایل جدید را آپلود نمایید.",
    }),
  });
  const validRevData = await validRevRes.json();
  suite.assert(validRevRes.status === 200 && validRevData.request?.status === "needs_revision", "Reviewer transitions status to needs_revision with message");

  // Customer 1 sees needs_revision and admin message
  const c1RevCheck = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}`, {
    headers: { Cookie: ctx.customer1Cookie },
  });
  const c1RevData = await c1RevCheck.json();
  suite.assert(
    c1RevData.request?.status === "needs_revision" &&
    c1RevData.request?.adminMessage?.includes("تحلیل رقبای بازار"),
    "Customer 1 receives needs_revision status and reviewer guidance message"
  );

  // Customer 1 edits and resubmits
  const resubmitForm = new FormData();
  resubmitForm.append("startup_name", "هوش مصنوعی نگین شرق");
  resubmitForm.append("founder_name", "مؤسس الف ویرایش شده");
  resubmitForm.append("email", c1Email);
  resubmitForm.append("phone", "09123456789");
  resubmitForm.append("sector", "ai");
  resubmitForm.append("stage", "seed");
  resubmitForm.append("description", "نسخه اصلاح شده با تحلیل کامل رقبا و اندازه بازار");
  resubmitForm.append("is_resubmit", "true");
  const newPdfBlob = new Blob([new Uint8Array(createDummyPdfBuffer("Pitch Deck v2 with Competitor Matrix"))], { type: "application/pdf" });
  resubmitForm.append("pitch_deck", newPdfBlob, "pitch_deck_v2.pdf");

  const resubmitRes = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}`, {
    method: "PUT",
    headers: { Cookie: ctx.customer1Cookie },
    body: resubmitForm,
  });
  const resubmitData = await resubmitRes.json();
  suite.assert(resubmitRes.status === 200 && resubmitData.request?.status === "submitted", "Customer 1 resubmits revised request (status: submitted)");

  // Reviewer accepts the request (submitted -> under_review -> accepted)
  const revAccept1 = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: ctx.reviewerCookie },
    body: JSON.stringify({
      targetStatus: "under_review",
      expectedVersion: resubmitData.request?.version,
    }),
  });
  const revAccept1Data = await revAccept1.json();

  const revAcceptFinal = await fetch(`${BASE_URL}/api/requests/${ctx.requestId}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: ctx.reviewerCookie },
    body: JSON.stringify({
      targetStatus: "accepted",
      expectedVersion: revAccept1Data.request?.version,
      adminMessage: "تبریک، استارتاپ شما جهت برگزاری جلسه نهایی در کمیته سرمایه‌گذاری تایید شد.",
    }),
  });
  const revAcceptFinalData = await revAcceptFinal.json();
  suite.assert(revAcceptFinal.status === 200 && revAcceptFinalData.request?.status === "accepted", "Reviewer marks request as accepted");

  // --------------------------------------------------------------------------
  // 5. SUPER ADMIN & RBAC ELEVATION TESTS
  // --------------------------------------------------------------------------
  console.log(`\n--- 5. RBAC & Super Admin Privilege Elevation ---`);

  // Customer 2 attempts to hit /api/admin/requests before promotion -> 403 Forbidden
  const c2AdminBefore = await fetch(`${BASE_URL}/api/admin/requests`, {
    headers: { Cookie: ctx.customer2Cookie },
  });
  suite.assert(c2AdminBefore.status === 403, "Customer 2 blocked from /api/admin/requests (403 Forbidden)");

  // Super Admin promotes Customer 2 to 'admin'
  const promoteRes = await fetch(`${BASE_URL}/api/admin/users/${ctx.customer2Id}/role`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: ctx.superAdminCookie },
    body: JSON.stringify({ newRole: "admin" }),
  });
  suite.assert(promoteRes.status === 200, "Super Admin successfully promotes Customer 2 to admin");

  // Customer 2 accesses /api/admin/requests after promotion -> 200 OK
  const c2AdminAfter = await fetch(`${BASE_URL}/api/admin/requests`, {
    headers: { Cookie: ctx.customer2Cookie },
  });
  suite.assert(c2AdminAfter.status === 200, "Promoted Customer 2 can now access /api/admin/requests (200 OK)");

  // Super Admin demotes Customer 2 back to 'customer'
  const demoteRes = await fetch(`${BASE_URL}/api/admin/users/${ctx.customer2Id}/role`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: ctx.superAdminCookie },
    body: JSON.stringify({ newRole: "customer" }),
  });
  suite.assert(demoteRes.status === 200, "Super Admin demotes Customer 2 back to customer");

  // Customer 2 is blocked again -> 403
  const c2AdminDemoted = await fetch(`${BASE_URL}/api/admin/requests`, {
    headers: { Cookie: ctx.customer2Cookie },
  });
  suite.assert(c2AdminDemoted.status === 403, "Demoted Customer 2 is blocked from /api/admin/requests again (403 Forbidden)");

  // Super Admin edits email template
  const tmplRes = await fetch(`${BASE_URL}/api/admin/email-templates/request_received`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: ctx.superAdminCookie },
    body: JSON.stringify({
      subject: "درخواست سرمایه‌گذاری با موفقیت دریافت گردید",
      body: "سلام {{name}} عزیز، درخواست شما ثبت شد و در صف ارزیابی قرار دارد.",
    }),
  });
  suite.assert(tmplRes.status === 200, "Super Admin updates email template successfully");

  // --------------------------------------------------------------------------
  // 6. SECURITY PENETRATION & STORAGE INTEGRITY
  // --------------------------------------------------------------------------
  console.log(`\n--- 6. Security Penetration (Fake Magic Bytes, Traversal, Spoofing) ---`);

  // Fake PDF file with shell script / text contents (fails magic bytes check)
  const fakePdfForm = new FormData();
  fakePdfForm.append("startup_name", "استارتاپ بدافزار");
  fakePdfForm.append("founder_name", "مهاجم سیستم");
  fakePdfForm.append("email", `attacker-${ts}@evil.com`);
  fakePdfForm.append("phone", "09120000000");
  fakePdfForm.append("sector", "ai");
  fakePdfForm.append("stage", "seed");
  fakePdfForm.append("description", "تلاش برای دور زدن فایروال و آپلود فایل مخرب اجرایی در سیستم");
  fakePdfForm.append("idempotency_key", crypto.randomUUID());
  fakePdfForm.append("is_draft", "false");
  const fakeBlob = new Blob([new Uint8Array(Buffer.from("#!/bin/bash\nrm -rf / --no-preserve-root\n"))], { type: "application/pdf" });
  fakePdfForm.append("pitch_deck", fakeBlob, "exploit.pdf");

  const fakeUploadRes = await fetch(`${BASE_URL}/api/requests`, {
    method: "POST",
    headers: { Cookie: ctx.customer1Cookie },
    body: fakePdfForm,
  });
  suite.assert(fakeUploadRes.status === 415 || fakeUploadRes.status === 400, "Fake PDF with invalid binary magic bytes is rejected (415/400)");

  // Path traversal in download endpoint
  const traversalDownloadRes = await fetch(`${BASE_URL}/api/requests/..%2F..%2Fetc%2Fpasswd/download`, {
    headers: { Cookie: ctx.superAdminCookie },
  });
  suite.assert(traversalDownloadRes.status === 400 || traversalDownloadRes.status === 404, "Path traversal in download endpoint blocked safely (400/404)");

  // Anonymous request to protected routes
  const anonAdminRes = await fetch(`${BASE_URL}/api/admin/users`);
  suite.assert(anonAdminRes.status === 401, "Anonymous request to /api/admin/users blocked (401 Unauthorized)");

  const anonRequestsRes = await fetch(`${BASE_URL}/api/requests/my`);
  suite.assert(anonRequestsRes.status === 401, "Anonymous request to /api/requests/my blocked (401 Unauthorized)");

  // --------------------------------------------------------------------------
  // 7. HONEYPOT & CONTACT RATE LIMITING
  // --------------------------------------------------------------------------
  console.log(`\n--- 7. Honeypot & Contact Abuse Prevention ---`);

  // Honeypot test: Spambot filling 'website' field
  const honeypotRes = await fetch(`${BASE_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Forwarded-For": "203.0.113.88",
    },
    body: JSON.stringify({
      name: "Spam Bot",
      email: "bot@spammer.org",
      phone: "09120000000",
      subject: "Buy cheap backlinks",
      message: "Check out our amazing link building offer right now!",
      website: "http://spamlink.com", // HONEYPOT TRAP
    }),
  });
  suite.assert(honeypotRes.status === 200, "Honeypot returns 200 OK to deceive spambot");

  // Verify DB does not contain the spam message
  const spamRecords = await db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.email, "bot@spammer.org"));
  suite.assert(spamRecords.length === 0, "Database contains NO records from honeypot-trapped submission");

  // Rate limiting test for contact form (max 3 per hour per IP)
  const contactIp = `198.51.100.${Math.floor(Math.random() * 200) + 10}`;
  let lastContactStatus = 0;
  for (let i = 1; i <= 4; i++) {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": contactIp,
      },
      body: JSON.stringify({
        name: `کاربر تست ${i}`,
        email: `contact-${i}-${ts}@test.ir`,
        phone: "09121234567",
        subject: "پرسش در مورد شتابدهی",
        message: "سلام، می‌خواستم درباره فرآیند پذیرش دوره جدید سوال بپرسم.",
      }),
    });
    lastContactStatus = res.status;
  }
  suite.assert(lastContactStatus === 429, "Contact form enforces rate limiting after 3 requests (4th request returns 429 Too Many Requests)");

  // --------------------------------------------------------------------------
  // 8. INPUT NORMALIZATION & SANITIZATION
  // --------------------------------------------------------------------------
  console.log(`\n--- 8. Persian Digit Normalization & Data Sanitization ---`);

  // Test registration with Persian digits
  const normEmail = `founder-persian-${ts}@startup.ir`;
  const normReg = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "کاربر با ارقام فارسی",
      email: normEmail,
      password: "Password#1234",
    }),
  });
  suite.assert(normReg.status === 201, "User registered successfully");

  const normLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: normEmail, password: "Password#1234" }),
  });
  const normCookie = await extractCookie(normLogin);
  suite.assert(normLogin.status === 200 && normCookie.length > 0, "Persian user logged in successfully");

  // Test intake submission with Persian digits in phone
  const normForm = new FormData();
  normForm.append("startup_name", "سامانه هوش مصنوعی تست");
  normForm.append("founder_name", "کاربر تست");
  normForm.append("email", normEmail);
  normForm.append("phone", "۰۹۱۲۹۸۷۶۵۴۳"); // Persian: 09129876543
  normForm.append("sector", "ai");
  normForm.append("stage", "seed");
  normForm.append("description", "تست نرمال‌سازی ارقام در پایگاه داده و ذخیره‌سازی داده‌های استارتاپ");
  normForm.append("idempotency_key", crypto.randomUUID());
  normForm.append("is_draft", "true");
  normForm.append("pitch_deck", new Blob([new Uint8Array(createDummyPdfBuffer())], { type: "application/pdf" }), "deck.pdf");

  const normRes = await fetch(`${BASE_URL}/api/requests`, {
    method: "POST",
    headers: { Cookie: normCookie },
    body: normForm,
  });
  const normData = await normRes.json();
  suite.assert(
    normRes.status === 201 && normData.request?.phone === "09129876543",
    "Persian digits in phone ('۰۹۱۲۹۸۷۶۵۴۳') successfully normalized to ASCII ('09129876543')"
  );

  const success = suite.summary();
  if (!success) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Test execution failed with fatal error:", err);
  process.exit(1);
});
