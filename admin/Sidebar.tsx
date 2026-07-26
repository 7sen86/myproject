import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, ClipboardList, Tags, BarChart3 } from "lucide-react";
import { SignOutButton } from "./SignOutButton";

const links = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/teachers", label: "الأساتذة", icon: Users },
  { href: "/admin/booklets", label: "الملازم", icon: BookOpen },
  { href: "/admin/orders", label: "الطلبات", icon: ClipboardList },
  { href: "/admin/reports", label: "التقارير", icon: BarChart3 },
  { href: "/admin/catalog", label: "المواد والمراحل", icon: Tags },
];

export function AdminSidebar() {
  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-l border-ink-50 bg-white">
      <div className="px-5 py-5">
        <Link href="/admin" className="font-display text-xl font-bold text-ink">
          ملازم<span className="marker-underline">.</span>
        </Link>
        <p className="mt-0.5 text-xs text-mist">لوحة الإدارة</p>
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
