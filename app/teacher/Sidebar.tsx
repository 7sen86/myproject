import Link from "next/link";
import { LayoutDashboard, BookOpen, ClipboardList } from "lucide-react";
import { SignOutButton } from "../admin/SignOutButton";

const links = [
  { href: "/teacher/dashboard", label: "لوحتي", icon: LayoutDashboard },
  { href: "/teacher/booklets", label: "ملازمي", icon: BookOpen },
  { href: "/teacher/orders", label: "طلباتي", icon: ClipboardList },
];

export function TeacherSidebar({ teacherName }: { teacherName: string }) {
  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-l border-ink-50 bg-white lg:flex">
      <div className="px-5 py-5">
        <Link href="/teacher/dashboard" className="font-display text-xl font-bold text-ink">
          مكتبة الصديقين
        </Link>
        <p className="mt-0.5 truncate text-xs text-mist">أ. {teacherName}</p>
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
