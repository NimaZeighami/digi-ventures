import { NextResponse } from "next/server";
import { NewsService } from "@/modules/news/service";
import { AppError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const result = await NewsService.getArticleBySlug(params.slug, false);
    if (!result) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "مقاله مورد نظر یافت نشد." } },
        { status: 404 }
      );
    }

    return NextResponse.json({ article: result.article, author: result.authorEmail }, { status: 200 });
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
