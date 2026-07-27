import { NotificationBell } from "@/components/admin/NotificationBell";
import { getAdminNotifications } from "@/lib/notifications";

/**
 * هذا الشريط يظهر فقط على الشاشات الكبيرة (lg وما فوق).
 * على الجوال، جرس الإشعارات أصبح جزءًا من MobileNavHeader نفسه
 * (بجانب زر القائمة والشعار في نفس الشريط) بدل شريطين منفصلين.
 */
export async function AdminHeader() {
  const { notifications, unreadCount } = await getAdminNotifications();

  return (
    <header className="sticky top-0 z-10 hidden items-center justify-between border-b border-ink-50 bg-paper/90 px-6 py-3 backdrop-blur sm:px-10 lg:flex">
      <span className="text-xs text-mist">
        {new Intl.DateTimeFormat("ar-IQ", { dateStyle: "full" }).format(new Date())}
      </span>
      <NotificationBell notifications={notifications} unreadCount={unreadCount} />
    </header>
  );
}
