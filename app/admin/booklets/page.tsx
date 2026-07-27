import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { toggleBookletStatus, deleteBooklet } from "../actions";
import { DeleteRowButton } from "@/components/admin/DeleteRowButton";
import { ToggleRowButton } from "@/components/admin/ToggleRowButton";
import { Pagination } from "@/components/admin/Pagination";
import { PAGE_SIZE_ADMIN, parsePage, totalPagesOf } from "@/lib/pagination";

export const dynamic = "force-dynamic";

export default async function BookletsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parsePage(searchParams.page);

  const [totalBooklets, booklets] = await Promise.all([
    db.booklet.count(),
    db.booklet.findMany({
      orderBy: { createdAt: "desc" },
      include: { subject: true, stage: true, teacher: true },
      skip: (page - 1) * PAGE_SIZE_ADMIN,
      take: PAGE_SIZE_ADMIN,
    }),
  ]);

  const totalPages = totalPagesOf(totalBooklets, PAGE_SIZE_ADMIN);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">الملازم</h1>
          <p className="text-sm text-mist">إضافة ملزمة جديدة وربطها بالأستاذ المسؤول</p>
        </div>
        <Link
          href="/admin/booklets/new"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-ink-light sm:py-2.5"
        >
          <Plus className="h-4 w-4" /> إضافة ملزمة
        </Link>
      </div>

      {booklets.length === 0 && (
        <p className="rounded-2xl bg-white px-5 py-10 text-center text-sm text-mist shadow-card">
          لا توجد ملازم بعد
        </p>
      )}

      {/* عرض الجوال: بطاقات */}
      {booklets.length > 0 && (
        <div className="grid gap-3 md:hidden">
          {booklets.map((b) => (
            <div key={b.id} className="rounded-2xl bg-white p-4 shadow-card">
              <div className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                  {b.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.coverImageUrl}
                      alt={b.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <BookOpen className="h-5 w-5 text-ink/30" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-display text-base font-bold text-charcoal">
                      {b.title}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        b.status === "VISIBLE" ? "bg-leaf/10 text-leaf" : "bg-clay/10 text-clay"
                      }`}
                    >
                      {b.status === "VISIBLE" ? "متاحة" : "مخفية"}
                    </span>
                  </div>
                  <p className="truncate text-sm text-mist">أ. {b.teacher.fullName}</p>
                  <p className="mt-1 text-xs text-mist">
                    {b.subject.name} · {b.stage.name}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3 text-sm">
                    <span className="font-display font-bold text-ink">
                      {formatPrice(b.price)} د.ع
                    </span>
                    <span className="text-mist">{b.salesCount} مبيعة</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-ink-50 pt-3">
                <Link
                  href={`/admin/booklets/${b.id}`}
                  className="flex-1 rounded-lg bg-ink-50 py-2.5 text-center text-sm font-medium text-ink"
                >
                  تعديل
                </Link>
                <ToggleRowButton
                  action={toggleBookletStatus}
                  id={b.id}
                  extraFields={{ nextStatus: b.status === "VISIBLE" ? "HIDDEN" : "VISIBLE" }}
                  label={b.status === "VISIBLE" ? "إخفاء" : "إظهار"}
                  successMessage={b.status === "VISIBLE" ? "تم إخفاء الملزمة" : "تم إظهار الملزمة"}
                  className="flex-1 rounded-lg bg-ink-50 py-2.5 text-center text-sm font-medium text-charcoal disabled:opacity-50"
                />
                <DeleteRowButton
                  action={deleteBooklet}
                  id={b.id}
                  itemLabel={b.title}
                  successMessage="تم حذف الملزمة بنجاح"
                  iconOnly
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* عرض الشاشات الكبيرة: جدول */}
      {booklets.length > 0 && (
        <div className="hidden overflow-hidden rounded-2xl bg-white shadow-card md:block">
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
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/booklets/${b.id}`}
                        className="text-xs font-medium text-ink hover:underline"
                      >
                        تعديل
                      </Link>
                      <ToggleRowButton
                        action={toggleBookletStatus}
                        id={b.id}
                        extraFields={{ nextStatus: b.status === "VISIBLE" ? "HIDDEN" : "VISIBLE" }}
                        label={b.status === "VISIBLE" ? "إخفاء" : "إظهار"}
                        successMessage={
                          b.status === "VISIBLE" ? "تم إخفاء الملزمة" : "تم إظهار الملزمة"
                        }
                      />
                      <DeleteRowButton
                        action={deleteBooklet}
                        id={b.id}
                        itemLabel={b.title}
                        successMessage="تم حذف الملزمة بنجاح"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        basePath="/admin/booklets"
        currentPage={page}
        totalPages={totalPages}
        searchParams={{}}
      />
    </div>
  );
}
