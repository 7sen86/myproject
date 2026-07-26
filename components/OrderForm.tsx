"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

type Governorate = { id: string; name: string };

export function OrderForm({
  bookletId,
  governorates,
}: {
  bookletId: string;
  governorates: Governorate[];
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = new FormData(e.currentTarget);
    const payload = {
      bookletId,
      studentName: form.get("studentName"),
      studentPhone: form.get("studentPhone"),
      governorateId: form.get("governorateId") || null,
      addressDetails: form.get("addressDetails") || null,
      notes: form.get("notes") || null,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error || "تعذّر إرسال الطلب، حاول مرة أخرى");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("تعذّر الاتصال بالخادم، تحقق من الإنترنت وحاول مرة أخرى");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rise-in flex flex-col items-center gap-2 rounded-2xl border border-leaf/20 bg-leaf/5 px-6 py-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-leaf" strokeWidth={1.5} />
        <h3 className="font-display text-lg font-bold text-charcoal">تم إرسال طلبك بنجاح</h3>
        <p className="text-sm text-mist">
          سيتواصل معك فريق المكتبة قريبًا لتأكيد التسليم.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
      <h3 className="font-display text-lg font-bold text-charcoal">اطلب هذه الملزمة</h3>

      <div>
        <label className="mb-1 block text-sm font-medium text-charcoal">اسم الطالب</label>
        <input
          name="studentName"
          required
          minLength={2}
          className="w-full rounded-xl border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-ink/40"
          placeholder="مثال: أحمد محمد"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-charcoal">رقم الهاتف</label>
        <input
          name="studentPhone"
          required
          type="tel"
          pattern="^01[0-9]{9}$"
          className="w-full rounded-xl border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-ink/40"
          placeholder="01xxxxxxxxx"
          dir="ltr"
        />
      </div>

      {governorates.length > 1 && (
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">المحافظة</label>
          <select
            name="governorateId"
            className="w-full rounded-xl border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-ink/40"
          >
            {governorates.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-charcoal">
          العنوان <span className="font-normal text-mist">(اختياري)</span>
        </label>
        <input
          name="addressDetails"
          className="w-full rounded-xl border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-ink/40"
          placeholder="أقرب علامة مميزة، اسم الشارع..."
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-charcoal">
          ملاحظات <span className="font-normal text-mist">(اختياري)</span>
        </label>
        <textarea
          name="notes"
          rows={2}
          className="w-full rounded-xl border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-ink/40"
        />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-marker px-4 py-3 font-semibold text-ink transition hover:bg-marker-dark disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
        تأكيد الطلب
      </button>
    </form>
  );
}
