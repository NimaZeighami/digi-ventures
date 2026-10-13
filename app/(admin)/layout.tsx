import { redirect } from "next/navigation";
import { getSessionUser } from "@/modules/auth/guard";
import Link from "next/link";
import {
  FileText,
  Newspaper,
  Users,
  Mail,
  Home,
  LogOut,
  ShieldAlert,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin" && user.role !== "super_admin") {
    redirect("/my-requests");
  }

  const isSuperAdmin = user.role === "super_admin";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-l border-slate-200 p-6 flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-lg bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green font-bold font-brand text-sm">
              DV
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base">پیشخوان مدیریت</div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-brand-green"></span>
                {isSuperAdmin ? "مدیر ارشد (Super Admin)" : "مدیر سرمایه‌گذاری (Admin)"}
              </div>
            </div>
          </div>

          <nav className="space-y-1.5">
            <Link
              href="/admin/requests"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition font-medium"
            >
              <FileText className="h-4 w-4 text-brand-green" />
              صف بررسی درخواست‌ها
            </Link>

            <Link
              href="/admin/news"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition font-medium"
            >
              <Newspaper className="h-4 w-4 text-blue-600" />
              مدیریت اخبار و مقالات
            </Link>

            {isSuperAdmin && (
              <>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition font-medium"
                >
                  <Users className="h-4 w-4 text-amber-600" />
                  مدیریت کاربران
                </Link>

                <Link
                  href="/admin/email-templates"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition font-medium"
                >
                  <Mail className="h-4 w-4 text-cyan-600" />
                  قالب‌های ایمیل
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-200 mt-6 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition font-medium"
          >
            <Home className="h-4 w-4 text-slate-500" />
            مشاهده وب‌سایت
          </Link>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 transition text-right font-medium"
            >
              <LogOut className="h-4 w-4" />
              خروج از حساب کاربری
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
