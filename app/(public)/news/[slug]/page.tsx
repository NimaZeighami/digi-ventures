import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { NewsService } from "@/modules/news/service";
import { getSessionUser } from "@/modules/auth/guard";
import { formatPersianDate } from "@/lib/utils";
import { CopyLinkButton } from "@/components/public/copy-link-button";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await NewsService.getArticleBySlug(params.slug, true);
  if (!data) {
    return {
      title: "مطلب یافت نشد | دیجی‌ونچرز",
    };
  }

  const { article } = data;
  return {
    title: `${article.title} | دیجی‌ونچرز`,
    description: article.excerpt,
    alternates: {
      canonical: `https://digiventures.ir/news/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: `https://digiventures.ir/news/${article.slug}`,
      publishedTime: article.publishedAt ? article.publishedAt.toISOString() : undefined,
      locale: "fa_IR",
    },
  };
}

export default async function SingleNewsPage({ params }: Props) {
  const user = await getSessionUser();
  const isStaff = user?.role === "admin" || user?.role === "super_admin";

  const result = await NewsService.getArticleBySlug(params.slug, isStaff);
  if (!result) {
    notFound();
  }

  const { article, authorEmail } = result;

  return (
    <article className="pt-[110px] pb-24 bg-white">
      <div className="container-dv max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8 text-xs text-slate-500 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-brand-green transition">
              خانه
            </Link>
            <span>/</span>
            <Link href="/news" className="hover:text-brand-green transition">
              تازه‌ها و دیدگاه‌ها
            </Link>
            <span>/</span>
            <span className="text-slate-800 line-clamp-1 max-w-[200px] sm:max-w-xs">
              {article.title}
            </span>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs text-brand-green hover:underline font-semibold"
          >
            <span>بازگشت به همه اخبار</span>
            <span>←</span>
          </Link>
        </div>

        {/* Draft Notice */}
        {article.status === "draft" && (
          <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
            <span className="font-bold">پیش‌نمایش مقاله پیش‌نویس:</span> این مطلب هنوز منتشر نشده است و تنها توسط مدیران سامانه قابل مشاهده است.
          </div>
        )}

        {/* Header */}
        <header className="space-y-6 mb-10">
          <span className="inline-block rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-brand-green">
            {(article as any).category || "سرمایه‌گذاری"}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-4">
              <span>نویسنده: دیجی‌ونچرز</span>
              {article.publishedAt && (
                <time dateTime={article.publishedAt.toISOString()}>
                  {formatPersianDate(article.publishedAt)}
                </time>
              )}
              <span>{article.readingTimeMinutes} دقیقه زمان مطالعه</span>
            </div>

            <CopyLinkButton title={article.title} />
          </div>

          {article.coverImage && (
            <div className="rounded-2xl overflow-hidden shadow-card border border-slate-200/80 my-8">
              <img src={article.coverImage} alt={article.title} className="w-full h-auto object-cover" />
            </div>
          )}

          {article.excerpt && (
            <div className="pull-quote">
              {article.excerpt}
            </div>
          )}
        </header>

        {/* Body Content */}
        <div className="dv-article-content whitespace-pre-wrap">
          {article.content}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>منتشر شده در پایگاه اطلاع‌رسانی دیجی‌ونچرز</div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-slate-700 hover:bg-white hover:text-brand-green transition"
          >
            <span>مشاهده سایر مطالب</span>
            <span>←</span>
          </Link>
        </footer>
      </div>
    </article>
  );
}
