import type { Metadata } from 'next'
import { getSeo, getSettings, getImage, siteName } from './content'
import { pick, ogLocale, type Locale } from './i18n'
import { locales } from './i18n'
import { href, type RouteKey } from './routes'

/**
 * Sayfa metadata'sı: başlık/açıklama panelden (SeoMeta), yoksa varsayılandan.
 * hreflang alternatifleri her sayfada üretilir.
 */
export async function buildMetadata(
  routeKey: RouteKey,
  locale: Locale,
  options: {
    /** Dinamik sayfalarda (hizmet/ekip detayı) başlığı üstten geç. */
    title?: string
    description?: string
    slugMap?: Partial<Record<Locale, string>>
    ogImage?: string | null
    noindex?: boolean
  } = {},
): Promise<Metadata> {
  const [settings, seo, fallbackOg] = await Promise.all([
    getSettings(),
    getSeo(routeKey),
    getImage('seo.defaultOg', locale),
  ])

  const base = settings.baseUrl?.trim() || 'https://cetinerlegal.com'
  const name = siteName(settings, locale)

  const title =
    options.title ||
    (seo.row ? pick(locale, seo.row.titleTr, seo.row.titleEn) : '') ||
    (seo.def ? pick(locale, seo.def.titleTr, seo.def.titleEn) : name)

  const description =
    options.description ||
    (seo.row ? pick(locale, seo.row.descTr, seo.row.descEn) : '') ||
    (seo.def ? pick(locale, seo.def.descTr, seo.def.descEn) : '')

  const path = href(routeKey, locale, options.slugMap?.[locale])
  const canonical = `${base}${path}`

  const languages: Record<string, string> = {}
  for (const code of locales) {
    languages[code] = `${base}${href(routeKey, code, options.slugMap?.[code])}`
  }
  languages['x-default'] = `${base}${href(routeKey, 'tr', options.slugMap?.tr)}`

  const image = options.ogImage ?? fallbackOg.src
  const noindex = options.noindex ?? seo.row?.noindex ?? false

  return {
    title,
    description,
    alternates: { canonical, languages },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: name,
      title,
      description,
      url: canonical,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: image ? [{ url: image.startsWith('http') ? image : `${base}${image}` }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image.startsWith('http') ? image : `${base}${image}`] : undefined,
    },
  }
}

export function jsonLdScript(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, '\\u003c'),
  }
}
