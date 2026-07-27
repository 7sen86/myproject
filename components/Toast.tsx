"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

type ToastKind = "success" | "error";
type ToastItem = { id: number; kind: ToastKind; message: string };

type ToastContextValue = {
  showToast: (kind: ToastKind, message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * نظام إشعارات خفيف (Toast) بدون أي مكتبة خارجية.
 * استخدمه عبر useToast() من أي Client Component لعرض رسالة نجاح/فشل
 * بعد تنفيذ إجراء (حذف، تعديل، تفعيل...).
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((kind: ToastKind, message: string) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, kind, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* الحاوية: أسفل الشاشة على الجوال (أسهل بالإبهام)، أعلى-يسار على الشاشات الكبيرة */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:bottom-auto sm:left-4 sm:top-4 sm:items-start">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`rise-in pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-2xl px-4 py-3 text-sm font-medium shadow-card sm:w-96 ${
              t.kind === "success" ? "bg-leaf text-white" : "bg-clay text-white"
            }`}
          >
            {t.kind === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0" />
            ) : (
              <XCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
            )}
            <span className="min-w-0 flex-1 break-words">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="إغلاق"
              className="shrink-0 rounded-lg p-0.5 hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
