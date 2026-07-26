"use client";

import { AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-clay/20 bg-clay/5 px-6 py-14 text-center">
      <AlertTriangle className="h-8 w-8 text-clay" strokeWidth={1.5} />
      <h2 className="font-display text-lg font-bold text-charcoal">حدث خطأ</h2>
      <p className="max-w-md text-sm text-charcoal/80">{error.message || "حدث خطأ غير متوقع"}</p>
      <button
        onClick={reset}
        className="mt-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-light"
      >
        حاول مرة أخرى
      </button>
    </div>
  );
}
