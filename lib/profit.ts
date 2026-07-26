import { Decimal } from "@prisma/client/runtime/library";

/**
 * دالة موحدة لحساب حصة الأستاذ وحصة المكتبة من ثمن الطلب.
 * يجب استدعاء هذه الدالة فقط عند تأكيد الطلب (لحفظ لقطة الربح)
 * وليس عند عرض التقارير، حتى لا تتغير الأرباح القديمة بأثر رجعي
 * إذا عدّل الأدمن نسبة أستاذ لاحقًا.
 */
export function calculateProfitSplit(price: number | Decimal, profitPercentage: number | Decimal) {
  const priceNum = Number(price);
  const percentNum = Number(profitPercentage);

  const teacherShare = Math.round(priceNum * (percentNum / 100) * 100) / 100;
  const libraryShare = Math.round((priceNum - teacherShare) * 100) / 100;

  return { teacherShare, libraryShare };
}

/**
 * يحدد نسبة الربح الفعلية لملزمة معينة:
 * يستخدم النسبة المخصصة للملزمة إن وُجدت، وإلا يعود للنسبة الافتراضية لدى الأستاذ.
 */
export function resolveProfitPercentage(
  bookletOverride: number | Decimal | null,
  teacherDefault: number | Decimal
) {
  return bookletOverride !== null && bookletOverride !== undefined
    ? Number(bookletOverride)
    : Number(teacherDefault);
}
