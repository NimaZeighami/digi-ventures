import { describe, it, expect, beforeEach } from "vitest";
import { ContactService } from "@/modules/contact/service";
import { EmailService } from "@/modules/email/service";
import { db } from "@/db";
import { contactSubmissions, emailOutbox } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ValidationError, TooManyRequestsError } from "@/lib/errors";

describe("Phase 8: Contact Form & Outbox Email Worker", () => {
  const testRunId = Date.now().toString(36);

  it("validates contact input fields strictly using Zod", async () => {
    // Missing required fields / invalid email
    await expect(
      ContactService.submitMessage(
        {
          name: "A", // too short
          email: "not-an-email",
          phone: "123", // too short
          subject: "No",
          message: "Short",
        },
        "10.0.0.1"
      )
    ).rejects.toThrow(ValidationError);
  });

  it("neutralizes spambots via honeypot without polluting DB or queue", async () => {
    const testIp = `192.168.100.${Math.floor(Math.random() * 200) + 1}`;

    const res = await ContactService.submitMessage(
      {
        name: "Bot Spammer",
        email: "spambot@promotions.xyz",
        phone: "09123456789",
        subject: "Cheap crypto traffic offers",
        message: "Buy millions of visitors for your website today!",
        website: "https://spamlink.xyz", // Bot trap triggered
      },
      testIp
    );

    expect(res.success).toBe(true);
    expect(res.isSpam).toBe(true);

    // Verify nothing written in database
    const [found] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.email, "spambot@promotions.xyz"));

    expect(found).toBeUndefined();
  });

  it("persists valid contact submission and queues admin notification into email_outbox", async () => {
    const testIp = `172.16.0.${Math.floor(Math.random() * 200) + 1}`;
    const founderEmail = `founder-${testRunId}@innovate.ir`;

    const res = await ContactService.submitMessage(
      {
        name: "رضا محمدی",
        email: founderEmail,
        phone: "09129876543",
        subject: `درخواست جلسه آشنایی ${testRunId}`,
        message: "سلام و احترام، ما مایل به معرفی استارتاپ لجستیکی خود به تیم سرمایه‌گذاری دیجی‌ونچرز هستیم.",
      },
      testIp
    );

    expect(res.success).toBe(true);

    // Verify contact_submissions record
    const [submission] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.email, founderEmail));

    expect(submission).toBeDefined();
    expect(submission.name).toBe("رضا محمدی");
    expect(submission.ipAddress).toBe(testIp);
    expect(submission.message).toContain("09129876543");

    // Verify email_outbox item
    const outboxItems = await db
      .select()
      .from(emailOutbox)
      .where(eq(emailOutbox.status, "pending"))
      .orderBy(desc(emailOutbox.createdAt));

    const queuedItem = outboxItems.find((item) =>
      item.subject.includes(testRunId)
    );

    expect(queuedItem).toBeDefined();
    expect(queuedItem?.htmlBody).toContain("رضا محمدی");
    expect(queuedItem?.status).toBe("pending");
  });

  it("enforces persistent IP rate limiting after 3 submissions in 1 hour", async () => {
    const throttledIp = `198.51.100.${Math.floor(Math.random() * 200) + 1}`;

    const makePayload = (idx: number) => ({
      name: `کاربر تستی ${idx}`,
      email: `test-rate-${idx}-${testRunId}@example.com`,
      phone: "09121112233",
      subject: `موضوع پیام شماره ${idx}`,
      message: `این یک متن پیام تستی معتبر و کامل است برای شماره ${idx}.`,
    });

    // Submissions 1, 2, 3 should succeed
    await expect(ContactService.submitMessage(makePayload(1), throttledIp)).resolves.toEqual({ success: true });
    await expect(ContactService.submitMessage(makePayload(2), throttledIp)).resolves.toEqual({ success: true });
    await expect(ContactService.submitMessage(makePayload(3), throttledIp)).resolves.toEqual({ success: true });

    // 4th submission from same IP must be blocked by rate limiter
    await expect(
      ContactService.submitMessage(makePayload(4), throttledIp)
    ).rejects.toThrow(TooManyRequestsError);
  });

  it("processes pending email_outbox queue and transitions items to sent status", async () => {
    // Process pending outbox
    const result = await EmailService.processOutbox(20);

    expect(result.processed).toBeGreaterThan(0);
    expect(result.succeeded).toBeGreaterThan(0);
    expect(result.failed).toBe(0);

    // Verify that processed items now have status 'sent' and sentAt timestamp
    const [anySent] = await db
      .select()
      .from(emailOutbox)
      .where(eq(emailOutbox.status, "sent"))
      .orderBy(desc(emailOutbox.sentAt))
      .limit(1);

    expect(anySent).toBeDefined();
    expect(anySent.sentAt).not.toBeNull();
  });
});
