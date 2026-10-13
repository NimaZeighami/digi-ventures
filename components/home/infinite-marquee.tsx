export function InfiniteMarquee() {
  const startups = [
    "آپ‌تایم (Uptime)",
    "گنجه (Ganjeh)",
    "نوروبی‌آی (NeuroBI)",
    "کارپو (Karpo)",
    "کیسان (Keysun)",
    "میاره (Miare)",
    "دیجی‌پی (DigiPay)",
    "دژینو (Dezhino)",
    "ویرا (Vira)",
  ];

  return (
    <div className="m12-marquee py-4">
      <div className="m12-marquee-track">
        {startups.map((name, i) => (
          <div
            key={`track1-${i}`}
            className="flex items-center justify-center h-16 min-w-[150px] rounded-xl border border-slate-200/80 bg-white px-5 shadow-sm text-slate-800 font-bold text-base hover:border-brand-green transition-all"
          >
            {name}
          </div>
        ))}
      </div>
      <div className="m12-marquee-track" aria-hidden="true">
        {startups.map((name, i) => (
          <div
            key={`track2-${i}`}
            className="flex items-center justify-center h-16 min-w-[150px] rounded-xl border border-slate-200/80 bg-white px-5 shadow-sm text-slate-800 font-bold text-base hover:border-brand-green transition-all"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
