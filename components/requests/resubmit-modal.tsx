"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InvestmentRequest } from "@/db/schema";
import { X, UploadCloud, FileCheck, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  request: InvestmentRequest;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ResubmitModal({ request, onClose, onSuccess }: Props) {
  const router = useRouter();

  const [startupName, setStartupName] = useState(request.startupName);
  const [founderName, setFounderName] = useState(request.founderName);
  const [phone, setPhone] = useState(request.phone);
  const [sector, setSector] = useState(request.sector);
  const [stage, setStage] = useState(request.stage);
  const [description, setDescription] = useState(request.description);
  const [pitchDeck, setPitchDeck] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = [".pdf", ".ppt", ".pptx", ".zip"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (!allowed.includes(ext)) {
      setError("تنها فایل‌های با پسوند PDF، PPT، PPTX یا ZIP مجاز هستند.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("حجم فایل نباید بیش از ۲۰ مگابایت باشد.");
      return;
    }

    setError(null);
    setPitchDeck(file);
  };

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("is_resubmit", "true");
      formData.append("startup_name", startupName.trim());
      formData.append("founder_name", founderName.trim());
      formData.append("phone", phone.trim());
      formData.append("sector", sector);
      formData.append("stage", stage);
      formData.append("description", description.trim());

      if (pitchDeck) {
        formData.append("pitch_deck", pitchDeck);
      }

      const res = await fetch(`/api/requests/${request.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "خطا در ارسال مجدد طرح.");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "خطای ناشناخته در ارسال اصلاحات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/90 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-brand-green" />
            <h2 className="text-lg font-bold text-slate-900">
              اصلاح و ارسال مجدد طرح ({request.startupName})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin Message Alert */}
        {request.adminMessage && (
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 text-xs leading-relaxed space-y-1">
            <span className="font-bold block text-orange-900">نکات و درخواست‌های تیم سرمایه‌گذاری:</span>
            <p>{request.adminMessage}</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleResubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">نام استارتاپ</label>
              <input
                type="text"
                required
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-brand-green"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">نام بنیان‌گذار</label>
              <input
                type="text"
                required
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-brand-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">شماره تماس</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-brand-green text-left"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">حوزه فعالیت</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-brand-green"
              >
                <option value="ecommerce">تجارت الکترونیک</option>
                <option value="fintech">فین‌تک</option>
                <option value="supply_chain">لجستیک</option>
                <option value="ai">هوش مصنوعی</option>
                <option value="platform">پلتفرم</option>
                <option value="other">سایر</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">مرحله رشد</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-brand-green"
              >
                <option value="seed">ایده و بذری (Seed)</option>
                <option value="early">مرحله اولیه (Early Stage)</option>
                <option value="growth">رشد (Series A)</option>
                <option value="scale">مقیاس‌پذیری (Series B+)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">شرح اصلاح‌شده طرح</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-brand-green resize-y leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              بارگذاری فایل ارائه جدید (اختیاری - در صورت نیاز به به‌روزرسانی فایل)
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50 relative cursor-pointer hover:border-brand-green transition">
              <input
                type="file"
                accept=".pdf,.ppt,.pptx,.zip"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {pitchDeck ? (
                <div className="flex items-center justify-center gap-2 text-xs text-brand-green font-semibold">
                  <FileCheck className="h-4 w-4" />
                  <span>فایل جدید: {pitchDeck.name}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <UploadCloud className="h-4 w-4" />
                  <span>انتخاب فایل جدید (PDF / PPT / PPTX تا ۲۰MB)</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary !px-6 !py-2 text-xs font-bold shadow-md shadow-brand-green/20 disabled:opacity-50"
            >
              {loading ? "در حال ثبت اصلاحات..." : "ارسال نهایی اصلاحات به کمیته"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
