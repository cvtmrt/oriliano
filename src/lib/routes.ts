import type { Locale } from './i18n'

/**
 * Kanonik rota anahtarları. Dosya sistemi bu anahtarları kullanır
 * (app/[locale]/services/...), URL'de görünen segment ise dile göre değişir.
 *
 * Menü etiketleri ve sıralaması panelden yönetiliyor (MenuItem tablosu);
 * burada tutulan sadece teknik yol eşlemesi.
 */
export const routeKeys = [
  'home',
  'about',
  'services',
  'legalServices',
  'mediation',
  'team',
  'contact',
  'publications',
] as const

export type RouteKey = (typeof routeKeys)[number]

type Segments = Record<Locale, string>

/** Kanonik dosya yolu → dile göre URL segmenti */
const segments: Record<RouteKey, { file: string; url: Segments }> = {
  home: { file: '', url: { tr: '', en: '' } },
  about: { file: 'about', url: { tr: 'hakkimizda', en: 'about' } },
  services: { file: 'services', url: { tr: 'hizmetlerimiz', en: 'services' } },
  legalServices: {
    file: 'legal-services',
    url: { tr: 'avukatlik-ve-danismanlik', en: 'legal-representation-and-advisory' },
  },
  mediation: { file: 'mediation', url: { tr: 'arabuluculuk', en: 'mediation' } },
  team: { file: 'team', url: { tr: 'ekibimiz', en: 'team' } },
  contact: { file: 'contact', url: { tr: 'iletisim', en: 'contact' } },
  // Dosya adı `publications` kalıyor (app dizini), görünen adres "Makaleler".
  publications: { file: 'publications', url: { tr: 'makaleler', en: 'articles' } },
}

/** Varsayılan menü sırası — seed bunu kullanır, sonrası panelden. */
export const defaultMenuOrder: RouteKey[] = [
  'home',
  'about',
  'services',
  'legalServices',
  'mediation',
  'team',
  'contact',
  'publications',
]

export function routeSegment(key: RouteKey, locale: Locale): string {
  return segments[key].url[locale]
}

export function routeFileSegment(key: RouteKey): string {
  return segments[key].file
}

/** `/tr/hizmetlerimiz` gibi tam yol üretir. */
export function href(key: RouteKey, locale: Locale, slug?: string): string {
  const seg = routeSegment(key, locale)
  const parts = ['', locale, seg, slug].filter((p) => p !== '' && p !== undefined)
  return '/' + parts.join('/')
}

/**
 * Bir segmentin hangi rotaya ait olduğunu bulur.
 *
 * Hem yerelleştirilmiş URL segmentlerini (`hakkimizda`, `about`) hem de dosya
 * sistemi segmentini (`about`, `legal-services`) tanır. Middleware yeniden
 * yazma yaptığı için istemci tarafında `usePathname()` bazen dosya yolunu
 * döndürebilir; her iki durumda da doğru rotayı bulmamız gerekiyor.
 */
export function routeKeyFromSegment(segment: string): RouteKey | null {
  for (const key of routeKeys) {
    const entry = segments[key]
    if (entry.url.tr === segment || entry.url.en === segment) return key
  }
  for (const key of routeKeys) {
    if (segments[key].file && segments[key].file === segment) return key
  }
  return null
}

/** Segment, o dil için kanonik URL segmenti mi? Değilse yönlendirilmeli. */
export function isCanonicalSegment(key: RouteKey, locale: Locale, segment: string): boolean {
  return segments[key].url[locale] === segment
}

/**
 * Dil değiştirme için karşı dildeki yolu üretir. Dinamik slug'lar (hizmet,
 * ekip, yayın) için `slugMap` verilir; verilmezse liste sayfasına döner.
 */
export function alternatePath(
  key: RouteKey,
  target: Locale,
  slug?: string,
): string {
  return href(key, target, slug)
}
