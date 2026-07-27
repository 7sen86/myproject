"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { ConfirmDialog } from "./ConfirmDialog";

/**
 * زر حذف موحّد لكل جداول لوحة الإدارة:
 * - يفتح نافذة تأكيد حقيقية بدل window.confirm.
 * - يستدعي server action مباشرة عبر useTransition (نفس أسلوب OrderStatusSelect).
 * - يعرض Toast نجاح/فشل، ويلتقط رسالة الخطأ القادمة من الـ action نفسه.
 */
export function DeleteRowButton({
  action,
  id,
  itemLabel,
  confirmTitle = "تأكيد الحذف",
  successMessage = "تم الحذف بنجاح",
  iconOnly = false,
}: {
  action: (formData: FormData) => Promise<void> | void;
  id: string;
  itemLabel: string;
  confirmTitle?: string;
  successMessage?: string;
  iconOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  function handleConfirm() {
    const formData = new FormData();
    formData.set("id", id);

    startTransition(async () => {
      try {
        await action(formData);
        setOpen(false);
        showToast("success", successMessage);
        router.refresh();
      } catch (err) {
        setOpen(false);
        showToast("error", err instanceof Error ? err.message : "حدث خطأ، حاول مرة أخرى");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          iconOnly
            ? "flex h-9 w-9 items-center justify-center rounded-lg text-clay transition hover:bg-clay/10"
            : "text-xs font-medium text-clay hover:underline"
        }
        aria-label={`حذف ${itemLabel}`}
      >
        {iconOnly ? <Trash2 className="h-4 w-4" /> : "حذف"}
      </button>

      <ConfirmDialog
        open={open}
        title={confirmTitle}
        message={`هل أنت متأكد من حذف "${itemLabel}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="نعم، احذف"
        loading={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
