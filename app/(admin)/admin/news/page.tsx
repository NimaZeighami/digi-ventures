import Link from "next/link";
import { NewsService } from "@/modules/news/service";
import { formatPersianDate } from "@/lib/utils";
import { Plus, Edit, Eye, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const articles = await NewsService.getAllArticlesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">مدیریت اخبار و دیدگاه‌ها</h1>
          <p className="text-sm text-slate-500 mt-1">
            نگارش، ویرایش و انتشار اخبار سرمایه‌گذاری و بیانیه‌های مطبوعاتی دیجی‌ونچرز
          </p>
        </div>

        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-green hover:bg-brand-greenHover text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="h-4 w-4" />
          نگارش مقاله جدید
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500 shadow-sm">
          هنوز هیچ مقاله‌ای ثبت نشده است.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-50 text-xs text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">عنوان مقاله</th>
                  <th className="py-3.5 px-4 font-semibold">نویسنده</th>
                  <th className="py-3.5 px-4 font-semibold">وضعیت</th>
                  <th className="py-3.5 px-4 font-semibold">زمان مطالعه</th>
                  <th className="py-3.5 px-4 font-semibold">تاریخ انتشار</th>
                  <th className="py-3.5 px-4 font-semibold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((a) => {
                  const isPublished = a.status === "published";
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs truncate">
                        {a.title}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {a.authorEmail}
                      </td>
                      <td className="py-3.5 px-4">
                        {isPublished ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            منتشر شده
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            پیش‌نویس
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {a.readingTimeMinutes} دقیقه
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {a.publishedAt ? formatPersianDate(a.publishedAt) : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/news/${a.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition"
                          >
                            <Edit className="h-3.5 w-3.5 text-blue-600" />
                            ویرایش
                          </Link>
                          {isPublished && (
                            <Link
                              href={`/news/${a.slug}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition"
                            >
                              <Eye className="h-3.5 w-3.5 text-brand-green" />
                              مشاهده
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
