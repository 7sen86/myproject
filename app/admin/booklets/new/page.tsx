import Link from "next/link";
import { db } from "@/lib/db";
import { createBooklet } from "../../actions";
import { FormField, inputClass } from "@/components/admin/FormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export default async function NewBookletPage() {
  const [subjects, stages, teachers] = await Promise.all([
    db.subject.findMany({ orderBy: { name: "asc" } }),
    db.stage.findMany({ orderBy: { name: "asc" } }),
    db.teacher.findMany({ where: { isActive: true }, orderBy: { fullName: "asc" } }),
  ]);

  const missingCatalog = subjects.length === 0 || stages.length === 0 || teachers.length === 0;

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">إضافة ملزمة</h1>
        <p className="text-sm text-mist">اربطها بالأستاذ المسؤول لتُحسب أرباحه تلقائيًا</p>
      </div>

      {missingCatalog ? (
        <div className="rounded-2xl bg-white p-6 text-sm text-charcoal shadow-card">
          قبل إضافة ملزمة، تحتاج على الأقل مادة واحدة، ومرحلة واحدة، وأستاذًا واحدًا مفعّلًا.{" "}
          <Link href="/admin/catalog" className="font-medium text-ink hover:underline">
            أضفها من هنا
          </Link>{" "}
          أو{" "}
          <Link href="/admin/teachers/new" className="font-medium text-ink hover:underline">
            أضف أستاذًا
          </Link>
          .
        </div>
      ) : (
        <form action={createBooklet} className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
          <FormField label="اسم الملزمة">
            <input name="title" required className={inputClass} />
          </FormField>

          <FormField label="الوصف (اختياري)">
            <textarea name="description" rows={3} className={inputClass} />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="المادة">
              <select name="subjectId" required className={inputClass}>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="المرحلة">
              <select name="stageId" required className={inputClass}>
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="الأستاذ المسؤول">
            <select name="teacherId" required className={inputClass}>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName} (نسبته الافتراضية {Number(t.profitPercentage)}%)
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="السعر (د.ع)">
              <input name="price" type="number" min={0} step="0.01" required className={inputClass} />
            </FormField>
            <FormField label="نسبة ربح مخصصة % (اختياري)">
              <input
                name="teacherProfitPercentageOverride"
                type="number"
                min={0}
                max={100}
                step="0.1"
                placeholder="اتركها فارغة لاستخدام نسبة الأستاذ"
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField label="صورة الغلاف (اختياري)">
            <ImageUploadField name="coverImageUrl" />
          </FormField>

          <FormField label="حالة العرض">
            <select name="status" defaultValue="VISIBLE" className={inputClass}>
              <option value="VISIBLE">متاحة للطلاب</option>
              <option value="HIDDEN">مخفية مؤقتًا</option>
            </select>
          </FormField>

          <button
            type="submit"
            className="w-full rounded-xl bg-ink px-4 py-3 font-semibold text-white hover:bg-ink-light"
          >
            إضافة الملزمة
          </button>
        </form>
      )}
    </div>
  );
}
