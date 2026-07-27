export const PAGE_SIZE_ADMIN = 20;
export const PAGE_SIZE_STUDENT = 24;

/** يحوّل قيمة searchParams.page (نص أو غير موجود) إلى رقم صفحة صالح، دائمًا 1 أو أكبر. */
export function parsePage(value?: string): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

export function totalPagesOf(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}
