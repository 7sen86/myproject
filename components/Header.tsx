import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getLibrarySettings } from "@/lib/settings";

export async function Header() {
  const settings = await getLibrarySettings();

  return (
    <header className="sticky top-0 z-20 border-b border-ink-50 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          {settings.logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={settings.logoUrl}
              alt={settings.name}
              className="h-9 w-9 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
              <BookOpen className="h-4.5 w-4.5" strokeWidth={1.8} />
            </span>
          )}
          <span className="truncate font-display text-2xl font-bold text-ink">
            {settings.name}
          </span>
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
