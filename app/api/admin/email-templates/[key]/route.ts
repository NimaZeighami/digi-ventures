import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/modules/auth/guard";
import { db } from "@/db";
import { emailTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AppError, NotFoundError, ValidationError } from "@/lib/errors";

export async function PUT(
  req: Request,
  { params }: { params: { key: string } }
) {
  try {
    const actor = await requireAuth(req);
    requireRole(actor, ["super_admin"]);

    const body = await req.json();
    const subject = body.subject?.toString().trim();
    const bodyText = body.body?.toString().trim();

    if (!subject || !bodyText) {
      throw new ValidationError("عنوان و متن قالب ایمیل الزامی است.");
    }

    const [existing] = await db
      .select()
      .from(emailTemplates)
      .where(eq(emailTemplates.key, params.key));

    if (!existing) {
      throw new NotFoundError("قالب ایمیل مورد نظر یافت نشد.");
    }

    const [updated] = await db
      .update(emailTemplates)
      .set({
        subject,
        body: bodyText,
        updatedBy: actor.id,
        updatedAt: new Date(),
      })
      .where(eq(emailTemplates.key, params.key))
      .returning();

    return NextResponse.json({ template: updated }, { status: 200 });
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
