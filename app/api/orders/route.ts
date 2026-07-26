import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createOrderSchema } from "@/lib/validation";

/**
 * ملاحظة تصميم مهمة:
 * لا نُنشئ لقطة الأرباح (ProfitSnapshot) هنا عند مجرد استلام الطلب،
 * لأن الربح الفعلي يجب أن يُحتسب فقط عند اكتمال البيع فعليًا
 * (عندما يغيّر الأدمن/الأستاذ حالة الطلب إلى "تم التسليم" لاحقًا).
 * هذا سيُنفَّذ في مرحلة إدارة الطلبات.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "بيانات الطلب غير صالحة" }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "بيانات غير صحيحة";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { bookletId, studentName, studentPhone, governorateId, addressDetails, notes } =
    parsed.data;

  const booklet = await db.booklet.findUnique({ where: { id: bookletId } });

  if (!booklet || booklet.status !== "VISIBLE") {
    return NextResponse.json({ error: "هذه الملزمة غير متاحة حاليًا" }, { status: 404 });
  }

  const order = await db.order.create({
    data: {
      bookletId: booklet.id,
      teacherId: booklet.teacherId, // نسخ ثابت وقت الطلب
      studentName,
      studentPhone,
      governorateId: governorateId || null,
      addressDetails: addressDetails || null,
      notes: notes || null,
      priceAtOrder: booklet.price, // نسخ ثابت من السعر وقت الطلب
      status: "NEW",
    },
  });

  // زيادة عدّاد الطلب لأغراض ترتيب "الأكثر طلبًا" في الواجهة الرئيسية
  await db.booklet.update({
    where: { id: booklet.id },
    data: { salesCount: { increment: 1 } },
  });

  // إشعار لوحة الإدارة بوصول طلب جديد
  await db.notification.create({
    data: {
      type: "new_order",
      message: `طلب جديد على "${booklet.title}" من ${studentName}`,
      targetRole: "ADMIN",
    },
  });

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
