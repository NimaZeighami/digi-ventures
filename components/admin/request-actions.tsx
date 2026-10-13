"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RequestStatus } from "@/db/schema";
import { AlertCircle, CheckCircle, RefreshCw, XCircle, FileText } from "lucide-react";

interface RequestActionsProps {
  requestId: string;
  currentStatus: RequestStatus;
  version: number;
}

export function RequestActions({
  requestId,
  currentStatus,
  version,
}: RequestActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [activeModal, setActiveModal] = useState<"needs_revision" | "accepted" | "rejected" | null>(null);

  // Quick Action: Move to under_review
  async function handleStartReview() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/requests/${requestId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetStatus: "under_review",
          expectedVersion: version,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "خطا در تغییر وضعیت");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Modal Action: Submit transition with message
  async function handleTransitionSubmit(targetStatus: RequestStatus) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/requests/${requestId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetStatus,
          adminMessage: adminMessage || undefined,
          expectedVersion: version,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "خطا در ثبت تصمیم");

      setActiveModal(null);
      setAdminMessage("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
        <FileText className="h-4 w-4 text-brand-green" />
        عملیات و تعیین وضعیت پرونده
      </h3>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Action Buttons depending on current state */}
      <div className="flex flex-wrap gap-3">
        {currentStatus === "submitted" && (
          <button
            onClick={handleStartReview}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            آغاز بررسی رسمی پرونده (Under Review)
          </button>
        )}

        {currentStatus === "under_review" && (
          <>
            <button
              onClick={() => setActiveModal("needs_revision")}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              درخواست بازنگری از بنیان‌گذار
            </button>

            <button
              onClick={() => setActiveModal("accepted")}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              پذیرش اولیه و ارجاع به کمیته
            </button>

            <button
              onClick={() => setActiveModal("rejected")}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              رد درخواست
            </button>
          </>
        )}

        {currentStatus === "needs_revision" && (
          <div className="text-xs text-purple-700 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200 font-medium">
            درخواست در انتظار پاسخ و به‌روزرسانی توسط بنیان‌گذار است.
          </div>
        )}

        {currentStatus === "accepted" && (
          <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 font-medium">
            این پیشنهاد سرمایه‌گذاری پذیرفته شده است.
          </div>
        )}

        {currentStatus === "rejected" && (
          <div className="text-xs text-rose-700 bg-rose-50 px-3 py-2 rounded-lg border border-rose-200 font-medium">
            این پیشنهاد سرمایه‌گذاری رد شده است.
          </div>
        )}
      </div>

      {/* Decision Modal / Drawer */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h4 className="font-bold text-slate-900 text-base">
              {activeModal === "needs_revision" && "درخواست بازنگری و اصلاح مدارک"}
              {activeModal === "accepted" && "پذیرش پیشنهاد سرمایه‌گذاری"}
              {activeModal === "rejected" && "رد پیشنهاد سرمایه‌گذاری"}
            </h4>

            <p className="text-xs text-slate-500 leading-relaxed">
              {activeModal === "needs_revision" &&
                "توضیحات و موارد مورد نیاز را جهت اطلاع بنیان‌گذار و ارسال در ایمیل به‌روزرسانی ثبت نمایید (حداقل ۱۰ کاراکتر)."}
              {activeModal === "accepted" &&
                "پیام تبریک یا مراحل بعدی ارزیابی را جهت ارسال به بنیان‌گذار ثبت نمایید."}
              {activeModal === "rejected" &&
                "دلیل عدم پذیرش را به صورت محترمانه و سازنده جهت ارسال به بنیان‌گذار ثبت نمایید (حداقل ۱۰ کاراکتر)."}
            </p>

            <textarea
              rows={4}
              value={adminMessage}
              onChange={(e) => setAdminMessage(e.target.value)}
              placeholder="توضیحات خود را اینجا بنویسید..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setError(null);
                }}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => handleTransitionSubmit(activeModal)}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-brand-green hover:bg-brand-greenHover text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                {loading ? "در حال ثبت..." : "تأیید و ارسال ایمیل"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
