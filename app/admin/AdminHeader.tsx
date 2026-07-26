import { db } from "@/lib/db";
import { NotificationBell } from "@/components/admin/NotificationBell";

export async function AdminHeader() {
  const notifications = await db.notification.findMany({
    where: { targetRole: "ADMIN" },
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-50 bg-paper/90 px-6 py-3 backdrop-blur sm:px-10">
      <span className="text-xs text-mist">
        {new Intl.DateTimeFormat("ar-EG", { dateStyle: "full" }).format(new Date())}
      </span>
      <NotificationBell
        notifications={notifications.map((n) => ({
          id: n.id,
          message: n.message,
          isRead: n.isRead,
          createdAt: n.createdAt.toISOString(),
        }))}
        unreadCount={unreadCount}
      />
    </header>
  );
}
