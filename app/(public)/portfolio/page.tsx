import { Metadata } from "next";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";

export const metadata: Metadata = {
  title: "پورتفولیو | دیجی‌ونچرز",
  description: "استارتاپ‌هایی که با حمایت دیجی‌ونچرز ساخته شده‌اند",
};

export default function PortfolioPage() {
  return (
    <div className="pt-[76px]">
      {/* ==================== HERO SECTION ==================== */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
        <div className="container-dv text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-700 mb-6">
            <span className="h-2 w-2 rounded-full bg-brand-green"></span>
            پورتفولیو دیجی‌ونچرز
          </span>
          <h1 className="text-4xl font-extrabold text-slate-950 sm:text-5xl lg:text-6xl leading-tight">
            استارتاپ‌هایی که با حمایت <span className="text-brand-green">دیجی‌ونچرز</span> ساخته شده‌اند
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 font-light leading-relaxed max-w-3xl mx-auto">
            دیجی‌ونچرز افتخار همراهی با تیم‌هایی را داشته است که راهکارهای نویی برای آینده تجارت الکترونیک، لجستیک و فناوری داشته‌اند.
          </p>
        </div>
      </section>

      {/* ==================== PORTFOLIO GRID ==================== */}
      <section className="py-20 bg-slate-50/50">
        <div className="container-dv">
          <PortfolioGrid />
        </div>
      </section>

      {/* ==================== ON THE MINDS OF FOUNDERS ==================== */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container-dv max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-green">از زبان بنیان‌گذاران بشنوید</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">
              ارزش فراتر از سرمایه مالی
            </h2>
            <p className="mt-3 text-base text-slate-600 font-light">
              تجربه بنیان‌گذاران از همکاری با صندوق سرمایه‌گذاری جسورانه شرکتی دیجی‌ونچرز
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Testimonial 1 */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-8 shadow-sm relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-brand-green">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <blockquote className="text-lg font-normal leading-relaxed text-slate-800">
                «همکاری با دیجی‌ونچرز برای ما بیش از جذب سرمایه بود؛ دسترسی به تخصص عملیاتی، زیرساخت فناوری و ارتباط بی‌واسطه با مشتریان، مسیر اعتبارسنجی و رشد محصول ما را سرعت چشمگیری بخشید.»
              </blockquote>
              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <p className="font-bold text-slate-900">بنیان‌گذار و مدیرعامل</p>
                <p className="text-xs text-slate-500 mt-0.5">استارتاپ پورتفولیو حوزه لجستیک هوشمند</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-8 shadow-sm relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-brand-green">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <blockquote className="text-lg font-normal leading-relaxed text-slate-800">
                «اتصال به زنجیره ارزش و ظرفیت‌های گروه دیجی‌کالا، مهم‌ترین مزیت راهبردی ما برای مقیاس‌پذیری زیرساخت نوآورانه و ارتقای تجربه میلیون‌ها کاربر بود.»
              </blockquote>
              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <p className="font-bold text-slate-900">بنیان‌گذار و مدیرعامل</p>
                <p className="text-xs text-slate-500 mt-0.5">استارتاپ پورتفولیو حوزه تجارت الکترونیک و داده</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
