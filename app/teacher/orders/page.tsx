import { db } from "@/lib/db";
import { requireTeacherId } from "@/lib/teacherSession";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

export const dynamic = "force-dynamic";

export default async function TeacherOrdersPage() {
  const teacherId = await requireTeacherId();

  const orders = await db.order.findMany({
    where: { teacherId }, // لا يرى الأستاذ إطلاقًا أي طلب خارج هذا الفلتر
    include: { booklet: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">طلباتي</h1>
        <p className="text-sm text-mist">الطلبات الواردة على ملازمك فقط</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
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
                  {new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(
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

        {orders.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-mist">لا توجد طلبات بعد</p>
        )}
      </div>
    </div>
  );
}
