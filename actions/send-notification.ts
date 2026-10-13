"use server";

import { z } from "zod";
import { renderPersianEmailTemplate, sendEmail } from "@/lib/mail";
import { logger } from "@/lib/logger";

// Input validation schema
const SendNotificationSchema = z.object({
  recipientEmail: z
    .string()
    .trim()
    .email({ message: "آدرس ایمیل گیرنده نامعتبر است." }),
  recipientName: z
    .string()
    .trim()
    .optional(),
  title: z
    .string()
    .trim()
    .min(3, { message: "عنوان پیام باید حداقل ۳ کاراکتر باشد." }),
  message: z
    .string()
    .trim()
    .min(5, { message: "متن پیام باید حداقل ۵ کاراکتر باشد." }),
  actionButton: z
    .object({
      label: z.string().trim().min(1, { message: "متن دکمه نباید خالی باشد." }),
      url: z.string().trim().url({ message: "لینک دکمه عملیات نامعتبر است." }),
    })
    .optional(),
});

export type SendNotificationInput = z.infer<typeof SendNotificationSchema>;

export interface ServerActionResponse {
  success: boolean;
  message: string;
  messageId?: string;
}

/**
 * Server Action to dispatch transactional notification emails.
 */
export async function sendNotificationAction(
  data: SendNotificationInput
): Promise<ServerActionResponse> {
  try {
    // 1. Validate Input Server-Side
    const parseResult = SendNotificationSchema.safeParse(data);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "اطلاعات ورودی نامعتبر است.";
      return {
        success: false,
        message: firstError,
      };
    }

    const { recipientEmail, recipientName, title, message, actionButton } = parseResult.data;

    // 2. Render Persian RTL HTML Template
    const html = renderPersianEmailTemplate({
      title,
      message,
      actionButton,
      recipientName,
    });

    // 3. Dispatch Email via Pooled Nodemailer Transporter
    const result = await sendEmail({
      to: recipientEmail,
      subject: `دیجیونچرز: ${title}`,
      html,
    });

    return {
      success: true,
      message: "ایمیل با موفقیت ارسال شد.",
      messageId: result.messageId,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to send transactional notification", { error: errorMessage });

    // Handle known SMTP error codes gracefully without exposing credentials or internal traces
    if (errorMessage.includes("EAUTH") || errorMessage.includes("535")) {
      return {
        success: false,
        message: "خطا در احراز هویت سرویس ایمیل. لطفاً تنظیمات حساب را بررسی کنید.",
      };
    }

    return {
      success: false,
      message: "خطا در برقراری ارتباط با سرویس ایمیل. لطفاً دقایقی دیگر مجدداً تلاش فرمایید.",
    };
  }
}
