import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, ClipboardList, Tags, BarChart3 } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "./Sidebar";
import { AdminHeader } from "./AdminHeader";
import { MobileNavHeader } from "@/components/MobileNavHeader";

const adminLinks = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/teachers", label: "الأساتذة", icon: Users },
  { href: "/admin/booklets", label: "الملازم", icon: BookOpen },
  { href: "/admin/orders", label: "الطلبات", icon: ClipboardList },
  { href: "/admin/reports", label: "التقارير", icon: BarChart3 },
  { href: "/admin/catalog", label: "المواد والمراحل", icon: Tags },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        <MobileNavHeader
          brandLabel="مكتبة الصديقين"
          subtitle="لوحة الإدارة"
          links={adminLinks}
          homeHref="/admin"
        />
        <AdminHeader />
        <div className="px-4 py-6 sm:px-10 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
