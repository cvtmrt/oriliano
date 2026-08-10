'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import { routeKeyFromSegment, routeSegment } from '@/lib/routes'

/**
 * TR/EN geçişi.
 *
 * Yol segmentleri dile göre farklı olduğu için (`/tr/hizmetlerimiz` ↔
 * `/en/services`) yalnızca dil önekini değiştirmek yetmez. Statik sayfalarda
 * segment haritasından çeviririz; dinamik slug'lı sayfalarda (hizmet/ekip
 * detayı) sunucudan gelen `slugMap` kullanılır, yoksa liste sayfasına düşer.
 */
export default function LocaleSwitch({
  locale,
  slugMap,
}: {
  locale: Locale
  /** { tr: 'is-hukuku', en: 'labour-law' } gibi */
  slugMap?: Partial<Record<Locale, string>>
}) {
  const pathname = usePathname() || `/${locale}`
  const segments = pathname.split('/').filter(Boolean)

  function targetPath(target: Locale): string {
    if (target === locale) return pathname
    if (segments.length <= 1) return `/${target}`

    const routeKey = routeKeyFromSegment(segments[1])
    if (!routeKey) return `/${target}`

    const seg = routeSegment(routeKey, target)
    const hasSlug = segments.length > 2

    if (!hasSlug) return `/${target}${seg ? `/${seg}` : ''}`

    const mapped = slugMap?.[target]
    if (mapped) return `/${target}/${seg}/${mapped}`
    // Karşı dildeki slug bilinmiyorsa liste sayfasına gönder — 404 verme.
    return `/${target}${seg ? `/${seg}` : ''}`
  }

  return (
    <div
      className="flex items-center gap-1 text-[0.72rem] font-medium uppercase tracking-wider"
      role="group"
      aria-label={locale === 'tr' ? 'Dil seçimi' : 'Language selection'}
    >
      {locales.map((code, i) => {
        const active = code === locale
        return (
          <span key={code} className="flex items-center">
            {i > 0 ? <span className="mx-1 text-paper-line">|</span> : null}
            {active ? (
              <span aria-current="true" className="px-1 text-navy-800">
                {code.toUpperCase()}
              </span>
            ) : (
              <Link
                href={targetPath(code)}
                hrefLang={code}
                className="px-1 text-graphite-500 transition-colors hover:text-navy-800"
              >
                {code.toUpperCase()}
              </Link>
            )}
          </span>
        )
      })}
    </div>
  )
}
