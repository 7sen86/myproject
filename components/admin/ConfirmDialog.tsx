"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

/**
 * نافذة تأكيد متجاوبة تستبدل window.confirm():
 * - على الجوال: تظهر كـ Bottom Sheet (أسهل بالإبهام، لا تتجاوز الشاشة أبدًا).
 * - على الشاشات الأكبر: نافذة متوسّطة الحجم في منتصف الشاشة.
 * - تُغلق بالنقر على الخلفية أو زر الإلغاء أو مفتاح Escape.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "تأكيد الحذف",
  cancelLabel = "إلغاء",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="fixed inset-0 bg-charcoal/40 backdrop-blur-[1px]"
        onClick={loading ? undefined : onCancel}
      />

      <div className="relative w-full max-w-sm rounded-t-3xl bg-white p-5 shadow-card sm:rounded-3xl sm:p-6">
        {/* مقبض صغير يوحي بأنها Sheet قابلة للسحب على الجوال */}
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-ink-50 sm:hidden" />

        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              danger ? "bg-clay/10 text-clay" : "bg-marker-50 text-marker-dark"
            }`}
          >
            <AlertTriangle className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <h3 className="font-display text-base font-bold text-charcoal">{title}</h3>
            <p className="mt-1 text-sm text-mist">{message}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full rounded-xl border border-ink/10 px-4 py-3 text-sm font-semibold text-charcoal transition hover:bg-ink-50 disabled:opacity-50 sm:w-auto sm:py-2.5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-60 sm:w-auto sm:py-2.5 ${
              danger ? "bg-clay hover:bg-clay/90" : "bg-ink hover:bg-ink-light"
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
