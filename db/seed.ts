import argon2 from "argon2";
import { db } from "./index";
import { users, emailTemplates, newsArticles } from "./schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

async function seed() {
  logger.info("Starting database seed...");

  const defaultPasswordHash = await argon2.hash("Password123!", {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
  });

  // 1. Seed Users
  const seedUsers = [
    {
      email: "admin@digiventures.ir",
      passwordHash: defaultPasswordHash,
      role: "super_admin" as const,
    },
    {
      email: "reviewer@digiventures.ir",
      passwordHash: defaultPasswordHash,
      role: "admin" as const,
    },
    {
      email: "founder@startup.ir",
      passwordHash: defaultPasswordHash,
      role: "customer" as const,
    },
  ];

  for (const u of seedUsers) {
    const existing = await db.select().from(users).where(eq(users.email, u.email));
    if (existing.length === 0) {
      await db.insert(users).values(u);
      logger.info(`Seeded user: ${u.email} (${u.role})`);
    }
  }

  // Fetch super_admin for relations
  const [superAdmin] = await db
    .select()
    .from(users)
    .where(eq(users.email, "admin@digiventures.ir"));

  // 2. Seed Email Templates
  const seedTemplates = [
    {
      key: "request_received",
      subject: "درخواست سرمایه‌گذاری شما با موفقیت ثبت شد",
      body: `درود {founder_name} عزیز،

درخواست سرمایه‌گذاری شما برای استارتاپ «{startup_name}» با موفقیت در سامانه دیجی‌ونچرز ثبت شد و جهت بررسی در اختیار تیم ارزیابی قرار گرفت.

پس از بررسی اولیه فایل پیچ‌دک و اطلاعات ارسال‌شده، وضعیت درخواست از طریق ایمیل و پنل کاربری به اطلاع شما خواهد رسید.

با احترام،
تیم سرمایه‌گذاری دیجی‌ونچرز`,
      updatedBy: superAdmin?.id,
    },
    {
      key: "request_status_updated",
      subject: "به‌روزرسانی وضعیت درخواست استارتاپ {startup_name}",
      body: `درود {founder_name} عزیز،

وضعیت بررسی درخواست استارتاپ «{startup_name}» به‌روزرسانی شد:
وضعیت جدید: {status}

پیام تیم بررسی:
{message}

جهت مشاهده جزئیات بیشتر یا ویرایش اطلاعات درخواستی، به پنل کاربری خود در دیجی‌ونچرز مراجعه نمایید.

با احترام،
تیم سرمایه‌گذاری دیجی‌ونچرز`,
      updatedBy: superAdmin?.id,
    },
  ];

  for (const t of seedTemplates) {
    const existing = await db.select().from(emailTemplates).where(eq(emailTemplates.key, t.key));
    if (existing.length === 0) {
      await db.insert(emailTemplates).values(t);
      logger.info(`Seeded email template: ${t.key}`);
    }
  }

  // 3. Seed News Articles
  if (superAdmin) {
    const seedArticles = [
      {
        authorId: superAdmin.id,
        title: "گزارش جامع سرمایه‌گذاری خطرپذیر دیجی‌ونچرز در سال ۱۴۰۲",
        slug: "digiventures-annual-report-1402",
        excerpt: "بررسی روند سرمایه‌گذاری، حمایت از استارتاپ‌های پیشرو اکوسیستم و توسعه زنجیره ارزش گروه دیجی‌کالا در سال گذشته.",
        content: `دیجی‌ونچرز به عنوان بازوی سرمایه‌گذاری جسورانه شرکتی (CVC) گروه دیجی‌کالا، در سال گذشته با تمرکز بر توانمندسازی کارآفرینان نوآور، گام‌های بلندی در تقویت زیرساخت‌های اقتصاد دیجیتال کشور برداشته است.

### مهم‌ترین دستاوردهای سال:
- گسترش پورتفولیو به بیش از ۱۵ استارتاپ فعال
- تمرکز بر حوزه‌های لجستیک هوشمند، فین‌تک و فناوری‌های ابری
- هم‌افزایی عملیاتی عمیق میان استارتاپ‌های پورتفولیو و پلتفرم‌های دیجی‌کالا

ما باور داریم که آینده اقتصاد دیجیتال به دست کارآفرینانی رقم می‌خورد که مسائل واقعی مردم را با راهکارهای فناورانه و مقیاس‌پذیر حل می‌کنند.`,
        coverImage: "/assets/images/news-1.jpg",
        status: "published" as const,
        readingTimeMinutes: 4,
        publishedAt: new Date("2024-03-15T10:00:00Z"),
      },
      {
        authorId: superAdmin.id,
        title: "تحول در لجستیک تجارت الکترونیک با سرمایه‌گذاری استراتژیک در دیجی‌اکسپرس",
        slug: "digiexpress-logistics-investment",
        excerpt: "چگونه فناوری‌های نوین مسیرهای توزیع و لجستیک هوشمند به ارتقای تجربه تحویل سفارش‌ها در سراسر کشور کمک می‌کند.",
        content: `لجستیک یکی از ستون‌های اساسی تجربه مشتری در تجارت الکترونیک است. سرمایه‌گذاری دیجی‌ونچرز در توسعه زیرساخت‌های دیجی‌اکسپرس، امکان پردازش صدها هزار بسته در روز با استفاده از هوش مصنوعی در توزیع و بهینه‌سازی مسیرها را فراهم کرده است.

این فناوری نه‌تنها زمان تحویل را به کمتر از ۲۴ ساعت در کلان‌شهرها کاهش داده، بلکه مصرف سوخت و آلایندگی را نیز به شکل چشمگیری بهینه‌سازی کرده است.`,
        coverImage: "/assets/images/news-2.jpg",
        status: "published" as const,
        readingTimeMinutes: 3,
        publishedAt: new Date("2024-04-20T14:30:00Z"),
      },
    ];

    for (const a of seedArticles) {
      const existing = await db.select().from(newsArticles).where(eq(newsArticles.slug, a.slug));
      if (existing.length === 0) {
        await db.insert(newsArticles).values(a);
        logger.info(`Seeded news article: ${a.slug}`);
      }
    }
  }

  logger.info("Database seed completed successfully.");
  process.exit(0);
}

seed().catch((err) => {
  logger.error("Database seed failed", { error: err.message || err });
  process.exit(1);
});
