import { Metadata } from "next";
import Link from "next/link";
import { HeroLottie } from "@/components/home/hero-lottie";
import { FocusFlipCards } from "@/components/home/flip-cards";
import { InfiniteMarquee } from "@/components/home/infinite-marquee";
import { NewsAccordion } from "@/components/home/news-accordion";
import { NewsService } from "@/modules/news/service";
import { formatPersianDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "دیجی‌ونچرز | صندوق سرمایه‌گذاری جسورانه شرکتی (CVC)",
  description: "دیجی‌ونچرز — صندوق سرمایه‌گذاری جسورانه شرکتی (CVC) گروه دیجی‌کالا بر آینده تجارت الکترونیک، فین‌تک و هوش مصنوعی",
};

export default async function HomePage() {
  let latestArticles: Array<{
    slug: string;
    title: string;
    category: string;
    publishedAt: string;
    coverImage: string | null;
  }> = [];

  try {
    const rawArticles = await NewsService.getPublishedArticles();
    latestArticles = rawArticles.slice(0, 3).map((a) => ({
      slug: a.slug,
      title: a.title,
      category: (a as any).category || "اکوسیستم و سرمایه‌گذاری",
      publishedAt: a.publishedAt ? formatPersianDate(a.publishedAt) : "شهریور ۱۴۰۵",
      coverImage: a.coverImage,
    }));
  } catch {
    // fallback gracefully
  }

  return (
    <div>
      {/* ==================== HERO SECTION (M12 Exact Layout) ==================== */}
      <section className="m12-hero">
        <div className="container-dv m12-hero-row">
          {/* Left: Hero Headline, Subtext & CTA */}
          <div className="m12-hero-text">
            <h1 className="m12-hero-title">
              سرمایه‌گذاری روی <span className="text-brand-green">آینده کسب‌وکارها</span>
            </h1>
            <p className="m12-hero-subtext">
              ما سرمایه، تجربه و اکوسیستمی را در اختیار شما می‌گذاریم که برای ساختن آینده به آن نیاز دارید.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/#contact" className="btn-primary !px-8 !py-3.5 text-base shadow-lg shadow-brand-green/20">
                <span>کسب‌وکارتان را به ما معرفی کنید</span>
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
              </Link>
              <Link href="/#portfolio" className="btn-secondary !px-6 !py-3.5 text-base">
                مشاهده پورتفولیو
              </Link>
            </div>
          </div>

          {/* Right: M12 Lottie Orbit Animation */}
          <HeroLottie />
        </div>
      </section>

      {/* ==================== INTRO / ABOUT DIGIVENTURES SECTION ==================== */}
      <section className="py-12 lg:py-16 bg-white border-b border-slate-100">
        <div className="container-dv">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-green">معرفی دیجی‌ونچرز</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
              آینده را بنیان‌گذاران می‌سازند.
            </h2>
            <p className="mt-6 text-lg sm:text-xl font-normal leading-relaxed text-slate-700">
              دیجی‌ونچرز با پشتوانه گروه دیجی‌کالا و همراهی دیجی‌پی و دیجی‌نکست، بر روی استارتاپ‌هایی سرمایه‌گذاری می‌کند که در حال ساختن کسب‌وکارهای آینده هستند.
            </p>
            <p className="mt-4 text-base sm:text-lg font-light leading-relaxed text-slate-600">
              ما در دیجی‌ونچرز صرفاً سرمایه‌گذاری نمی‌کنیم. تلاش ما این است که با فراهم‌کردن دسترسی به تجربه، زیرساخت، بازار و شبکه گروه دیجی‌کالا، به تیم‌ها کمک کنیم تا رشدی سریع و پایدار را تجربه کنند.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-500">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-green"></span>
                دیجی‌کالا
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                دیجی‌پی
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-500"></span>
                دیجی‌نکست
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== "FOCUS AREAS" - 5 FLIP BOXES ==================== */}
      <section className="m12-bg-focus py-14 lg:py-18 bg-slate-50/40 border-b border-slate-200/60" id="focus">
        <div className="container-dv">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-green">حوزه‌های سرمایه‌گذاری</p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-950 sm:text-3xl lg:text-4xl">
              تبدیل استارتاپ‌های نوآور به پیشروهای فناوری فردا
            </h2>
            <p className="mt-3 text-sm font-normal leading-relaxed text-slate-600 sm:text-base">
              ما به استارتاپ‌ها کمک می‌کنیم تا به پیشروهای نوآوری و فناوری فردا تبدیل شوند؛ با تمرکز بر ۵ حوزه راهبردی:
            </p>
          </div>

          <FocusFlipCards />
        </div>
      </section>

      {/* ==================== "WHY DIGIVENTURES / ADVANTAGE" - 4 PILLARS ==================== */}
      <section className="py-14 lg:py-18 bg-white border-b border-slate-100" id="advantage">
        <div className="container-dv">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-green">مزیت دیجی‌ونچرز</p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-950 sm:text-3xl lg:text-4xl">
              چرا دیجی‌ونچرز؟
            </h2>
            <p className="mt-3 text-sm font-normal leading-relaxed text-slate-700 sm:text-base">
              سرمایه‌گذاری، قدم آغازین شروع یک مسیر طولانی است. سرمایه نه به تنهایی بلکه در کنار داشتن همراهی یک اکوسیستم به رشد بهتر شما کمک می‌کند.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Pillar 1: Access */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-brand-green/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green mb-4 font-bold text-base">
                ۰۱
              </div>
              <h3 className="text-lg font-bold text-slate-900">دسترسی (Access)</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 font-light">
                دسترسی به یکی از بزرگ‌ترین اکوسیستم‌های دیجیتال ایران و فرصت‌های همکاری پایدار با شرکت‌های گروه دیجی‌کالا.
              </p>
            </div>

            {/* Pillar 2: Expertise */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-brand-green/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4 font-bold text-base">
                ۰۲
              </div>
              <h3 className="text-lg font-bold text-slate-900">تخصص (Expertise)</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 font-light">
                دسترسی به تجربه و تخصص مدیران و تیم‌هایی که کسب‌وکارهای بزرگ دیجیتال را ساخته، راهبری کرده و توسعه داده‌اند.
              </p>
            </div>

            {/* Pillar 3: Ecosystem */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-brand-green/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 mb-4 font-bold text-base">
                ۰۳
              </div>
              <h3 className="text-lg font-bold text-slate-900">اکوسیستم (Ecosystem)</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 font-light">
                اتصال مستقیم به ظرفیت‌های دیجی‌کالا، دیجی‌پی و دیجی‌نکست در تجارت الکترونیک، پرداخت، فناوری و نوآوری.
              </p>
            </div>

            {/* Pillar 4: Partnership */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-brand-green/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 font-bold text-base">
                ۰۴
              </div>
              <h3 className="text-lg font-bold text-slate-900">همراهی (Partnership)</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 font-light">
                ما در مسیر رشد استارتاپ‌ها فقط سرمایه‌گذار نیستیم؛ می‌توانیم شریک، مشتری، همکار تجاری و همراه رشد استارتاپ‌ها باشیم.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== "THE POWER OF DIGIVENTURES" - STATS & MARQUEE ==================== */}
      <section className="m12-bg-power py-14 lg:py-18 bg-slate-50/30 overflow-hidden border-b border-slate-100" id="portfolio">
        <div className="container-dv">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-green">The Power of DigiVentures</p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-950 sm:text-3xl lg:text-4xl">ظرفیت‌های دیجی‌ونچرز و پورتفولیو</h2>
            <p className="mt-2 text-sm text-slate-600">پشتوانه داده، مشتریان و زیرساخت در مقیاس ملی</p>
          </div>

          {/* 4 Big Metric Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 text-center max-w-5xl mx-auto mb-12">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="text-3xl lg:text-4xl font-extrabold text-slate-950">+۴۰</div>
              <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-600">سرمایه‌گذاری و استارتاپ فعال</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="text-3xl lg:text-4xl font-extrabold text-brand-green">Seed - B</div>
              <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-600">مراحل ورود و سرمایه‌گذاری</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="text-3xl lg:text-4xl font-extrabold text-slate-950">+۱۰M</div>
              <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-600">کاربران و مشتریان در دسترس</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="text-3xl lg:text-4xl font-extrabold text-brand-green">+۱۵</div>
              <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-600">خروج‌های موفق و ادغام‌ها</p>
            </div>
          </div>

          <InfiniteMarquee />

          <div className="mt-8 text-center">
            <Link href="/portfolio" className="btn-secondary !px-7 !py-2.5 text-sm font-semibold">
              مشاهده تمام شرکت‌های پورتفولیو
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== EXECUTIVE QUOTE / FOUNDER VOICE ==================== */}
      <section className="py-12 lg:py-16 bg-white relative overflow-hidden">
        <div className="container-dv max-w-4xl text-center relative z-10">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
            <img src="/assets/images/m12/quote-icon.svg" alt="Quote Icon" className="h-7 w-7" />
          </div>

          <blockquote className="text-xl font-light leading-relaxed text-slate-900 sm:text-2xl lg:text-3xl text-balance">
            «همکاری با دیجی‌ونچرز برای ما بیش از جذب سرمایه بود؛ دسترسی به تخصص فنی، بازار گسترده و بازخوردهای بی‌واسطه از بزرگ‌ترین اکوسیستم دیجیتال کشور، مسیر چندساله رشد ما را به چند ماه تبدیل کرد.»
          </blockquote>

          <div className="mt-6">
            <p className="text-base font-bold text-slate-950">از زبان بنیان‌گذاران پورتفولیو</p>
            <p className="text-xs text-slate-500 font-medium mt-1">آپ‌تایم · گنجه · نوروبی‌آی · کارپو · کیسان · میاره · دیجی‌پی</p>
          </div>
        </div>
      </section>

      {/* ==================== TEAM SECTION ==================== */}
      <section className="py-14 lg:py-18 bg-slate-50/40 border-b border-slate-200/60" id="team">
        <div className="container-dv">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-green">تیم ما</p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-950 sm:text-3xl lg:text-4xl">
              تیم راهبری و سرمایه‌گذاری
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              متخصصان سرمایه‌گذاری خطرپذیر، پلتفرم و توسعه اکوسیستم در کنار بنیان‌گذاران
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            {/* Pillar 1: Investment */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-brand-green/30">
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10 font-bold text-brand-green text-sm">GP</span>
                <span className="text-xs font-semibold text-slate-400">سرمایه‌گذاری</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">تیم راهبری و سرمایه‌گذاری</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 font-light">
                هدایت استراتژی تخصیص سرمایه، ساختاردهی قراردادهای مشارکت و همراهی مداوم پورتفولیو از مرحله Seed به بالا.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-brand-green">
                <span>تخصیص سرمایه صبور</span>
                <span>←</span>
              </div>
            </div>

            {/* Pillar 2: Platform & Tech */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-emerald-500/30">
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-600 text-sm">Tech</span>
                <span className="text-xs font-semibold text-slate-400">فناوری و داده</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">تیم توسعه پلتفرم و فناوری</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 font-light">
                پشتیبانی فنی در زمینه معماری زیرساخت مقیاس‌پذیر، امنیت ابری، و تلفیق مدل‌های هوش مصنوعی در زنجیره ارزش.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-emerald-600">
                <span>معماری مقیاس‌پذیر</span>
                <span>←</span>
              </div>
            </div>

            {/* Pillar 3: Ecosystem & Support */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-teal-500/30">
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 font-bold text-teal-600 text-sm">Scale</span>
                <span className="text-xs font-semibold text-slate-400">توسعه بازار</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">توسعه کسب‌وکار و اکوسیستم</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 font-light">
                ایجاد کانال‌های هم‌افزایی با شرکت‌های دیجی‌کالا، دیجی‌پی و دیجی‌نکست، دسترسی به مارکت و تسریع ورود به بازار.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-teal-600">
                <span>اتصال مستقیم به بازار</span>
                <span>←</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/team" className="btn-secondary !px-7 !py-2.5 text-sm font-semibold">
              مشاهده تمام ساختار و اعضای تیم
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== "THE LATEST" - ACCORDION GRID ==================== */}
      <section className="pt-14 pb-0 bg-white overflow-hidden" id="news">
        <div className="container-dv pb-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-green">تازه‌ها و دیدگاه‌ها</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">آخرین اخبار دیجی‌ونچرز و شرکت‌های پورتفولیو</h2>
            </div>
            <Link href="/news" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-brand-green hover:underline">
              <span>همه اخبار</span>
              <span>←</span>
            </Link>
          </div>
        </div>

        <NewsAccordion articles={latestArticles} />
      </section>

      {/* ==================== CONTACT / PARTNERSHIP SECTION ==================== */}
      <section className="py-14 lg:py-20 bg-white border-b border-slate-100" id="contact">
        <div className="container-dv">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Left Col: Narrative & Dual Call-to-Actions */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-700 mb-4">
                <span className="h-2 w-2 rounded-full bg-brand-green"></span>
                ارتباط با ما
              </span>
              <h2 className="text-2xl font-extrabold text-slate-950 sm:text-3xl lg:text-4xl leading-tight">
                دیجی‌ونچرز، <span className="text-brand-green">همراه مسیر استارتاپی شما</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base font-normal leading-relaxed text-slate-700">
                ما تجربه، سرمایه و دسترسی به اکوسیستمی را به همراه می‌آوریم که می‌تواند به شما در مسیر ساختن، رشد و مقیاس‌‌پذیری کسب‌وکارتان کمک کند.
              </p>
              <p className="mt-3 text-xs sm:text-sm font-light leading-relaxed text-slate-600">
                اگر در حال ساخت یک کسب‌وکار نوآورانه در حوزه تجارت الکترونیک، فین‌تک یا هوش مصنوعی هستید، خوشحال می‌شویم که در مورد آن بیشتر از شما بشنویم.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/investment-request" className="btn-primary !px-7 !py-3 text-sm font-semibold shadow-md shadow-brand-green/20">
                  <span>کسب‌وکارتان را به ما معرفی کنید</span>
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                </Link>
                <a href="mailto:info@digiventures.ir" className="btn-secondary !px-6 !py-3 text-sm font-semibold">
                  info@digiventures.ir
                </a>
              </div>
            </div>

            {/* Right Col: Quick Channels Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-6 sm:p-8 shadow-card">
                <h3 className="text-base font-bold text-slate-900">مسیرهای ارتباط مستقیم</h3>
                <p className="mt-1 text-xs text-slate-500 font-light">تیم سرمایه‌گذاری آماده بررسی ایده‌ها و پروپوزال‌های ارسالی است</p>

                <div className="mt-6 space-y-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-3 text-slate-700">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-brand-green shadow-xs">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">ایمیل ارتباطی</p>
                      <a href="mailto:info@digiventures.ir" className="font-semibold text-slate-900 hover:text-brand-green">
                        info@digiventures.ir
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-brand-green shadow-xs">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">دفتر مرکزی</p>
                      <p className="font-semibold text-slate-900">تهران، خیابان گاندی، تقاطع شهید حقانی</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-brand-green shadow-xs">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">پاسخ‌دهی به درخواست‌ها</p>
                      <p className="font-semibold text-slate-900">حداکثر ظرف ۴۸ ساعت کاری</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-light">پشتیبانی بنیان‌گذاران:</span>
                  <Link href="/contact" className="text-xs font-bold text-brand-green hover:underline">
                    ارسال پیام اختصاصی ←
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
