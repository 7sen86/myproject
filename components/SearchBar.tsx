"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBar({ placeholder = "ابحث عن اسم ملزمة أو أستاذ..." }: { placeholder?: string }) {
  const [value, setValue] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/booklets${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-2xl border border-ink/10 bg-white p-2 shadow-card"
    >
      <Search className="mr-2 h-5 w-5 shrink-0 text-mist" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent py-2 text-sm text-charcoal outline-none placeholder:text-mist"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-light"
      >
        بحث
      </button>
    </form>
  );
}
