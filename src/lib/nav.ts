import type { Locale } from './i18n'
import { href, routeSegment, type RouteKey } from './routes'

export { href, routeSegment, routeKeyFromSegment, routeKeys } from './routes'
export type { RouteKey } from './routes'

/** `/tr/hizmetlerimiz/is-hukuku` */
export function serviceHref(locale: Locale, slug: string): string {
  return href('services', locale, slug)
}

/** `/tr/ekibimiz/av-ad-soyad-1` */
export function teamHref(locale: Locale, slug: string): string {
  return href('team', locale, slug)
}

/** `/tr/yayinlar/ornek-yazi` */
export function publicationHref(locale: Locale, slug: string): string {
  return href('publications', locale, slug)
}

export function pageHref(key: RouteKey, locale: Locale): string {
  return href(key, locale)
}

export function segmentFor(key: RouteKey, locale: Locale): string {
  return routeSegment(key, locale)
}
