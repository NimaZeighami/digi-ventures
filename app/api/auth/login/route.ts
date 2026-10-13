import { NextResponse } from "next/server";
import { loginSchema } from "@/modules/auth/schema";
import { AuthService } from "@/modules/auth/service";
import { setSessionCookie } from "@/modules/auth/guard";
import { AppError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    const body = await req.json();
    const validated = loginSchema.safeParse(body);
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

    const { user, token } = await AuthService.login({
      email: validated.data.email,
      password: validated.data.password,
      ipAddress,
      userAgent,
    });

    const res = NextResponse.json({ user }, { status: 200 });
    setSessionCookie(res, token);
    return res;
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
