"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "خطا در پردازش درخواست بازیابی گذرواژه.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "خطایی رخ داد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-panel" aria-labelledby="forgot-title">
      {/* Left Aside */}
      <aside className="auth-aside">
        <Link href="/" className="brand-logo relative z-10 self-start" aria-label="صفحه اصلی دیجی‌ونچرز">
          <span className="brand-logo-mark" aria-hidden="true"></span>
          <span className="brand-logo-wordmark !text-white" aria-hidden="true"></span>
        </Link>
        <div className="relative z-10">
          <span className="section-label !bg-brand-green/20 !text-brand-green">بازیابی امن</span>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white">دوباره به حسابتان برگردید.</h1>
          <p className="mt-5 max-w-sm leading-relaxed text-white/70">
            برای امنیت بیشتر، گذرواژه موقت فقط به ایمیل ثبت‌شده شما فرستاده می‌شود.
          </p>
        </div>
        <p className="relative z-10 text-sm text-white/50">سرمایه‌گذاری بر آینده کسب‌وکارها.</p>
      </aside>

      {/* Right Content */}
      <div className="auth-content">
        <div className="flex items-center justify-between">
          <Link href="/login" className="text-sm text-slate-500 transition-colors hover:text-brand-green">
            بازگشت به ورود
          </Link>
          <Link href="/" className="brand-logo lg:hidden" aria-label="صفحه اصلی دیجی‌ونچرز">
            <span className="brand-logo-mark" aria-hidden="true"></span>
            <span className="brand-logo-wordmark !text-slate-900" aria-hidden="true"></span>
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <span className="section-label">فراموشی گذرواژه</span>
          <h1 id="forgot-title" className="text-3xl font-bold text-slate-900">بازیابی گذرواژه</h1>
          <p className="mt-3 leading-relaxed text-slate-600">
            ایمیل حساب خود را وارد کنید. گذرواژه موقت به همان ایمیل ارسال می‌شود.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="form-label" htmlFor="recovery-email">ایمیل</label>
              <input
                className="form-input"
                id="recovery-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="auth-feedback is-visible is-error">
                {error}
              </div>
            )}

            {success && (
              <div className="auth-feedback is-visible is-success">
                اگر حسابی با این ایمیل وجود داشته باشد، گذرواژه موقت برای آن ارسال می‌شود.
              </div>
            )}

            <button className="btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "در حال ارسال..." : "ارسال گذرواژه موقت"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            گذرواژه را به یاد آوردید؟{" "}
            <Link className="font-semibold text-brand-green hover:underline" href="/login">
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
