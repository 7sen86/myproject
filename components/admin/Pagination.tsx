import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

/**
 * ترقيم صفحات بسيط يحافظ على أي فلاتر موجودة في الرابط (status, q, subject...)
 * ويغيّر فقط قيمة page.
 */
export function Pagination({
  basePath,
  currentPage,
  totalPages,
  searchParams,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") params.set(key, value);
    }
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      {prevDisabled ? (
        <span className="flex items-center gap-1 rounded-xl border border-ink/10 px-3.5 py-2 text-sm text-mist/50">
          <ChevronRight className="h-4 w-4" /> السابق
        </span>
      ) : (
        <Link
          href={hrefFor(currentPage - 1)}
          className="flex items-center gap-1 rounded-xl border border-ink/10 bg-white px-3.5 py-2 text-sm text-charcoal hover:border-ink/30"
        >
          <ChevronRight className="h-4 w-4" /> السابق
        </Link>
      )}

      <span className="text-sm text-mist">
        صفحة {currentPage} من {totalPages}
      </span>

      {nextDisabled ? (
        <span className="flex items-center gap-1 rounded-xl border border-ink/10 px-3.5 py-2 text-sm text-mist/50">
          التالي <ChevronLeft className="h-4 w-4" />
        </span>
      ) : (
        <Link
          href={hrefFor(currentPage + 1)}
          className="flex items-center gap-1 rounded-xl border border-ink/10 bg-white px-3.5 py-2 text-sm text-charcoal hover:border-ink/30"
        >
          التالي <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
