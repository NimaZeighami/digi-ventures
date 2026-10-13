"use client";

import { useState } from "react";
import Link from "next/link";
import { SessionUser } from "@/modules/auth/guard";

interface NavbarClientProps {
  user: SessionUser | null;
}

export function NavbarClient({ user }: NavbarClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch {
      window.location.reload();
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md transition-all duration-200">
      <div className="site-header-inner container-dv flex h-[76px] items-center justify-between">
        <Link href="/" className="site-header-brand brand-logo flex items-center gap-2" aria-label="Digiventures">
          <span className="brand-logo-mark" aria-hidden="true"></span>
          <span className="brand-logo-wordmark" aria-hidden="true"></span>
        </Link>

        {/* Primary Navigation */}
        <nav className="header-primary-nav hidden items-center gap-7 xl:flex" aria-label="منوی اصلی">
          <Link href="/#focus" className="text-sm font-medium text-slate-700 transition-colors hover:text-brand-green">
            حوزه‌های سرمایه‌گذاری
          </Link>
          <Link href="/#portfolio" className="text-sm font-medium text-slate-700 transition-colors hover:text-brand-green">
            پورتفولیو
          </Link>
          <Link href="/#team" className="text-sm font-medium text-slate-700 transition-colors hover:text-brand-green">
            تیم ما
          </Link>
          <Link href="/#news" className="text-sm font-medium text-slate-700 transition-colors hover:text-brand-green">
            تازه‌ها و دیدگاه‌ها
          </Link>
          <Link href="/#contact" className="text-sm font-medium text-slate-700 transition-colors hover:text-brand-green">
            ارتباط با ما
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-700 transition-colors hover:text-brand-green">
            درباره ما
          </Link>
        </nav>

        {/* Actions */}
        <div className="header-auth-actions hidden items-center gap-3 xl:flex">
          {user ? (
            <div className="flex items-center gap-2.5">
              {user.role === "admin" || user.role === "super_admin" ? (
                <Link
                  href="/admin/requests"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-green/40 hover:text-brand-green"
                >
                  <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                  </svg>
                  <span>پنل مدیریت</span>
                </Link>
              ) : (
                <Link
                  href="/my-requests"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-green/40 hover:text-brand-green"
                >
                  <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span>درخواست‌های من</span>
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center justify-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-rose-600"
                title="خروج از حساب"
              >
                <span>خروج</span>
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-header-login">
              <svg className="h-4 w-4 text-slate-500 transition-colors group-hover:text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span>ورود</span>
            </Link>
          )}

          <Link href="/investment-request" className="btn-header-cta">
            <span>درخواست سرمایه‌گذاری</span>
            <svg className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-800 xl:hidden hover:bg-slate-100"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "بستن منو" : "باز کردن منو"}
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      <nav
        className={`mobile-menu xl:hidden ${mobileMenuOpen ? "mobile-menu-visible" : "mobile-menu-hidden"}`}
        aria-label="منوی موبایل"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="container-dv flex flex-col gap-1 py-6">
          <Link
            href="/#focus"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-green"
          >
            حوزه‌های سرمایه‌گذاری
          </Link>
          <Link
            href="/#portfolio"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-green"
          >
            پورتفولیو
          </Link>
          <Link
            href="/#team"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-green"
          >
            تیم ما
          </Link>
          <Link
            href="/#news"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-green"
          >
            تازه‌ها و دیدگاه‌ها
          </Link>
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-green"
          >
            ارتباط با ما
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-green"
          >
            درباره ما
          </Link>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/investment-request"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-greenHover"
            >
              <span>درخواست سرمایه‌گذاری</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
            {user ? (
              <div className="flex flex-col gap-2">
                {user.role === "admin" || user.role === "super_admin" ? (
                  <Link
                    href="/admin/requests"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-green"
                  >
                    <span>ورود به پنل مدیریت</span>
                  </Link>
                ) : (
                  <Link
                    href="/my-requests"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-green"
                  >
                    <span>مشاهده درخواست‌های من</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base font-medium text-red-700 hover:bg-red-100"
                >
                  <span>خروج از حساب</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-green"
              >
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <span>ورود به حساب</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
