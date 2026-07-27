import Link from "next/link";
import { Plus, Phone, BookOpen as BookletsIcon } from "lucide-react";
import { db } from "@/lib/db";
import { toggleTeacherActive, deleteTeacher } from "../actions";
import { DeleteRowButton } from "@/components/admin/DeleteRowButton";
import { ToggleRowButton } from "@/components/admin/ToggleRowButton";

export const dynamic = "force-dynamic";

export default async function TeachersPage() {
  const teachers = await db.teacher.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, _count: { select: { booklets: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">الأساتذة</h1>
          <p className="text-sm text-mist">إنشاء حسابات الأساتذة وإدارة نسب أرباحهم</p>
        </div>
        <Link
          href="/admin/teachers/new"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-ink-light sm:py-2.5"
        >
          <Plus className="h-4 w-4" /> إضافة أستاذ
        </Link>
      </div>

      {teachers.length === 0 && (
        <p className="rounded-2xl bg-white px-5 py-10 text-center text-sm text-mist shadow-card">
          لا يوجد أساتذة بعد
        </p>
      )}

      {/* عرض الجوال: بطاقات — لا حاجة لتكبير الشاشة أو Scroll أفقي */}
      {teachers.length > 0 && (
        <div className="grid gap-3 md:hidden">
          {teachers.map((t) => (
            <div key={t.id} className="rounded-2xl bg-white p-4 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-bold text-charcoal">
                    {t.fullName}
                  </p>
                  <p className="text-xs text-mist" dir="ltr">
                    {t.user.username}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    t.isActive ? "bg-leaf/10 text-leaf" : "bg-clay/10 text-clay"
                  }`}
                >
                  {t.isActive ? "مفعّل" : "معطّل"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-mist">
                <span className="flex items-center gap-1.5" dir="ltr">
                  <Phone className="h-3.5 w-3.5" /> {t.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookletsIcon className="h-3.5 w-3.5" /> {t._count.booklets} ملزمة
                </span>
                <span className="font-medium text-charcoal">
                  نسبته {Number(t.profitPercentage)}%
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-ink-50 pt-3">
                <Link
                  href={`/admin/teachers/${t.id}`}
                  className="flex-1 rounded-lg bg-ink-50 py-2.5 text-center text-sm font-medium text-ink"
                >
                  تعديل
                </Link>
                <ToggleRowButton
                  action={toggleTeacherActive}
                  id={t.id}
                  extraFields={{ nextActive: (!t.isActive).toString() }}
                  label={t.isActive ? "تعطيل" : "تفعيل"}
                  successMessage={t.isActive ? "تم تعطيل الحساب" : "تم تفعيل الحساب"}
                  className="flex-1 rounded-lg bg-ink-50 py-2.5 text-center text-sm font-medium text-charcoal disabled:opacity-50"
                />
                <DeleteRowButton
                  action={deleteTeacher}
                  id={t.id}
                  itemLabel={t.fullName}
                  successMessage="تم حذف الأستاذ بنجاح"
                  iconOnly
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* عرض الشاشات الكبيرة: جدول */}
      {teachers.length > 0 && (
        <div className="hidden overflow-hidden rounded-2xl bg-white shadow-card md:block">
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
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/teachers/${t.id}`}
                        className="text-xs font-medium text-ink hover:underline"
                      >
                        تعديل
                      </Link>
                      <ToggleRowButton
                        action={toggleTeacherActive}
                        id={t.id}
                        extraFields={{ nextActive: (!t.isActive).toString() }}
                        label={t.isActive ? "تعطيل" : "تفعيل"}
                        successMessage={t.isActive ? "تم تعطيل الحساب" : "تم تفعيل الحساب"}
                      />
                      <DeleteRowButton
                        action={deleteTeacher}
                        id={t.id}
                        itemLabel={t.fullName}
                        successMessage="تم حذف الأستاذ بنجاح"
                      />
                    </div>
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
