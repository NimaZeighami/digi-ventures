"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "چه استارتاپ‌هایی واجد شرایط جذب سرمایه از دیجی‌ونچرز هستند؟",
    answer:
      "ما در درجه اول بر استارتاپ‌های مراحل بذری (Seed) تا مراحل ابتدایی رشد (Series A) متمرکز هستیم که در حوزه‌های تجارت الکترونیک، فین‌تک، لجستیک هوشمند، زیرساخت داده و هوش مصنوعی فعالیت می‌کنند و پتانسیل هم‌افزایی با اکوسیستم گروه دیجی‌کالا را دارند.",
  },
  {
    question: "فرآیند بررسی درخواست سرمایه‌گذاری چقدر زمان می‌برد؟",
    answer:
      "غربالگری اولیه معمولاً ظرف ۵ الی ۱۰ روز کاری پس از ارسال درخواست انجام می‌شود. در صورت تناسب طرح با اولویت‌های ما، جلسات ارزیابی تخصصی و راستی‌آزمایی (Due Diligence) طی ۲ تا ۴ هفته برگزار خواهد شد.",
  },
  {
    question: "آیا داشتن محصول اولیه (MVP) یا درآمد اولیه الزامی است؟",
    answer:
      "داشتن حداقل محصول قابل ارائه (MVP) و اعتبارسنجی اولیه بازار امتیاز بسیار مهمی است. با این حال، برای تیم‌های نخبه با ایده تحول‌آفرین و پشتوانه فنی قوی در حوزه هوش مصنوعی و فناوری‌های عمیق، امکان بررسی در مراحل پیش‌بذری نیز وجود دارد.",
  },
  {
    question: "مالکیت فکری (IP) و کنترل مدیریتی شرکت پس از سرمایه‌گذاری چگونه خواهد بود؟",
    answer:
      "دیجی‌ونچرز به استقلال بنیان‌گذاران باور کامل دارد. مالکیت فکری همواره متعلق به استارتاپ باقی می‌ماند و ما به عنوان سهامدار اقلیت ارزش‌آفرین در کنار شما قرار می‌گیریم، نه مداخله‌گر در تصمیم‌گیری‌های روزمره شرکت.",
  },
  {
    question: "چه فایل‌هایی برای ثبت درخواست قابل بارگذاری هستند؟",
    answer:
      "شما می‌توانید فایل ارائه استارتاپ (Pitch Deck) خود را در قالب‌های PDF، PPT یا PPTX با حداکثر حجم ۲۰ مگابایت در سامانه بارگذاری فرمایید. نسخه به‌روزشده فایل در هر زمان از پنل کاربری قابل ویرایش است.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-4">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white transition overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggle(idx)}
              type="button"
              className="w-full flex items-center justify-between p-5 text-right font-bold text-sm sm:text-base text-slate-900 hover:text-brand-green transition"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-brand-green" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                <div className="pt-3">{faq.answer}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
