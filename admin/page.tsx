import Link from "next/link";
import { Users, BookOpen, ClipboardList, Wallet } from "lucide-react";
import { db } from "@/lib/db";
import { StatCard } from "@/components/admin/StatCard";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [teachersCount, bookletsCount, newOrdersCount, revenue, recentOrders] = await Promise.all([
    db.teacher.count({ where: { isActive: true } }),
    db.booklet.count(),
    db.order.count({ where: { status: "NEW" } }),
    db.profitSnapshot.aggregate({ _sum: { libraryShare: true, teacherShare: true } }),
    db.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { booklet: true, teacher: true },
    }),
  ]);

  const totalRevenue =
    Number(revenue._sum.libraryShare ?? 0) + Number(revenue._sum.teacherShare ?? 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">لوحة التحكم</h1>
        <p className="text-sm text-mist">نظرة سريعة على نشاط المكتبة اليوم</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="أساتذة نشطون" value={teachersCount} icon={Users} accent="ink" />
        <StatCard label="ملازم مضافة" value={bookletsCount} icon={BookOpen} accent="ink" />
        <StatCard label="طلبات جديدة" value={newOrdersCount} icon={ClipboardList} accent="marker" />
        <StatCard
          label="إيرادات مكتملة"
          value={`${formatPrice(totalRevenue)} ج.م`}
          icon={Wallet}
          accent="leaf"
        />
      </div>

      <div className="rounded-2xl bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-ink-50 px-5 py-4">
          <h2 className="font-display text-lg font-bold text-charcoal">أحدث الطلبات</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-ink hover:underline">
            عرض كل الطلبات
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-mist">لا توجد طلبات بعد</p>
        ) : (
          <div className="divide-y divide-ink-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-charcoal">
                    {order.booklet.title}
                  </p>
                  <p className="text-xs text-mist">
                    {order.studentName} · أ. {order.teacher.fullName}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
