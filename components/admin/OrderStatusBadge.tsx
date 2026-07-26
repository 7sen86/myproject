import type { OrderStatus } from "@prisma/client";

const styles: Record<OrderStatus, string> = {
  NEW: "bg-ink-50 text-ink",
  PROCESSING: "bg-marker-50 text-marker-dark",
  READY: "bg-leaf/10 text-leaf",
  DELIVERED: "bg-leaf/15 text-leaf",
  CANCELLED: "bg-clay/10 text-clay",
};

const labels: Record<OrderStatus, string> = {
  NEW: "جديد",
  PROCESSING: "جاري التجهيز",
  READY: "جاهز",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export const orderStatusLabels = labels;
