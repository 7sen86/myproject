import type { Metadata } from "next";
import { El_Messiri, Tajawal } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { getLibrarySettings } from "@/lib/settings";
import { hexToRgbTriplet, lightenHex } from "@/lib/color";

// هذا المشروع بالكامل يعتمد على بيانات حية من القاعدة (الإعدادات، الجلسات،
// الطلبات...) في كل صفحة تقريبًا عبر التخطيط الجذري (RootLayout يستدعي
// getLibrarySettings). لذلك نمنع Next.js من محاولة توليد أي صفحة بشكل ثابت
// وقت البناء (وهو ما كان يفشل سابقًا لعدم توفر DATABASE_URL وقت الـ build) —
// كل الصفحات تُعرض ديناميكيًا عند الطلب الفعلي بدلًا من ذلك.
export const dynamic = "force-dynamic";

// El Messiri: خط عرض عربي بشخصية واضحة، يُستخدم للعناوين فقط
const displayFont = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Tajawal: خط نصوص عربي واضح ومريح للقراءة الطويلة
const bodyFont = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getLibrarySettings();
  return {
    title: `${settings.name} — ملازم دراسية`,
    description: "تصفح ملازم أساتذتك واطلبها في دقيقة واحدة",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getLibrarySettings();

  // نبني قيم CSS Variables من ألوان المكتبة المحفوظة، ونستخدمها لتجاوز
  // القيم الافتراضية في globals.css — إذا كانت القيمة غير صالحة (نادر جدًا،
  // مثل تلاعب مباشر بقاعدة البيانات) نتجاهلها بهدوء وتبقى الألوان الافتراضية.
  const primaryTriplet = hexToRgbTriplet(settings.colorPrimary);
  const primaryLightTriplet = hexToRgbTriplet(lightenHex(settings.colorPrimary, 0.15));
  const accentTriplet = hexToRgbTriplet(settings.colorAccent);

  const cssVars = [
    primaryTriplet ? `--color-ink: ${primaryTriplet};` : "",
    primaryLightTriplet ? `--color-ink-light: ${primaryLightTriplet};` : "",
    accentTriplet ? `--color-marker: ${accentTriplet};` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html lang="ar" dir="rtl" className={`${displayFont.variable} ${bodyFont.variable}`}>
      {cssVars && (
        <head>
          <style dangerouslySetInnerHTML={{ __html: `:root { ${cssVars} }` }} />
        </head>
      )}
      <body className="font-body bg-paper text-charcoal antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
