import type { MetadataRoute } from 'next'
import { getSettings, getServices, getTeam, getPublications, isRouteVisible, serviceSlug, publicationSlug } from '@/lib/content'
import { locales, type Locale } from '@/lib/i18n'
import { href, routeKeys, type RouteKey } from '@/lib/routes'

/**
 * İstek anında üretilir, build'de değil.
 *
 * Build sırasında veritabanına erişilemediği (Railway özel ağ) için
 * ön-üretilen sitemap yalnızca statik sayfaları içeriyordu; hizmet, ekip ve
 * yayın adresleri eksik kalıyordu. Sitemap'i tarayıcılar seyrek çektiği için
 * her istekte üretmek sorun değil, karşılığında hep güncel.
 */
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings()
  const base = (settings.baseUrl?.trim() || 'https://cetinerlegal.com').replace(/\/$/, '')

  const entries: MetadataRoute.Sitemap = []

  const publicationsVisible = await isRouteVisible('publications')

  function alternates(key: RouteKey, slugMap?: Partial<Record<Locale, string>>) {
    const languages: Record<string, string> = {}
    for (const code of locales) {
      languages[code] = `${base}${href(key, code, slugMap?.[code])}`
    }
    return { languages }
  }

  // Statik sayfalar
  for (const key of routeKeys) {
    if (key === 'publications' && !publicationsVisible) continue
    for (const locale of locales) {
      entries.push({
        url: `${base}${href(key, locale)}`,
        lastModified: settings.updatedAt,
        changeFrequency: key === 'home' ? 'weekly' : 'monthly',
        priority: key === 'home' ? 1 : 0.8,
        alternates: alternates(key),
      })
    }
  }

  // Hizmet detayları
  const services = await getServices()
  for (const service of services) {
    const slugMap = { tr: service.slugTr, en: service.slugEn || service.slugTr }
    for (const locale of locales) {
      entries.push({
        url: `${base}${href('services', locale, serviceSlug(service, locale))}`,
        lastModified: service.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: alternates('services', slugMap),
      })
    }
  }

  // Ekip detayları
  const team = await getTeam()
  for (const member of team) {
    const slugMap = { tr: member.slug, en: member.slug }
    for (const locale of locales) {
      entries.push({
        url: `${base}${href('team', locale, member.slug)}`,
        lastModified: member.updatedAt,
        changeFrequency: 'yearly',
        priority: 0.5,
        alternates: alternates('team', slugMap),
      })
    }
  }

  // Yayınlar (bölüm açıksa)
  if (publicationsVisible) {
    const publications = await getPublications()
    for (const item of publications) {
      const slugMap = { tr: item.slugTr, en: item.slugEn || item.slugTr }
      for (const locale of locales) {
        entries.push({
          url: `${base}${href('publications', locale, publicationSlug(item, locale))}`,
          lastModified: item.updatedAt,
          changeFrequency: 'yearly',
          priority: 0.6,
          alternates: alternates('publications', slugMap),
        })
      }
    }
  }

  return entries
}
