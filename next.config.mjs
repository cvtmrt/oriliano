/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // sharp ve @prisma/client sunucu tarafında native binary kullanıyor,
  // bundle'a girmemeleri gerekiyor.
  serverExternalPackages: ['sharp', '@prisma/client', 'bcryptjs'],
  images: {
    // Yüklenen görseller /api/media/... üzerinden servis ediliyor (Railway Volume).
    // next/image bunları optimize edebilsin diye local pattern tanımlıyoruz.
    formats: ['image/webp'],
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
}

export default nextConfig
