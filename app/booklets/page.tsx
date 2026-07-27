import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { BookletFilters } from "@/components/BookletFilters";
import { BookletCard } from "@/components/BookletCard";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/admin/Pagination";
import { PAGE_SIZE_STUDENT, parsePage, totalPagesOf } from "@/lib/pagination";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function BookletsPage({
  searchParams,
}: {
  searchParams: { q?: string; subject?: string; stage?: string; teacher?: string; page?: string };
}) {
  const { q, subject, stage, teacher } = searchParams;
  const page = parsePage(searchParams.page);

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

  // نجيب فقط الصفحة المطلوبة من الملازم، مو كل الملازم دفعة وحدة —
  // هذا يخلي الصفحة سريعة حتى لو صار عند المكتبة مئات الملازم مستقبلًا
  const [totalBooklets, booklets, subjects, stages, teachers] = await Promise.all([
    db.booklet.count({ where }),
    db.booklet.findMany({
      where,
      include: { subject: true, stage: true, teacher: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE_STUDENT,
      take: PAGE_SIZE_STUDENT,
    }),
    db.subject.findMany({
      where: { booklets: { some: { status: "VISIBLE" } } },
      orderBy: { name: "asc" },
    }),
    db.stage.findMany({
      where: { booklets: { some: { status: "VISIBLE" } } },
      orderBy: { name: "asc" },
    }),
    db.teacher.findMany({
      where: { isActive: true, booklets: { some: { status: "VISIBLE" } } },
      orderBy: { fullName: "asc" },
    }),
  ]);

  const totalPages = totalPagesOf(totalBooklets, PAGE_SIZE_STUDENT);

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

        <Pagination
          basePath="/booklets"
          currentPage={page}
          totalPages={totalPages}
          searchParams={{ q, subject, stage, teacher }}
        />
      </main>
    </>
  );
}
