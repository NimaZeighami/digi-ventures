import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("ایمیل وارد شده معتبر نیست"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
});

export const loginSchema = z.object({
  email: z.string().email("ایمیل وارد شده معتبر نیست"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("ایمیل وارد شده معتبر نیست"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "توکن بازیابی الزامی است"),
  password: z.string().min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد"),
});

export const changeRoleSchema = z.object({
  targetUserId: z.string().uuid("شناسه کاربر نامعتبر است"),
  newRole: z.enum(["customer", "admin"], {
    errorMap: () => ({ message: "نقش انتخابی باید customer یا admin باشد" }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
