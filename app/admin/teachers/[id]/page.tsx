import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateTeacher } from "../../actions";
import { FormField, inputClass } from "@/components/admin/FormField";

export default async function EditTeacherPage({ params }: { params: { id: string } }) {
  const teacher = await db.teacher.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!teacher) notFound();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">تعديل بيانات الأستاذ</h1>
        <p className="text-sm text-mist" dir="ltr">
          {teacher.user.username}
        </p>
      </div>

      <form action={updateTeacher} className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
        <input type="hidden" name="id" value={teacher.id} />

        <FormField label="الاسم الكامل">
          <input name="fullName" required defaultValue={teacher.fullName} className={inputClass} />
        </FormField>
        <FormField label="رقم الهاتف">
          <input name="phone" required defaultValue={teacher.phone} dir="ltr" className={inputClass} />
        </FormField>
        <FormField label="نسبة أرباح الأستاذ (%)">
          <input
            name="profitPercentage"
            type="number"
            min={0}
            max={100}
            step="0.1"
            required
            defaultValue={Number(teacher.profitPercentage)}
            className={inputClass}
          />
        </FormField>
        <FormField label="كلمة مرور جديدة (اتركها فارغة لعدم التغيير)">
          <input name="newPassword" type="password" minLength={6} dir="ltr" className={inputClass} />
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
