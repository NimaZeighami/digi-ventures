import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "تیم ما | دیجی‌ونچرز",
  description: "تیم راهبری، سرمایه‌گذاری و توسعه اکوسیستم دیجی‌ونچرز",
};

export default function TeamPage() {
  return (
    <div className="pt-[76px]">
      {/* ==================== HERO SECTION ==================== */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
        <div className="container-dv text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-700 mb-6">
            <span className="h-2 w-2 rounded-full bg-brand-green"></span>
            تیم سرمایه‌گذاری و راهبری
          </span>
          <h1 className="text-4xl font-extrabold text-slate-950 sm:text-5xl lg:text-6xl leading-tight">
            تیم <span className="text-brand-green">دیجی‌ونچرز</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 font-light leading-relaxed max-w-3xl mx-auto">
            تیمی از مدیران سرمایه‌گذاری، تحلیلگران فنی و توسعه‌دهندگان پلتفرم که با تکیه بر تجربه اکوسیستم گروه دیجی‌کالا، استارتاپ‌ها را در مسیر رشد همراهی می‌کنند.
          </p>
        </div>
      </section>

      {/* ==================== 1. INVESTMENT & GP TEAM ==================== */}
      <section className="py-20 bg-slate-50/50">
        <div className="container-dv">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-green">Investment Team</p>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">تیم راهبری و سرمایه‌گذاری</h2>
            <p className="mt-2 text-sm text-slate-600 font-light">رهبری استراتژی سرمایه‌گذاری، مدیریت پرتفوی و اعتبارسنجی موشکافانه فرصت‌های نوین بازار</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Member 1 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-brand-green/40">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green font-bold text-xl">
                GP
              </div>
              <h3 className="text-xl font-bold text-slate-900">مدیریت سرمایه‌گذاری</h3>
              <p className="mt-1 text-sm font-semibold text-brand-green">Investment Lead & Partner</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 font-light">
                هدایت استراتژی کلان تخصیص سرمایه، ساختاردهی قراردادهای مشارکت و راهبری توسعه پورتفولیو در مقیاس ملی.
              </p>
            </div>

            {/* Member 2 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-brand-green/40">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-bold text-xl">
                DD
              </div>
              <h3 className="text-xl font-bold text-slate-900">تحلیل مالی و ارزیابی موشکافانه</h3>
              <p className="mt-1 text-sm font-semibold text-brand-green">Due Diligence & Financial Analyst</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 font-light">
                تحلیل صورت‌های مالی، ارزیابی ریسک، ارزش‌گذاری استارتاپ‌ها و مدل‌سازی اقتصادی مبتنی بر داده‌های بازار.
              </p>
            </div>

            {/* Member 3 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-brand-green/40">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold text-xl">
                TA
              </div>
              <h3 className="text-xl font-bold text-slate-900">ارزیابی فناوری و هوش مصنوعی</h3>
              <p className="mt-1 text-sm font-semibold text-brand-green">Tech & AI Assessment Lead</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 font-light">
                بررسی معماری فنی، اعتبارسنجی الگوریتم‌های هوش مصنوعی و ارزیابی مقیاس‌پذیری زیرساخت استارتاپ‌ها.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. PLATFORM & ECOSYSTEM TEAM ==================== */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container-dv">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-green">Platform & Value Creation</p>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">تیم پلتفرم و ارزش‌آفرینی اکوسیستم</h2>
            <p className="mt-2 text-sm text-slate-600 font-light">ایجاد اتصال استراتژیک بین پورتفولیو و ظرفیت‌های عملیاتی، بازار و فناوری گروه دیجی‌کالا</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Platform 1 */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-brand-green/40">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 font-bold text-xl">
                EC
              </div>
              <h3 className="text-xl font-bold text-slate-900">توسعه ارتباطات اکوسیستم</h3>
              <p className="mt-1 text-sm font-semibold text-brand-green">Ecosystem & Synergy Lead</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 font-light">
                اتصال استارتاپ‌ها به واحدهای تجاری دیجی‌کالا، دیجی‌پی و دیجی‌نکست و خلق پایلوت‌های مشترک تجاری.
              </p>
            </div>

            {/* Platform 2 */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-brand-green/40">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 font-bold text-xl">
                GR
              </div>
              <h3 className="text-xl font-bold text-slate-900">شتاب‌دهی رشد و توسعه بازار</h3>
              <p className="mt-1 text-sm font-semibold text-brand-green">Growth & Market Access</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 font-light">
                ارائه راهکارهای توسعه بازار، بهینه‌سازی کانال‌های جذب مشتری و هم‌افزایی با پایگاه میلیونی کاربران.
              </p>
            </div>

            {/* Platform 3 */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-brand-green/40">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 font-bold text-xl">
                OP
              </div>
              <h3 className="text-xl font-bold text-slate-900">عملیات و همراهی استارتاپ‌ها</h3>
              <p className="mt-1 text-sm font-semibold text-brand-green">Operations & Portfolio Support</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 font-light">
                پشتیبانی از نیازمندی‌های حقوقی، حکمرانی شرکتی، راندهای بعدی تأمین مالی و هماهنگی‌های ستادی.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80 text-center">
        <div className="container-dv max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-950">مشتاق گفتگو با شما هستیم</h2>
          <p className="mt-4 text-slate-600 font-light leading-relaxed">
            اگر در حال ساخت محصولی نوآور در حوزه تجارت الکترونیک، فین‌تک یا هوش مصنوعی هستید، با تیم ما در ارتباط باشید.
          </p>
          <div className="mt-8">
            <Link href="/investment-request" className="btn-primary !px-8 !py-3.5 text-base shadow-md shadow-brand-green/20">
              ثبت درخواست سرمایه‌گذاری
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
