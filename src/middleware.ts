import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, locales, type Locale } from './lib/i18n'
import { isCanonicalSegment, routeFileSegment, routeKeyFromSegment, routeSegment } from './lib/routes'

/**
 * İKİ İŞ YAPAR:
 *
 * 1. Dil öneki ekler: `/hakkimizda` → `/tr/hakkimizda`.
 *
 * 2. Yerelleştirilmiş URL'i dosya yoluna YENİDEN YAZAR. Next.js dosya sistemine
 *    göre yönlendirdiği için `app/(site)/[locale]/about/page.tsx` dosyası
 *    `/tr/about` adresine karşılık gelir; biz ise adres çubuğunda
 *    `/tr/hakkimizda` görmek istiyoruz. Bu yüzden gelen `/tr/hakkimizda`
 *    isteği içeride `/tr/about` olarak çalıştırılır — tarayıcıdaki adres
 *    değişmez.
 *
 *    Kanonik olmayan segmentler (ör. Türkçe sayfaya `/tr/about` ile gelinmesi)
 *    kalıcı yönlendirmeyle doğru adrese taşınır; böylece aynı içerik iki
 *    ayrı adresten yayınlanmaz (SEO'da yinelenen içerik olmaz).
 */

const PUBLIC_FILE = /\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|txt|xml|json|pdf|woff2?|ttf|css|js|map)$/i

function preferredLocale(request: NextRequest): Locale {
  const header = request.headers.get('accept-language') || ''
  const first = header.split(',')[0]?.trim().toLowerCase() ?? ''
  if (first.startsWith('tr')) return 'tr'
  if (first.startsWith('en')) return 'en'
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const parts = pathname.split('/').filter(Boolean)
  const maybeLocale = parts[0]

  // 1) Dil öneki yoksa ekle
  if (!maybeLocale || !(locales as readonly string[]).includes(maybeLocale)) {
    const locale = preferredLocale(request)
    const target = new URL(`/${locale}${pathname === '/' ? '' : pathname}${search}`, request.url)
    return NextResponse.redirect(target)
  }

  const locale = maybeLocale as Locale
  const rest = parts.slice(1)

  // Anasayfa
  if (rest.length === 0) return NextResponse.next()

  const segment = rest[0]
  const key = routeKeyFromSegment(segment)

  // Bilinmeyen segment → Next 404 versin
  if (!key) return NextResponse.next()

  const canonical = routeSegment(key, locale)
  const tail = rest.slice(1)

  // Yol her zaman "/" ile başlamalı — aksi hâlde new URL() göreli çözer ve
  // /tr/tr/about gibi bir adres oluşur.
  const buildPath = (mid: string) => '/' + [locale, mid, ...tail].filter(Boolean).join('/')

  // 2) Kanonik olmayan adres → kalıcı yönlendirme
  if (!isCanonicalSegment(key, locale, segment)) {
    return NextResponse.redirect(new URL(`${buildPath(canonical)}${search}`, request.url), 308)
  }

  // 3) Kanonik adres → dosya yoluna yeniden yaz (adres çubuğu değişmez)
  const file = routeFileSegment(key)
  if (file && file !== canonical) {
    return NextResponse.rewrite(new URL(`${buildPath(file)}${search}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
