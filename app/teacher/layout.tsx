import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { TeacherSidebar } from "./Sidebar";

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
    <div className="flex min-h-screen bg-paper">
      <TeacherSidebar teacherName={teacher.fullName} />
      <div className="flex-1 overflow-x-hidden px-6 py-8 sm:px-10">{children}</div>
    </div>
  );
}
