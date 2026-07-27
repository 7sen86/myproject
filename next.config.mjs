/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // أضف هنا نطاق تخزين الصور الذي ستعتمده (مثلًا Cloudflare R2 أو S3) عند إعداده
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    // صور الغلاف تُرفع وتُحفظ كنص Base64 مباشرة داخل النموذج (بدون خدمة تخزين خارجية)،
    // فنرفع الحد الافتراضي (1MB) لجسم طلبات Server Actions حتى تمر الصور المضغوطة بأمان.
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
