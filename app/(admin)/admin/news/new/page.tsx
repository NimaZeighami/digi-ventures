import { ArticleForm } from "@/components/admin/article-form";

export default function AdminNewArticlePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">نگارش مقاله جدید</h1>
        <p className="text-sm text-slate-500 mt-1">
          ثبت گزارش، بیانیه یا تحلیل جدید در بخش تازه‌ها و دیدگاه‌های دیجی‌ونچرز
        </p>
      </div>

      <ArticleForm />
    </div>
  );
}
