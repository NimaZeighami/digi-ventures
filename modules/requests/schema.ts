import { z } from "zod";
import { normalizeDigits } from "@/lib/utils";

export const requestSectorSchema = z.enum([
  "ecommerce",
  "fintech",
  "platform",
  "supply_chain",
  "ai",
  "other",
], {
  errorMap: () => ({ message: "لطفاً حوزه فعالیت معتبری انتخاب کنید." }),
});

export const requestStageEnumSchema = z.enum([
  "seed",
  "early",
  "growth",
  "scale",
], {
  errorMap: () => ({ message: "لطفاً مرحله رشد استارتاپ را انتخاب کنید." }),
});

export const requestStageSchema = z.preprocess(
  (val) => (val === "idea" ? "seed" : val),
  requestStageEnumSchema
);

export const requestStatusSchema = z.enum([
  "draft",
  "submitted",
  "under_review",
  "needs_revision",
  "accepted",
  "rejected",
]);

export const createRequestSchema = z.object({
  startup_name: z.string().min(2, "نام استارتاپ باید حداقل ۲ کاراکتر باشد").max(100),
  founder_name: z.string().min(2, "نام و نام خانوادگی بنیان‌گذار الزامی است").max(100),
  email: z.string().email("ایمیل وارد شده معتبر نیست"),
  phone: z
    .string()
    .transform(normalizeDigits)
    .refine((v) => /^[0-9]{10,15}$/.test(v), {
      message: "شماره تماس باید بین ۱۰ تا ۱۵ رقم باشد",
    }),
  sector: requestSectorSchema,
  stage: requestStageSchema,
  description: z.string().min(30, "توضیحات باید حداقل ۳۰ کاراکتر باشد").max(3000),
  idempotency_key: z
    .string()
    .regex(/^[a-zA-Z0-9_-]{16,64}$/, "کلید ارسال تکراری نامعتبر است"),
});

export const updateRequestSchema = createRequestSchema.partial().omit({ idempotency_key: true });

export const changeStatusSchema = z.object({
  targetStatus: requestStatusSchema,
  adminMessage: z.string().optional(),
  internalNote: z.string().optional(),
  expectedVersion: z.number().int().min(1),
});

export const internalNoteSchema = z.object({
  note: z.string().min(2, "متن یادداشت الزامی است (حداقل ۲ کاراکتر)"),
});
