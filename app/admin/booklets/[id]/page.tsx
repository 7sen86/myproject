import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateBooklet } from "../../actions";
import { FormField, inputClass } from "@/components/admin/FormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export default async function EditBookletPage({ params }: { params: { id: string } }) {
  const [booklet, subjects, stages, teachers] = await Promise.all([
    db.booklet.findUnique({ where: { id: params.id } }),
    db.subject.findMany({ orderBy: { name: "asc" } }),
    db.stage.findMany({ orderBy: { name: "asc" } }),
    db.teacher.findMany({ orderBy: { fullName: "asc" } }),
  ]);

  if (!booklet) notFound();

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">تعديل الملزمة</h1>
        <p className="text-sm text-mist">{booklet.title}</p>
      </div>

      <form action={updateBooklet} className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
        <input type="hidden" name="id" value={booklet.id} />

        <FormField label="اسم الملزمة">
          <input name="title" required defaultValue={booklet.title} className={inputClass} />
        </FormField>

        <FormField label="الوصف (اختياري)">
          <textarea
            name="description"
            rows={3}
            defaultValue={booklet.description ?? ""}
            className={inputClass}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="المادة">
            <select
              name="subjectId"
              required
              defaultValue={booklet.subjectId}
              className={inputClass}
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="المرحلة">
            <select name="stageId" required defaultValue={booklet.stageId} className={inputClass}>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="الأستاذ المسؤول">
          <select
            name="teacherId"
            required
            defaultValue={booklet.teacherId}
            className={inputClass}
          >
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.fullName}
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="السعر (د.ع)">
            <input
              name="price"
              type="number"
              min={0}
              step="0.01"
              required
              defaultValue={Number(booklet.price)}
              className={inputClass}
            />
          </FormField>
          <FormField label="نسبة ربح مخصصة % (اختياري)">
            <input
              name="teacherProfitPercentageOverride"
              type="number"
              min={0}
              max={100}
              step="0.1"
              defaultValue={
                booklet.teacherProfitPercentageOverride
                  ? Number(booklet.teacherProfitPercentageOverride)
                  : undefined
              }
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="صورة الغلاف (اختياري)">
          <ImageUploadField name="coverImageUrl" defaultValue={booklet.coverImageUrl} />
        </FormField>

        <FormField label="حالة العرض">
          <select name="status" defaultValue={booklet.status} className={inputClass}>
            <option value="VISIBLE">متاحة للطلاب</option>
            <option value="HIDDEN">مخفية مؤقتًا</option>
          </select>
        </FormField>

        <button
          type="submit"
          className="w-full rounded-xl bg-ink px-4 py-3 font-semibold text-white hover:bg-ink-light"
        >
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
}
