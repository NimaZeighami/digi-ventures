import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-14 text-slate-700">
      <div className="container-dv">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2">
            <Link href="/" className="brand-logo flex items-center gap-2" aria-label="Digiventures">
              <span className="brand-logo-mark" aria-hidden="true"></span>
              <span className="brand-logo-wordmark" aria-hidden="true"></span>
            </Link>
            <p className="mt-4 text-base font-semibold text-slate-900">سرمایه‌گذاری بر آینده کسب‌وکارها.</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500 font-light">
              دیجی‌ونچرز صندوق پژوهش و فناوری سرمایه‌گذاری خطرپذیر شرکتی (CVC) گروه دیجی‌کالاست که با مشارکت دیجی‌کالا و دیجی‌پی و با مدیریت اجرایی دیجی‌نکست فعالیت می‌کند.
            </p>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span>دیجی‌کالا</span>
              <span>·</span>
              <span>دیجی‌پی</span>
              <span>·</span>
              <span>دیجی‌نکست</span>
            </div>
          </div>

          {/* Col 2: Navigation & Focus */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-slate-900">حوزه‌های سرمایه‌گذاری</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/#focus" className="transition-colors hover:text-brand-green">
                  تجارت الکترونیک
                </Link>
              </li>
              <li>
                <Link href="/#focus" className="transition-colors hover:text-brand-green">
                  فین‌تک و پرداخت
                </Link>
              </li>
              <li>
                <Link href="/#focus" className="transition-colors hover:text-brand-green">
                  هوش مصنوعی و داده
                </Link>
              </li>
              <li>
                <Link href="/#focus" className="transition-colors hover:text-brand-green">
                  کسب‌وکارهای پلتفرمی
                </Link>
              </li>
              <li>
                <Link href="/#focus" className="transition-colors hover:text-brand-green">
                  زنجیره تأمین و لجستیک
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Access & Portfolio */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-slate-900">دسترسی سریع</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/#portfolio" className="transition-colors hover:text-brand-green">
                  پورتفولیو
                </Link>
              </li>
              <li>
                <Link href="/#advantage" className="transition-colors hover:text-brand-green">
                  مزیت دیجی‌ونچرز
                </Link>
              </li>
              <li>
                <Link href="/#team" className="transition-colors hover:text-brand-green">
                  تیم ما
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-brand-green">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/#news" className="transition-colors hover:text-brand-green">
                  اخبار و دیدگاه‌ها
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="transition-colors hover:text-brand-green">
                  ارتباط با ما
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: For Founders & Contact */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-slate-900">برای بنیان‌گذاران</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/investment-request" className="font-semibold text-brand-green hover:underline">
                  درخواست جذب سرمایه
                </Link>
              </li>
              <li>
                <Link href="/about#faq" className="transition-colors hover:text-brand-green">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <a href="mailto:info@digiventures.ir" className="transition-colors hover:text-brand-green">
                  info@digiventures.ir
                </a>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-brand-green hover:text-white"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63c0-.9-.73-1.63-1.63-1.63z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-brand-green hover:text-white"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© ۱۴۰۵ دیجی‌ونچرز. تمامی حقوق محفوظ است.</p>
          <p className="text-slate-400">صندوق سرمایه‌گذاری خطرپذیر شرکتی گروه دیجی‌کالا (CVC)</p>
        </div>
      </div>
    </footer>
  );
}
