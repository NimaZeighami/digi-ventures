"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (password !== passwordConfirmation) {
      setError("گذرواژه و تکرار آن یکسان نیستند.");
      return;
    }

    if (password.length < 8) {
      setError("گذرواژه باید حداقل ۸ کاراکتر باشد.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "خطا در ثبت‌نام کاربر.");
      }

      setSuccessMsg("حساب کاربری شما با موفقیت ساخته شد. در حال انتقال...");
      setTimeout(() => {
        router.push("/my-requests");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "خطایی در ثبت‌نام رخ داد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-panel" aria-labelledby="signup-title">
      {/* Left Aside */}
      <aside className="auth-aside">
        <Link href="/" className="brand-logo relative z-10 self-start" aria-label="صفحه اصلی دیجی‌ونچرز">
          <span className="brand-logo-mark" aria-hidden="true"></span>
          <span className="brand-logo-wordmark !text-white" aria-hidden="true"></span>
        </Link>
        <div className="relative z-10">
          <span className="section-label !bg-brand-green/20 !text-brand-green">همراهی از ابتدا</span>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white">برای ساختن آینده آماده‌اید؟</h1>
          <p className="mt-5 max-w-sm leading-relaxed text-white/70">
            با ایجاد حساب، مسیر ارتباط با تیم سرمایه‌گذاری دیجی‌ونچرز را شروع کنید.
          </p>
        </div>
        <p className="relative z-10 text-sm text-white/50">سرمایه‌گذاری بر آینده کسب‌وکارها.</p>
      </aside>

      {/* Right Content */}
      <div className="auth-content">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-500 transition-colors hover:text-brand-green">
            بازگشت به سایت
          </Link>
          <Link href="/" className="brand-logo lg:hidden" aria-label="صفحه اصلی دیجی‌ونچرز">
            <span className="brand-logo-mark" aria-hidden="true"></span>
            <span className="brand-logo-wordmark !text-slate-900" aria-hidden="true"></span>
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          <span className="section-label">ایجاد حساب</span>
          <h1 id="signup-title" className="text-3xl font-bold text-slate-900">ثبت‌نام</h1>
          <p className="mt-3 leading-relaxed text-slate-600">با ایمیل کاری خود حساب کاربری بسازید.</p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="form-label" htmlFor="signup-email">ایمیل</label>
              <input
                className="form-input"
                id="signup-email"
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

            <div>
              <label className="form-label" htmlFor="signup-password">گذرواژه</label>
              <div className="auth-input-wrap">
                <input
                  className="form-input pl-20"
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="auth-password-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "پنهان" : "نمایش"}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">حداقل ۸ کاراکتر انتخاب کنید.</p>
            </div>

            <div>
              <label className="form-label" htmlFor="signup-password-confirmation">تکرار گذرواژه</label>
              <div className="auth-input-wrap">
                <input
                  className="form-input pl-20"
                  id="signup-password-confirmation"
                  name="password_confirmation"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                />
                <button
                  className="auth-password-toggle"
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "پنهان" : "نمایش"}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-feedback is-visible is-error">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="auth-feedback is-visible is-success">
                {successMsg}
              </div>
            )}

            <button className="btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "در حال ایجاد حساب..." : "ایجاد حساب"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            حساب دارید؟{" "}
            <Link className="font-semibold text-brand-green hover:underline" href="/login">
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
