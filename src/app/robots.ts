import type { MetadataRoute } from 'next'
import { getSettings } from '@/lib/content'

// Panelden değiştirilen alan adını okuduğu için istek anında üretiliyor.
export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings()
  const base = (settings.baseUrl?.trim() || 'https://cetinerlegal.com').replace(/\/$/, '')

  // Ön izleme ortamlarında (Railway alt alan adı) arama motorlarını içeri alma.
  const isPreview = process.env.DISALLOW_INDEXING === 'true'

  if (isPreview) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      sitemap: `${base}/sitemap.xml`,
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
