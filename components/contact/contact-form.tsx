"use client";

import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // Honeypot
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "خطا در ارسال پیام. لطفاً دوباره تلاش کنید.");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        website: "",
      });
    } catch (err: any) {
      setError(err.message || "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-brand-green/30 bg-brand-green/10 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-white">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-900">پیام شما با موفقیت ثبت شد</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          از پیام شما سپاسگزاریم. تیم سرمایه‌گذاری دیجی‌ونچرز پیام شما را بررسی کرده و حداکثر ظرف ۴۸ ساعت پاسخ خواهد داد.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          ارسال پیام جدید
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Honeypot field */}
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div>
        <label htmlFor="contact_name" className="block text-xs font-bold text-slate-700 mb-2">
          نام و نام خانوادگی <span className="text-brand-green">*</span>
        </label>
        <input
          type="text"
          id="contact_name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          placeholder="نام شما"
          required
        />
      </div>

      <div>
        <label htmlFor="contact_email" className="block text-xs font-bold text-slate-700 mb-2">
          آدرس ایمیل <span className="text-brand-green">*</span>
        </label>
        <input
          type="email"
          id="contact_email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          placeholder="example@domain.com"
          dir="ltr"
          required
        />
      </div>

      <div>
        <label htmlFor="contact_subject" className="block text-xs font-bold text-slate-700 mb-2">
          موضوع پیام
        </label>
        <input
          type="text"
          id="contact_subject"
          name="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          placeholder="همکاری تجاری / پرسش عمومی"
        />
      </div>

      <div>
        <label htmlFor="contact_message" className="block text-xs font-bold text-slate-700 mb-2">
          متن پیام <span className="text-brand-green">*</span>
        </label>
        <textarea
          id="contact_message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green resize-y"
          placeholder="پیام خود را به صورت مشروح بنویسید..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full !py-3.5 text-base shadow-md shadow-brand-green/20 disabled:opacity-50"
      >
        {loading ? "در حال ارسال..." : "ارسال پیام"}
      </button>
    </form>
  );
}
