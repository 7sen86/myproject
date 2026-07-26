import { PrismaClient } from "@prisma/client";

// نمط singleton ضروري في Next.js لتفادي فتح اتصالات جديدة بقاعدة البيانات
// مع كل Hot Reload أثناء التطوير.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
