import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { toggleTeacherActive, deleteTeacher } from "../actions";
import { ConfirmForm } from "@/components/admin/ConfirmForm";

export const dynamic = "force-dynamic";

export default async function TeachersPage() {
  const teachers = await db.teacher.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, _count: { select: { booklets: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">الأساتذة</h1>
          <p className="text-sm text-mist">إنشاء حسابات الأساتذة وإدارة نسب أرباحهم</p>
        </div>
        <Link
          href="/admin/teachers/new"
          className="flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-light"
        >
          <Plus className="h-4 w-4" /> إضافة أستاذ
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <table className="w-full text-right text-sm">
          <thead className="bg-ink-50/50 text-mist">
            <tr>
              <th className="px-5 py-3 font-medium">الاسم</th>
              <th className="px-5 py-3 font-medium">اسم المستخدم</th>
              <th className="px-5 py-3 font-medium">الهاتف</th>
              <th className="px-5 py-3 font-medium">نسبة الربح</th>
              <th className="px-5 py-3 font-medium">الملازم</th>
              <th className="px-5 py-3 font-medium">الحالة</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {teachers.map((t) => (
              <tr key={t.id}>
                <td className="px-5 py-3 font-medium text-charcoal">{t.fullName}</td>
                <td className="px-5 py-3 text-mist" dir="ltr">
                  {t.user.username}
                </td>
                <td className="px-5 py-3 text-mist" dir="ltr">
                  {t.phone}
                </td>
                <td className="px-5 py-3 text-charcoal">{Number(t.profitPercentage)}%</td>
                <td className="px-5 py-3 text-charcoal">{t._count.booklets}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      t.isActive ? "bg-leaf/10 text-leaf" : "bg-clay/10 text-clay"
                    }`}
                  >
                    {t.isActive ? "مفعّل" : "معطّل"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/teachers/${t.id}`}
                      className="text-xs font-medium text-ink hover:underline"
                    >
                      تعديل
                    </Link>
                    <form action={toggleTeacherActive}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="nextActive" value={(!t.isActive).toString()} />
                      <button className="text-xs font-medium text-mist hover:underline">
                        {t.isActive ? "تعطيل" : "تفعيل"}
                      </button>
                    </form>
                    <ConfirmForm
                      action={deleteTeacher}
                      confirmMessage={`حذف الأستاذ "${t.fullName}"؟ لا يمكن التراجع.`}
                    >
                      <input type="hidden" name="id" value={t.id} />
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

        {teachers.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-mist">لا يوجد أساتذة بعد</p>
        )}
      </div>
    </div>
  );
}
