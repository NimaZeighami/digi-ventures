import { z } from "zod";
import { normalizeDigits } from "@/lib/utils";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "نام باید حداقل ۲ کاراکتر باشد.").max(100),
  email: z.string().trim().email("پست الکترونیک معتبر نیست.").max(255),
  phone: z
    .string()
    .trim()
    .transform(normalizeDigits)
    .refine((val) => val.length >= 8 && val.length <= 50, {
      message: "شماره تماس باید حداقل ۸ رقم باشد.",
    }),
  subject: z.string().trim().min(3, "موضوع پیام باید حداقل ۳ کاراکتر باشد.").max(200),
  message: z.string().trim().min(10, "متن پیام باید حداقل ۱۰ کاراکتر باشد.").max(5000),
  website: z.string().optional(), // Honeypot field for bot detection
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
