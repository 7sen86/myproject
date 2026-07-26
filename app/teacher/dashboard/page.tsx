import Link from "next/link";
import { BookOpen, ClipboardList, Wallet, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import { requireTeacherId } from "@/lib/teacherSession";
import { formatPrice } from "@/lib/utils";
import { StatCard } from "@/components/admin/StatCard";
import { SimpleBarChart } from "@/components/admin/SimpleBarChart";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

export const dynamic = "force-dynamic";

const arabicMonths = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export default async function TeacherDashboardPage() {
  // teacherId يأتي حصريًا من الجلسة الموقّعة، وكل استعلام أدناه مفلتر به
  const teacherId = await requireTeacherId();

  const [bookletsCount, ordersCount, profitSnapshots, lastOrder] = await Promise.all([
    db.booklet.count({ where: { teacherId } }),
    db.order.count({ where: { teacherId } }),
    db.profitSnapshot.findMany({
      where: { order: { teacherId } },
      include: { order: true },
    }),
    db.order.findFirst({
      where: { teacherId },
      orderBy: { createdAt: "desc" },
      include: { booklet: true },
    }),
  ]);

  const totalProfit = profitSnapshots.reduce((sum, s) => sum + Number(s.teacherShare), 0);
  const soldCopies = profitSnapshots.length; // نسخ مباعة فعليًا = طلبات وصلت لحالة "تم التسليم"

  const currentYear = new Date().getFullYear();
  const monthlyTotals = Array(12).fill(0);
  const yearlyTotals: Record<number, number> = {};

  for (const snapshot of profitSnapshots) {
    const date = snapshot.order.createdAt;
    const year = date.getFullYear();
    yearlyTotals[year] = (yearlyTotals[year] ?? 0) + Number(snapshot.teacherShare);
    if (year === currentYear) {
      monthlyTotals[date.getMonth()] += Number(snapshot.teacherShare);
    }
  }

  const monthlyChartData = arabicMonths.map((label, i) => ({
    label: label.slice(0, 3),
    value: Math.round(monthlyTotals[i]),
  }));

  const yearlyEntries = Object.entries(yearlyTotals).sort((a, b) => Number(b[0]) - Number(a[0]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">لوحتي</h1>
        <p className="text-sm text-mist">إحصائيات ملازمك وأرباحك فقط</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="ملازمي" value={bookletsCount} icon={BookOpen} accent="ink" />
        <StatCard label="إجمالي الطلبات" value={ordersCount} icon={ClipboardList} accent="ink" />
        <StatCard label="نسخ مباعة" value={soldCopies} icon={TrendingUp} accent="marker" />
        <StatCard
          label="أرباحي الحالية"
          value={`${formatPrice(totalProfit)} ج.م`}
          icon={Wallet}
          accent="leaf"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-card lg:col-span-2">
          <h2 className="font-display text-lg font-bold text-charcoal">
            أرباحي الشهرية ({currentYear})
          </h2>
          <div className="mt-4">
            <SimpleBarChart data={monthlyChartData} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card">
          <h2 className="font-display text-lg font-bold text-charcoal">إحصائيات سنوية</h2>
          <ul className="mt-3 space-y-2">
            {yearlyEntries.length === 0 && (
              <li className="text-sm text-mist">لا توجد أرباح مسجّلة بعد</li>
            )}
            {yearlyEntries.map(([year, total]) => (
              <li key={year} className="flex items-center justify-between text-sm">
                <span className="text-charcoal">{year}</span>
                <span className="font-medium text-ink">{formatPrice(total)} ج.م</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-charcoal">آخر طلب</h2>
          <Link href="/teacher/orders" className="text-sm font-medium text-ink hover:underline">
            كل طلباتي
          </Link>
        </div>

        {lastOrder ? (
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal">{lastOrder.booklet.title}</p>
              <p className="text-xs text-mist">
                {lastOrder.studentName} ·{" "}
                {new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(
                  lastOrder.createdAt
                )}
              </p>
            </div>
            <OrderStatusBadge status={lastOrder.status} />
          </div>
        ) : (
          <p className="mt-3 text-sm text-mist">لا توجد طلبات على ملازمك بعد</p>
        )}
      </div>
    </div>
  );
}
