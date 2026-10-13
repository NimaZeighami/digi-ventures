import { Metadata } from "next";
import Link from "next/link";
import { NewsService } from "@/modules/news/service";
import { formatPersianDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تازه‌ها و دیدگاه‌ها | دیجی‌ونچرز",
  description: "مرجع تخصصی دیدگاه‌های راهبردی، دستاوردهای استارتاپ‌های پورتفولیو و تحلیل‌های تیم سرمایه‌گذاری دیجی‌ونچرز",
};

export default async function PublicNewsPage({
  searchParams,
}: {
  searchParams?: { search?: string; category?: string };
}) {
  const articles = await NewsService.getPublishedArticles(searchParams?.search);

  const defaultArticles = [
    {
      id: "def-1",
      slug: "smart-logistics-supply-chain",
      title: "چرا دیجی‌ونچرز در استارتاپ‌های لجستیک هوشمند و زنجیره تأمین تجارت دیجیتال سرمایه‌گذاری کرد؟",
      excerpt: "تحلیل راهبردی ارزش‌گذاری و فرصت‌های پنهان در خودکارسازی زنجیره توزیع و بهره‌گیری از هوش مصنوعی در لجستیک مقیاس‌پذیر.",
      category: "سرمایه‌گذاری",
      coverImage: "/assets/images/m12/dv-news-logistics.jpg",
      publishedAt: new Date(),
      readingTimeMinutes: 6,
    },
    {
      id: "def-2",
      slug: "fintech-digital-payments-future",
      title: "همراهی راهبردی دیجی‌پی و دیجی‌ونچرز در توانمندسازی و رشد مقیاس استارتاپ‌های حوزه فین‌تک",
      excerpt: "چگونگی اتصال خدمات اعتباری BNPL، کیف پول و زیرساخت پرداخت امن به اکوسیستم فروشگاهی و نوآوری مالی.",
      category: "اخبار پورتفولیو",
      coverImage: "/assets/images/m12/dv-news-fintech.jpg",
      publishedAt: new Date(),
      readingTimeMinutes: 5,
    },
    {
      id: "def-3",
      slug: "ai-llm-ecommerce-transformation",
      title: "تحلیل اختصاصی: همگرایی هوش مصنوعی و مدل‌های زبانی بزرگ در تحول تجربه تجارت الکترونیک",
      excerpt: "بررسی نقش ایجنت‌های هوشمند در شخصی‌سازی جستجو، پاسخگویی مشتریان و مدیریت پویای قیمت‌گذاری در خرده‌فروشی دیجیتال.",
      category: "دیدگاه و تحلیل",
      coverImage: "/assets/images/m12/dv-news-ai.jpg",
      publishedAt: new Date(),
      readingTimeMinutes: 8,
    },
  ];

  const displayArticles = articles.length > 0 ? articles : defaultArticles;

  return (
    <div className="pt-[76px]">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container-dv relative z-10 mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/90 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm mb-6">
            <span className="h-2 w-2 rounded-full bg-brand-green"></span>
            <span>تازه‌ها، دیدگاه‌ها و اتاق خبر دیجی‌ونچرز</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-950 sm:text-5xl lg:text-6xl leading-[1.2] tracking-tight">
            روایت نوآوری، گزارش‌های سرمایه‌گذاری و <span className="text-brand-green">چشم‌انداز آینده</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 font-light leading-relaxed max-w-3xl mx-auto">
            مرجع تخصصی دیدگاه‌های راهبردی، دستاوردهای استارتاپ‌های پورتفولیو و تحلیل‌های تیم سرمایه‌گذاری دیجی‌ونچرز در تحول اقتصاد دیجیتال، تجارت الکترونیک، فین‌تک و فناوری‌های عمیق.
          </p>

          {/* Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form method="get" className="relative flex items-center">
              <input
                name="search"
                defaultValue={searchParams?.search}
                type="text"
                placeholder="جستجو در مقالات، دسته‌بندی‌ها یا شرکت‌های پورتفولیو..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 pl-14 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none transition-all duration-200 focus:border-brand-green focus:ring-4 focus:ring-emerald-500/10"
              />
              <button
                type="submit"
                className="absolute left-3 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm hover:bg-slate-800"
                aria-label="جستجو"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ==================== ARTICLES GRID ==================== */}
      <section className="py-16 bg-slate-50/50">
        <div className="container-dv">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayArticles.map((article) => (
              <article
                key={article.id}
                className="rounded-2xl border border-slate-200/80 bg-white shadow-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-brand-green/40 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={article.coverImage || "/assets/images/m12/dv-news-logistics.jpg"}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <span className="absolute top-4 right-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-sm">
                      {(article as any).category || "سرمایه‌گذاری"}
                    </span>
                  </div>

                  <div className="p-6">
                    <p className="text-xs text-slate-400 font-medium mb-2">
                      {article.publishedAt ? formatPersianDate(article.publishedAt) : "شهریور ۱۴۰۵"}
                    </p>
                    <h2 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 hover:text-brand-green transition-colors">
                      <Link href={`/news/${article.slug}`}>{article.title}</Link>
                    </h2>
                    <p className="mt-3 text-xs sm:text-sm text-slate-600 font-light leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{article.readingTimeMinutes || 5} دقیقه مطالعه</span>
                  <Link href={`/news/${article.slug}`} className="font-semibold text-brand-green hover:underline">
                    ادامه مطلب ←
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
