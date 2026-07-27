"use client";

import { useTransition } from "react";
import type { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/app/admin/actions";
import { useToast } from "@/components/Toast";
import { orderStatusLabels } from "./OrderStatusBadge";

const statuses: OrderStatus[] = ["NEW", "PROCESSING", "READY", "DELIVERED", "CANCELLED"];

export function OrderStatusSelect({ orderId, current }: { orderId: string; current: OrderStatus }) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextStatus = e.target.value as OrderStatus;
    const formData = new FormData();
    formData.set("id", orderId);
    formData.set("nextStatus", nextStatus);
    startTransition(async () => {
      try {
        await updateOrderStatus(formData);
        showToast("success", `تم تحديث حالة الطلب إلى "${orderStatusLabels[nextStatus]}"`);
      } catch (err) {
        showToast("error", err instanceof Error ? err.message : "تعذّر تحديث الحالة");
      }
    });
  }

  return (
    <select
      defaultValue={current}
      onChange={handleChange}
      disabled={isPending}
      className="w-full rounded-lg border border-ink/10 bg-white px-2.5 py-2 text-sm text-charcoal disabled:opacity-50 sm:w-auto sm:py-1.5"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {orderStatusLabels[s]}
        </option>
      ))}
    </select>
  );
}
