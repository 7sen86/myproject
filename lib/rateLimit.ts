/**
 * محدّد معدّل بسيط في الذاكرة، هدفه منع سبام الطلبات من نفس الجهاز خلال فترة قصيرة.
 *
 * ملاحظة مهمة: هذا حل "أفضل من لا شيء" وليس حماية كاملة —
 * لأنه يعمل داخل عملية السيرفر نفسها فقط. إذا كان النظام يعمل على أكثر
 * من نسخة سيرفر (serverless متعدد الأمثلة) فكل نسخة تحتفظ بعدّادها الخاص.
 * لحماية أقوى مستقبلًا يُفضّل الانتقال لتخزين مشترك مثل Redis.
 */
const hits = new Map<string, number[]>();

// تنظيف دوري بسيط حتى لا تتراكم المفاتيح القديمة في الذاكرة إلى الأبد
const MAX_TRACKED_KEYS = 5000;

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const existing = hits.get(key) ?? [];
  const recent = existing.filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_TRACKED_KEYS) {
    const oldestKey = hits.keys().next().value;
    if (oldestKey) hits.delete(oldestKey);
  }

  return false;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
