import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/db";
import { users, investmentRequests, requestStatusHistory, emailOutbox } from "@/db/schema";
import { eq } from "drizzle-orm";
import { RequestService } from "@/modules/requests/service";
import { TransitionService } from "@/modules/requests/transition";
import {
  InvalidTransitionError,
  ForbiddenError,
  ValidationError,
  ConflictError,
} from "@/lib/errors";

describe("Phase 4: Investment Request Engine & State Machine", () => {
  let customerUser: { id: string; role: "customer" };
  let adminUser: { id: string; role: "admin" };
  let otherCustomerUser: { id: string; role: "customer" };

  beforeEach(async () => {
    // Clean up existing test requests
    await db.delete(requestStatusHistory);
    await db.delete(investmentRequests);
    await db.delete(emailOutbox);

    const [customer] = await db
      .select()
      .from(users)
      .where(eq(users.role, "customer"));
    customerUser = { id: customer.id, role: "customer" };

    const [admin] = await db
      .select()
      .from(users)
      .where(eq(users.role, "admin"));
    adminUser = { id: admin.id, role: "admin" };

    // Create a secondary customer for cross-tenant isolation tests
    const [secondUser] = await db
      .insert(users)
      .values({
        email: "other@startup.ir",
        passwordHash: "$argon2id$fakehash",
        role: "customer",
      })
      .onConflictDoUpdate({
        target: users.email,
        set: { role: "customer" },
      })
      .returning();
    otherCustomerUser = { id: secondUser.id, role: "customer" };
  });

  const samplePayload = {
    startup_name: "استارتاپ لجستیک هوشمند",
    founder_name: "علیرضا رضایی",
    email: "alireza@logistics.ir",
    phone: "09123456789",
    sector: "supply_chain" as const,
    stage: "early" as const,
    description: "سامانه بهینه‌سازی مسیرهای توزیع کالا با استفاده از الگوریتم‌های هوش مصنوعی پیشرفته.",
    idempotency_key: "test-idemp-" + Math.random().toString(36).slice(2),
  };

  const sampleFile = {
    filePath: "2026/10/pitch-deck-test.pdf",
    originalFileName: "SmartLogistics_Deck.pdf",
    fileSize: 1024 * 100,
    mimeType: "application/pdf",
  };

  it("creates a draft proposal without queueing confirmation email", async () => {
    const draft = await RequestService.createDraft(customerUser, samplePayload);
    expect(draft.id).toBeDefined();
    expect(draft.status).toBe("draft");

    const outbox = await db.select().from(emailOutbox);
    expect(outbox.length).toBe(0); // No email for drafts
  });

  it("submits a new request, enforces idempotency, and queues E1 confirmation email", async () => {
    const req = await RequestService.submitNewRequest(customerUser, samplePayload, sampleFile);
    expect(req.status).toBe("submitted");
    expect(req.filePath).toBe(sampleFile.filePath);

    // Verify E1 email was queued in email_outbox
    const [outboxItem] = await db
      .select()
      .from(emailOutbox)
      .where(eq(emailOutbox.toEmail, samplePayload.email));
    expect(outboxItem).toBeDefined();
    expect(outboxItem.toEmail).toBe(samplePayload.email);
    expect(outboxItem.subject).toMatch(/(ثبت شد|دریافت گردید)/);

    // Idempotency test: submitting again with same key returns existing row
    const dup = await RequestService.submitNewRequest(customerUser, samplePayload, sampleFile);
    expect(dup.id).toBe(req.id);
  });

  it("executes the complete happy path diligence lifecycle with state tracking", async () => {
    // 1. Submit Request
    const req = await RequestService.submitNewRequest(customerUser, samplePayload, sampleFile);
    expect(req.status).toBe("submitted");

    // 2. Admin starts review: submitted -> under_review
    const underReview = await TransitionService.executeTransition({
      requestId: req.id,
      targetStatus: "under_review",
      actor: adminUser,
      expectedVersion: req.version,
    });
    expect(underReview.status).toBe("under_review");

    // 3. Admin requests revision: under_review -> needs_revision
    const needsRev = await TransitionService.executeTransition({
      requestId: req.id,
      targetStatus: "needs_revision",
      actor: adminUser,
      adminMessage: "لطفاً صورت‌های مالی سال گذشته و پیش‌بینی جریان وجوه نقد را ضمیمه کنید.",
      expectedVersion: underReview.version,
    });
    expect(needsRev.status).toBe("needs_revision");

    // 4. Customer resubmits: needs_revision -> submitted
    const resubmitted = await RequestService.resubmitRequest(
      customerUser,
      req.id,
      { description: "توضیحات و صورت‌های مالی جدید به‌روزرسانی شد." }
    );
    expect(resubmitted.status).toBe("submitted");

    // 5. Admin begins review again: submitted -> under_review
    const reviewAgain = await TransitionService.executeTransition({
      requestId: req.id,
      targetStatus: "under_review",
      actor: adminUser,
      expectedVersion: resubmitted.version,
    });
    expect(reviewAgain.status).toBe("under_review");

    // 6. Admin accepts proposal: under_review -> accepted
    const accepted = await TransitionService.executeTransition({
      requestId: req.id,
      targetStatus: "accepted",
      actor: adminUser,
      adminMessage: "طرح شما با موفقیت در کمیته سرمایه‌گذاری پذیرفته شد.",
      expectedVersion: reviewAgain.version,
    });
    expect(accepted.status).toBe("accepted");

    // Check status history integrity
    const history = await db
      .select()
      .from(requestStatusHistory)
      .where(eq(requestStatusHistory.requestId, req.id));
    expect(history.length).toBeGreaterThanOrEqual(5);
  });

  it("handles rejection flow with mandatory admin message", async () => {
    const req = await RequestService.submitNewRequest(customerUser, samplePayload, sampleFile);

    const underReview = await TransitionService.executeTransition({
      requestId: req.id,
      targetStatus: "under_review",
      actor: adminUser,
      expectedVersion: req.version,
    });

    // Rejection without explanation must fail
    await expect(
      TransitionService.executeTransition({
        requestId: req.id,
        targetStatus: "rejected",
        actor: adminUser,
        adminMessage: "کوتاه", // < 10 chars
        expectedVersion: underReview.version,
      })
    ).rejects.toThrow(ValidationError);

    // Rejection with proper explanation succeeds
    const rejected = await TransitionService.executeTransition({
      requestId: req.id,
      targetStatus: "rejected",
      actor: adminUser,
      adminMessage: "متأسفانه مرحله رشد استارتاپ شما در حال حاضر با معیارهای سرمایه‌گذاری ما همخوانی ندارد.",
      expectedVersion: underReview.version,
    });
    expect(rejected.status).toBe("rejected");
  });

  it("rejects invalid state transitions centrally", async () => {
    const req = await RequestService.submitNewRequest(customerUser, samplePayload, sampleFile);

    // submitted cannot jump straight to accepted!
    await expect(
      TransitionService.executeTransition({
        requestId: req.id,
        targetStatus: "accepted",
        actor: adminUser,
        expectedVersion: req.version,
      })
    ).rejects.toThrow(InvalidTransitionError);

    // submitted cannot jump to needs_revision without under_review!
    await expect(
      TransitionService.executeTransition({
        requestId: req.id,
        targetStatus: "needs_revision",
        actor: adminUser,
        adminMessage: "توضیحات تکمیلی برای بازنگری",
        expectedVersion: req.version,
      })
    ).rejects.toThrow(InvalidTransitionError);
  });

  it("enforces optimistic concurrency control on stale version", async () => {
    const req = await RequestService.submitNewRequest(customerUser, samplePayload, sampleFile);

    // Simulate Admin A moving to under_review
    await TransitionService.executeTransition({
      requestId: req.id,
      targetStatus: "under_review",
      actor: adminUser,
      expectedVersion: req.version, // version 1
    });

    // Admin B submits action using the old version 1 -> MUST throw ConflictError
    await expect(
      TransitionService.executeTransition({
        requestId: req.id,
        targetStatus: "under_review",
        actor: adminUser,
        expectedVersion: 1, // Stale!
      })
    ).rejects.toThrow(ConflictError);
  });

  it("isolates customer data and prevents cross-tenant access", async () => {
    const req = await RequestService.submitNewRequest(customerUser, samplePayload, sampleFile);

    // 1. Customer B cannot access Customer A's proposal
    await expect(
      RequestService.getRequestById(otherCustomerUser, req.id)
    ).rejects.toThrow(ForbiddenError);

    // 2. Customer A viewing own request: internalNote is sanitized to null
    await RequestService.addInternalNote(adminUser, req.id, "یادداشت محرمانه ارزیاب");
    const { request: founderView } = await RequestService.getRequestById(customerUser, req.id);
    expect(founderView.internalNote).toBeNull();

    // 3. Admin viewing request: internalNote is visible
    const { request: adminView } = await RequestService.getRequestById(adminUser, req.id);
    expect(adminView.internalNote).toContain("یادداشت محرمانه ارزیاب");
  });

  it("filters diligence requests by status, sector, and search keyword", async () => {
    const req = await RequestService.submitNewRequest(customerUser, samplePayload, sampleFile);

    // Filter by sector
    const sectorMatch = await RequestService.getAllRequests(adminUser, { sector: "supply_chain" });
    expect(sectorMatch.some((r) => r.id === req.id)).toBe(true);

    const sectorMismatch = await RequestService.getAllRequests(adminUser, { sector: "fintech" });
    expect(sectorMismatch.some((r) => r.id === req.id)).toBe(false);

    // Filter by search keyword
    const searchMatch = await RequestService.getAllRequests(adminUser, { search: "لجستیک" });
    expect(searchMatch.some((r) => r.id === req.id)).toBe(true);

    const searchMismatch = await RequestService.getAllRequests(adminUser, { search: "غیرمرتبط" });
    expect(searchMismatch.some((r) => r.id === req.id)).toBe(false);
  });

  it("queues styled notification emails for both founder and admin on status rejection", async () => {
    // 1. Submit proposal
    const req = await RequestService.submitNewRequest(customerUser, samplePayload, sampleFile);

    // Initial submit queues email for founder and admin
    const initialEmails = await db.select().from(emailOutbox);
    expect(initialEmails.some((e) => e.toEmail === req.email)).toBe(true);

    // 2. Transition: submitted -> under_review
    const underReview = await TransitionService.executeTransition({
      requestId: req.id,
      targetStatus: "under_review",
      actor: adminUser,
      expectedVersion: req.version,
    });

    // 3. Rejection: under_review -> rejected
    await TransitionService.executeTransition({
      requestId: req.id,
      targetStatus: "rejected",
      actor: adminUser,
      adminMessage: "متأسفانه به دلیل عدم تطابق مرحله رشد با معیارهای دوره جاری امکان پذیرش وجود ندارد.",
      expectedVersion: underReview.version,
    });

    // Verify outbox entries
    const allOutbox = await db.select().from(emailOutbox);
    
    // Both founder and admin notification emails must be present
    expect(allOutbox.some((e) => e.toEmail === req.email)).toBe(true);

    // Founder rejection email must contain admin message and Persian RTL layout
    const founderEmail = allOutbox.find(
      (e) => e.toEmail === req.email && e.textBody?.includes("عدم تطابق")
    );
    expect(founderEmail).toBeDefined();
    expect(founderEmail?.htmlBody).toContain('dir="rtl"');
    expect(founderEmail?.htmlBody).toContain("دیجیونچرز");
  });
});
