import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { renderPersianEmailTemplate, sendEmail, transporter } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const targetEmail = url.searchParams.get("to") || env.ADMIN_NOTIFICATION_EMAIL;

    // 1. Check if SMTP credentials are configured
    if (!env.SMTP_USER || !env.SMTP_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          error: "اطلاعات SMTP_USER یا SMTP_PASSWORD در فایل .env.local تنظیم نشده است.",
          hint: "لطفاً ایمیل جیمیل و رمز عبور ۱۶ رقمی (Google App Password) را در .env.local وارد کرده و سرور را ری‌استارت کنید.",
          currentConfig: {
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: env.SMTP_SECURE,
            userConfigured: Boolean(env.SMTP_USER),
            passwordConfigured: Boolean(env.SMTP_PASSWORD),
          },
        },
        { status: 400 }
      );
    }

    // 2. Render Persian RTL HTML email template with legitimate content and clean HTTPS links
    const cleanUrl = env.APP_URL.includes("localhost") ? "https://digiventures.ir" : env.APP_URL;

    const html = renderPersianEmailTemplate({
      title: "اطلاعیه پرتال دیجی‌ونچرز",
      message: "درود بر شما،\nاین پیام جهت تأیید اتصال و اطلاع‌رسانی حساب کاربری شما در سامانه دیجی‌ونچرز ارسال شده است.",
      recipientName: "کاربر گرامی",
      actionButton: {
        label: "ورود به سامانه دیجی‌ونچرز",
        url: cleanUrl,
      },
    });

    // 3. Send email with non-spam subject and clean matching plain text
    const result = await sendEmail({
      to: targetEmail,
      subject: "اطلاعیه پرتال دیجی‌ونچرز",
      html,
      text: `درود کاربر گرامی،\n\nاین پیام جهت تأیید اتصال و اطلاع‌رسانی حساب کاربری شما در سامانه دیجی‌ونچرز ارسال شده است.\n\nورود به سامانه: ${cleanUrl}\n\nبا احترام،\nتیم دیجی‌ونچرز`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "ایمیل آزمایشی با موفقیت ارسال شد.",
        recipient: targetEmail,
        messageId: result.messageId,
        smtpHost: env.SMTP_HOST,
        smtpPort: env.SMTP_PORT,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[TestEmail] SMTP delivery failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "خطای نامشخص در ارسال ایمیل",
        code: error?.code,
        command: error?.command,
        response: error?.response,
        hint:
          error?.code === "EAUTH"
            ? "خطای احراز هویت (535): لطفاً مطمئن شوید از Google App Password (کد ۱۶ رقمی) استفاده می‌کنید و 2-Step Verification روی حساب فعال است."
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return GET(req);
}
