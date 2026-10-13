import { NextResponse } from "next/server";
import { requireAuth } from "@/modules/auth/guard";
import { RequestService } from "@/modules/requests/service";
import { updateRequestSchema } from "@/modules/requests/schema";
import { FileStorageService, SavedFileMetadata } from "@/modules/storage/service";
import { AppError, ConflictError, NotFoundError } from "@/lib/errors";
import { db } from "@/db";
import { investmentRequests } from "@/db/schema";
import { eq } from "drizzle-orm";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!UUID_REGEX.test(params.id)) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "شناسه درخواست نامعتبر است." } },
        { status: 404 }
      );
    }

    const user = await requireAuth(req);
    const data = await RequestService.getRequestById(user, params.id);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "خطای سرور" } },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!UUID_REGEX.test(params.id)) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "شناسه درخواست نامعتبر است." } },
        { status: 404 }
      );
    }

    const user = await requireAuth(req);

    const formData = await req.formData();
    const isResubmit = formData.get("is_resubmit") === "true";

    const payload: Record<string, any> = {};
    const fields = [
      "startup_name",
      "founder_name",
      "email",
      "phone",
      "sector",
      "stage",
      "description",
    ];

    for (const f of fields) {
      const val = formData.get(f);
      if (val !== null && val !== undefined) {
        payload[f] = val.toString();
      }
    }

    const validated = updateRequestSchema.safeParse(payload);
    if (!validated.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_FAILED",
            message: "ورودی‌های ارسالی معتبر نیستند.",
            details: validated.error.flatten().fieldErrors,
          },
        },
        { status: 422 }
      );
    }

    const file = formData.get("pitch_deck");
    let fileMetadata: SavedFileMetadata | undefined;

    if (file && file instanceof Blob && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      fileMetadata = await FileStorageService.validateAndSave({
        name: (file as any).name || "pitch_deck.pdf",
        size: file.size,
        type: file.type,
        buffer,
      });
    }

    const [current] = await db
      .select()
      .from(investmentRequests)
      .where(eq(investmentRequests.id, params.id));

    if (!current) {
      throw new NotFoundError("درخواست مورد نظر یافت نشد.");
    }

    let request;
    if (isResubmit) {
      if (current.status === "draft") {
        await RequestService.updateDraft(
          user,
          params.id,
          validated.data as any,
          fileMetadata
        );
        request = await RequestService.submitDraft(user, params.id);
      } else if (current.status === "needs_revision") {
        request = await RequestService.resubmitRequest(
          user,
          params.id,
          validated.data as any,
          fileMetadata
        );
      } else {
        throw new ConflictError("تنها پیش‌نویس‌ها یا درخواست‌های نیازمند بازنگری امکان ارسال دارند.");
      }
    } else {
      request = await RequestService.updateDraft(
        user,
        params.id,
        validated.data as any,
        fileMetadata
      );
    }

    return NextResponse.json({ request }, { status: 200 });
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message, details: error.details } },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "خطای سرور" } },
      { status: 500 }
    );
  }
}
