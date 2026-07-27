import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * لتنسيق السعر بشكل موحّد في كل الواجهة.
 * يقبل number أو string أو أي قيمة عندها toString() (مثل Prisma Decimal)
 * حتى يعمل مباشرة مع الحقول القادمة من قاعدة البيانات (price, priceAtOrder...).
 */
export function formatPrice(price: number | string | { toString(): string }) {
  const num = Number(price.toString());
  return new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 0 }).format(num);
}
