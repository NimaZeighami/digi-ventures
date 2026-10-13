"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function IntakeForm() {
  const router = useRouter();

  // Form State
  const [startupName, setStartupName] = useState("");
  const [founderName, setFounderName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sector, setSector] = useState("");
  const [stage, setStage] = useState("");
  const [description, setDescription] = useState("");
  const [pitchDeck, setPitchDeck] = useState<File | null>(null);

  // Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startupName.trim() || startupName.trim().length < 2) {
      setError("نام استارتاپ باید حداقل ۲ کاراکتر باشد.");
      return;
    }
    if (!founderName.trim() || founderName.trim().length < 2) {
      setError("نام و نام خانوادگی بنیان‌گذار باید حداقل ۲ کاراکتر باشد.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("پست الکترونیک معتبر نیست.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError("شماره تماس باید حداقل ۱۰ رقم باشد.");
      return;
    }
    if (!sector) {
      setError("لطفاً حوزه فعالیت را انتخاب کنید.");
      return;
    }
    if (!stage) {
      setError("لطفاً مرحله کسب‌وکار را انتخاب کنید.");
      return;
    }
    if (!description.trim() || description.trim().length < 30) {
      setError("توضیح کوتاه باید حداقل ۳۰ کاراکتر باشد.");
      return;
    }
    if (!pitchDeck) {
      setError("بارگذاری فایل Pitch Deck الزامی است.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("startup_name", startupName.trim());
      formData.append("founder_name", founderName.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("sector", sector);
      formData.append("stage", stage);
      formData.append("description", description.trim());
      formData.append("pitch_deck", pitchDeck);
      formData.append("is_draft", "false");
      formData.append("idempotency_key", `intake-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);

      const res = await fetch("/api/requests", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "خطا در ارسال درخواست سرمایه‌گذاری.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/my-requests");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "خطایی در ثبت درخواست رخ داد.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-brand-green/30 bg-brand-green/10 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900">درخواست شما با موفقیت ثبت شد</h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          طرح استارتاپ شما برای تیم ارزیابی دیجی‌ونچرز ارسال شد. در حال انتقال به داشبورد پیگیری درخواست‌ها...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card lg:p-10">
      <h2 className="text-xl font-bold text-slate-900">فرم درخواست سرمایه‌گذاری</h2>
      <p className="mt-2 text-sm text-slate-500">لطفاً تمام فیلدهای الزامی را با دقت تکمیل کنید.</p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="startup_name" className="form-label">
              نام استارتاپ <span className="text-brand-green">*</span>
            </label>
            <input
              type="text"
              id="startup_name"
              name="startup_name"
              className="form-input"
              placeholder="نام استارتاپ خود را وارد کنید"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              required
              minLength={2}
            />
          </div>
          <div>
            <label htmlFor="founder_name" className="form-label">
              نام و نام خانوادگی <span className="text-brand-green">*</span>
            </label>
            <input
              type="text"
              id="founder_name"
              name="founder_name"
              className="form-input"
              placeholder="نام بنیان‌گذار"
              value={founderName}
              onChange={(e) => setFounderName(e.target.value)}
              required
              minLength={2}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="form-label">
              ایمیل <span className="text-brand-green">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="example@email.com"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="form-label">
              شماره تماس <span className="text-brand-green">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="sector" className="form-label">
              حوزه فعالیت <span className="text-brand-green">*</span>
            </label>
            <select
              id="sector"
              name="sector"
              className="form-select"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              required
            >
              <option value="" disabled>
                انتخاب کنید
              </option>
              <option value="ecommerce">تجارت الکترونیک</option>
              <option value="fintech">فین‌تک</option>
              <option value="ai">هوش مصنوعی</option>
              <option value="other">سایر حوزه‌های مرتبط</option>
            </select>
          </div>
          <div>
            <label htmlFor="stage" className="form-label">
              مرحله کسب و کار <span className="text-brand-green">*</span>
            </label>
            <select
              id="stage"
              name="stage"
              className="form-select"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              required
            >
              <option value="" disabled>
                انتخاب کنید
              </option>
              <option value="seed">ایده و بذری (Seed)</option>
              <option value="early">مرحله اولیه (Early Stage)</option>
              <option value="growth">رشد (Series A)</option>
              <option value="scale">مقیاس‌پذیری (Series B+)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="form-label">
            توضیح کوتاه <span className="text-brand-green">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            className="form-textarea"
            placeholder="مدل کسب‌وکار، بازار هدف و مزیت رقابتی استارتاپ خود را به‌اختصار شرح دهید..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={30}
          />
        </div>

        <div>
          <label htmlFor="pitch_deck" className="form-label">
            آپلود Pitch Deck <span className="text-brand-green">*</span>
          </label>
          <div className="mt-1 flex items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-8 transition-colors hover:border-brand-green/40 hover:bg-emerald-50/20">
            <div className="text-center">
              <svg className="mx-auto h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <label htmlFor="pitch_deck" className="mt-3 block cursor-pointer text-sm font-medium text-brand-green hover:underline">
                {pitchDeck ? `فایل انتخاب شده: ${pitchDeck.name}` : "انتخاب فایل"}
              </label>
              <input
                type="file"
                id="pitch_deck"
                name="pitch_deck"
                className="sr-only"
                accept=".pdf,.ppt,.pptx,.zip"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPitchDeck(e.target.files[0]);
                  }
                }}
                required
              />
              <p className="mt-2 text-xs text-slate-500">
                فرمت‌های مجاز: PDF, PPT, PPTX, ZIP - حداکثر حجم فایل: ۲۰ مگابایت
              </p>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "در حال ارسال درخواست..." : "ارسال درخواست سرمایه‌گذاری"}
        </button>
      </form>
    </div>
  );
}
