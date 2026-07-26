"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Option = { id: string; name: string };

export function BookletFilters({
  subjects,
  stages,
  teachers,
}: {
  subjects: Option[];
  stages: Option[];
  teachers: Option[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/booklets?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        defaultValue={searchParams.get("stage") ?? ""}
        onChange={(e) => updateParam("stage", e.target.value)}
        className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-charcoal"
      >
        <option value="">كل المراحل</option>
        {stages.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("subject") ?? ""}
        onChange={(e) => updateParam("subject", e.target.value)}
        className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-charcoal"
      >
        <option value="">كل المواد</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("teacher") ?? ""}
        onChange={(e) => updateParam("teacher", e.target.value)}
        className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-charcoal"
      >
        <option value="">كل الأساتذة</option>
        {teachers.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}
