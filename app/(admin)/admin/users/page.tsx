import { redirect } from "next/navigation";
import { getSessionUser } from "@/modules/auth/guard";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatPersianDate } from "@/lib/utils";
import { UserRoleActions } from "@/components/admin/user-role-actions";
import { Users, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const user = (await getSessionUser())!;
  if (user.role !== "super_admin") {
    redirect("/admin/requests");
  }

  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-amber-500" />
            مدیریت دسترسی‌ها و کاربران
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            تعیین و تغییر نقش‌های دسترسی تیم سرمایه‌گذاری و متقاضیان (مختص مدیر ارشد)
          </p>
        </div>
        <div className="text-xs bg-white px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 shadow-sm">
          کاربران فعال: <span className="font-bold text-slate-900">{allUsers.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 text-xs text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-semibold">ایمیل کاربر</th>
                <th className="py-3.5 px-4 font-semibold">نقش فعلی</th>
                <th className="py-3.5 px-4 font-semibold">تاریخ عضویت</th>
                <th className="py-3.5 px-4 font-semibold">مدیریت نقش</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allUsers.map((u) => {
                const isSuperAdmin = u.role === "super_admin";
                const isAdmin = u.role === "admin";
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-medium text-slate-900">{u.email}</td>
                    <td className="py-3.5 px-4">
                      {isSuperAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-green/10 text-brand-green border border-brand-green/20">
                          <ShieldCheck className="h-3 w-3" />
                          مدیر ارشد (Super Admin)
                        </span>
                      ) : isAdmin ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          مدیر (Admin)
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          مشتری (Customer)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {formatPersianDate(u.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <UserRoleActions userId={u.id} currentRole={u.role} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
