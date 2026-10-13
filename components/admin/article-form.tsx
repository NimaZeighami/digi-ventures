"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NewsArticle, ArticleStatus } from "@/db/schema";
import { Save, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ArticleFormProps {
  initialData?: NewsArticle;
}

export function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [status, setStatus] = useState<ArticleStatus>(initialData?.status || "draft");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug when title changes (if not manual or editing)
  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEditing && !slug) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\u0600-\u06FFa-z0-9\s-_]/g, "")
        .replace(/\s+/g, "-");
      setSlug(generated);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isEditing
        ? `/api/admin/news/${initialData.id}`
        : "/api/admin/news";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          cover_image: coverImage || undefined,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "خطا در ذخیره مقاله");
      }

      router.push("/admin/news");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/news"
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition font-medium"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به فهرست مقالات
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-green hover:bg-brand-greenHover text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {loading ? "در حال ذخیره..." : isEditing ? "به‌روزرسانی مقاله" : "انتشار / ذخیره مقاله"}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">عنوان مقاله (فارسی):</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="مثال: گزارش فصلی سرمایه‌گذاری دیجی‌ونچرز در سال ۱۴۰۳"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white"
          />
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">
            شناسه آدرس (Slug) — بخشی از آدرس اینترنتی مقاله:
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="example-article-slug"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white font-mono"
            dir="ltr"
          />
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">وضعیت انتشار:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={status === "draft"}
                onChange={() => setStatus("draft")}
                className="accent-brand-green"
              />
              پیش‌نویس (عدم نمایش به عموم)
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="published"
                checked={status === "published"}
                onChange={() => setStatus("published")}
                className="accent-brand-green"
              />
              منتشر شده (عمومی)
            </label>
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">
            چکیده و مقدمه (جهت نمایش در کارت‌ها و نتایج جستجوی گوگل):
          </label>
          <textarea
            rows={2}
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="خلاصه کوتاهی از موضوع مقاله..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white"
          />
        </div>

        {/* Cover Image URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">آدرس تصویر شاخص (Cover Image URL):</label>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="/assets/images/news-1.jpg"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white font-mono"
            dir="ltr"
          />
        </div>

        {/* Content (Markdown) */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">متن کامل مقاله (پشتیبانی از Markdown):</label>
          <textarea
            rows={12}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="متن کامل خبر، بیانیه یا تحلیل سرمایه‌گذاری را اینجا بنویسید..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-900 placeholder:text-slate-400 font-mono leading-relaxed focus:outline-none focus:border-brand-green focus:bg-white"
          />
        </div>
      </div>
    </form>
  );
}
