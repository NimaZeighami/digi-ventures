import { NextResponse } from "next/server";
import { requireAuth } from "@/modules/auth/guard";
import { RequestService } from "@/modules/requests/service";
import { AppError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await requireAuth(req);
    const requests = await RequestService.getMyRequests(user);
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "خطای سرور در دریافت درخواست‌ها" } },
      { status: 500 }
    );
  }
}
