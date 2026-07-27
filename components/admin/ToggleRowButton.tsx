"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

/**
 * زر تبديل حالة موحّد (تفعيل/تعطيل أستاذ، إظهار/إخفاء ملزمة...).
 * يستدعي server action مباشرة ويعرض Toast بدل ما يعتمد على إعادة تحميل الصفحة بصمت.
 */
export function ToggleRowButton({
  action,
  id,
  extraFields,
  label,
  successMessage,
  className,
}: {
  action: (formData: FormData) => Promise<void> | void;
  id: string;
  extraFields: Record<string, string>;
  label: string;
  successMessage: string;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  function handleClick() {
    const formData = new FormData();
    formData.set("id", id);
    for (const [key, value] of Object.entries(extraFields)) {
      formData.set(key, value);
    }

    startTransition(async () => {
      try {
        await action(formData);
        showToast("success", successMessage);
        router.refresh();
      } catch (err) {
        showToast("error", err instanceof Error ? err.message : "حدث خطأ، حاول مرة أخرى");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={className ?? "text-xs font-medium text-mist hover:underline disabled:opacity-50"}
    >
      {label}
    </button>
  );
}
