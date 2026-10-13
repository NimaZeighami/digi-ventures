import { db } from "@/db";
import { contactSubmissions, emailOutbox } from "@/db/schema";
import { contactFormSchema, ContactFormInput } from "./schema";
import { DbRateLimiter } from "@/modules/auth/rate-limiter";
import { ValidationError, TooManyRequestsError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";
import { EmailService } from "@/modules/email/service";

export class ContactService {
  /**
   * Submits a contact inquiry with honeypot spam guard and rate limiting
   */
  static async submitMessage(
    rawInput: unknown,
    clientIp: string = "127.0.0.1"
  ): Promise<{ success: boolean; isSpam?: boolean }> {
    // 1. Zod schema validation
    const parsed = contactFormSchema.safeParse(rawInput);
    if (!parsed.success) {
      throw new ValidationError(
        "اطلاعات ارسالی معتبر نیستند. لطفاً ورودی‌ها را بررسی کنید.",
        parsed.error.flatten().fieldErrors
      );
    }

    const data: ContactFormInput = parsed.data;

    // 2. Honeypot check: If bot filled the hidden website field, silently succeed without writing to DB
    if (data.website && data.website.trim().length > 0) {
      logger.warn("Contact form honeypot triggered by spambot", { ip: clientIp });
      return { success: true, isSpam: true };
    }

    // 3. Persistent IP Rate Limiting: 3 requests per 1 hour (3600 seconds)
    const rateLimit = await DbRateLimiter.consume(`contact_${clientIp}`, 3, 3600);
    if (!rateLimit.allowed) {
      throw new TooManyRequestsError(
        `تعداد درخواست‌های تماس بیش از حد مجاز است. لطفاً ${Math.ceil(
          rateLimit.retryAfterSeconds / 60
        )} دقیقه دیگر تلاش کنید.`
      );
    }

    // 4. Persist contact submission in DB
    const fullMessage = `شماره تماس: ${data.phone}\n\n${data.message}`;

    await db.transaction(async (tx) => {
      await tx.insert(contactSubmissions).values({
        name: data.name,
        email: data.email.toLowerCase(),
        subject: data.subject,
        message: fullMessage,
        ipAddress: clientIp,
      });

      // 5. Queue admin notification email into email_outbox
      const htmlBody = `
        <div style="font-family: Tahoma, sans-serif; direction: rtl; text-align: right; line-height: 1.6; color: #333;">
          <h2 style="color: #e01f3d;">پیام جدید از فرم ارتباط با ما (دیجی‌ونچرز)</h2>
          <p><strong>نام فرستنده:</strong> ${data.name}</p>
          <p><strong>پست الکترونیک:</strong> ${data.email}</p>
          <p><strong>شماره تماس:</strong> ${data.phone}</p>
          <p><strong>موضوع:</strong> ${data.subject}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <p><strong>متن پیام:</strong></p>
          <div style="background-color: #f9f9f9; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${data.message}</div>
          <p style="font-size: 11px; color: #888; margin-top: 20px;">آی‌پی ارسال‌کننده: ${clientIp}</p>
        </div>
      `;

      await tx.insert(emailOutbox).values({
        toEmail: env.ADMIN_NOTIFICATION_EMAIL,
        subject: `[تماس با ما] ${data.subject} - ${data.name}`,
        htmlBody,
        textBody: `پیام جدید از ${data.name} (${data.email} - ${data.phone}):\n\nموضوع: ${data.subject}\n\n${data.message}`,
      });
    });

    if (env.NODE_ENV !== "test") {
      EmailService.processOutbox().catch((err) => {
        logger.error("Failed to process email outbox after contact inquiry", {
          error: err?.message,
        });
      });
    }

    logger.info("Contact inquiry submitted and queued for delivery", { email: data.email, ip: clientIp });
    return { success: true };
  }
}
