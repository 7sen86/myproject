import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { BookletWithRelations } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function BookletCard({ booklet }: { booklet: BookletWithRelations }) {
  return (
    <Link
      href={`/booklets/${booklet.id}`}
      className="notebook-edge group block overflow-hidden rounded-2xl bg-white pl-4 pr-6 py-4 shadow-card transition-transform hover:-translate-y-0.5"
    >
      <div className="flex gap-4">
        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-50">
          {booklet.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={booklet.coverImageUrl}
              alt={booklet.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BookOpen className="h-7 w-7 text-ink/30" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="w-fit rounded-full bg-ink-50 px-2 py-0.5 text-xs font-medium text-ink">
            {booklet.subject.name}
          </span>
          <h3 className="mt-1.5 truncate font-display text-lg font-semibold text-charcoal group-hover:text-ink">
            {booklet.title}
          </h3>
          <p className="truncate text-sm text-mist">أ. {booklet.teacher.fullName}</p>

          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="text-sm text-mist">{booklet.stage.name}</span>
            <span className="font-display text-base font-bold text-ink">
              {formatPrice(booklet.price)} د.ع
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
