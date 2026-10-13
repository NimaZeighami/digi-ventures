import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/modules/auth/guard";
import { RequestService } from "@/modules/requests/service";
import { MyRequestsList } from "@/components/requests/my-requests-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "درخواست‌های من | دیجی‌ونچرز",
  description: "پیگیری وضعیت درخواست‌های سرمایه‌گذاری ثبت شده در دیجی‌ونچرز",
};

export default async function MyRequestsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login?redirect=/my-requests");
  }

  const requests = await RequestService.getMyRequests(user);

  return (
    <div className="pt-[100px] pb-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green">
            <span className="h-2 w-2 rounded-full bg-brand-green"></span>
            <span>پنل کارآفرینان</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            درخواست‌های سرمایه‌گذاری من
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-light">
            پیگیری وضعیت بررسی طرح‌ها در کمیته و مشاهده بازخوردهای تیم سرمایه‌گذاری
          </p>
        </div>

        <Link
          href="/investment-request"
          className="btn-primary !px-5 !py-2.5 text-xs font-semibold shrink-0 shadow-md shadow-brand-green/20"
        >
          <span>ثبت طرح جدید +</span>
        </Link>
      </div>

      {/* Requests List */}
      <MyRequestsList requests={requests} />
    </div>
  );
}
