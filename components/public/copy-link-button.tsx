"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function CopyLinkButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback or ignore
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm transition"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-brand-green" />
          <span className="text-brand-green font-medium">لینک کپی شد</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5 text-slate-500" />
          <span>اشتراک‌گذاری</span>
        </>
      )}
    </button>
  );
}
