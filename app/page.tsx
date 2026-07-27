import Link from "next/link";
import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { BookletCard } from "@/components/BookletCard";
import { EmptyState } from "@/components/EmptyState";
import { HeroNotebookStack } from "@/components/HeroNotebookStack";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic"; // البيانات تتغير باستمرار (طلبات ومبيعات جديدة)

export default async function HomePage() {
  const [latest, stages, subjects] = await Promise.all([
    db.booklet.findMany({
      where: { status: "VISIBLE" },
      include: { subject: true, stage: true, teacher: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.stage.findMany({
      where: { booklets: { some: { status: "VISIBLE" } } },
      orderBy: { name: "asc" },
    }),
    db.subject.findMany({
      where: { booklets: { some: { status: "VISIBLE" } } },
      orderBy: { name: "asc" },
    }),
  ]);

  const isEmpty = latest.length === 0;

  return (
    <>
      <Header />

      {/* البطل: أول ما يميّز المنصة هو موضوعها نفسه — الملزمة والبحث عنها */}
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-16 pt-14 sm:px-6 md:flex-row-reverse md:items-center md:pt-20">
        <HeroNotebookStack />

        <div className="w-full max-w-xl text-center md:text-right">
          <h1 className="font-display text-4xl font-bold leading-tight text-charcoal sm:text-5xl">
            ملزمة أستاذك،
            <br />
            <span className="marker-underline">بضغطة واحدة</span>
          </h1>
          <p className="mt-4 text-base text-mist sm:text-lg">
            تصفح ملازم أساتذتك حسب المادة والمرحلة، واطلبها مباشرة بدون تسجيل أو تعقيد.
          </p>

          <div className="mt-7">
            <SearchBar />
          </div>

          {stages.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              {stages.map((stage) => (
                <Link
                  key={stage.id}
                  href={`/booklets?stage=${stage.id}`}
                  className="rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-sm text-charcoal transition hover:border-ink/30"
                >
                  {stage.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-14 px-4 pb-20 sm:px-6">
        {isEmpty && (
          <EmptyState
            title="لا توجد ملازم متاحة بعد"
            description="بمجرد أن يضيف فريق المكتبة أول ملزمة من لوحة التحكم، ستظهر هنا مباشرة."
          />
        )}

        {subjects.length > 0 && (
          <section>
            <h2 className="mb-4 font-display text-2xl font-bold text-charcoal">المواد الدراسية</h2>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <Link
                  key={subject.id}
                  href={`/booklets?subject=${subject.id}`}
                  className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-charcoal transition hover:border-ink/30 hover:bg-ink-50"
                >
                  {subject.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {latest.length > 0 && (
          <section>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-bold text-charcoal">أحدث الملازم</h2>
              <Link href="/booklets" className="text-sm font-medium text-ink hover:underline">
                عرض الكل
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {latest.map((b) => (
                <BookletCard key={b.id} booklet={b} />
              ))}
            </div>
          </section>
        )}

        {!isEmpty && (
          <section className="flex justify-center">
            <Link
              href="/booklets"
              className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-light"
            >
              تصفح جميع الملازم
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </section>
        )}
      </main>
    </>
  );
}
