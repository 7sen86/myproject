import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";

/**
 * كل صفحة أو استعلام في لوحة الأستاذ يجب أن يمرّ من هنا للحصول على teacherId.
 * لا يُقرأ teacherId أبدًا من الرابط أو من مدخلات المستخدم — فقط من الجلسة الموقّعة،
 * حتى يستحيل على أستاذ رؤية بيانات أستاذ آخر عبر تعديل الرابط يدويًا.
 */
export async function requireTeacherId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER" || !session.user.teacherId) {
    redirect("/login");
  }
  return session.user.teacherId;
}
