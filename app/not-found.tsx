import Link from "next/link";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-charcoal">لم نجد هذه الصفحة</h1>
        <p className="text-mist">ربما تم حذف الملزمة أو الرابط غير صحيح.</p>
        <Link
          href="/booklets"
          className="mt-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-light"
        >
          تصفح الملازم
        </Link>
      </main>
    </>
  );
}
