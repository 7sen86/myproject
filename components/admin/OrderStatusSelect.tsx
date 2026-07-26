"use client";

import { useTransition } from "react";
import type { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/app/admin/actions";
import { orderStatusLabels } from "./OrderStatusBadge";

const statuses: OrderStatus[] = ["NEW", "PROCESSING", "READY", "DELIVERED", "CANCELLED"];

export function OrderStatusSelect({ orderId, current }: { orderId: string; current: OrderStatus }) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const formData = new FormData();
    formData.set("id", orderId);
    formData.set("nextStatus", e.target.value);
    startTransition(() => {
      updateOrderStatus(formData);
    });
  }

  return (
    <select
      defaultValue={current}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-sm text-charcoal disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {orderStatusLabels[s]}
        </option>
      ))}
    </select>
  );
}
