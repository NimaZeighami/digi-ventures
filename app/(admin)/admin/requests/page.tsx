import { getSessionUser } from "@/modules/auth/guard";
import { RequestService } from "@/modules/requests/service";
import Link from "next/link";
import { formatPersianDate } from "@/lib/utils";
import { RequestStatus, RequestSector } from "@/db/schema";
import { Search, Filter, Eye, Download } from "lucide-react";

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

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams?: { status?: string; sector?: string; search?: string };
}) {
  const user = (await getSessionUser())!;
  const currentStatus = searchParams?.status as RequestStatus | undefined;

  let requests = await RequestService.getAllRequests(user, {
    status: currentStatus,
  });

  // Client-safe search filtering
  if (searchParams?.search) {
    const q = searchParams.search.toLowerCase();
    requests = requests.filter(
      (r) =>
        r.startupName.toLowerCase().includes(q) ||
        r.founderName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
    );
  }

  const statusTabs: { key: string; label: string }[] = [
    { key: "", label: "همه درخواست‌ها" },
    { key: "submitted", label: "در انتظار بررسی" },
    { key: "under_review", label: "در حال بررسی" },
    { key: "needs_revision", label: "نیازمند بازنگری" },
    { key: "accepted", label: "پذیرفته‌شده" },
    { key: "rejected", label: "ردشده" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">صف بررسی درخواست‌های سرمایه‌گذاری</h1>
          <p className="text-sm text-slate-500 mt-1">
            ارزیابی پیشنهادات سرمایه‌گذاری، بررسی پیچ‌دک‌ها و تعیین وضعیت استارتاپ‌ها
          </p>
        </div>
        <div className="text-xs bg-white px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 shadow-sm">
          مجموع درخواست‌ها: <span className="font-bold text-slate-900">{requests.length}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {statusTabs.map((tab) => {
          const isActive = (searchParams?.status || "") === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.key ? `/admin/requests?status=${tab.key}` : "/admin/requests"}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                isActive
                  ? "bg-brand-green text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Requests List - Responsive Table on desktop, Cards on mobile */}
      {requests.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500 shadow-sm">
          هیچ درخواستی با فیلترهای انتخابی یافت نشد.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-50 text-xs text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">استارتاپ</th>
                  <th className="py-3.5 px-4 font-semibold">بنیان‌گذار</th>
                  <th className="py-3.5 px-4 font-semibold">حوزه</th>
                  <th className="py-3.5 px-4 font-semibold">وضعیت</th>
                  <th className="py-3.5 px-4 font-semibold">تاریخ ارسال</th>
                  <th className="py-3.5 px-4 font-semibold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => {
                  const statusInfo = STATUS_LABELS[r.status] || {
                    label: r.status,
                    color: "bg-slate-100 text-slate-700 border-slate-200",
                  };
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {r.startupName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {r.founderName}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {SECTOR_LABELS[r.sector] || r.sector}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs border font-medium ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {formatPersianDate(r.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href={`/admin/requests/${r.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition"
                        >
                          <Eye className="h-3.5 w-3.5 text-brand-green" />
                          بررسی پرونده
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards Layout */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {requests.map((r) => {
              const statusInfo = STATUS_LABELS[r.status];
              return (
                <div
                  key={r.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{r.startupName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {r.founderName} • {r.email}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs border font-medium ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>{SECTOR_LABELS[r.sector]}</span>
                    <span>{formatPersianDate(r.createdAt)}</span>
                  </div>

                  <Link
                    href={`/admin/requests/${r.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-brand-green hover:bg-brand-greenHover text-white text-xs font-semibold shadow-sm transition"
                  >
                    <Eye className="h-4 w-4" />
                    بررسی و تعیین وضعیت
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
