"use client";

import Link from "next/link";
import Image from "next/image";

interface FocusCard {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  backColor: string;
  description: string;
  tag: string;
}

const FOCUS_CARDS: FocusCard[] = [
  {
    id: "ecommerce",
    icon: "/assets/images/m12/icon-cloud.png",
    title: "تجارت الکترونیک",
    subtitle: "E-Commerce & Retail",
    backColor: "!bg-[#00B140]",
    description: "سرمایه‌گذاری بر استارتاپ‌هایی که شیوه خرید، فروش، خرده‌فروشی، لجستیک و تجربه مشتری را بازتعریف می‌کنند.",
    tag: "آپ‌تایم · گنجه · کیسان · میاره",
  },
  {
    id: "fintech",
    icon: "/assets/images/m12/icon-security.png",
    title: "فین‌تک و خدمات مالی",
    subtitle: "Fintech & Digital Finance",
    backColor: "!bg-[#059669]",
    description: "حمایت از ساخت آینده خدمات مالی؛ از پرداخت و اعتبار تا زیرساخت‌های مالی جدید که دسترسی به مالیه دیجیتال را ساده می‌کنند.",
    tag: "نمونه پورتفولیو: دیجی‌پی",
  },
  {
    id: "ai",
    icon: "/assets/images/m12/icon-ai-apps.png",
    title: "هوش مصنوعی",
    subtitle: "Artificial Intelligence",
    backColor: "!bg-[#0F172A]",
    description: "استفاده از هوش مصنوعی برای حل مسائل واقعی و ساخت محصولات مقیاس‌پذیر در تقاطع AI با تجارت و خدمات مالی.",
    tag: "نمونه پورتفولیو: نوروبی‌آی · کارپو",
  },
  {
    id: "platform",
    icon: "/assets/images/m12/icon-data-ops.png",
    title: "کسب‌وکارهای پلتفرمی",
    subtitle: "Platform Businesses",
    backColor: "!bg-[#047857]",
    description: "پلتفرم‌هایی که افراد، کسب‌وکارها و خدمات را به شکل‌های نوین به یکدیگر متصل کرده و بازارهای جدید خلق می‌کنند.",
    tag: "اتصال بازارهای چندوجهی",
  },
  {
    id: "logistics",
    icon: "/assets/images/m12/icon-deep-tech.png",
    title: "زنجیره تأمین و لجستیک",
    subtitle: "Supply Chain Tech",
    backColor: "!bg-[#1E293B]",
    description: "راهکارهایی که به بهبود، هوشمندسازی و خودکارسازی زنجیره تأمین، ناوگان توزیع، لجستیک و انبارداری کمک می‌کنند.",
    tag: "گنجه · آپ‌تایم · میاره",
  },
];

export function FocusFlipCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {FOCUS_CARDS.map((card) => (
        <div key={card.id} className="m12-flip-card">
          <div className="m12-flip-inner">
            {/* Front */}
            <div className="m12-flip-front">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 p-2 shadow-sm border border-slate-100">
                <Image
                  src={card.icon}
                  alt={card.title}
                  width={36}
                  height={36}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{card.title}</h3>
                <p className="mt-1 text-xs text-slate-400 font-medium">{card.subtitle}</p>
              </div>
            </div>

            {/* Back */}
            <div className={`m12-flip-back ${card.backColor}`}>
              <div>
                <h3 className="text-lg font-bold text-white leading-snug">{card.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/90">{card.description}</p>
                <div className="mt-2.5 inline-block rounded-lg bg-black/15 px-2 py-0.5 text-[11px] font-semibold text-white/90">
                  {card.tag}
                </div>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/#portfolio"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform hover:scale-110"
                  aria-label={`مشاهده استارتاپ‌های ${card.title}`}
                >
                  <img
                    src="/assets/images/m12/tile-arrow.svg"
                    alt="Arrow"
                    className="h-3.5 w-3.5 rotate-180 invert"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
