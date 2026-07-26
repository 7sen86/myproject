"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-mist transition hover:bg-clay/5 hover:text-clay"
    >
      <LogOut className="h-4.5 w-4.5" strokeWidth={1.8} />
      تسجيل الخروج
    </button>
  );
}
