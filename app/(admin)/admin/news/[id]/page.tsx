import { db } from "@/db";
import { newsArticles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/article-form";

export const dynamic = "force-dynamic";

export default async function AdminEditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const [article] = await db
    .select()
    .from(newsArticles)
    .where(eq(newsArticles.id, params.id));

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ویرایش مقاله</h1>
        <p className="text-sm text-slate-500 mt-1">
          به‌روزرسانی محتوا، چکیده و وضعیت انتشار مقاله «{article.title}»
        </p>
      </div>

      <ArticleForm initialData={article} />
    </div>
  );
}
