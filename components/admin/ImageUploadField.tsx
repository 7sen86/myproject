"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

/**
 * حقل رفع صورة مباشر (بدل إدخال رابط URL يدويًا).
 * يقرأ الصورة من جهاز المستخدم، يصغّرها ويضغطها داخل المتصفح (Canvas)
 * لتبقى خفيفة، ثم يحفظها كنص Base64 داخل حقل مخفي بنفس اسم الحقل الأصلي
 * (coverImageUrl)، فلا حاجة لتعديل أي شيء في الحفظ بقاعدة البيانات أو
 * طريقة عرض الصورة لاحقًا — تبقى قيمة نصية عادية كما كانت.
 */
export function ImageUploadField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(defaultValue ?? null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("الرجاء اختيار ملف صورة صالح");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 900;
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        setPreview(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <input type="hidden" name={name} value={preview ?? ""} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {preview ? (
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="معاينة الغلاف" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink-50"
            >
              تغيير الصورة
            </button>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="flex items-center gap-1 text-xs font-medium text-clay hover:underline"
            >
              <X className="h-3.5 w-3.5" /> إزالة الصورة
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/15 py-6 text-sm font-medium text-mist transition hover:border-ink/30 hover:text-ink"
        >
          <ImagePlus className="h-5 w-5" strokeWidth={1.8} />
          اضغط لرفع صورة الغلاف
        </button>
      )}

      {error && <p className="mt-1.5 text-xs text-clay">{error}</p>}
    </div>
  );
}
