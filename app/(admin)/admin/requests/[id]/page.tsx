import { getSessionUser } from "@/modules/auth/guard";
import { RequestService } from "@/modules/requests/service";
import { formatPersianDate, formatFileSize } from "@/lib/utils";
import { RequestStatus, RequestSector, RequestStage } from "@/db/schema";
import { RequestActions } from "@/components/admin/request-actions";
import { InternalNotesForm } from "@/components/admin/internal-notes-form";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  Building,
  User,
  Mail,
  Phone,
  Calendar,
  Layers,
  Clock,
  Lock,
} from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<RequestStatus, { label: string; color: string }> = {
  draft: { label: "پیش‌نویس", color: "bg-slate-100 text-slate-700 border-slate-200" },
  submitted: { label: "در انتظار بررسی", color: "bg-blue-50 text-blue-700 border-blue-200" },
  under_review: { label: "در حال بررسی", color: "bg-amber-50 text-amber-700 border-amber-200" },
  needs_revision: { label: "نیازمند بازنگری", color: "bg-purple-50 text-purple-700 border-purple-200" },
  accepted: { label: "پذیرفته‌شده", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { label: "ردشده", color: "bg-rose-50 text-rose-700 border-rose-200" },
};

const SECTOR_LABELS: Record<RequestSector, string> = {
  ecommerce: "تجارت الکترونیک",
  fintech: "فین‌تک و پرداخت",
  platform: "پلتفرم و زیرساخت",
  supply_chain: "لجستیک و زنجیره تأمین",
  ai: "هوش مصنوعی",
  other: "سایر حوزه‌ها",
};

const STAGE_LABELS: Record<RequestStage, string> = {
  seed: "بذری (Seed)",
  early: "مراحل اولیه (Early-stage)",
  growth: "رشد (Growth)",
  scale: "توسعه و مقیاس‌پذیری (Scale)",
};

export default async function AdminRequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = (await getSessionUser())!;
  const { request, history } = await RequestService.getRequestById(user, params.id);

  const statusInfo = STATUS_LABELS[request.status];

  return (
    <div className="space-y-6">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/admin/requests" className="hover:text-slate-900 flex items-center gap-1 transition">
          <ArrowRight className="h-3.5 w-3.5" />
          بازگشت به صف درخواست‌ها
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{request.startupName}</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{request.startupName}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            شناسه پرونده: <span className="font-mono text-slate-600">{request.id}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {request.filePath && (
            <a
              href={`/api/requests/${request.id}/download`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-green hover:bg-brand-greenHover text-white text-xs font-semibold shadow-sm transition"
            >
              <Download className="h-4 w-4" />
              دانلود پیچ‌دک ({request.fileSize ? formatFileSize(request.fileSize) : "فایل"})
            </a>
          )}
        </div>
      </div>

      {/* Main Grid: Details + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Startup Information & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics / Attributes */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-brand-green shrink-0" />
              <div>
                <div className="text-xs text-slate-500">بنیان‌گذار</div>
                <div className="text-sm font-medium text-slate-900">{request.founderName}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <div className="text-xs text-slate-500">ایمیل</div>
                <div className="text-sm font-medium text-slate-900">{request.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-brand-green shrink-0" />
              <div>
                <div className="text-xs text-slate-500">شماره تماس</div>
                <div className="text-sm font-medium text-slate-900" dir="ltr">
                  {request.phone}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Layers className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <div className="text-xs text-slate-500">مرحله رشد</div>
                <div className="text-sm font-medium text-slate-900">
                  {STAGE_LABELS[request.stage] || request.stage}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-cyan-600 shrink-0" />
              <div>
                <div className="text-xs text-slate-500">حوزه تخصصی</div>
                <div className="text-sm font-medium text-slate-900">
                  {SECTOR_LABELS[request.sector] || request.sector}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-purple-600 shrink-0" />
              <div>
                <div className="text-xs text-slate-500">تاریخ ثبت اولیه</div>
                <div className="text-sm font-medium text-slate-900">
                  {formatPersianDate(request.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Startup Description Narrative */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-base">معرفی و شرح مسئله/راهکار</h3>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              {request.description}
            </div>
          </div>

          {/* Interactive State Actions */}
          <RequestActions
            requestId={request.id}
            currentStatus={request.status}
            version={request.version}
          />
        </div>

        {/* Right Column: Internal Notes & Timeline */}
        <div className="space-y-6">
          {/* Internal Diligence Notes (Protected) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-600" />
                یادداشت‌های محرمانه ارزیابی
              </h3>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                محرمانه داخلی
              </span>
            </div>

            {request.internalNote ? (
              <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                {request.internalNote}
              </div>
            ) : (
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                هنوز یادداشتی برای این پرونده ثبت نشده است.
              </div>
            )}

            <InternalNotesForm requestId={request.id} />
          </div>

          {/* Audit History Timeline */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              تاریخچه تغییرات وضعیت
            </h3>

            <div className="space-y-3 border-r-2 border-slate-200 pr-4 mr-2">
              {history.map((h, i) => {
                const toStatusInfo = STATUS_LABELS[h.toStatus as RequestStatus];
                return (
                  <div key={h.id || i} className="relative text-xs space-y-1">
                    <span className="absolute -right-[23px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-green border-2 border-white"></span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {toStatusInfo?.label || h.toStatus}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {formatPersianDate(h.createdAt)}
                      </span>
                    </div>
                    {h.adminMessage && (
                      <div className="text-[11px] text-purple-800 bg-purple-50 p-2 rounded border border-purple-200">
                        پیام: {h.adminMessage}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
