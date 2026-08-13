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
        disallow: ['/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}

/**
 * NEDEN BURADA `/admin` YAZMIYOR?
 *
 * robots.txt herkese açık bir dosya. Oraya `Disallow: /admin` yazmak panelin
 * yerini ilan etmekten başka bir işe yaramıyor — panel adresini arayan biri
 * ilk oraya bakar.
 *
 * Karşılığında bir koruma da sağlamıyor: anahtarsız her `/admin` isteği zaten
 * 404 dönüyor (bkz. middleware'deki kapı), yani Googlebot içeriyi hiç
 * göremiyor. Dahası `Disallow`, ters bile tepebilir: Google engellenen bir
 * adresi tarayamadan, yalnızca bir yerde bağlantısını görüp "robots.txt
 * nedeniyle engellendi" notuyla sonuçlarda listeleyebiliyor. 404 dönen ve
 * engellenmemiş bir adres ise hiçbir zaman dizine girmiyor.
 *
 * Yani panelin görünmezliği üç şeye dayanıyor: kapıdan 404, sayfa ve başlık
 * düzeyinde noindex, ve sitede panele giden hiçbir bağlantının olmaması.
 */
