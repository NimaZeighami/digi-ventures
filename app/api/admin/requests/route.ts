import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/modules/auth/guard";
import { RequestService } from "@/modules/requests/service";
import { AppError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const actor = await requireAuth(req);
    requireRole(actor, ["admin", "super_admin"]);

    const url = new URL(req.url);
    const status = url.searchParams.get("status") as any;
    const sector = url.searchParams.get("sector") as any;
    const search = url.searchParams.get("search") || undefined;

    const requests = await RequestService.getAllRequests(actor, {
      status,
      sector,
      search,
    });

    return NextResponse.json({ requests }, { status: 200 });
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
