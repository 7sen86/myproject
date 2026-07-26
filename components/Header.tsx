import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-ink-50 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-2xl font-bold text-ink">
          ملازم<span className="marker-underline">.</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/booklets"
            className="hidden text-sm font-medium text-charcoal hover:text-ink sm:block"
          >
            تصفح الملازم
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition hover:bg-ink hover:text-white"
          >
            دخول الأستاذ
          </Link>
        </nav>
      </div>
    </header>
  );
}
