"use client";

import { useState } from "react";
import Link from "next/link";
import { InvestmentRequest } from "@/db/schema";
import { formatPersianDate } from "@/lib/utils";
import { ResubmitModal } from "./resubmit-modal";

interface Props {
  requests: InvestmentRequest[];
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  draft: {
    label: "پیش‌نویس",
    color: "bg-slate-100 text-slate-700 border-slate-200",
  },
  submitted: {
    label: "در صف غربالگری اولیه",
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
  under_review: {
    label: "در حال بررسی تخصصی",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  needs_revision: {
    label: "نیازمند اصلاح و بازنگری",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  accepted: {
    label: "پذیرفته شده در کمیته",
    color: "bg-emerald-50 text-brand-green border-emerald-200",
  },
  rejected: {
    label: "رد شده در کمیته",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const SECTOR_LABELS: Record<string, string> = {
  ecommerce: "تجارت الکترونیک",
  fintech: "فین‌تک و خدمات مالی",
  platform: "پلتفرم‌ها",
  supply_chain: "لجستیک و توزیع",
  ai: "هوش مصنوعی و داده",
  other: "سایر حوزه‌ها",
};

export function MyRequestsList({ requests }: Props) {
  const [editingRequest, setEditingRequest] = useState<InvestmentRequest | null>(null);

  if (requests.length === 0) {
    return (
      <div className="text-center py-20 px-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-5">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900">تاکنون درخواستی ثبت نکرده‌اید</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto font-light">
            ایده یا استارتاپ خود را در سامانه ثبت کنید تا توسط کمیته سرمایه‌گذاری دیجی‌ونچرز ارزیابی شود.
          </p>
        </div>
        <Link
          href="/investment-request"
          className="btn-primary inline-flex text-xs !px-5 !py-2.5 font-semibold"
        >
          <span>ارسال درخواست سرمایه‌گذاری</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {requests.map((req) => {
        const statusMeta = STATUS_CONFIG[req.status] || {
          label: req.status,
          color: "bg-slate-100 text-slate-700 border-slate-200",
        };

        return (
          <div
            key={req.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm transition hover:border-brand-green/30 hover:shadow-card space-y-6"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">{req.startupName}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusMeta.color}`}>
                    {statusMeta.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>بنیان‌گذار: {req.founderName}</span>
                  <span>•</span>
                  <span>ثبت شده در: {formatPersianDate(req.createdAt)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                {req.filePath && (
                  <a
                    href={`/api/requests/${req.id}/download`}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                  >
                    <span>دریافت فایل Pitch Deck</span>
                  </a>
                )}

                {req.status === "needs_revision" && (
                  <button
                    type="button"
                    onClick={() => setEditingRequest(req)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-green text-white hover:bg-brand-greenHover transition shadow-sm"
                  >
                    <span>ویرایش و ارسال مجدد</span>
                  </button>
                )}
              </div>
            </div>

            {/* Description & Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">حوزه فعالیت</span>
                <span className="font-semibold text-slate-800">
                  {SECTOR_LABELS[req.sector] || req.sector}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">مرحله کسب‌وکار</span>
                <span className="font-semibold text-slate-800">
                  {req.stage.toUpperCase()}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">ایمیل ارتباطی</span>
                <span className="font-semibold text-slate-800">{req.email}</span>
              </div>
            </div>

            {/* Pitch Deck summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs leading-relaxed text-slate-700">
              <span className="font-bold block mb-1 text-slate-900">خلاصه طرح و کسب‌وکار:</span>
              <p>{req.description}</p>
            </div>

            {/* Review feedback note if needs_revision or rejected */}
            {req.status === "needs_revision" && (
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 space-y-1">
                <span className="font-bold">پیام تیم ارزیابی:</span>
                <p>
                  طرح شما مورد بررسی اولیه قرار گرفت و نیازمند به‌روزرسانی مدارک یا توضیحات است. لطفاً از طریق دکمه «ویرایش و ارسال مجدد»، تغییرات لازم را اعمال و فایل بازنگری‌شده را ارسال فرمایید.
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Resubmit Modal */}
      {editingRequest && (
        <ResubmitModal
          request={editingRequest}
          onClose={() => setEditingRequest(null)}
          onSuccess={() => {
            setEditingRequest(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
