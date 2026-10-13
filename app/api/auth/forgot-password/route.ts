import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/modules/auth/schema";
import { AuthService } from "@/modules/auth/service";
import { AppError } from "@/lib/errors";

import { db } from "@/db";
import { emailOutbox } from "@/db/schema";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { EmailService } from "@/modules/email/service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = forgotPasswordSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_FAILED",
            message: "ایمیل وارد شده معتبر نیست.",
            details: validated.error.flatten().fieldErrors,
          },
        },
        { status: 422 }
      );
    }

    // Generic success response regardless of user existence to prevent account enumeration
    const resetInfo = await AuthService.requestPasswordReset(validated.data.email);
    if (resetInfo.rawToken && resetInfo.userEmail) {
      const resetUrl = `${env.APP_URL}/reset-password?token=${resetInfo.rawToken}`;
      await db.insert(emailOutbox).values({
        toEmail: resetInfo.userEmail,
        subject: "بازیابی رمز عبور دیجی‌ونچرز",
        htmlBody: `
          <div style="font-family: Tahoma, sans-serif; direction: rtl; text-align: right; line-height: 1.6; color: #333;">
            <h2 style="color: #00B140;">درخواست بازیابی رمز عبور دیجی‌ونچرز</h2>
            <p>درخواست بازیابی رمز عبور برای حساب کاربری شما دریافت شد.</p>
            <p>برای تنظیم رمز عبور جدید روی لینک زیر کلیک کنید (این لینک به مدت ۱ ساعت معتبر است):</p>
            <p><a href="${resetUrl}" style="display: inline-block; background-color: #00B140; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">بازیابی رمز عبور</a></p>
            <p style="color: #888; font-size: 12px;">اگر این درخواست توسط شما انجام نشده است، لطفاً این ایمیل را نادیده بگیرید.</p>
          </div>
        `,
        textBody: `برای بازیابی رمز عبور به پیوند زیر مراجعه کنید:\n${resetUrl}`,
      });

      if (env.NODE_ENV !== "test") {
        EmailService.processOutbox().catch((err) => {
          logger.error("Failed to process email outbox after password reset", {
            error: err?.message,
          });
        });
      }
    }

    return NextResponse.json(
      { message: "در صورت وجود حساب کاربری، لینک بازیابی رمز عبور ارسال شد." },
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
