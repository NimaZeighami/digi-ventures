import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import {
  investmentRequests,
  requestStatusHistory,
  emailTemplates,
  emailOutbox,
  InvestmentRequest,
  RequestStatus,
  UserRole,
} from "@/db/schema";
import {
  NotFoundError,
  ForbiddenError,
  ConflictError,
  InvalidTransitionError,
  ValidationError,
} from "@/lib/errors";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { renderPersianEmailTemplate } from "@/lib/mail";
import { EmailService } from "@/modules/email/service";

export const VALID_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  draft: ["submitted"],
  submitted: ["under_review"],
  under_review: ["needs_revision", "accepted", "rejected"],
  needs_revision: ["submitted"],
  accepted: [],
  rejected: [],
};

const PERSIAN_STATUS_NAMES: Record<RequestStatus, string> = {
  draft: "پیش‌نویس",
  submitted: "در انتظار بررسی",
  under_review: "در حال بررسی",
  needs_revision: "نیازمند بازنگری",
  accepted: "پذیرفته‌شده",
  rejected: "ردشده",
};

export class TransitionService {
  /**
   * Authoritative execution of request status mutations.
   * Runs in a PostgreSQL transaction with SELECT ... FOR UPDATE and optimistic locking.
   */
  static async executeTransition(params: {
    requestId: string;
    targetStatus: RequestStatus;
    actor: { id: string; role: UserRole };
    adminMessage?: string;
    internalNote?: string;
    expectedVersion: number;
  }): Promise<InvestmentRequest> {
    const updated = await db.transaction(async (tx) => {
      // 1. Fetch current request with row-level lock
      const [current] = await tx
        .select()
        .from(investmentRequests)
        .where(eq(investmentRequests.id, params.requestId))
        .for("update");

      if (!current) {
        throw new NotFoundError("درخواست مورد نظر یافت نشد.");
      }

      // 2. Optimistic concurrency check
      if (current.version !== params.expectedVersion) {
        throw new ConflictError(
          "اطلاعات این درخواست توسط کاربر یا مدیر دیگری تغییر یافته است. لطفاً صفحه را بازخوانی کنید."
        );
      }

      // 3. Permission verification
      const isOwner = current.userId === params.actor.id;
      const isAdmin =
        params.actor.role === "admin" || params.actor.role === "super_admin";

      if (params.targetStatus === "submitted") {
        if (!isOwner) {
          throw new ForbiddenError("تنها مالک استارتاپ مجاز به ارسال یا باز‌ارسال این درخواست است.");
        }
      } else {
        if (!isAdmin) {
          throw new ForbiddenError("شما مجوز لازم برای تغییر وضعیت این درخواست را ندارید.");
        }
      }

      // 4. Validate allowed transitions
      const allowed = VALID_TRANSITIONS[current.status];
      if (!allowed.includes(params.targetStatus)) {
        throw new InvalidTransitionError(
          `امکان انتقال از وضعیت «${PERSIAN_STATUS_NAMES[current.status]}» به وضعیت «${PERSIAN_STATUS_NAMES[params.targetStatus]}» وجود ندارد.`
        );
      }

      // 5. Enforce required admin messages on revision or rejection
      if (
        (params.targetStatus === "needs_revision" || params.targetStatus === "rejected") &&
        (!params.adminMessage || params.adminMessage.trim().length < 10)
      ) {
        throw new ValidationError(
          "برای بازنگری یا رد درخواست، ثبت توضیحات مشخص برای بنیان‌گذار (حداقل ۱۰ کاراکتر) الزامی است."
        );
      }

      // 6. Update request record with incremented version
      const [updated] = await tx
        .update(investmentRequests)
        .set({
          status: params.targetStatus,
          adminMessage: params.adminMessage ?? current.adminMessage,
          internalNote: params.internalNote ?? current.internalNote,
          version: current.version + 1,
          updatedAt: new Date(),
        })
        .where(eq(investmentRequests.id, params.requestId))
        .returning();

      // 7. Insert audit row in request_status_history
      await tx.insert(requestStatusHistory).values({
        requestId: current.id,
        actorId: params.actor.id,
        fromStatus: current.status,
        toStatus: params.targetStatus,
        adminMessage: params.adminMessage,
        internalNote: params.internalNote,
      });

      // 8. Queue transactional email event into email_outbox
      await this.queueNotificationEmail(
        tx,
        updated,
        current.status,
        params.targetStatus,
        params.adminMessage
      );

      return updated;
    });

    // 9. Immediately trigger delivery in development/production
    if (env.NODE_ENV !== "test") {
      EmailService.processOutbox().catch((err) => {
        logger.error("Failed to process email outbox after status transition", {
          requestId: params.requestId,
          error: err?.message,
        });
      });
    }

    return updated;
  }

  /**
   * Helper to queue notification emails into email_outbox within the transaction
   * Sends notifications to both the founder and the administrative investment team
   */
  private static async queueNotificationEmail(
    tx: any,
    request: InvestmentRequest,
    fromStatus: RequestStatus,
    toStatus: RequestStatus,
    passedAdminMessage?: string
  ): Promise<void> {
    // 1. Initial Request Submission Confirmation (draft -> submitted)
    if (toStatus === "submitted" && fromStatus === "draft") {
      const [tpl] = await tx
        .select()
        .from(emailTemplates)
        .where(eq(emailTemplates.key, "request_received"));

      let subject = tpl?.subject || "درخواست سرمایه‌گذاری شما با موفقیت ثبت شد";
      let body =
        tpl?.body ||
        `درود {founder_name} عزیز، درخواست استارتاپ {startup_name} دریافت شد و در صف بررسی قرار گرفت.`;

      subject = subject
        .replace(/{founder_name}/g, request.founderName)
        .replace(/{startup_name}/g, request.startupName);

      body = body
        .replace(/{founder_name}/g, request.founderName)
        .replace(/{startup_name}/g, request.startupName);

      const founderHtml = renderPersianEmailTemplate({
        title: subject,
        message: body,
        recipientName: request.founderName,
        actionButton: {
          label: "مشاهده جزئیات در پنل کاربری",
          url: `${env.APP_URL}/my-requests`,
        },
      });

      // To founder
      await tx.insert(emailOutbox).values({
        toEmail: request.email,
        subject,
        htmlBody: founderHtml,
        textBody: body,
      });

      // To admin
      if (env.ADMIN_NOTIFICATION_EMAIL) {
        const adminSubject = `[درخواست جدید] استارتاپ «${request.startupName}» ثبت شد`;
        const adminBody = `درخواست سرمایه‌گذاری جدیدی توسط ${request.founderName} برای استارتاپ «${request.startupName}» ثبت گردید.\n\nحوزه: ${request.sector}\nایمیل: ${request.email}\nشماره تماس: ${request.phone}`;
        const adminHtml = renderPersianEmailTemplate({
          title: adminSubject,
          message: adminBody,
          actionButton: {
            label: "بررسی پرونده در پنل مدیریت",
            url: `${env.APP_URL}/admin/requests/${request.id}`,
          },
        });

        await tx.insert(emailOutbox).values({
          toEmail: env.ADMIN_NOTIFICATION_EMAIL,
          subject: adminSubject,
          htmlBody: adminHtml,
          textBody: adminBody,
        });
      }
      return;
    }

    // 2. Resubmission after Revision (needs_revision -> submitted)
    if (toStatus === "submitted" && fromStatus === "needs_revision") {
      const founderSubject = `طرح اصلاح‌شده استارتاپ «${request.startupName}» با موفقیت دریافت شد`;
      const founderBody = `درود ${request.founderName} عزیز،\n\nتوضیحات و مدارک تکمیلی شما برای استارتاپ «${request.startupName}» دریافت شد و جهت ارزیابی مجدد در اختیار تیم سرمایه‌گذاری قرار گرفت.`;
      const founderHtml = renderPersianEmailTemplate({
        title: founderSubject,
        message: founderBody,
        recipientName: request.founderName,
        actionButton: {
          label: "مشاهده جزئیات درخواست",
          url: `${env.APP_URL}/my-requests`,
        },
      });

      await tx.insert(emailOutbox).values({
        toEmail: request.email,
        subject: founderSubject,
        htmlBody: founderHtml,
        textBody: founderBody,
      });

      if (env.ADMIN_NOTIFICATION_EMAIL) {
        const adminSubject = `[باز‌ارسال طرح] استارتاپ «${request.startupName}» اصلاحات را ثبت کرد`;
        const adminBody = `بنیان‌گذار استارتاپ «${request.startupName}» (${request.founderName}) موارد درخواستی را اصلاح و پرونده را مجدداً ارسال کرده است.`;
        const adminHtml = renderPersianEmailTemplate({
          title: adminSubject,
          message: adminBody,
          actionButton: {
            label: "بررسی اصلاحات پرونده",
            url: `${env.APP_URL}/admin/requests/${request.id}`,
          },
        });

        await tx.insert(emailOutbox).values({
          toEmail: env.ADMIN_NOTIFICATION_EMAIL,
          subject: adminSubject,
          htmlBody: adminHtml,
          textBody: adminBody,
        });
      }
      return;
    }

    // 3. Status Changes (under_review, needs_revision, accepted, rejected)
    if (
      toStatus === "under_review" ||
      toStatus === "needs_revision" ||
      toStatus === "accepted" ||
      toStatus === "rejected"
    ) {
      const statusName = PERSIAN_STATUS_NAMES[toStatus];
      const effectiveAdminMessage = (passedAdminMessage || request.adminMessage || "").trim();

      let subject = `به‌روزرسانی وضعیت درخواست استارتاپ «${request.startupName}»`;
      let title = `به‌روزرسانی وضعیت درخواست استارتاپ ${request.startupName}`;
      let boxTitle = "پیام و توضیحات تیم بررسی:";
      let boxType: "success" | "danger" | "warning" | "info" = "info";
      let fallbackText = "درخواست شما توسط تیم ارزیابی دیجی‌ونچرز بررسی شد.";

      if (toStatus === "accepted") {
        subject = `[پذیرش طرح] نتیجه ارزیابی استارتاپ «${request.startupName}» در دیجی‌ونچرز`;
        title = `پذیرش پیشنهاد سرمایه‌گذاری استارتاپ ${request.startupName}`;
        boxTitle = "پاسخ و پیام تیم سرمایه‌گذاری دیجی‌ونچرز:";
        boxType = "success";
        fallbackText = "پیشنهاد سرمایه‌گذاری شما با موفقیت در کمیته ارزیابی دیجی‌ونچرز مورد تایید قرار گرفت.";
      } else if (toStatus === "rejected") {
        subject = `[نتیجه ارزیابی] وضعیت درخواست استارتاپ «${request.startupName}» در دیجی‌ونچرز`;
        title = `نتیجه بررسی درخواست سرمایه‌گذاری استارتاپ ${request.startupName}`;
        boxTitle = "دلیل و توضیحات عدم پذیرش طرح:";
        boxType = "danger";
        fallbackText = "متأسفانه در حال حاضر امکان همراهی و سرمایه‌گذاری در این طرح فراهم نمی‌باشد.";
      } else if (toStatus === "needs_revision") {
        subject = `[نیازمند بازنگری] درخواست اصلاح اطلاعات استارتاپ «${request.startupName}»`;
        title = `درخواست بازنگری و اصلاح مدارک استارتاپ ${request.startupName}`;
        boxTitle = "موارد و توضیحات نیازمند اصلاح و تکمیل:";
        boxType = "warning";
        fallbackText = "لطفاً توضیحات تکمیلی یا مدارک اصلاح‌شده را از طریق پنل کاربری ارسال نمایید.";
      } else if (toStatus === "under_review") {
        subject = `[در حال بررسی] آغاز بررسی تخصصی استارتاپ «${request.startupName}»`;
        title = `آغاز بررسی تخصصی پرونده استارتاپ ${request.startupName}`;
        boxTitle = "پیام تیم ارزیابی دیجی‌ونچرز:";
        boxType = "info";
        fallbackText = "درخواست سرمایه‌گذاری شما توسط تیم ارزیابی دیجی‌ونچرز در دست بررسی تخصصی قرار گرفت.";
      }

      const displayedMessage = effectiveAdminMessage || fallbackText;

      const introMessage = `وضعیت بررسی پرونده استارتاپ «${request.startupName}» به وضعیت «${statusName}» تغییر یافت. توضیحات و پاسخ تیم سرمایه‌گذاری در کادر زیر جهت اطلاع شما درج شده است:`;

      const founderHtml = renderPersianEmailTemplate({
        title,
        message: introMessage,
        recipientName: request.founderName,
        adminResponse: {
          title: boxTitle,
          content: displayedMessage,
          type: boxType,
        },
        actionButton: {
          label: "مشاهده جزئیات در پنل کاربری",
          url: `${env.APP_URL}/my-requests`,
        },
      });

      const textBody = `درود ${request.founderName} عزیز،

وضعیت بررسی درخواست استارتاپ «${request.startupName}» به‌روزرسانی شد:
وضعیت جدید: ${statusName}

───────────────────────────────────────────────────────
${boxTitle}
${displayedMessage}
───────────────────────────────────────────────────────

جهت مشاهده جزئیات بیشتر یا ویرایش اطلاعات، به پنل کاربری خود در دیجی‌ونچرز مراجعه نمایید:
${env.APP_URL}/my-requests

با احترام،
تیم سرمایه‌گذاری دیجی‌ونچرز`;

      // 1. To founder
      await tx.insert(emailOutbox).values({
        toEmail: request.email,
        subject,
        htmlBody: founderHtml,
        textBody,
      });

      // 2. To admin notification ("both")
      if (env.ADMIN_NOTIFICATION_EMAIL) {
        const adminSubject = `[به‌روزرسانی وضعیت] استارتاپ «${request.startupName}» ➔ ${statusName}`;
        const adminIntro = `وضعیت درخواست استارتاپ «${request.startupName}» (بنیان‌گذار: ${request.founderName}) به «${statusName}» تغییر یافت. متن پیام ثبت‌شده در سیستم به شرح زیر است:`;
        const adminHtml = renderPersianEmailTemplate({
          title: adminSubject,
          message: adminIntro,
          adminResponse: {
            title: `متن پیام ثبت‌شده (${boxTitle}):`,
            content: displayedMessage,
            type: boxType,
          },
          actionButton: {
            label: "مشاهده پرونده در پنل مدیریت",
            url: `${env.APP_URL}/admin/requests/${request.id}`,
          },
        });

        await tx.insert(emailOutbox).values({
          toEmail: env.ADMIN_NOTIFICATION_EMAIL,
          subject: adminSubject,
          htmlBody: adminHtml,
          textBody: `وضعیت درخواست استارتاپ «${request.startupName}» به «${statusName}» تغییر یافت.\n\n${boxTitle}\n${displayedMessage}`,
        });
      }
    }
  }
}
