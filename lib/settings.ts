import { cache } from "react";
import { db } from "@/lib/db";

export const DEFAULT_LIBRARY_NAME = "مكتبة الصديقين";
export const DEFAULT_COLOR_PRIMARY = "#1E2A4A"; // نفس قيمة ink الافتراضية في tailwind.config
export const DEFAULT_COLOR_ACCENT = "#F2A93B"; // نفس قيمة marker الافتراضية في tailwind.config

export type LibrarySettings = {
  name: string;
  logoUrl: string | null; // Base64 data URL أو null لعرض الشعار الافتراضي
  phone: string;
  email: string;
  address: string;
  socialFacebook: string;
  socialInstagram: string;
  socialWhatsapp: string;
  colorPrimary: string;
  colorAccent: string;
};

const SETTING_KEYS = [
  "library_name",
  "library_logo",
  "library_phone",
  "library_email",
  "library_address",
  "social_facebook",
  "social_instagram",
  "social_whatsapp",
  "color_primary",
  "color_accent",
] as const;

/**
 * يقرأ كل إعدادات المكتبة دفعة وحدة (صف واحد لكل مفتاح في system_settings)
 * ويرجعها بشكل كائن مرتب مع قيم افتراضية معقولة لأي مفتاح غير محفوظ بعد.
 *
 * تُستدعى هذه الدالة من عدة أماكن (Header, Sidebar, صفحة الإعدادات، الصفحة
 * الرئيسية) في كل طلب، وهذا مقصود ومقبول لأن الجدول صغير جدًا (10 صفوف)
 * واستعلامه رخيص جدًا مقارنة باستعلامات الملازم/الطلبات.
 */
export const getLibrarySettings = cache(async (): Promise<LibrarySettings> => {
  const rows = await db.systemSetting.findMany({
    where: { key: { in: [...SETTING_KEYS] } },
  });

  const map = new Map(rows.map((r) => [r.key, r.value]));

  return {
    name: map.get("library_name") || DEFAULT_LIBRARY_NAME,
    logoUrl: map.get("library_logo") || null,
    phone: map.get("library_phone") || "",
    email: map.get("library_email") || "",
    address: map.get("library_address") || "",
    socialFacebook: map.get("social_facebook") || "",
    socialInstagram: map.get("social_instagram") || "",
    socialWhatsapp: map.get("social_whatsapp") || "",
    colorPrimary: map.get("color_primary") || DEFAULT_COLOR_PRIMARY,
    colorAccent: map.get("color_accent") || DEFAULT_COLOR_ACCENT,
  };
});
