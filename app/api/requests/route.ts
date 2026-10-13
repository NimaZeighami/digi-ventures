import { NextResponse } from "next/server";
import { requireAuth } from "@/modules/auth/guard";
import { createRequestSchema } from "@/modules/requests/schema";
import { RequestService } from "@/modules/requests/service";
import { FileStorageService, SavedFileMetadata } from "@/modules/storage/service";
import { AppError, ValidationError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req);

    const formData = await req.formData();
    const isDraft = formData.get("is_draft") === "true";

    const payload = {
      startup_name: formData.get("startup_name")?.toString() || "",
      founder_name: formData.get("founder_name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      sector: formData.get("sector")?.toString() || "",
      stage: formData.get("stage")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      idempotency_key: formData.get("idempotency_key")?.toString() || "",
    };

    const validated = createRequestSchema.safeParse(payload);
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

    if (!isDraft && !fileMetadata) {
      throw new ValidationError("بارگذاری فایل پیچ‌دک (حداکثر ۲۰ مگابایت، PDF یا PPT) الزامی است.");
    }

    let request;
    if (isDraft) {
      request = await RequestService.createDraft(user, validated.data as any, fileMetadata);
    } else {
      request = await RequestService.submitNewRequest(
        user,
        validated.data as any,
        fileMetadata!
      );
    }

    return NextResponse.json({ request }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message, details: error.details } },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "خطای سرور در ثبت درخواست" } },
      { status: 500 }
    );
  }
}
