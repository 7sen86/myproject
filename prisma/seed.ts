/**
 * سكربت التهيئة الأولية لقاعدة البيانات.
 * يُشغَّل مرة واحدة بعد أول migration عبر: npm run seed
 *
 * ينشئ:
 * - حساب أدمن افتراضي (يجب تغيير كلمة المرور فورًا بعد أول دخول)
 * - محافظة افتراضية واحدة (تخدم النسخة الحالية أحادية الموقع)
 * - بعض المواد والمراحل الشائعة كنقطة بداية (يمكن للأدمن إضافة/حذف لاحقًا)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1) حساب الأدمن الافتراضي
  const adminUsername = process.env.SEED_ADMIN_USERNAME || "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        role: "ADMIN",
        username: adminUsername,
        passwordHash,
        isActive: true,
      },
    });
    console.log(`✅ تم إنشاء حساب الأدمن: ${adminUsername} / ${adminPassword}`);
    console.log("⚠️  غيّر كلمة المرور فورًا بعد أول تسجيل دخول.");
  } else {
    console.log("ℹ️  حساب الأدمن موجود مسبقًا، تم التخطي.");
  }

  // 2) المحافظة الافتراضية (النظام أحادي الموقع حاليًا)
  await prisma.governorate.upsert({
    where: { name: "المحافظة الرئيسية" },
    update: {},
    create: { name: "المحافظة الرئيسية", isActive: true },
  });

  // 3) مراحل دراسية أساسية كنقطة انطلاق
  const stages = ["الإعدادية", "الثانوية", "الجامعة"];
  for (const name of stages) {
    await prisma.stage.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 4) مواد أساسية كنقطة انطلاق
  const subjects = ["رياضيات", "فيزياء", "كيمياء", "لغة عربية", "لغة إنجليزية"];
  for (const name of subjects) {
    await prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("✅ اكتملت عملية التهيئة الأولية.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
