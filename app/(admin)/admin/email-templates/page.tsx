import { redirect } from "next/navigation";
import { getSessionUser } from "@/modules/auth/guard";
import { db } from "@/db";
import { emailTemplates } from "@/db/schema";
import { EmailTemplateEditor } from "@/components/admin/email-template-editor";
import { Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEmailTemplatesPage() {
  const user = (await getSessionUser())!;
  if (user.role !== "super_admin") {
    redirect("/admin/requests");
  }

  const templates = await db.select().from(emailTemplates);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Mail className="h-6 w-6 text-cyan-600" />
          مدیریت قالب‌های اعلان ایمیلی
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          شخصی‌سازی عنوان و متن ایمیل‌های خودکار اطلاع‌رسانی به بنیان‌گذاران استارتاپ‌ها (مختص مدیر ارشد)
        </p>
      </div>

      <div className="space-y-6">
        {templates.map((t) => (
          <EmailTemplateEditor key={t.id} template={t} />
        ))}
      </div>
    </div>
  );
}
