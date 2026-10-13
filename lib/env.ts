import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1).default("postgres://localhost:5432/digiventures_dev"),
  SESSION_SECRET: z.string().min(16).default("super_secret_session_key_digiventures_2026_default_salt"),
  STORAGE_ROOT: z.string().min(1).default("./storage/uploads/pitch-decks"),
  SMTP_HOST: z.string().default("localhost"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z
    .union([z.boolean(), z.string()])
    .optional()
    .default(false)
    .transform((v) => v === true || v === "true" || v === "1"),
  SMTP_USER: z.string().default(""),
  SMTP_PASSWORD: z.string().default(""),
  SMTP_FROM: z.string().default('"Digi Ventures" <noreply@digiventures.ir>'),
  ADMIN_NOTIFICATION_EMAIL: z.string().email().default("investment@digiventures.ir"),
});

export const env = envSchema.parse(process.env);
