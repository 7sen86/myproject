import Link from "next/link";
import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { BookletCard } from "@/components/BookletCard";
import { EmptyState } from "@/components/EmptyState";
import { HeroNotebookStack } from "@/components/HeroNotebookStack";

export const dynamic = "force-dynamic"; // البيانات تتغير باستمرار (طلبات ومبيعات جديدة)

export default async function HomePage() {
  const [popular, latest, stages] = await Promise.all([
    db.booklet.findMany({
      where: { status: "VISIBLE" },
      include: { subject: true, stage: true, teacher: true },
      orderBy: { salesCount: "desc" },
      take: 4,
    }),
    db.booklet.findMany({
      where: { status: "VISIBLE" },
      include: { subject: true, stage: true, teacher: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.stage.findMany({ orderBy: { name: "asc" } }),
  ]);

  const isEmpty = popular.length === 0 && latest.length === 0;

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

        {popular.length > 0 && (
          <section>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-bold text-charcoal">
                الأكثر طلبًا
              </h2>
              <Link href="/booklets" className="text-sm font-medium text-ink hover:underline">
                عرض الكل
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {popular.map((b) => (
                <BookletCard key={b.id} booklet={b} />
              ))}
            </div>
          </section>
        )}

        {latest.length > 0 && (
          <section>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-bold text-charcoal">
                أحدث الملازم
              </h2>
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
      </main>
    </>
  );
}
