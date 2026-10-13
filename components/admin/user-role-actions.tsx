"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/db/schema";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export function UserRoleActions({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: UserRole;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (currentRole === "super_admin") {
    return <span className="text-xs text-slate-400">—</span>;
  }

  async function handleRoleChange(newRole: "customer" | "admin") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "خطا در تغییر نقش");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-[11px] text-rose-600">{error}</span>}
      {currentRole === "customer" ? (
        <button
          onClick={() => handleRoleChange("admin")}
          disabled={loading}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-medium transition disabled:opacity-50"
        >
          <ArrowUpCircle className="h-3.5 w-3.5 text-amber-600" />
          ارتقا به مدیر (Admin)
        </button>
      ) : (
        <button
          onClick={() => handleRoleChange("customer")}
          disabled={loading}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium transition disabled:opacity-50"
        >
          <ArrowDownCircle className="h-3.5 w-3.5 text-slate-500" />
          تنزل به مشتری (Customer)
        </button>
      )}
    </div>
  );
}
