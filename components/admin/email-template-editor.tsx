"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmailTemplate } from "@/db/schema";
import { Save, Check, AlertCircle } from "lucide-react";

export function EmailTemplateEditor({ template }: { template: EmailTemplate }) {
  const router = useRouter();
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    setError(null);

    try {
      const res = await fetch(`/api/admin/email-templates/${template.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "خطا در ذخیره قالب");

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            قالب: <span className="font-mono text-brand-green">{template.key}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {template.key === "request_received"
              ? "ارسال خودکار پس از ثبت موفق درخواست توسط بنیان‌گذار (رویداد E1)"
              : "ارسال خودکار پس از تغییر وضعیت درخواست توسط ارزیاب (رویداد E2)"}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-green hover:bg-brand-greenHover text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
        >
          {saved ? <Check className="h-4 w-4 text-white" /> : <Save className="h-4 w-4" />}
          {loading ? "در حال ذخیره..." : saved ? "ذخیره شد!" : "ذخیره تغییرات"}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-600">عنوان ایمیل (Subject):</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-600">متن پیام (Body):</label>
        <textarea
          rows={7}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder:text-slate-400 leading-relaxed focus:outline-none focus:border-brand-green focus:bg-white"
        />
      </div>

      <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-wrap gap-2 items-center">
        <span className="font-semibold text-slate-700">متغیرهای مجاز:</span>
        <code className="text-cyan-700 bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded font-mono">{"{founder_name}"}</code>
        <code className="text-cyan-700 bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded font-mono">{"{startup_name}"}</code>
        {template.key === "request_status_updated" && (
          <>
            <code className="text-cyan-700 bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded font-mono">{"{status}"}</code>
            <code className="text-cyan-700 bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded font-mono">{"{message}"}</code>
          </>
        )}
      </div>
    </form>
  );
}
