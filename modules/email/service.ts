import nodemailer from "nodemailer";
import { eq, and, asc, lt } from "drizzle-orm";
import { db } from "@/db";
import { emailOutbox, EmailOutboxItem } from "@/db/schema";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export interface OutboxProcessResult {
  processed: number;
  succeeded: number;
  failed: number;
}

import { transporter as pooledTransporter } from "@/lib/mail";

export class EmailService {
  /**
   * Returns the shared pooled SMTP transporter with rate limiting and strict TLS
   */
  static getTransporter(): nodemailer.Transporter {
    return pooledTransporter;
  }

  /**
   * Sends an email directly through the SMTP transporter
   */
  static async sendDirect(params: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<{ messageId: string }> {
    const transporter = this.getTransporter();

    const info = await transporter.sendMail({
      from: env.SMTP_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });

    logger.info("Email sent via SMTP", { to: params.to, subject: params.subject });
    return { messageId: info.messageId || "mock_id" };
  }

  private static isProcessing = false;

  /**
   * Processes a batch of pending emails from the persistent email_outbox table
   */
  static async processOutbox(batchSize: number = 10): Promise<OutboxProcessResult> {
    if (this.isProcessing) {
      return { processed: 0, succeeded: 0, failed: 0 };
    }
    this.isProcessing = true;

    try {
      const transporter = this.getTransporter();

      // Fetch batch of pending items with fewer than 5 attempts
      const pendingItems = await db
        .select()
        .from(emailOutbox)
        .where(and(eq(emailOutbox.status, "pending"), lt(emailOutbox.attempts, 5)))
        .orderBy(asc(emailOutbox.createdAt))
        .limit(batchSize);

      let succeeded = 0;
      let failed = 0;

      for (const item of pendingItems) {
        const nextAttempt = item.attempts + 1;

        try {
          await transporter.sendMail({
            from: env.SMTP_FROM,
            to: item.toEmail,
            subject: item.subject,
            html: item.htmlBody,
            text: item.textBody ?? undefined,
          });

          // Mark as sent
          await db
            .update(emailOutbox)
            .set({
              status: "sent",
              attempts: nextAttempt,
              sentAt: new Date(),
              lastError: null,
            })
            .where(eq(emailOutbox.id, item.id));

          succeeded++;
        } catch (err: any) {
          const errorMsg = err?.message || "Unknown SMTP delivery error";
          const newStatus = nextAttempt >= 5 ? "failed" : "pending";

          await db
            .update(emailOutbox)
            .set({
              status: newStatus,
              attempts: nextAttempt,
              lastError: errorMsg,
            })
            .where(eq(emailOutbox.id, item.id));

          logger.error("Failed to deliver outbox email", {
            id: item.id,
            to: item.toEmail,
            attempts: nextAttempt,
            error: errorMsg,
          });

          failed++;
        }
      }

      return {
        processed: pendingItems.length,
        succeeded,
        failed,
      };
    } finally {
      this.isProcessing = false;
    }
  }
}

// Background worker: Periodically drain any retryable or unhandled outbox items every 20 seconds
if (env.NODE_ENV !== "test" && typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    EmailService.processOutbox().catch((err) => {
      logger.error("Periodic outbox processing error", { error: err?.message });
    });
  }, 20000);
  if (timer.unref) {
    timer.unref();
  }
}
