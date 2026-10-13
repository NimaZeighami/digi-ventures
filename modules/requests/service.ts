import { eq, and, desc, sql, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import {
  investmentRequests,
  requestStatusHistory,
  emailTemplates,
  emailOutbox,
  InvestmentRequest,
  RequestStatus,
  RequestSector,
  RequestStage,
  UserRole,
} from "@/db/schema";
import {
  NotFoundError,
  ForbiddenError,
  ConflictError,
  ValidationError,
} from "@/lib/errors";
import { TransitionService } from "./transition";
import { SavedFileMetadata } from "@/modules/storage/service";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { renderPersianEmailTemplate } from "@/lib/mail";
import { EmailService } from "@/modules/email/service";

export interface CreateRequestDto {
  startup_name: string;
  founder_name: string;
  email: string;
  phone: string;
  sector: RequestSector;
  stage: RequestStage;
  description: string;
  idempotency_key: string;
}

export class RequestService {
  /**
   * Creates a draft proposal (file optional, no email dispatched)
   */
  static async createDraft(
    actor: { id: string; role: UserRole },
    data: CreateRequestDto,
    file?: SavedFileMetadata
  ): Promise<InvestmentRequest> {
    const [existing] = await db
      .select()
      .from(investmentRequests)
      .where(eq(investmentRequests.idempotencyKey, data.idempotency_key));

    if (existing) {
      return existing;
    }

    const [created] = await db
      .insert(investmentRequests)
      .values({
        userId: actor.id,
        startupName: data.startup_name,
        founderName: data.founder_name,
        email: data.email.toLowerCase().trim(),
        phone: data.phone,
        sector: data.sector,
        stage: data.stage,
        description: data.description,
        filePath: file?.filePath,
        originalFileName: file?.originalFileName,
        fileSize: file?.fileSize,
        mimeType: file?.mimeType,
        status: "draft",
        idempotencyKey: data.idempotency_key,
        version: 1,
      })
      .returning();

    return created;
  }

  /**
   * Updates an existing draft (only allowed while in 'draft' status)
   */
  static async updateDraft(
    actor: { id: string; role: UserRole },
    requestId: string,
    data: Partial<CreateRequestDto>,
    file?: SavedFileMetadata
  ): Promise<InvestmentRequest> {
    const [current] = await db
      .select()
      .from(investmentRequests)
      .where(eq(investmentRequests.id, requestId));

    if (!current) {
      throw new NotFoundError("درخواست مورد نظر یافت نشد.");
    }

    if (current.userId !== actor.id) {
      throw new ForbiddenError("شما اجازه ویرایش این پیش‌نویس را ندارید.");
    }

    if (current.status !== "draft") {
      throw new ConflictError("تنها درخواست‌های در وضعیت پیش‌نویس امکان ویرایش عادی دارند.");
    }

    const [updated] = await db
      .update(investmentRequests)
      .set({
        startupName: data.startup_name ?? current.startupName,
        founderName: data.founder_name ?? current.founderName,
        email: data.email ? data.email.toLowerCase().trim() : current.email,
        phone: data.phone ?? current.phone,
        sector: data.sector ?? current.sector,
        stage: data.stage ?? current.stage,
        description: data.description ?? current.description,
        filePath: file ? file.filePath : current.filePath,
        originalFileName: file ? file.originalFileName : current.originalFileName,
        fileSize: file ? file.fileSize : current.fileSize,
        mimeType: file ? file.mimeType : current.mimeType,
        updatedAt: new Date(),
        version: current.version + 1,
      })
      .where(eq(investmentRequests.id, requestId))
      .returning();

    return updated;
  }

  /**
   * Creates and submits a new investment proposal directly (file mandatory, dispatches E1)
   */
  static async submitNewRequest(
    actor: { id: string; role: UserRole },
    data: CreateRequestDto,
    file: SavedFileMetadata
  ): Promise<InvestmentRequest> {
    // 1. Idempotency Check
    const [existing] = await db
      .select()
      .from(investmentRequests)
      .where(eq(investmentRequests.idempotencyKey, data.idempotency_key));

    if (existing) {
      return existing;
    }

    const created = await db.transaction(async (tx) => {
      // 2. Insert record in submitted state
      const [created] = await tx
        .insert(investmentRequests)
        .values({
          userId: actor.id,
          startupName: data.startup_name,
          founderName: data.founder_name,
          email: data.email.toLowerCase().trim(),
          phone: data.phone,
          sector: data.sector,
          stage: data.stage,
          description: data.description,
          filePath: file.filePath,
          originalFileName: file.originalFileName,
          fileSize: file.fileSize,
          mimeType: file.mimeType,
          status: "submitted",
          idempotencyKey: data.idempotency_key,
          version: 1,
        })
        .returning();

      // 3. Insert audit log
      await tx.insert(requestStatusHistory).values({
        requestId: created.id,
        actorId: actor.id,
        fromStatus: "draft",
        toStatus: "submitted",
      });

      // 4. Queue E1 Confirmation Email for Founder
      const [tpl] = await tx
        .select()
        .from(emailTemplates)
        .where(eq(emailTemplates.key, "request_received"));

      let subject = tpl?.subject || "درخواست سرمایه‌گذاری شما با موفقیت ثبت شد";
      let body =
        tpl?.body ||
        `درود {founder_name} عزیز، درخواست استارتاپ {startup_name} دریافت شد و در صف بررسی قرار گرفت.`;

      subject = subject
        .replace(/{founder_name}/g, created.founderName)
        .replace(/{startup_name}/g, created.startupName);

      body = body
        .replace(/{founder_name}/g, created.founderName)
        .replace(/{startup_name}/g, created.startupName);

      const founderHtml = renderPersianEmailTemplate({
        title: subject,
        message: body,
        recipientName: created.founderName,
        actionButton: {
          label: "مشاهده جزئیات در پنل کاربری",
          url: `${env.APP_URL}/my-requests`,
        },
      });

      await tx.insert(emailOutbox).values({
        toEmail: created.email,
        subject,
        htmlBody: founderHtml,
        textBody: body,
      });

      // 5. Queue Notification Email for Admin ("both")
      if (env.ADMIN_NOTIFICATION_EMAIL) {
        const adminSubject = `[درخواست جدید] استارتاپ «${created.startupName}» ثبت شد`;
        const adminBody = `درخواست سرمایه‌گذاری جدیدی توسط ${created.founderName} برای استارتاپ «${created.startupName}» ثبت گردید.\n\nحوزه فعالیت: ${created.sector}\nمرحله رشد: ${created.stage}\nایمیل متقاضی: ${created.email}\nشماره تماس: ${created.phone}`;
        const adminHtml = renderPersianEmailTemplate({
          title: adminSubject,
          message: adminBody,
          actionButton: {
            label: "بررسی پرونده در پنل مدیریت",
            url: `${env.APP_URL}/admin/requests/${created.id}`,
          },
        });

        await tx.insert(emailOutbox).values({
          toEmail: env.ADMIN_NOTIFICATION_EMAIL,
          subject: adminSubject,
          htmlBody: adminHtml,
          textBody: adminBody,
        });
      }

      return created;
    });

    // 6. Trigger immediate outbox delivery
    if (env.NODE_ENV !== "test") {
      EmailService.processOutbox().catch((err) => {
        logger.error("Failed to process email outbox after submitNewRequest", {
          requestId: created.id,
          error: err?.message,
        });
      });
    }

    return created;
  }

  /**
   * Submits an existing draft (draft -> submitted)
   */
  static async submitDraft(
    actor: { id: string; role: UserRole },
    requestId: string,
    file?: SavedFileMetadata
  ): Promise<InvestmentRequest> {
    const [current] = await db
      .select()
      .from(investmentRequests)
      .where(eq(investmentRequests.id, requestId));

    if (!current) throw new NotFoundError("درخواست مورد نظر یافت نشد.");
    if (current.userId !== actor.id) {
      throw new ForbiddenError("تنها مالک استارتاپ مجاز به ارسال این پیش‌نویس است.");
    }
    if (!current.filePath && !file) {
      throw new ValidationError("بارگذاری فایل پیچ‌دک پیش از ارسال نهایی الزامی است.");
    }

    if (file) {
      await db
        .update(investmentRequests)
        .set({
          filePath: file.filePath,
          originalFileName: file.originalFileName,
          fileSize: file.fileSize,
          mimeType: file.mimeType,
        })
        .where(eq(investmentRequests.id, requestId));
    }

    return await TransitionService.executeTransition({
      requestId,
      targetStatus: "submitted",
      actor,
      expectedVersion: current.version,
    });
  }

  /**
   * Resubmits a request after revision (needs_revision -> submitted)
   */
  static async resubmitRequest(
    actor: { id: string; role: UserRole },
    requestId: string,
    data: Partial<CreateRequestDto>,
    file?: SavedFileMetadata
  ): Promise<InvestmentRequest> {
    const [current] = await db
      .select()
      .from(investmentRequests)
      .where(eq(investmentRequests.id, requestId));

    if (!current) throw new NotFoundError("درخواست مورد نظر یافت نشد.");
    if (current.userId !== actor.id) {
      throw new ForbiddenError("تنها مالک استارتاپ مجاز به باز‌ارسال این درخواست است.");
    }
    if (current.status !== "needs_revision") {
      throw new ConflictError("تنها درخواست‌های نیازمند بازنگری امکان باز‌ارسال دارند.");
    }

    // Update fields and file if provided
    await db
      .update(investmentRequests)
      .set({
        startupName: data.startup_name ?? current.startupName,
        founderName: data.founder_name ?? current.founderName,
        email: data.email ? data.email.toLowerCase().trim() : current.email,
        phone: data.phone ?? current.phone,
        sector: data.sector ?? current.sector,
        stage: data.stage ?? current.stage,
        description: data.description ?? current.description,
        filePath: file ? file.filePath : current.filePath,
        originalFileName: file ? file.originalFileName : current.originalFileName,
        fileSize: file ? file.fileSize : current.fileSize,
        mimeType: file ? file.mimeType : current.mimeType,
        updatedAt: new Date(),
      })
      .where(eq(investmentRequests.id, requestId));

    return await TransitionService.executeTransition({
      requestId,
      targetStatus: "submitted",
      actor,
      expectedVersion: current.version,
    });
  }

  /**
   * Retrieves single request with history (owner or reviewer)
   */
  static async getRequestById(
    actor: { id: string; role: UserRole },
    requestId: string
  ): Promise<{
    request: InvestmentRequest;
    history: any[];
  }> {
    const [request] = await db
      .select()
      .from(investmentRequests)
      .where(eq(investmentRequests.id, requestId));

    if (!request) throw new NotFoundError("درخواست مورد نظر یافت نشد.");

    const isOwner = request.userId === actor.id;
    const isStaff = actor.role === "admin" || actor.role === "super_admin";

    if (!isOwner && !isStaff) {
      throw new ForbiddenError("شما اجازه دسترسی به این درخواست را ندارید.");
    }

    // Hide internalNote from customer!
    const sanitizedRequest = isStaff
      ? request
      : { ...request, internalNote: null };

    const historyRows = await db
      .select()
      .from(requestStatusHistory)
      .where(eq(requestStatusHistory.requestId, requestId))
      .orderBy(desc(requestStatusHistory.createdAt));

    const sanitizedHistory = isStaff
      ? historyRows
      : historyRows.map((h) => ({ ...h, internalNote: null }));

    return {
      request: sanitizedRequest as InvestmentRequest,
      history: sanitizedHistory,
    };
  }

  /**
   * Retrieves all requests belonging to the current customer
   */
  static async getMyRequests(
    actor: { id: string; role: UserRole }
  ): Promise<InvestmentRequest[]> {
    const results = await db
      .select()
      .from(investmentRequests)
      .where(eq(investmentRequests.userId, actor.id))
      .orderBy(desc(investmentRequests.createdAt));

    // Strip internalNote from customer view
    return results.map((r) => ({ ...r, internalNote: null } as InvestmentRequest));
  }

  /**
   * Diligence queue: retrieves all requests with optional status filtering
   */
  static async getAllRequests(
    actor: { id: string; role: UserRole },
    filters?: { status?: RequestStatus; sector?: RequestSector; search?: string }
  ): Promise<InvestmentRequest[]> {
    if (actor.role !== "admin" && actor.role !== "super_admin") {
      throw new ForbiddenError("دسترسی به فهرست همه درخواست‌ها فقط برای مدیران مجاز است.");
    }

    const conditions: SQL[] = [];

    if (filters?.status) {
      conditions.push(eq(investmentRequests.status, filters.status));
    }

    if (filters?.sector) {
      conditions.push(eq(investmentRequests.sector, filters.sector));
    }

    if (filters?.search && filters.search.trim().length > 0) {
      const pattern = `%${filters.search.trim()}%`;
      const searchMatch = or(
        ilike(investmentRequests.startupName, pattern),
        ilike(investmentRequests.founderName, pattern),
        ilike(investmentRequests.email, pattern)
      );
      if (searchMatch) {
        conditions.push(searchMatch);
      }
    }

    const query = conditions.length > 0
      ? db.select().from(investmentRequests).where(and(...conditions))
      : db.select().from(investmentRequests);

    return await query.orderBy(desc(investmentRequests.createdAt));
  }

  /**
   * Appends a private internal diligence note (admin/super_admin only)
   */
  static async addInternalNote(
    actor: { id: string; role: UserRole },
    requestId: string,
    note: string
  ): Promise<void> {
    if (actor.role !== "admin" && actor.role !== "super_admin") {
      throw new ForbiddenError("فقط تیم سرمایه‌گذاری مجاز به ثبت یادداشت محرمانه است.");
    }

    const [current] = await db
      .select()
      .from(investmentRequests)
      .where(eq(investmentRequests.id, requestId));

    if (!current) throw new NotFoundError("درخواست مورد نظر یافت نشد.");

    const formattedNote = current.internalNote
      ? `${current.internalNote}\n---\n[${new Date().toISOString()}] ${note}`
      : `[${new Date().toISOString()}] ${note}`;

    await db
      .update(investmentRequests)
      .set({
        internalNote: formattedNote,
        updatedAt: new Date(),
      })
      .where(eq(investmentRequests.id, requestId));

    await db.insert(requestStatusHistory).values({
      requestId: current.id,
      actorId: actor.id,
      fromStatus: current.status,
      toStatus: current.status,
      internalNote: note,
    });
  }
}
