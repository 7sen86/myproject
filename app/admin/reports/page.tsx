import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { StatCard } from "@/components/admin/StatCard";
import { SimpleBarChart } from "@/components/admin/SimpleBarChart";
import { Wallet, Users, TrendingUp, Package } from "lucide-react";

export const dynamic = "force-dynamic";

type Range = "today" | "week" | "month" | "year" | "all";

const rangeLabels: Record<Range, string> = {
  today: "اليوم",
  week: "آخر 7 أيام",
  month: "هذا الشهر",
  year: "هذه السنة",
  all: "كل الفترات",
};

function getStartDate(range: Range): Date | null {
  const now = new Date();
  switch (range) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "week": {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d;
    }
    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "year":
      return new Date(now.getFullYear(), 0, 1);
    case "all":
    default:
      return null;
  }
}

const arabicMonths = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { range?: string };
}) {
  const range: Range = (["today", "week", "month", "year", "all"] as Range[]).includes(
    searchParams.range as Range
  )
    ? (searchParams.range as Range)
    : "month";

  // بداية الفترة المختارة. لو الفلتر "كل الفترات" نستخدم تاريخ قديم جدًا
  // بدل قيمة فارغة (null)، عشان يبقى الاستعلام موحّدًا وبسيطًا.
  const effectiveStart = getStartDate(range) ?? new Date(0);
  const yearStart = new Date(new Date().getFullYear(), 0, 1);

  // كل الحساب هنا يتم داخل قاعدة البيانات (SUM/GROUP BY) بدل سحب كل الصفوف
  // للذاكرة وجمعها بالجافاسكربت — هذا يخلي صفحة التقارير سريعة حتى لو
  // تراكمت عشرات آلاف الطلبات المكتملة عبر السنين.
  const [totalsRows, teacherRowsRaw, monthlyRows] = await Promise.all([
    db.$queryRaw<{ sold_copies: bigint; teacher_share: number; library_share: number }[]>`
      SELECT COUNT(*)::bigint as sold_copies,
             COALESCE(SUM(ps."teacherShare"), 0)::float as teacher_share,
             COALESCE(SUM(ps."libraryShare"), 0)::float as library_share
      FROM profit_snapshots ps
      JOIN orders o ON o.id = ps."orderId"
      WHERE o."createdAt" >= ${effectiveStart}
    `,
    db.$queryRaw<
      { teacher_id: string; name: string; sold_copies: bigint; teacher_share: number; library_share: number }[]
    >`
      SELECT o."teacherId" as teacher_id, t."fullName" as name,
             COUNT(*)::bigint as sold_copies,
             COALESCE(SUM(ps."teacherShare"), 0)::float as teacher_share,
             COALESCE(SUM(ps."libraryShare"), 0)::float as library_share
      FROM profit_snapshots ps
      JOIN orders o ON o.id = ps."orderId"
      JOIN teachers t ON t.id = o."teacherId"
      WHERE o."createdAt" >= ${effectiveStart}
      GROUP BY o."teacherId", t."fullName"
      ORDER BY (COALESCE(SUM(ps."teacherShare"), 0) + COALESCE(SUM(ps."libraryShare"), 0)) DESC
    `,
    db.$queryRaw<{ month: number; total: number }[]>`
      SELECT EXTRACT(MONTH FROM o."createdAt")::int as month,
             COALESCE(SUM(ps."teacherShare"), 0)::float as total
      FROM profit_snapshots ps
      JOIN orders o ON o.id = ps."orderId"
      WHERE o."createdAt" >= ${yearStart}
      GROUP BY month
      ORDER BY month
    `,
  ]);

  const totals = totalsRows[0];
  const soldCopies = Number(totals?.sold_copies ?? 0);
  const totalTeacherShare = totals?.teacher_share ?? 0;
  const totalLibraryShare = totals?.library_share ?? 0;
  const totalRevenue = totalTeacherShare + totalLibraryShare;

  const teacherRows = teacherRowsRaw.map((r) => ({
    name: r.name,
    soldCopies: Number(r.sold_copies),
    revenue: r.teacher_share + r.library_share,
    teacherShare: r.teacher_share,
    libraryShare: r.library_share,
  }));

  const monthlyTotals = Array(12).fill(0);
  for (const row of monthlyRows) {
    monthlyTotals[row.month - 1] = row.total;
  }
  const monthlyChartData = arabicMonths.map((label, i) => ({
    label: label.slice(0, 3),
    value: Math.round(monthlyTotals[i]),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">التقارير</h1>
        <p className="text-sm text-mist">الأرقام هنا تعتمد فقط على الطلبات المؤكد تسليمها</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(rangeLabels) as Range[]).map((r) => (
          <a
            key={r}
            href={`/admin/reports?range=${r}`}
            className={`rounded-full px-3.5 py-1.5 text-sm ${
              range === r ? "bg-ink text-white" : "border border-ink/10 bg-white text-charcoal"
            }`}
          >
            {rangeLabels[r]}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="إجمالي الإيرادات"
          value={`${formatPrice(totalRevenue)} د.ع`}
          icon={Wallet}
          accent="leaf"
        />
        <StatCard
          label="حصة المكتبة"
          value={`${formatPrice(totalLibraryShare)} د.ع`}
          icon={Package}
          accent="ink"
        />
        <StatCard
          label="حصص الأساتذة"
          value={`${formatPrice(totalTeacherShare)} د.ع`}
          icon={Users}
          accent="marker"
        />
        <StatCard label="نسخ مباعة" value={soldCopies} icon={TrendingUp} accent="ink" />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-card">
        <h2 className="font-display text-lg font-bold text-charcoal">
          حصص الأساتذة شهريًا ({new Date().getFullYear()})
        </h2>
        <div className="mt-4">
          <SimpleBarChart data={monthlyChartData} />
        </div>
      </div>

      {teacherRows.length === 0 && (
        <p className="rounded-2xl bg-white px-5 py-10 text-center text-sm text-mist shadow-card">
          لا توجد مبيعات مؤكدة في هذه الفترة
        </p>
      )}

      {/* عرض الجوال: بطاقات */}
      {teacherRows.length > 0 && (
        <div className="grid gap-3 md:hidden">
          <h2 className="font-display text-lg font-bold text-charcoal">
            الأداء حسب الأستاذ — {rangeLabels[range]}
          </h2>
          {teacherRows.map((row) => (
            <div key={row.name} className="rounded-2xl bg-white p-4 shadow-card">
              <div className="flex items-center justify-between">
                <p className="font-display text-base font-bold text-charcoal">{row.name}</p>
                <span className="text-sm text-mist">{row.soldCopies} نسخة</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-lg bg-ink-50/60 py-2">
                  <p className="text-xs text-mist">الإيرادات</p>
                  <p className="font-medium text-charcoal">{formatPrice(row.revenue)}</p>
                </div>
                <div className="rounded-lg bg-leaf/10 py-2">
                  <p className="text-xs text-mist">حصته</p>
                  <p className="font-medium text-leaf">{formatPrice(row.teacherShare)}</p>
                </div>
                <div className="rounded-lg bg-ink-50 py-2">
                  <p className="text-xs text-mist">حصة المكتبة</p>
                  <p className="font-medium text-ink">{formatPrice(row.libraryShare)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* عرض الشاشات الكبيرة: جدول */}
      {teacherRows.length > 0 && (
        <div className="hidden overflow-hidden rounded-2xl bg-white shadow-card md:block">
          <div className="border-b border-ink-50 px-5 py-4">
            <h2 className="font-display text-lg font-bold text-charcoal">
              الأداء حسب الأستاذ — {rangeLabels[range]}
            </h2>
          </div>
          <table className="w-full text-right text-sm">
            <thead className="bg-ink-50/50 text-mist">
              <tr>
                <th className="px-5 py-3 font-medium">الأستاذ</th>
                <th className="px-5 py-3 font-medium">نسخ مباعة</th>
                <th className="px-5 py-3 font-medium">إجمالي الإيرادات</th>
                <th className="px-5 py-3 font-medium">حصته</th>
                <th className="px-5 py-3 font-medium">حصة المكتبة منه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {teacherRows.map((row) => (
                <tr key={row.name}>
                  <td className="px-5 py-3 font-medium text-charcoal">{row.name}</td>
                  <td className="px-5 py-3 text-charcoal">{row.soldCopies}</td>
                  <td className="px-5 py-3 text-charcoal">{formatPrice(row.revenue)} د.ع</td>
                  <td className="px-5 py-3 font-medium text-leaf">
                    {formatPrice(row.teacherShare)} د.ع
                  </td>
                  <td className="px-5 py-3 text-ink">{formatPrice(row.libraryShare)} د.ع</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
