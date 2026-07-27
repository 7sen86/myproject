import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { toggleBookletStatus, deleteBooklet } from "../actions";
import { ConfirmForm } from "@/components/admin/ConfirmForm";

export const dynamic = "force-dynamic";

export default async function BookletsPage() {
  const booklets = await db.booklet.findMany({
    orderBy: { createdAt: "desc" },
    include: { subject: true, stage: true, teacher: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">الملازم</h1>
          <p className="text-sm text-mist">إضافة ملزمة جديدة وربطها بالأستاذ المسؤول</p>
        </div>
        <Link
          href="/admin/booklets/new"
          className="flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-light"
        >
          <Plus className="h-4 w-4" /> إضافة ملزمة
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <table className="w-full text-right text-sm">
          <thead className="bg-ink-50/50 text-mist">
            <tr>
              <th className="px-5 py-3 font-medium">الملزمة</th>
              <th className="px-5 py-3 font-medium">الأستاذ</th>
              <th className="px-5 py-3 font-medium">المادة/المرحلة</th>
              <th className="px-5 py-3 font-medium">السعر</th>
              <th className="px-5 py-3 font-medium">المبيعات</th>
              <th className="px-5 py-3 font-medium">الحالة</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {booklets.map((b) => (
              <tr key={b.id}>
                <td className="px-5 py-3 font-medium text-charcoal">{b.title}</td>
                <td className="px-5 py-3 text-mist">{b.teacher.fullName}</td>
                <td className="px-5 py-3 text-mist">
                  {b.subject.name} · {b.stage.name}
                </td>
                <td className="px-5 py-3 text-charcoal">{formatPrice(b.price)} د.ع</td>
                <td className="px-5 py-3 text-charcoal">{b.salesCount}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      b.status === "VISIBLE" ? "bg-leaf/10 text-leaf" : "bg-clay/10 text-clay"
                    }`}
                  >
                    {b.status === "VISIBLE" ? "متاحة" : "مخفية"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/booklets/${b.id}`}
                      className="text-xs font-medium text-ink hover:underline"
                    >
                      تعديل
                    </Link>
                    <form action={toggleBookletStatus}>
                      <input type="hidden" name="id" value={b.id} />
                      <input
                        type="hidden"
                        name="nextStatus"
                        value={b.status === "VISIBLE" ? "HIDDEN" : "VISIBLE"}
                      />
                      <button className="text-xs font-medium text-mist hover:underline">
                        {b.status === "VISIBLE" ? "إخفاء" : "إظهار"}
                      </button>
                    </form>
                    <ConfirmForm
                      action={deleteBooklet}
                      confirmMessage={`حذف الملزمة "${b.title}"؟`}
                    >
                      <input type="hidden" name="id" value={b.id} />
                      <button className="text-xs font-medium text-clay hover:underline">
                        حذف
                      </button>
                    </ConfirmForm>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {booklets.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-mist">لا توجد ملازم بعد</p>
        )}
      </div>
    </div>
  );
}
