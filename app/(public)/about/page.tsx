import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "درباره ما | دیجی‌ونچرز",
  description: "درباره دیجی‌ونچرز — صندوق پژوهش و فناوری سرمایه‌گذاری خطرپذیر شرکتی (CVC) گروه دیجی‌کالا",
};

export default function AboutPage() {
  const faqs = [
    {
      q: "دیجی‌ونچرز چیست؟",
      a: "دیجی‌ونچرز صندوق پژوهش و فناوری سرمایه‌گذاری خطرپذیر شرکتی گروه دیجی‌کالاست که با مشارکت دیجی‌کالا و دیجی‌پی و با مدیریت اجرایی دیجی‌نکست فعالیت می‌کند.",
    },
    {
      q: "در چه حوزه‌هایی سرمایه‌گذاری می‌کنید؟",
      a: "تمرکز ما بر حوزه‌هایی مانند تجارت الکترونیک، فین‌تک، کسب‌وکارهای پلتفرمی، زنجیره تأمین و هوش مصنوعی است.",
    },
    {
      q: "در چه مرحله‌ای سرمایه‌گذاری می‌کنید؟",
      a: "دیجی‌ونچرز در استارتاپ‌های مرحله Seed به بالا سرمایه‌گذاری می‌کند و بسته به مرحله و نیاز کسب‌وکار، امکان همراهی در مراحل بعدی رشد نیز وجود دارد.",
    },
    {
      q: "استارتاپ من در مرحله اولیه قرار دارد، امکان جذب سرمایه دارم؟",
      a: "دیجی‌نکست به‌عنوان بازوی نوآوری و سرمایه‌گذاری گروه دیجی‌کالا، بر حمایت از تیم‌ها و استارتاپ‌های مراحل اولیه تمرکز دارد. دیجی‌ونچرز با چک‌سایز بالاتر و تمرکز بر استارتاپ‌های Seed به بالا، برای همراهی با کسب‌وکارهایی طراحی شده است که در مسیر رشد و مقیاس‌پذیری قرار دارند.",
    },
    {
      q: "آیا علاوه بر سرمایه‌گذاری، در سایر موارد نیز از استارتاپ‌ها حمایت می‌کنید؟",
      a: "بله. هدف ما ایجاد ارزش افزوده عملیاتی است. بسته به نیاز و فرصت همکاری، این ارزش می‌تواند از طریق دسترسی به تخصص، بازار، شبکه، زیرساخت‌ها و ظرفیت‌های گروه دیجی‌کالا ایجاد شود.",
    },
    {
      q: "چگونه می‌توانم برای جذب سرمایه درخواست بدهم؟",
      a: "از طریق فرم درخواست سرمایه‌گذاری، اطلاعات کسب‌وکار و Pitch Deck خود را برای ما ارسال کنید. تیم سرمایه‌گذاری پس از بررسی اولیه، در صورت تطابق با معیارهای سرمایه‌گذاری با شما تماس خواهد گرفت.",
    },
  ];

  return (
    <div className="pt-[76px]">
      {/* ==================== HERO SECTION ==================== */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
        <div className="container-dv text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-700 mb-6">
            <span className="h-2 w-2 rounded-full bg-brand-green"></span>
            درباره دیجی‌ونچرز
          </span>
          <h1 className="text-4xl font-extrabold text-slate-950 sm:text-5xl lg:text-6xl leading-tight">
            هم‌قدم با بنیان‌گذارانی که <span className="text-brand-green">آینده‌سازند.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 font-light leading-relaxed max-w-3xl mx-auto">
            دیجی‌ونچرز صندوق پژوهش و فناوری سرمایه‌گذاری خطرپذیر شرکتی (CVC) گروه دیجی‌کالاست که با مشارکت دیجی‌کالا و دیجی‌پی و با مدیریت اجرایی دیجی‌نکست فعالیت می‌کند.
          </p>
        </div>
      </section>

      {/* ==================== MISSION & NARRATIVE ==================== */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-dv">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-green">در کنار ساختن آینده</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl leading-snug">
                سرمایه‌گذاری استراتژیک بر تحول اقتصاد دیجیتال
              </h2>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-700 font-normal">
                ما با سرمایه‌گذاری در استارتاپ‌های نوآور و ایجاد دسترسی به ظرفیت‌های عملیاتی، تخصصی و تجاری گروه دیجی‌کالا، با بنیان‌گذارانی هم‌قدم می‌شویم که در حال ساختن آینده تجارت، خدمات مالی و فناوری هستند.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600 font-light">
                ما با تکیه بر تجربه و ظرفیت‌های گروه دیجی‌کالا شکل گرفته‌ایم؛ اکوسیستمی که طی سال‌ها در حوزه‌هایی مانند تجارت الکترونیک، پرداخت، فناوری، لجستیک و نوآوری فعالیت کرده و با میلیون‌ها کاربر و هزاران کسب‌وکار در ارتباط است.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600 font-light">
                اما ارزش این ارتباط فقط در سرمایه خلاصه نمی‌شود. ما تلاش می‌کنیم برای تیم‌های پورتفولیو، دسترسی به فرصت‌هایی فراهم کنیم که می‌تواند به آن‌ها در توسعه محصول، شناخت بازار، ایجاد همکاری‌های استراتژیک و رشد کسب‌وکار کمک کند.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-8 sm:p-10 shadow-card">
              <h3 className="text-xl font-bold text-slate-900">ارزش‌های کلیدی ما</h3>
              <p className="mt-2 text-sm text-slate-500">اصول بنیادینی که تصمیمات سرمایه‌گذاری و همراهی ما را هدایت می‌کنند:</p>
              <ul className="mt-8 space-y-6">
                <li className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-sm font-bold text-brand-green">۱</span>
                  <div>
                    <h4 className="font-bold text-slate-900">همراهی بلندمدت</h4>
                    <p className="mt-1 text-sm text-slate-600 font-light leading-relaxed">ما به دنبال ساختن رابطه‌هایی بلندمدت با بنیان‌گذاران هستیم و موفقیت خودمان را در موفقیت کسب‌وکارهایی می‌بینیم که در آن‌ها سرمایه‌گذاری کرده‌ایم.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-sm font-bold text-brand-green">۲</span>
                  <div>
                    <h4 className="font-bold text-slate-900">ارزش واقعی</h4>
                    <p className="mt-1 text-sm text-slate-600 font-light leading-relaxed">ما به دنبال فرصت‌هایی هستیم که بتوانیم فراتر از سرمایه مالی، ارزش واقعی و عملیاتی ایجاد کنیم.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-sm font-bold text-brand-green">۳</span>
                  <div>
                    <h4 className="font-bold text-slate-900">اعتماد و شفافیت</h4>
                    <p className="mt-1 text-sm text-slate-600 font-light leading-relaxed">ساختن یک کسب‌وکار بزرگ به اعتماد نیاز دارد. ما تلاش می‌کنیم شریکی شفاف، قابل اتکا و همراه برای بنیان‌گذاران باشیم.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-sm font-bold text-brand-green">۴</span>
                  <div>
                    <h4 className="font-bold text-slate-900">ساختن، نه فقط سرمایه‌گذاری</h4>
                    <p className="mt-1 text-sm text-slate-600 font-light leading-relaxed">ما به بنیان‌گذارانی باور داریم که در حال حل مسائل واقعی هستند. نقش ما فقط تأمین سرمایه نیست؛ بلکه کمک به ساختن و رشد کسب‌وکارهای بزرگ و ماندگار است.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5 INVESTMENT STRATEGY AREAS ==================== */}
      <section className="bg-slate-50/70 border-y border-slate-200/80 py-20 lg:py-28" id="investment-strategy">
        <div className="container-dv">
          <div className="mb-14 text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-green">استراتژی سرمایه‌گذاری ما</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">
              دیجی‌ونچرز بر کسب‌وکارهای آینده‌ساز سرمایه‌گذاری می‌کند
            </h2>
            <p className="mt-4 text-base text-slate-600 font-light leading-relaxed">
              استراتژی ما بر سرمایه‌گذاری در حوزه‌هایی متمرکز است که با زنجیره ارزش گروه دیجی‌کالا ارتباط دارند و در حال تغییر شکل اقتصاد دیجیتال هستند.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-card-hover">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-brand-green mb-6 font-bold text-lg">۰۱</div>
              <h3 className="text-xl font-bold text-slate-900">تجارت الکترونیک</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 font-light">
                استارتاپ‌هایی که شیوه خرید، فروش و تعامل کسب‌وکارها با مشتریان را تغییر می‌دهند؛ از راهکارهای خرده‌فروشی و مارکت‌پلیس تا تجربه مشتری، زیرساخت‌های تجارت دیجیتال و فناوری‌های مرتبط با زنجیره تأمین.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-card-hover">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-brand-green mb-6 font-bold text-lg">۰۲</div>
              <h3 className="text-xl font-bold text-slate-900">فین‌تک و خدمات مالی</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 font-light">
                کسب‌وکارهایی که در حال ساخت نسل جدید خدمات مالی هستند؛ از پرداخت و اعتبار تا زیرساخت‌های مالی و راهکارهای دیجیتالی که خدمات مالی را ساده‌تر، هوشمندتر و در دسترس‌تر می‌کنند.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-card-hover">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-brand-green mb-6 font-bold text-lg">۰۳</div>
              <h3 className="text-xl font-bold text-slate-900">کسب‌وکارهای پلتفرمی</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 font-light">
                پلتفرم‌هایی که افراد، کسب‌وکارها و خدمات را به شکل‌های جدیدی به یکدیگر متصل می‌کنند و امکان ایجاد بازارهای جدید و فرصت‌های مقیاس‌پذیر را به وجود می‌آورند.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-card-hover">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-brand-green mb-6 font-bold text-lg">۰۴</div>
              <h3 className="text-xl font-bold text-slate-900">زنجیره تأمین و لجستیک</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 font-light">
                راهکارهایی که به بهبود، هوشمندسازی و تحول بنیادین زنجیره تأمین، مدیریت ناوگان، لجستیک و انبارداری و عملیات توزیع کمک می‌کنند.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-card-hover sm:col-span-2 lg:col-span-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-brand-green mb-6 font-bold text-lg">۰۵</div>
              <h3 className="text-xl font-bold text-slate-900">هوش مصنوعی</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 font-light">
                تیم‌هایی که از هوش مصنوعی برای حل مسائل واقعی و ساخت محصولات و کسب‌وکارهای جدید استفاده می‌کنند؛ به‌ویژه در تقاطع هوش مصنوعی با تجارت، خدمات مالی و عملیات.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ==================== THREE ENTITIES, ONE INVESTMENT ARM ==================== */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-dv">
          <div className="mb-14 text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-green">ساختار دیجی‌ونچرز</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">
              سه مجموعه، یک بازوی سرمایه‌گذاری
            </h2>
            <p className="mt-4 text-base text-slate-600 font-light">
              هم‌افزایی بی‌نظیر برای خلق بیشترین ارزش افزوده به نفع استارتاپ‌ها
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-8 shadow-sm text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green font-bold text-xl">
                دیجی‌کالا
              </div>
              <h3 className="text-xl font-bold text-slate-900">دیجی‌کالا</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 font-light">
                ظرفیت‌های تجارت الکترونیک، بازار، میلیون‌ها مشتری، فناوری، انبارداری و زیرساخت‌های عملیاتی گسترده.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-8 shadow-sm text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-bold text-xl">
                دیجی‌پی
              </div>
              <h3 className="text-xl font-bold text-slate-900">دیجی‌پی</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 font-light">
                تجربه و تخصص عمیق در حوزه پرداخت، خدمات مالی دیجیتال، اعتبار خرید (BNPL) و فناوری‌های فین‌تک.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-8 shadow-sm text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 font-bold text-xl">
                دیجی‌نکست
              </div>
              <h3 className="text-xl font-bold text-slate-900">دیجی‌نکست</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 font-light">
                تجربه در سرمایه‌گذاری، شتاب‌دهی، همراهی با استارتاپ‌ها، استعدادیابی فناوری و مدیریت اجرایی دیجی‌ونچرز.
              </p>
            </article>
          </div>

          {/* Metric Bars */}
          <div className="mt-16 grid grid-cols-2 gap-6 lg:grid-cols-4 text-center">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/30 p-6">
              <p className="text-4xl font-extrabold text-slate-950">+۴۰</p>
              <p className="mt-2 text-sm font-medium text-slate-600">سرمایه‌گذاری فعال</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm border-brand-green/30">
              <p className="text-4xl font-extrabold text-brand-green">Seed - B</p>
              <p className="mt-2 text-sm font-medium text-slate-600">مراحل سرمایه‌گذاری</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/30 p-6">
              <p className="text-4xl font-extrabold text-slate-950">۵</p>
              <p className="mt-2 text-sm font-medium text-slate-600">حوزه سرمایه‌گذاری استراتژیک</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm border-brand-green/30">
              <p className="text-4xl font-extrabold text-brand-green">۱۳۹۸</p>
              <p className="mt-2 text-sm font-medium text-slate-600">سال آغاز فعالیت CVC</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ACCORDION SECTION ==================== */}
      <section className="bg-slate-50/70 border-t border-slate-200/80 py-20 lg:py-28" id="faq">
        <div className="container-dv max-w-4xl">
          <div className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-green">سوالات متداول</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">
              آنچه بنیان‌گذاران می‌پرسند
            </h2>
            <p className="mt-3 text-base text-slate-600 font-light">
              پاسخ به سوالات کلیدی درباره فرآیند، معیارها و نحوه همکاری با دیجی‌ونچرز
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="faq-item group rounded-2xl border border-slate-200/90 bg-white p-6 transition-all duration-200 open:shadow-md open:border-brand-green/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-bold text-slate-900">
                  <span>{faq.q}</span>
                  <span className="transition duration-200 group-open:rotate-180 text-brand-green">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-base leading-relaxed text-slate-600 font-light pt-3 border-t border-slate-100">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/investment-request" className="btn-primary !px-8 !py-3.5 text-base shadow-md shadow-brand-green/20">
              ارسال فرم درخواست سرمایه‌گذاری
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
