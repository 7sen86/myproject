import { db } from "@/lib/db";
import { requireTeacherId } from "@/lib/teacherSession";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeacherBookletsPage() {
  const teacherId = await requireTeacherId();

  const booklets = await db.booklet.findMany({
    where: { teacherId }, // فلترة صارمة على مستوى الاستعلام، وليس فقط في الواجهة
    include: { subject: true, stage: true },
    orderBy: { createdAt: "desc" },
  });

  const stats = await Promise.all(
    booklets.map(async (booklet) => {
      const [ordersCount, snapshots, lastOrder] = await Promise.all([
        db.order.count({ where: { bookletId: booklet.id } }),
        db.profitSnapshot.findMany({ where: { order: { bookletId: booklet.id } } }),
        db.order.findFirst({
          where: { bookletId: booklet.id },
          orderBy: { createdAt: "desc" },
          select: { createdAt: true },
        }),
      ]);

      const soldCopies = snapshots.length;
      const revenue = snapshots.reduce((s, x) => s + Number(x.teacherShare) + Number(x.libraryShare), 0);
      const myProfit = snapshots.reduce((s, x) => s + Number(x.teacherShare), 0);

      return {
        booklet,
        ordersCount,
        soldCopies,
        revenue,
        myProfit,
        lastOrderDate: lastOrder?.createdAt ?? null,
      };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">ملازمي</h1>
        <p className="text-sm text-mist">أداء كل ملزمة على حدة</p>
      </div>

      {booklets.length === 0 && (
        <p className="rounded-2xl bg-white px-5 py-10 text-center text-sm text-mist shadow-card">
          لا توجد ملازم مرتبطة بك بعد. تواصل مع إدارة المكتبة لإضافتها.
        </p>
      )}

      {/* عرض الجوال: بطاقات */}
      {stats.length > 0 && (
        <div className="grid gap-3 md:hidden">
          {stats.map(({ booklet, ordersCount, soldCopies, revenue, myProfit, lastOrderDate }) => (
            <div key={booklet.id} className="rounded-2xl bg-white p-4 shadow-card">
              <p className="font-display text-base font-bold text-charcoal">{booklet.title}</p>
              <p className="text-xs text-mist">
                {booklet.subject.name} · {booklet.stage.name}
              </p>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-lg bg-ink-50/60 py-2">
                  <p className="text-xs text-mist">طلبات</p>
                  <p className="font-medium text-charcoal">{ordersCount}</p>
                </div>
                <div className="rounded-lg bg-ink-50/60 py-2">
                  <p className="text-xs text-mist">نسخ مباعة</p>
                  <p className="font-medium text-charcoal">{soldCopies}</p>
                </div>
                <div className="rounded-lg bg-leaf/10 py-2">
                  <p className="text-xs text-mist">أرباحي</p>
                  <p className="font-medium text-leaf">{formatPrice(myProfit)}</p>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-mist">
                <span>إجمالي الإيرادات: {formatPrice(revenue)} د.ع</span>
                <span>
                  آخر طلب:{" "}
                  {lastOrderDate
                    ? new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium" }).format(lastOrderDate)
                    : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* عرض الشاشات الكبيرة: جدول */}
      {stats.length > 0 && (
        <div className="hidden overflow-hidden rounded-2xl bg-white shadow-card md:block">
          <table className="w-full text-right text-sm">
            <thead className="bg-ink-50/50 text-mist">
              <tr>
                <th className="px-5 py-3 font-medium">الملزمة</th>
                <th className="px-5 py-3 font-medium">المادة/المرحلة</th>
                <th className="px-5 py-3 font-medium">الطلبات</th>
                <th className="px-5 py-3 font-medium">نسخ مباعة</th>
                <th className="px-5 py-3 font-medium">إجمالي الإيرادات</th>
                <th className="px-5 py-3 font-medium">أرباحي</th>
                <th className="px-5 py-3 font-medium">آخر طلب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {stats.map(({ booklet, ordersCount, soldCopies, revenue, myProfit, lastOrderDate }) => (
                <tr key={booklet.id}>
                  <td className="px-5 py-3 font-medium text-charcoal">{booklet.title}</td>
                  <td className="px-5 py-3 text-mist">
                    {booklet.subject.name} · {booklet.stage.name}
                  </td>
                  <td className="px-5 py-3 text-charcoal">{ordersCount}</td>
                  <td className="px-5 py-3 text-charcoal">{soldCopies}</td>
                  <td className="px-5 py-3 text-charcoal">{formatPrice(revenue)} د.ع</td>
                  <td className="px-5 py-3 font-medium text-leaf">{formatPrice(myProfit)} د.ع</td>
                  <td className="px-5 py-3 text-mist">
                    {lastOrderDate
                      ? new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium" }).format(lastOrderDate)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
