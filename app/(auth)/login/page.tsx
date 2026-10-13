"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/my-requests";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "خطا در ورود به حساب کاربری.");
      }

      if (data.user?.role === "admin" || data.user?.role === "super_admin" || data.user?.role === "manager") {
        router.push("/admin/requests");
      } else {
        router.push(redirectUrl);
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "اطلاعات ورود نادرست است.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-panel" aria-labelledby="login-title">
      {/* Left Aside */}
      <aside className="auth-aside">
        <Link href="/" className="brand-logo relative z-10 self-start" aria-label="صفحه اصلی دیجی‌ونچرز">
          <span className="brand-logo-mark" aria-hidden="true"></span>
          <span className="brand-logo-wordmark !text-white" aria-hidden="true"></span>
        </Link>
        <div className="relative z-10">
          <span className="section-label !bg-brand-green/20 !text-brand-green">حساب کاربری</span>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white">همراه آینده‌سازان باشید.</h1>
          <p className="mt-5 max-w-sm leading-relaxed text-white/70">
            حساب کاربری شما راهی امن برای پیگیری درخواست‌های سرمایه‌گذاری و ارتباط با تیم دیجی‌ونچرز است.
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

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <span className="section-label">خوش آمدید</span>
          <h1 id="login-title" className="text-3xl font-bold text-slate-900">ورود به حساب کاربری</h1>
          <p className="mt-3 leading-relaxed text-slate-600">ایمیل و گذرواژه خود را وارد کنید.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="form-label" htmlFor="login-email">ایمیل</label>
              <input
                className="form-input"
                id="login-email"
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
              <div className="mb-2 flex items-center justify-between">
                <label className="form-label !mb-0" htmlFor="login-password">گذرواژه</label>
                <Link className="text-xs font-medium text-brand-green hover:underline" href="/forgot-password">
                  گذرواژه را فراموش کرده‌اید؟
                </Link>
              </div>
              <div className="auth-input-wrap">
                <input
                  className="form-input pl-20"
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="auth-password-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "پنهان کردن گذرواژه" : "نمایش گذرواژه"}
                >
                  {showPassword ? "پنهان" : "نمایش"}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-feedback is-visible is-error">
                {error}
              </div>
            )}

            <button className="btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            حساب کاربری ندارید؟{" "}
            <Link className="font-semibold text-brand-green hover:underline" href="/register">
              ثبت‌نام کنید
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">در حال بارگذاری...</div>}>
      <LoginFormInner />
    </Suspense>
  );
}
