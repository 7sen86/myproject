"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { calculateProfitSplit, resolveProfitPercentage } from "@/lib/profit";
import { isValidHexColor } from "@/lib/color";
import type { BookletStatus, OrderStatus } from "@prisma/client";

/**
 * كل إجراء هنا يتحقق من صلاحية الأدمن بنفسه، ولا يعتمد فقط على middleware.
 * هذا هو خط الدفاع الحقيقي والملزم المذكور في خطة المشروع.
 */
async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }
  return session;
}

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

// ============================================================
// الأساتذة
// ============================================================

export async function createTeacher(formData: FormData) {
  await assertAdmin();

  const fullName = str(formData, "fullName");
  const phone = str(formData, "phone");
  const username = str(formData, "username");
  const password = str(formData, "password");
  const profitPercentage = Number(str(formData, "profitPercentage") || 30);

  if (!fullName || !phone || !username || password.length < 6) {
    throw new Error("تحقق من تعبئة كل الحقول (كلمة المرور 6 أحرف على الأقل)");
  }

  const existing = await db.user.findUnique({ where: { username } });
  if (existing) {
    throw new Error("اسم المستخدم مستخدم بالفعل، اختر اسمًا آخر");
  }

  const passwordHash = await hashPassword(password);

  await db.user.create({
    data: {
      role: "TEACHER",
      username,
      passwordHash,
      teacher: {
        create: { fullName, phone, profitPercentage },
      },
    },
  });

  revalidatePath("/admin/teachers");
  redirect("/admin/teachers");
}

export async function updateTeacher(formData: FormData) {
  await assertAdmin();

  const id = str(formData, "id");
  const fullName = str(formData, "fullName");
  const phone = str(formData, "phone");
  const profitPercentage = Number(str(formData, "profitPercentage") || 30);
  const newPassword = str(formData, "newPassword");

  const teacher = await db.teacher.update({
    where: { id },
    data: { fullName, phone, profitPercentage },
  });

  if (newPassword) {
    if (newPassword.length < 6) throw new Error("كلمة المرور الجديدة قصيرة جدًا");
    await db.user.update({
      where: { id: teacher.userId },
      data: { passwordHash: await hashPassword(newPassword) },
    });
  }

  revalidatePath("/admin/teachers");
  redirect("/admin/teachers");
}

export async function toggleTeacherActive(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const nextActive = str(formData, "nextActive") === "true";

  const teacher = await db.teacher.update({
    where: { id },
    data: { isActive: nextActive },
  });
  await db.user.update({ where: { id: teacher.userId }, data: { isActive: nextActive } });

  revalidatePath("/admin/teachers");
}

export async function deleteTeacher(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");

  const bookletCount = await db.booklet.count({ where: { teacherId: id } });
  if (bookletCount > 0) {
    throw new Error("لا يمكن حذف أستاذ لديه ملازم مرتبطة به. عطّل حسابه بدلًا من الحذف.");
  }

  const teacher = await db.teacher.findUnique({ where: { id } });
  if (teacher) {
    await db.teacher.delete({ where: { id } });
    await db.user.delete({ where: { id: teacher.userId } });
  }

  revalidatePath("/admin/teachers");
}

// ============================================================
// التصنيفات (المواد والمراحل)
// ============================================================

export async function createSubject(formData: FormData) {
  await assertAdmin();
  const name = str(formData, "name");
  if (!name) throw new Error("اسم المادة مطلوب");
  await db.subject.create({ data: { name } });
  revalidatePath("/admin/catalog");
}

export async function deleteSubject(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  try {
    await db.subject.delete({ where: { id } });
  } catch {
    throw new Error("لا يمكن حذف مادة مرتبطة بملازم موجودة");
  }
  revalidatePath("/admin/catalog");
}

export async function createStage(formData: FormData) {
  await assertAdmin();
  const name = str(formData, "name");
  if (!name) throw new Error("اسم المرحلة مطلوب");
  await db.stage.create({ data: { name } });
  revalidatePath("/admin/catalog");
}

export async function deleteStage(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  try {
    await db.stage.delete({ where: { id } });
  } catch {
    throw new Error("لا يمكن حذف مرحلة مرتبطة بملازم موجودة");
  }
  revalidatePath("/admin/catalog");
}

// ============================================================
// الملازم
// ============================================================

function bookletDataFromForm(formData: FormData) {
  const title = str(formData, "title");
  const description = str(formData, "description");
  const subjectId = str(formData, "subjectId");
  const stageId = str(formData, "stageId");
  const teacherId = str(formData, "teacherId");
  const price = Number(str(formData, "price"));
  const overrideRaw = str(formData, "teacherProfitPercentageOverride");
  const coverImageUrl = str(formData, "coverImageUrl");
  const status = str(formData, "status") as BookletStatus;

  if (!title || !subjectId || !stageId || !teacherId || !price) {
    throw new Error("تحقق من تعبئة كل الحقول المطلوبة");
  }

  return {
    title,
    description: description || null,
    subjectId,
    stageId,
    teacherId,
    price,
    teacherProfitPercentageOverride: overrideRaw ? Number(overrideRaw) : null,
    coverImageUrl: coverImageUrl || null,
    status: status || "VISIBLE",
  };
}

export async function createBooklet(formData: FormData) {
  await assertAdmin();
  const data = bookletDataFromForm(formData);
  await db.booklet.create({ data });
  revalidatePath("/admin/booklets");
  revalidatePath("/");
  redirect("/admin/booklets");
}

export async function updateBooklet(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const data = bookletDataFromForm(formData);
  await db.booklet.update({ where: { id }, data });
  revalidatePath("/admin/booklets");
  revalidatePath("/");
  redirect("/admin/booklets");
}

export async function deleteBooklet(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");

  const orderCount = await db.order.count({ where: { bookletId: id } });
  if (orderCount > 0) {
    throw new Error("لا يمكن حذف ملزمة لها طلبات مسجّلة. أخفِها بدلًا من الحذف.");
  }

  await db.booklet.delete({ where: { id } });
  revalidatePath("/admin/booklets");
  revalidatePath("/");
}

export async function toggleBookletStatus(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const nextStatus = str(formData, "nextStatus") as BookletStatus;

  await db.booklet.update({ where: { id }, data: { status: nextStatus } });
  revalidatePath("/admin/booklets");
  revalidatePath("/");
}

// ============================================================
// الإشعارات
// ============================================================

export async function markNotificationRead(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  await db.notification.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/admin");
}

export async function markAllNotificationsRead() {
  await assertAdmin();
  await db.notification.updateMany({
    where: { targetRole: "ADMIN", isRead: false },
    data: { isRead: true },
  });
  revalidatePath("/admin");
}

// ============================================================
// إعدادات المكتبة (الهوية البصرية وبيانات التواصل)
// ============================================================

export async function updateLibrarySettings(formData: FormData) {
  await assertAdmin();

  const name = str(formData, "name") || "مكتبة الصديقين";
  const logoUrl = str(formData, "logoUrl"); // فاضي = إزالة الشعار والرجوع للافتراضي
  const phone = str(formData, "phone");
  const email = str(formData, "email");
  const address = str(formData, "address");
  const socialFacebook = str(formData, "socialFacebook");
  const socialInstagram = str(formData, "socialInstagram");
  const socialWhatsapp = str(formData, "socialWhatsapp");
  const colorPrimary = str(formData, "colorPrimary");
  const colorAccent = str(formData, "colorAccent");

  if (colorPrimary && !isValidHexColor(colorPrimary)) {
    throw new Error("لون أساسي غير صالح");
  }
  if (colorAccent && !isValidHexColor(colorAccent)) {
    throw new Error("لون ثانوي غير صالح");
  }

  const entries: Array<[string, string]> = [
    ["library_name", name],
    ["library_logo", logoUrl],
    ["library_phone", phone],
    ["library_email", email],
    ["library_address", address],
    ["social_facebook", socialFacebook],
    ["social_instagram", socialInstagram],
    ["social_whatsapp", socialWhatsapp],
    ["color_primary", colorPrimary],
    ["color_accent", colorAccent],
  ];

  await db.$transaction(
    entries.map(([key, value]) =>
      db.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  // الشعار والاسم يظهران في كل صفحة تقريبًا (الهيدر العام، لوحتي الأدمن
  // والأستاذ)، لذلك نُنعش المسار الجذري كامًلا بدل صفحة واحدة فقط
  revalidatePath("/", "layout");
}

// ============================================================
// الطلبات
// ============================================================

export async function updateOrderStatus(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const nextStatus = str(formData, "nextStatus") as OrderStatus;

  const order = await db.order.update({
    where: { id },
    data: { status: nextStatus },
    include: { booklet: true, teacher: true },
  });

  if (nextStatus === "DELIVERED") {
    // نحتسب لقطة الأرباح فقط الآن، عند اكتمال البيع فعليًا
    const percentage = resolveProfitPercentage(
      order.booklet.teacherProfitPercentageOverride,
      order.teacher.profitPercentage
    );
    const { teacherShare, libraryShare } = calculateProfitSplit(order.priceAtOrder, percentage);

    await db.profitSnapshot.upsert({
      where: { orderId: order.id },
      update: { teacherShare, libraryShare },
      create: { orderId: order.id, teacherShare, libraryShare },
    });
  } else {
    // إذا رجعت الحالة للخلف بعد أن كانت "تم التسليم"، نلغي لقطة الربح لتبقى الأرقام صحيحة
    await db.profitSnapshot.deleteMany({ where: { orderId: order.id } });
  }

  revalidatePath("/admin/orders");
  revalidatePath("/teacher/orders");
  revalidatePath("/admin");
  revalidatePath("/teacher/dashboard");
}
