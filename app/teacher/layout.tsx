import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { TeacherSidebar } from "./Sidebar";
import { MobileNavHeader } from "@/components/MobileNavHeader";

// ملاحظة: الأيقونات نمررها كاسم نصي (وليس مكوّن React) لأن هذا الملف
// Server Component ويمرر البيانات لـ MobileNavHeader وهو Client Component.
const teacherLinks = [
  { href: "/teacher/dashboard", label: "لوحتي", icon: "dashboard" as const },
  { href: "/teacher/booklets", label: "ملازمي", icon: "booklets" as const },
  { href: "/teacher/orders", label: "طلباتي", icon: "orders" as const },
];

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "TEACHER" || !session.user.teacherId) {
    redirect("/login");
  }

  const teacher = await db.teacher.findUnique({ where: { id: session.user.teacherId } });
  if (!teacher || !teacher.isActive) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper lg:flex-row">
      <TeacherSidebar teacherName={teacher.fullName} />
      <div className="flex-1 overflow-x-hidden">
        <MobileNavHeader
          brandLabel="مكتبة الصديقين"
          subtitle={`أ. ${teacher.fullName}`}
          links={teacherLinks}
          homeHref="/teacher/dashboard"
        />
        <div className="px-4 py-6 sm:px-10 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
