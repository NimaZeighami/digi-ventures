"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Send } from "lucide-react";

export function InternalNotesForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/requests/${requestId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "خطا در ثبت یادداشت");

      setNote("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      <textarea
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="یادداشت محرمانه ارزیاب یا اعضای کمیته (فقط برای تیم سرمایه‌گذاری قابل مشاهده است)..."
        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || note.trim().length < 2}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          {loading ? "در حال ثبت..." : "ثبت یادداشت محرمانه"}
        </button>
      </div>
    </form>
  );
}
