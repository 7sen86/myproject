import type { Metadata } from "next";
import { El_Messiri, Tajawal } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

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

export const metadata: Metadata = {
  title: "مكتبة الصديقين — ملازم دراسية",
  description: "تصفح ملازم أساتذتك واطلبها في دقيقة واحدة",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-body bg-paper text-charcoal antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
