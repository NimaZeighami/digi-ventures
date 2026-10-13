import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/modules/auth/guard";
import { createArticleSchema } from "@/modules/news/schema";
import { NewsService } from "@/modules/news/service";
import { AppError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const actor = await requireAuth(req);
    requireRole(actor, ["admin", "super_admin"]);

    const articles = await NewsService.getAllArticlesAdmin();
    return NextResponse.json({ articles }, { status: 200 });
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

export async function POST(req: Request) {
  try {
    const actor = await requireAuth(req);
    requireRole(actor, ["admin", "super_admin"]);

    const body = await req.json();
    const validated = createArticleSchema.safeParse(body);
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

    const article = await NewsService.createArticle(actor.id, validated.data);
    return NextResponse.json({ article }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "خطای سرور در ایجاد مقاله" } },
      { status: 500 }
    );
  }
}
