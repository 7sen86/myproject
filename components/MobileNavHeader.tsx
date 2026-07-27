"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SignOutButton } from "@/app/admin/SignOutButton";

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
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
}: {
  brandLabel: string;
  subtitle: string;
  links: NavLink[];
  homeHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 border-b border-ink-50 bg-white lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <Link href={homeHref} className="font-display text-lg font-bold text-ink">
            {brandLabel}
          </Link>
          <p className="truncate text-xs text-mist">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ink/10 text-ink"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="space-y-1 border-t border-ink-50 px-3 py-3">
          {links.map((link) => {
            const Icon = link.icon;
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
