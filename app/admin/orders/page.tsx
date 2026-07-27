import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import type { OrderStatus, Prisma } from "@prisma/client";
import { orderStatusLabels } from "@/components/admin/OrderStatusBadge";
import { Phone } from "lucide-react";
import { Pagination } from "@/components/admin/Pagination";
import { PAGE_SIZE_ADMIN, parsePage, totalPagesOf } from "@/lib/pagination";

export const dynamic = "force-dynamic";

const statusFilters: OrderStatus[] = ["NEW", "PROCESSING", "READY", "DELIVERED", "CANCELLED"];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const statusFilter = searchParams.status as OrderStatus | undefined;
  const page = parsePage(searchParams.page);

  const where: Prisma.OrderWhereInput = statusFilter ? { status: statusFilter } : {};

  // نجيب العدد الكلي والصفحة المطلوبة فقط، بدل تحميل كل الطلبات دفعة وحدة —
  // هذا يضمن أن الصفحة تبقى سريعة مهما تراكمت الطلبات مستقبلًا
  const [totalOrders, orders] = await Promise.all([
    db.order.count({ where }),
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { booklet: true, teacher: true },
      skip: (page - 1) * PAGE_SIZE_ADMIN,
      take: PAGE_SIZE_ADMIN,
    }),
  ]);

  const totalPages = totalPagesOf(totalOrders, PAGE_SIZE_ADMIN);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">الطلبات</h1>
        <p className="text-sm text-mist">غيّر الحالة مباشرة من القائمة المنسدلة أمام كل طلب</p>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <a
          href="/admin/orders"
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm ${
            !statusFilter ? "bg-ink text-white" : "border border-ink/10 bg-white text-charcoal"
          }`}
        >
          الكل
        </a>
        {statusFilters.map((s) => (
          <a
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm ${
              statusFilter === s ? "bg-ink text-white" : "border border-ink/10 bg-white text-charcoal"
            }`}
          >
            {orderStatusLabels[s]}
          </a>
        ))}
      </div>

      {orders.length === 0 && (
        <p className="rounded-2xl bg-white px-5 py-10 text-center text-sm text-mist shadow-card">
          لا توجد طلبات مطابقة
        </p>
      )}

      {/* عرض الجوال: بطاقات */}
      {orders.length > 0 && (
        <div className="grid gap-3 md:hidden">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl bg-white p-4 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-bold text-charcoal">
                    {order.studentName}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-mist" dir="ltr">
                    <Phone className="h-3.5 w-3.5" /> {order.studentPhone}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-mist">
                  {new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium" }).format(
                    order.createdAt
                  )}
                </span>
              </div>

              <div className="mt-3 rounded-xl bg-ink-50/60 px-3 py-2 text-sm">
                <p className="truncate font-medium text-charcoal">{order.booklet.title}</p>
                <p className="truncate text-xs text-mist">أ. {order.teacher.fullName}</p>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="font-display text-base font-bold text-ink">
                  {formatPrice(order.priceAtOrder)} د.ع
                </span>
                <OrderStatusSelect orderId={order.id} current={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* عرض الشاشات الكبيرة: جدول */}
      {orders.length > 0 && (
        <div className="hidden overflow-hidden rounded-2xl bg-white shadow-card md:block">
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
        </div>
      )}

      <Pagination
        basePath="/admin/orders"
        currentPage={page}
        totalPages={totalPages}
        searchParams={{ status: statusFilter }}
      />
    </div>
  );
}
