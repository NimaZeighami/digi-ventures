import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/modules/auth/guard";
import { updateArticleSchema } from "@/modules/news/schema";
import { NewsService } from "@/modules/news/service";
import { AppError } from "@/lib/errors";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!UUID_REGEX.test(params.id)) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "شناسه مقاله نامعتبر است." } },
        { status: 404 }
      );
    }

    const actor = await requireAuth(req);
    requireRole(actor, ["admin", "super_admin"]);

    const body = await req.json();
    const validated = updateArticleSchema.safeParse(body);
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

    const updated = await NewsService.updateArticle(params.id, validated.data);
    return NextResponse.json({ article: updated }, { status: 200 });
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "خطای سرور در ویرایش مقاله" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!UUID_REGEX.test(params.id)) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "شناسه مقاله نامعتبر است." } },
        { status: 404 }
      );
    }

    const actor = await requireAuth(req);
    requireRole(actor, ["admin", "super_admin"]);

    await NewsService.deleteArticle(params.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "خطای سرور در حذف مقاله" } },
      { status: 500 }
    );
  }
}
