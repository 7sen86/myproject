import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** لتنسيق السعر بشكل موحّد في كل الواجهة */
export function formatPrice(price: number | string) {
  const num = Number(price);
  return new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 0 }).format(num);
}
