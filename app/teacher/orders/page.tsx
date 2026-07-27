import { db } from "@/lib/db";
import { requireTeacherId } from "@/lib/teacherSession";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Pagination } from "@/components/admin/Pagination";
import { PAGE_SIZE_ADMIN, parsePage, totalPagesOf } from "@/lib/pagination";
import { Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeacherOrdersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const teacherId = await requireTeacherId();
  const page = parsePage(searchParams.page);

  const [totalOrders, orders] = await Promise.all([
    db.order.count({ where: { teacherId } }),
    db.order.findMany({
      where: { teacherId }, // لا يرى الأستاذ إطلاقًا أي طلب خارج هذا الفلتر
      include: { booklet: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE_ADMIN,
      take: PAGE_SIZE_ADMIN,
    }),
  ]);

  const totalPages = totalPagesOf(totalOrders, PAGE_SIZE_ADMIN);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">طلباتي</h1>
        <p className="text-sm text-mist">الطلبات الواردة على ملازمك فقط</p>
      </div>

      {orders.length === 0 && (
        <p className="rounded-2xl bg-white px-5 py-10 text-center text-sm text-mist shadow-card">
          لا توجد طلبات بعد
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
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-ink-50/60 px-3 py-2 text-sm">
                <span className="truncate font-medium text-charcoal">{order.booklet.title}</span>
                <span className="shrink-0 text-xs text-mist">
                  {new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium" }).format(
                    order.createdAt
                  )}
                </span>
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
                  <td className="px-5 py-3 text-mist">
                    {new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium" }).format(
                      order.createdAt
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        basePath="/teacher/orders"
        currentPage={page}
        totalPages={totalPages}
        searchParams={{}}
      />
    </div>
  );
}
