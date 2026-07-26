/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // أضف هنا نطاق تخزين الصور الذي ستعتمده (مثلًا Cloudflare R2 أو S3) عند إعداده
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
