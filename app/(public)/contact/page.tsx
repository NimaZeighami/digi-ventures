import { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "ارتباط با ما | دیجی‌ونچرز",
  description: "ارتباط با تیم سرمایه‌گذاری، مدیریت پورتفولیو و توسعه اکوسیستم دیجی‌ونچرز",
};

export default function ContactPage() {
  return (
    <div className="pt-[76px]">
      {/* ==================== HERO SECTION ==================== */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
        <div className="container-dv text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-700 mb-6">
            <span className="h-2 w-2 rounded-full bg-brand-green"></span>
            ارتباط با ما
          </span>
          <h1 className="text-4xl font-extrabold text-slate-950 sm:text-5xl lg:text-6xl leading-tight">
            ارتباط با <span className="text-brand-green">دیجی‌ونچرز</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 font-light leading-relaxed max-w-3xl mx-auto">
            اگر در حال ساخت یک کسب‌وکار نوآور هستید که مراحل اولیه آن را پشت سر گذاشته‌اید و برای مقیاس‌پذیری و جذب سرمایه به همراهی احتیاج دارید، در کنار شما هستیم.
          </p>
        </div>
      </section>

      {/* ==================== CONTACT INFO & FORM ==================== */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-dv">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            {/* Channels & Direct Links */}
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-green">راه‌های ارتباطی</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-950">در کنار شما هستیم</h2>
                <p className="mt-4 text-base text-slate-600 font-light leading-relaxed">
                  برای پاسخ به پرسش‌های عمومی، همکاری‌های تجاری یا آشنایی با مدل سرمایه‌گذاری شرکتی با ما در ارتباط باشید.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">ایمیل مستقیم</h3>
                    <a href="mailto:info@digiventures.ir" className="mt-1 block text-sm font-semibold text-brand-green hover:underline">
                      info@digiventures.ir
                    </a>
                    <p className="mt-1 text-xs text-slate-400">پاسخ‌گویی ظرف ۴۸ ساعت کاری</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">دفتر مرکزی</h3>
                    <p className="mt-1 text-sm text-slate-600 font-light">تهران، خیابان گاندی، کوچه پنجم، پلاک ۲۴، ساختمان دیجی‌نکست</p>
                  </div>
                </div>
              </div>

              {/* Investment Banner */}
              <div className="rounded-3xl border border-brand-green/20 bg-brand-green/5 p-8">
                <h3 className="text-xl font-bold text-slate-900">درخواست جذب سرمایه</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 font-light">
                  اگر استارتاپ شما آماده ارزیابی و دریافت سرمایه است، مستقیماً از طریق فرم جامع درخواست سرمایه‌گذاری اقدام کنید. این سریع‌ترین مسیر بررسی Pitch Deck شماست.
                </p>
                <Link href="/investment-request" className="btn-primary mt-6 inline-flex text-sm !px-6 !py-3">
                  <span>ثبت فرم درخواست سرمایه‌گذاری</span>
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Message Form Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-card">
              <h2 className="text-2xl font-bold text-slate-900">فرم ارسال پیام</h2>
              <p className="mt-2 text-sm text-slate-500">برای ارتباط و ارسال پیام، فرم زیر را تکمیل نمایید.</p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
