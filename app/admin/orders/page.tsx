import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import type { OrderStatus, Prisma } from "@prisma/client";
import { orderStatusLabels } from "@/components/admin/OrderStatusBadge";

export const dynamic = "force-dynamic";

const statusFilters: OrderStatus[] = ["NEW", "PROCESSING", "READY", "DELIVERED", "CANCELLED"];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const statusFilter = searchParams.status as OrderStatus | undefined;

  const where: Prisma.OrderWhereInput = statusFilter ? { status: statusFilter } : {};

  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { booklet: true, teacher: true },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">الطلبات</h1>
        <p className="text-sm text-mist">غيّر الحالة مباشرة من القائمة المنسدلة أمام كل طلب</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href="/admin/orders"
          className={`rounded-full px-3.5 py-1.5 text-sm ${
            !statusFilter ? "bg-ink text-white" : "border border-ink/10 bg-white text-charcoal"
          }`}
        >
          الكل
        </a>
        {statusFilters.map((s) => (
          <a
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`rounded-full px-3.5 py-1.5 text-sm ${
              statusFilter === s ? "bg-ink text-white" : "border border-ink/10 bg-white text-charcoal"
            }`}
          >
            {orderStatusLabels[s]}
          </a>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <table className="w-full text-right text-sm">
          <thead className="bg-ink-50/50 text-mist">
            <tr>
              <th className="px-5 py-3 font-medium">الطالب</th>
              <th className="px-5 py-3 font-medium">الهاتف</th>
              <th className="px-5 py-3 font-medium">الملزمة</th>
              <th className="px-5 py-3 font-medium">الأستاذ</th>
              <th className="px-5 py-3 font-medium">السعر</th>
              <th className="px-5 py-3 font-medium">التاريخ</th>
              <th className="px-5 py-3 font-medium">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-5 py-3 font-medium text-charcoal">{order.studentName}</td>
                <td className="px-5 py-3 text-mist" dir="ltr">
                  {order.studentPhone}
                </td>
                <td className="px-5 py-3 text-charcoal">{order.booklet.title}</td>
                <td className="px-5 py-3 text-mist">{order.teacher.fullName}</td>
                <td className="px-5 py-3 text-charcoal">{formatPrice(order.priceAtOrder)} د.ع</td>
                <td className="px-5 py-3 text-mist">
                  {new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium" }).format(
                    order.createdAt
                  )}
                </td>
                <td className="px-5 py-3">
                  <OrderStatusSelect orderId={order.id} current={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-mist">لا توجد طلبات مطابقة</p>
        )}
      </div>
    </div>
  );
}
