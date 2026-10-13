import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/modules/auth/guard";
import { db } from "@/db";
import { emailTemplates } from "@/db/schema";
import { AppError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const actor = await requireAuth(req);
    requireRole(actor, ["super_admin"]);

    const templates = await db.select().from(emailTemplates);
    return NextResponse.json({ templates }, { status: 200 });
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
