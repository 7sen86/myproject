"use client";

import { useState, useTransition } from "react";
import { Bell } from "lucide-react";
import { markNotificationRead, markAllNotificationsRead } from "../../app/actions";

type NotificationItem = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export function NotificationBell({
  notifications,
  unreadCount,
}: {
  notifications: NotificationItem[];
  unreadCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 bg-white text-charcoal hover:bg-ink-50"
      >
        <Bell className="h-4.5 w-4.5" strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-clay text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-20 mt-2 w-80 rounded-2xl border border-ink-50 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-ink-50 px-4 py-3">
              <span className="text-sm font-bold text-charcoal">الإشعارات</span>
              {unreadCount > 0 && (
                <button
                  disabled={isPending}
                  onClick={() => startTransition(() => markAllNotificationsRead())}
                  className="text-xs font-medium text-ink hover:underline disabled:opacity-50"
                >
                  تعليم الكل كمقروء
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-mist">لا توجد إشعارات</p>
              )}
              {notifications.map((n) => (
                <button
                  key={n.id}
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() => {
                      const fd = new FormData();
                      fd.set("id", n.id);
                      markNotificationRead(fd);
                    })
                  }
                  className={`block w-full border-b border-ink-50 px-4 py-3 text-right text-sm last:border-b-0 ${
                    n.isRead ? "text-mist" : "bg-marker-50 font-medium text-charcoal"
                  }`}
                >
                  {n.message}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
