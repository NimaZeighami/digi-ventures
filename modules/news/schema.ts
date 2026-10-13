import { z } from "zod";

export const articleStatusSchema = z.enum(["draft", "published"]);

export const createArticleSchema = z.object({
  title: z.string().min(5, "عنوان مقاله باید حداقل ۵ کاراکتر باشد").max(255),
  slug: z
    .string()
    .min(3, "شناسه آدرس (slug) باید حداقل ۳ کاراکتر باشد")
    .max(255)
    .regex(/^[a-z0-9\u0600-\u06FF_-]+$/i, "شناسه آدرس فقط می‌تواند شامل حروف، اعداد، زیرخط و خط تیره باشد"),
  excerpt: z.string().min(10, "چکیده مقاله باید حداقل ۱۰ کاراکتر باشد").max(500),
  content: z.string().min(30, "متن مقاله باید حداقل ۳۰ کاراکتر باشد"),
  cover_image: z.string().optional(),
  status: articleStatusSchema.default("draft"),
});

export const updateArticleSchema = createArticleSchema.partial();
