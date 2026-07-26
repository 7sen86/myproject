import { notFound } from "next/navigation";
import { BookOpen, GraduationCap, Layers } from "lucide-react";
import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { OrderForm } from "@/components/OrderForm";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BookletDetailPage({ params }: { params: { id: string } }) {
  const booklet = await db.booklet.findUnique({
    where: { id: params.id },
    include: { subject: true, stage: true, teacher: true },
  });

  if (!booklet || booklet.status !== "VISIBLE") {
    notFound();
  }

  const governorates = await db.governorate.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* الغلاف والمعلومات */}
          <div className="md:col-span-3">
            <div className="notebook-edge overflow-hidden rounded-2xl bg-white pl-4 pr-6 py-4 shadow-card">
              <div className="mb-4 h-56 w-full overflow-hidden rounded-xl bg-ink-50">
                {booklet.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={booklet.coverImageUrl}
                    alt={booklet.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <BookOpen className="h-14 w-14 text-ink/25" strokeWidth={1.2} />
                  </div>
                )}
              </div>

              <h1 className="font-display text-2xl font-bold text-charcoal sm:text-3xl">
                {booklet.title}
              </h1>
              <p className="mt-1 text-mist">أ. {booklet.teacher.fullName}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-ink-50 px-3 py-1 text-sm text-ink">
                  <Layers className="h-3.5 w-3.5" /> {booklet.subject.name}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-ink-50 px-3 py-1 text-sm text-ink">
                  <GraduationCap className="h-3.5 w-3.5" /> {booklet.stage.name}
                </span>
              </div>

              {booklet.description && (
                <p className="mt-5 whitespace-pre-line leading-relaxed text-charcoal/85">
                  {booklet.description}
                </p>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-ink-50 pt-4">
                <span className="text-sm text-mist">السعر</span>
                <span className="font-display text-2xl font-bold text-ink">
                  {formatPrice(booklet.price)} ج.م
                </span>
              </div>
            </div>
          </div>

          {/* نموذج الطلب */}
          <div className="md:col-span-2">
            <div className="md:sticky md:top-24">
              <OrderForm bookletId={booklet.id} governorates={governorates} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
