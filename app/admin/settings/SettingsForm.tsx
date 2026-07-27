"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";
import { useToast } from "@/components/Toast";
import { FormField, inputClass } from "@/components/admin/FormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { LibrarySettings } from "@/lib/settings";
import { DEFAULT_COLOR_ACCENT, DEFAULT_COLOR_PRIMARY } from "@/lib/settings";

export function SettingsForm({
  action,
  settings,
}: {
  action: (formData: FormData) => Promise<void>;
  settings: LibrarySettings;
}) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // نتابع لون الأزرار محليًا فقط لعرض معاينة حيّة قبل الحفظ
  const [primary, setPrimary] = useState(settings.colorPrimary || DEFAULT_COLOR_PRIMARY);
  const [accent, setAccent] = useState(settings.colorAccent || DEFAULT_COLOR_ACCENT);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await action(formData);
        showToast("success", "تم حفظ إعدادات المكتبة");
        router.refresh();
      } catch (err) {
        showToast("error", err instanceof Error ? err.message : "تعذّر حفظ الإعدادات");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* الهوية البصرية */}
      <section className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-charcoal">الهوية البصرية</h2>

        <FormField label="اسم المكتبة">
          <input name="name" defaultValue={settings.name} required className={inputClass} />
        </FormField>

        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">شعار المكتبة</label>
          <p className="mb-2 text-xs text-mist">
            اختياري — إذا لم ترفع شعارًا سيظهر شعار افتراضي بجانب اسم المكتبة
          </p>
          <ImageUploadField name="logoUrl" defaultValue={settings.logoUrl} />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-ink/10 bg-paper p-3">
          <span className="text-xs font-medium text-mist">معاينة سريعة:</span>
          {settings.logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={settings.logoUrl} alt="" className="h-8 w-8 rounded-lg object-cover" />
          ) : (
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: primary }}
            >
              <BookOpen className="h-4 w-4" />
            </span>
          )}
          <span className="font-display text-sm font-bold" style={{ color: primary }}>
            {settings.name}
          </span>
        </div>
      </section>

      {/* الألوان */}
      <section className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-charcoal">ألوان الموقع</h2>
        <p className="text-xs text-mist">
          يُطبَّق التغيير على الموقع بالكامل فور الحفظ — بدون الحاجة لأي إعادة نشر
        </p>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="اللون الأساسي">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
                className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-ink/10"
              />
              <input
                name="colorPrimary"
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
                dir="ltr"
                className={inputClass}
              />
            </div>
          </FormField>

          <FormField label="لون التمييز (الهايلايتر)">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-ink/10"
              />
              <input
                name="colorAccent"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                dir="ltr"
                className={inputClass}
              />
            </div>
          </FormField>
        </div>
      </section>

      {/* بيانات التواصل */}
      <section className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-charcoal">بيانات التواصل</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="رقم الهاتف">
            <input name="phone" defaultValue={settings.phone} dir="ltr" className={inputClass} />
          </FormField>
          <FormField label="البريد الإلكتروني">
            <input
              name="email"
              type="email"
              defaultValue={settings.email}
              dir="ltr"
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="العنوان">
          <input name="address" defaultValue={settings.address} className={inputClass} />
        </FormField>
      </section>

      {/* التواصل الاجتماعي */}
      <section className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-charcoal">روابط التواصل الاجتماعي</h2>

        <FormField label="فيسبوك">
          <input
            name="socialFacebook"
            defaultValue={settings.socialFacebook}
            dir="ltr"
            placeholder="https://facebook.com/..."
            className={inputClass}
          />
        </FormField>
        <FormField label="انستغرام">
          <input
            name="socialInstagram"
            defaultValue={settings.socialInstagram}
            dir="ltr"
            placeholder="https://instagram.com/..."
            className={inputClass}
          />
        </FormField>
        <FormField label="واتساب">
          <input
            name="socialWhatsapp"
            defaultValue={settings.socialWhatsapp}
            dir="ltr"
            placeholder="9647xxxxxxxxx"
            className={inputClass}
          />
        </FormField>
      </section>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 font-semibold text-white transition hover:bg-ink-light disabled:opacity-60"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
      </button>
    </form>
  );
}
