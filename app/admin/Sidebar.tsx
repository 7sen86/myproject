import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, ClipboardList, Tags, BarChart3, Settings } from "lucide-react";
import { SignOutButton } from "./SignOutButton";
import { getLibrarySettings } from "@/lib/settings";

const links = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/teachers", label: "الأساتذة", icon: Users },
  { href: "/admin/booklets", label: "الملازم", icon: BookOpen },
  { href: "/admin/orders", label: "الطلبات", icon: ClipboardList },
  { href: "/admin/reports", label: "التقارير", icon: BarChart3 },
  { href: "/admin/catalog", label: "المواد والمراحل", icon: Tags },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export async function AdminSidebar() {
  const settings = await getLibrarySettings();

  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-l border-ink-50 bg-white lg:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        {settings.logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={settings.logoUrl}
            alt=""
            className="h-9 w-9 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
            <BookOpen className="h-4.5 w-4.5" strokeWidth={1.8} />
          </span>
        )}
        <div className="min-w-0">
          <Link href="/admin" className="block truncate font-display text-lg font-bold text-ink">
            {settings.name}
          </Link>
          <p className="text-xs text-mist">لوحة الإدارة</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal transition hover:bg-ink-50 hover:text-ink"
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-50 p-3">
        <SignOutButton />
      </div>
    </aside>
  );
}
