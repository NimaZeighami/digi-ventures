import { describe, it, expect } from "vitest";
import { renderPersianEmailTemplate, sendEmail } from "@/lib/mail";
import { sendNotificationAction } from "@/actions/send-notification";

describe("Transactional Email Module (Gmail SMTP & Persian RTL)", () => {
  it("renders a valid Persian RTL HTML email template with correct branding and fallbacks", () => {
    const html = renderPersianEmailTemplate({
      title: "به‌روزرسانی وضعیت درخواست سرمایه‌گذاری",
      message: "درخواست شما با موفقیت بررسی گردید.\nجهت مشاهده جزئیات کلیک کنید.",
      recipientName: "علیرضا",
      actionButton: {
        label: "مشاهده در پرتال",
        url: "https://digiventures.ir/portal/requests/123",
      },
    });

    expect(html).toContain('dir="rtl"');
    expect(html).toContain('lang="fa"');
    expect(html).toContain("دیجیونچرز");
    expect(html).toContain("به‌روزرسانی وضعیت درخواست سرمایه‌گذاری");
    expect(html).toContain("علیرضا");
    expect(html).toContain("مشاهده در پرتال");
    expect(html).toContain("https://digiventures.ir/portal/requests/123");
    expect(html).toContain("Tahoma");
  });

  it("sends an email successfully via the test transporter", async () => {
    const result = await sendEmail({
      to: "recipient@example.com",
      subject: "آزمایش سیستم ایمیل",
      html: "<p>سلام، این یک ایمیل آزمایشی است.</p>",
    });

    expect(result.messageId).toBeDefined();
    expect(typeof result.messageId).toBe("string");
  });

  it("validates server action input and rejects invalid email addresses", async () => {
    const res = await sendNotificationAction({
      recipientEmail: "invalid-email-address",
      title: "عنوان تست",
      message: "متن تست برای آزمون سیستم ایمیل",
    });

    expect(res.success).toBe(false);
    expect(res.message).toBe("آدرس ایمیل گیرنده نامعتبر است.");
  });

  it("validates server action input and rejects too short messages", async () => {
    const res = await sendNotificationAction({
      recipientEmail: "user@example.com",
      title: "عنوان تست",
      message: "کم", // 2 characters (< 5)
    });

    expect(res.success).toBe(false);
    expect(res.message).toBe("متن پیام باید حداقل ۵ کاراکتر باشد.");
  });

  it("executes server action successfully with valid data", async () => {
    const res = await sendNotificationAction({
      recipientEmail: "founder@example.com",
      recipientName: "سارا",
      title: "تایید مدارک ارسالی",
      message: "مدارک شما با موفقیت در سیستم دیجیونچرز ثبت و تایید گردید.",
      actionButton: {
        label: "ورود به حساب کاربری",
        url: "https://digiventures.ir/auth/login",
      },
    });

    expect(res.success).toBe(true);
    expect(res.message).toBe("ایمیل با موفقیت ارسال شد.");
    expect(res.messageId).toBeDefined();
  });

  it("handles test-email API route cleanly", async () => {
    const { GET } = await import("@/app/api/test-email/route");
    const req = new Request("http://localhost:3000/api/test-email?to=tester@example.com");
    const response = await GET(req);
    const body = await response.json();

    // Since SMTP_USER is empty in test environment unless set, it either rejects cleanly or sends
    expect([200, 400]).toContain(response.status);
    expect(typeof body.success).toBe("boolean");
  });
});
