"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Users,
  Tags,
  BarChart3,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SignOutButton } from "@/app/admin/SignOutButton";

/**
 * الأيقونات لا يمكن تمريرها كـ prop من Server Component إلى هذا المكوّن
 * (Client Component) لأنها دوال غير قابلة للتسلسل عبر حدود RSC.
 * لذلك نمررها كاسم نصي فقط ونحوّلها هنا إلى مكوّن فعلي عبر هذه الخريطة.
 */
const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  booklets: BookOpen,
  orders: ClipboardList,
  teachers: Users,
  catalog: Tags,
  reports: BarChart3,
  settings: Settings,
};

type NavLink = {
  href: string;
  label: string;
  icon: keyof typeof iconMap;
};

/**
 * شريط تنقّل علوي مخصص للشاشات الصغيرة (الجوال).
 * يستبدل القائمة الجانبية الثابتة (aside) التي كانت مصممة للحاسوب فقط
 * وتسبب تكسّر التصميم على عرض الجوال. تظهر هذه المكوّنة فقط أسفل حد lg
 * (راجع lg:hidden في مكان الاستخدام)، وتفتح قائمة منسدلة عند الحاجة.
 */
export function MobileNavHeader({
  brandLabel,
  subtitle,
  links,
  homeHref,
  logoUrl = null,
  rightExtra,
}: {
  brandLabel: string;
  subtitle: string;
  links: NavLink[];
  homeHref: string;
  logoUrl?: string | null;
  rightExtra?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 border-b border-ink-50 bg-white lg:hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        {/* المجموعة اليمنى: زر القائمة، ثم الشعار، ثم اسم المكتبة — هذا الترتيب
            هو ما يحدد موضعها بصريًا في RTL (أول عنصر بالكود = أقصى اليمين) */}
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ink/10 text-ink"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logoUrl}
              alt=""
              className="h-9 w-9 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
              <BookOpen className="h-4.5 w-4.5" strokeWidth={1.8} />
            </span>
          )}

          <div className="min-w-0">
            <Link href={homeHref} className="block truncate font-display text-lg font-bold text-ink">
              {brandLabel}
            </Link>
            <p className="truncate text-xs text-mist">{subtitle}</p>
          </div>
        </div>

        {/* المجموعة اليسرى: عناصر ثانوية (إشعارات، بحث، حساب...) — اختيارية */}
        {rightExtra && <div className="flex shrink-0 items-center gap-2">{rightExtra}</div>}
      </div>

      {open && (
        <nav className="space-y-1 border-t border-ink-50 px-3 py-3">
          {links.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal transition hover:bg-ink-50 hover:text-ink"
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                {link.label}
              </Link>
            );
          })}
          <div className="border-t border-ink-50 pt-2">
            <SignOutButton />
          </div>
        </nav>
      )}
    </div>
  );
}
