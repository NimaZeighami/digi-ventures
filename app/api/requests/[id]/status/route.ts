import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/modules/auth/guard";
import { changeStatusSchema } from "@/modules/requests/schema";
import { TransitionService } from "@/modules/requests/transition";
import { AppError } from "@/lib/errors";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
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

    const actor = await requireAuth(req);
    requireRole(actor, ["admin", "super_admin"]);

    const body = await req.json();
    const validated = changeStatusSchema.safeParse(body);
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

    const updatedRequest = await TransitionService.executeTransition({
      requestId: params.id,
      targetStatus: validated.data.targetStatus,
      actor,
      adminMessage: validated.data.adminMessage,
      internalNote: validated.data.internalNote,
      expectedVersion: validated.data.expectedVersion,
    });

    return NextResponse.json({ request: updatedRequest }, { status: 200 });
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "خطای سرور در تغییر وضعیت" } },
      { status: 500 }
    );
  }
}
