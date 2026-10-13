"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("گذرواژه و تکرار آن یکسان نیستند.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("گذرواژه جدید باید حداقل ۸ کاراکتر باشد.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "توکن نامعتبر است یا منقضی شده است.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "خطا در بازنشانی گذرواژه.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-panel" aria-labelledby="reset-title">
      {/* Left Aside */}
      <aside className="auth-aside">
        <Link href="/" className="brand-logo relative z-10 self-start" aria-label="صفحه اصلی دیجی‌ونچرز">
          <span className="brand-logo-mark" aria-hidden="true"></span>
          <span className="brand-logo-wordmark !text-white" aria-hidden="true"></span>
        </Link>
        <div className="relative z-10">
          <span className="section-label !bg-brand-green/20 !text-brand-green">امنیت حساب</span>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white">تغییر و تنظیم گذرواژه</h1>
          <p className="mt-5 max-w-sm leading-relaxed text-white/70">
            گذرواژه جدید و امن برای حساب کاربری دیجی‌ونچرز خود انتخاب نمایید.
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
          <span className="section-label">گذرواژه جدید</span>
          <h1 id="reset-title" className="text-3xl font-bold text-slate-900">تنظیم گذرواژه جدید</h1>
          <p className="mt-3 leading-relaxed text-slate-600">
            گذرواژه جدید خود را با حداقل ۸ کاراکتر وارد کنید.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="form-label" htmlFor="reset-token">کد تایید / توکن بازیابی</label>
              <input
                className="form-input"
                id="reset-token"
                name="token"
                type="text"
                placeholder="توکن دریافت شده در ایمیل"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="reset-password">گذرواژه جدید</label>
              <input
                className="form-input"
                id="reset-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                placeholder="حداقل ۸ کاراکتر"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="reset-confirm">تکرار گذرواژه جدید</label>
              <input
                className="form-input"
                id="reset-confirm"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                placeholder="تکرار گذرواژه جدید"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                گذرواژه شما با موفقیت تغییر یافت. در حال انتقال به صفحه ورود...
              </div>
            )}

            <button className="btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "در حال ثبت..." : "ذخیره گذرواژه جدید"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            انصراف؟{" "}
            <Link className="font-semibold text-brand-green hover:underline" href="/login">
              ورود به حساب
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">در حال بارگذاری...</div>}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
