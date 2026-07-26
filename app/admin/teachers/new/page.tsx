import { createTeacher } from "../../actions";
import { FormField, inputClass } from "@/components/admin/FormField";

export default function NewTeacherPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">إضافة أستاذ</h1>
        <p className="text-sm text-mist">أنشئ حسابًا يستطيع الأستاذ به الدخول لمتابعة ملازمه</p>
      </div>

      <form action={createTeacher} className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
        <FormField label="الاسم الكامل">
          <input name="fullName" required className={inputClass} />
        </FormField>
        <FormField label="رقم الهاتف">
          <input name="phone" required dir="ltr" className={inputClass} />
        </FormField>
        <FormField label="اسم المستخدم (لتسجيل الدخول)">
          <input name="username" required dir="ltr" className={inputClass} />
        </FormField>
        <FormField label="كلمة المرور">
          <input
            name="password"
            type="password"
            required
            minLength={6}
            dir="ltr"
            className={inputClass}
          />
        </FormField>
        <FormField label="نسبة أرباح الأستاذ (%)">
          <input
            name="profitPercentage"
            type="number"
            min={0}
            max={100}
            step="0.1"
            defaultValue={30}
            required
            className={inputClass}
          />
        </FormField>

        <button
          type="submit"
          className="w-full rounded-xl bg-ink px-4 py-3 font-semibold text-white hover:bg-ink-light"
        >
          إنشاء الحساب
        </button>
      </form>
    </div>
  );
}
