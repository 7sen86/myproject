import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "./Sidebar";
import { AdminHeader } from "./AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        <AdminHeader />
        <div className="px-6 py-8 sm:px-10">{children}</div>
      </div>
    </div>
  );
}
