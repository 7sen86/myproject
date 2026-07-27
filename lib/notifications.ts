import { cache } from "react";
import { db } from "@/lib/db";

export type NotificationItem = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export const getAdminNotifications = cache(async (): Promise<{
  notifications: NotificationItem[];
  unreadCount: number;
}> => {
  const rows = await db.notification.findMany({
    where: { targetRole: "ADMIN" },
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return {
    notifications: rows.map((n) => ({
      id: n.id,
      message: n.message,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
    })),
    unreadCount: rows.filter((n) => !n.isRead).length,
  };
});
