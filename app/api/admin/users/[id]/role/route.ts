import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/modules/auth/guard";
import { AuthService } from "@/modules/auth/service";
import { changeRoleSchema } from "@/modules/auth/schema";
import { AppError } from "@/lib/errors";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const actor = await requireAuth(req);
    requireRole(actor, ["super_admin"]);

    const body = await req.json();
    const validated = changeRoleSchema.safeParse({
      targetUserId: params.id,
      newRole: body.newRole,
    });

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

    const updatedUser = await AuthService.changeUserRole({
      actorId: actor.id,
      actorRole: actor.role,
      targetUserId: validated.data.targetUserId,
      newRole: validated.data.newRole,
    });

    return NextResponse.json(
      {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "خطای غیرمنتظره در سرور" } },
      { status: 500 }
    );
  }
}
