import { NextResponse } from "next/server";
import { registerSchema } from "@/modules/auth/schema";
import { AuthService } from "@/modules/auth/service";
import { AppError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.safeParse(body);
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

    const user = await AuthService.register(validated.data);
    return NextResponse.json({ user }, { status: 201 });
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
