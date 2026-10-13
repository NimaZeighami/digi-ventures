import { NextResponse } from "next/server";
import { NewsService } from "@/modules/news/service";
import { AppError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || undefined;
    const articles = await NewsService.getPublishedArticles(search);
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
