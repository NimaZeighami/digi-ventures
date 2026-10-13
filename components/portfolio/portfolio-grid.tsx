"use client";

import { useState } from "react";
import Image from "next/image";

export interface StartupItem {
  id: string;
  name: string;
  enName: string;
  sector: "ecommerce" | "logistics" | "fintech" | "ai" | "platform";
  sectorLabel: string;
  stage: string;
  stageColor: string;
  description: string;
  logoText?: string;
  logo?: string;
  website?: string;
}

const STARTUPS: StartupItem[] = [
  {
    id: "uptime",
    name: "آپ‌تایم",
    enName: "Uptime",
    sector: "logistics",
    sectorLabel: "تجارت الکترونیک و لجستیک",
    stage: "Seed Stage",
    stageColor: "bg-emerald-50 text-brand-green",
    description: "سامانه هوشمند بهینه‌سازی مسیر ناوگان، زمان‌بندی و توزیع سفارش‌ها با استفاده از الگوریتم‌های هوش مصنوعی.",
    logoText: "آپ‌تایم (Uptime)",
    website: "https://uptime.ir",
  },
  {
    id: "ganjeh",
    name: "گنجه",
    enName: "Ganjeh",
    sector: "logistics",
    sectorLabel: "لجستیک و خرده‌فروشی",
    stage: "Seed Stage",
    stageColor: "bg-blue-50 text-blue-700",
    description: "شبکه هوشمند لاکرهای اختصاصی تحویل مرسولات پستی و خریدهای اینترنتی در سراسر کشور جهت ارتقای تجربه مشتری.",
    logoText: "گنجه (Ganjeh)",
    website: "https://ganjeh.net",
  },
  {
    id: "neurobi",
    name: "نوروبی‌آی",
    enName: "NeuroBI",
    sector: "ai",
    sectorLabel: "هوش مصنوعی و داده",
    stage: "Seed Stage",
    stageColor: "bg-purple-50 text-purple-700",
    description: "پلتفرم هوش تجاری و تحلیل داده‌های کلان بازار و رفتار مشتریان با تکیه بر مدل‌های پیشرفته یادگیری عمیق.",
    logoText: "نوروبی‌آی (NeuroBI)",
  },
  {
    id: "karpo",
    name: "کارپو",
    enName: "Karpo",
    sector: "ai",
    sectorLabel: "هوش مصنوعی و نرم‌افزار",
    stage: "Seed Stage",
    stageColor: "bg-teal-50 text-teal-700",
    description: "دستیار هوشمند سازمانی و پلتفرم بهینه‌سازی فرآیندهای کسب‌وکار با بهره‌گیری از عامل‌های هوشمند (AI Agents).",
    logoText: "کارپو (Karpo)",
  },
  {
    id: "keysun",
    name: "کیسان",
    enName: "Keysun",
    sector: "fintech",
    sectorLabel: "تجارت الکترونیک و مالی",
    stage: "Seed Stage",
    stageColor: "bg-amber-50 text-amber-700",
    description: "سامانه‌های مالیاتی، حسابداری ابری و صدور صورت‌حساب الکترونیکی یکپارچه برای کسب‌وکارهای دیجیتال و فروشندگان.",
    logoText: "کیسان (Keysun)",
  },
  {
    id: "miare",
    name: "میاره",
    enName: "Miare",
    sector: "logistics",
    sectorLabel: "لجستیک و ارسال سریع",
    stage: "Series A",
    stageColor: "bg-emerald-50 text-brand-green",
    description: "پلتفرم برون‌سپاری ارسال سفارش‌های فروشگاهی و تحویل سریع درون‌شهری با الگوریتم‌های هوشمند توزیع بار.",
    logoText: "میاره (Miare)",
    website: "https://miare.ir",
  },
  {
    id: "digipay",
    name: "دیجی‌پی",
    enName: "DigiPay",
    sector: "fintech",
    sectorLabel: "فین‌تک و خدمات مالی",
    stage: "Growth / Series A",
    stageColor: "bg-emerald-50 text-brand-green",
    description: "جامع‌ترین پلتفرم خدمات پرداخت، کیف پول دیجیتال، اعتبار خرید خرد (BNPL) و زیرساخت مالی در اقتصاد دیجیتال ایران.",
    logoText: "دیجی‌پی (DigiPay)",
    website: "https://mydigipay.com",
  },
  {
    id: "dezhino",
    name: "دژینو",
    enName: "Dezhino",
    sector: "ai",
    sectorLabel: "امنیت و هوش مصنوعی",
    stage: "Seed Stage",
    stageColor: "bg-blue-50 text-blue-700",
    description: "سامانه هوشمند کشف و پیشگیری از تقلب تبلیغاتی آنلاین با الگوریتم‌های بلادرنگ یادگیری ماشین و پردازش داده.",
    logoText: "دژینو (Dezhino)",
    website: "https://dezhino.com",
  },
  {
    id: "vira",
    name: "ویرا",
    enName: "Vira",
    sector: "ai",
    sectorLabel: "هوش مصنوعی و بینایی ماشین",
    stage: "Seed Stage",
    stageColor: "bg-purple-50 text-purple-700",
    description: "راهکارهای داده‌محور و پردازش صوت و تصویر در خرده‌فروشی دیجیتال و فروشگاه‌های نسل جدید.",
    logoText: "ویرا (Vira)",
  },
];

const SECTORS = [
  { key: "all", label: "همه استارتاپ‌ها" },
  { key: "ecommerce", label: "تجارت الکترونیک و خرده‌فروشی" },
  { key: "fintech", label: "فین‌تک و پرداخت" },
  { key: "ai", label: "هوش مصنوعی و داده" },
  { key: "logistics", label: "لجستیک و زنجیره تأمین" },
];

export function PortfolioGrid() {
  const [activeSector, setActiveSector] = useState("all");

  const filteredStartups =
    activeSector === "all"
      ? STARTUPS
      : STARTUPS.filter((s) => s.sector === activeSector);

  return (
    <div>
      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
        {SECTORS.map((sector) => {
          const isActive = activeSector === sector.key;
          return (
            <button
              key={sector.key}
              type="button"
              onClick={() => setActiveSector(sector.key)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-brand-green hover:text-brand-green"
              }`}
            >
              {sector.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStartups.map((startup) => (
          <div
            key={startup.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-brand-green/40 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${startup.stageColor}`}>
                  {startup.stage}
                </span>
                <span className="text-xs text-slate-400">{startup.sectorLabel}</span>
              </div>
              <div className="h-24 flex items-center justify-center bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100">
                <span className="text-2xl font-black text-slate-900">{startup.logoText || startup.name}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{startup.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 font-light">
                {startup.description}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>{startup.sectorLabel}</span>
              {startup.website ? (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-green font-semibold hover:underline"
                >
                  مشاهده وب‌سایت ←
                </a>
              ) : (
                <span className="text-brand-green font-semibold">فعال در پورتفولیو</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
