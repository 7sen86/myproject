import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { BookletFilters } from "@/components/BookletFilters";
import { BookletCard } from "@/components/BookletCard";
import { EmptyState } from "@/components/EmptyState";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function BookletsPage({
  searchParams,
}: {
  searchParams: { q?: string; subject?: string; stage?: string; teacher?: string };
}) {
  const { q, subject, stage, teacher } = searchParams;

  const where: Prisma.BookletWhereInput = {
    status: "VISIBLE",
    ...(subject ? { subjectId: subject } : {}),
    ...(stage ? { stageId: stage } : {}),
    ...(teacher ? { teacherId: teacher } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { teacher: { fullName: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [booklets, subjects, stages, teachers] = await Promise.all([
    db.booklet.findMany({
      where,
      include: { subject: true, stage: true, teacher: true },
      orderBy: { createdAt: "desc" },
    }),
    db.subject.findMany({ orderBy: { name: "asc" } }),
    db.stage.findMany({ orderBy: { name: "asc" } }),
    db.teacher.findMany({ where: { isActive: true }, orderBy: { fullName: "asc" } }),
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl space-y-6 px-4 pb-20 pt-8 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-charcoal">تصفح الملازم</h1>

        <SearchBar />
        <BookletFilters
          subjects={subjects}
          stages={stages}
          teachers={teachers.map((t) => ({ id: t.id, name: t.fullName }))}
        />

        {booklets.length === 0 ? (
          <EmptyState
            title="لم نجد ملازم مطابقة"
            description="جرّب كلمة بحث مختلفة أو أزل بعض الفلاتر لتوسيع النتائج."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {booklets.map((b) => (
              <BookletCard key={b.id} booklet={b} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
