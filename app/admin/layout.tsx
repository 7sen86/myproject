import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "./Sidebar";
import { AdminHeader } from "./AdminHeader";
import { MobileNavHeader } from "@/components/MobileNavHeader";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { getLibrarySettings } from "@/lib/settings";
import { getAdminNotifications } from "@/lib/notifications";

// ملاحظة: الأيقونات نمررها كاسم نصي (وليس مكوّن React) لأن هذا الملف
// Server Component ويمرر البيانات لـ MobileNavHeader وهو Client Component.
const adminLinks = [
  { href: "/admin", label: "لوحة التحكم", icon: "dashboard" as const },
  { href: "/admin/teachers", label: "الأساتذة", icon: "teachers" as const },
  { href: "/admin/booklets", label: "الملازم", icon: "booklets" as const },
  { href: "/admin/orders", label: "الطلبات", icon: "orders" as const },
  { href: "/admin/reports", label: "التقارير", icon: "reports" as const },
  { href: "/admin/catalog", label: "المواد والمراحل", icon: "catalog" as const },
  { href: "/admin/settings", label: "الإعدادات", icon: "settings" as const },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [settings, { notifications, unreadCount }] = await Promise.all([
    getLibrarySettings(),
    getAdminNotifications(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-paper lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        <MobileNavHeader
          brandLabel={settings.name}
          subtitle="لوحة الإدارة"
          logoUrl={settings.logoUrl}
          links={adminLinks}
          homeHref="/admin"
          rightExtra={<NotificationBell notifications={notifications} unreadCount={unreadCount} />}
        />
        <AdminHeader />
        <div className="px-4 py-6 sm:px-10 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
