import type { Metadata, Viewport } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import { notFound } from 'next/navigation'
import '@/app/globals.css'
import { locales, isLocale, htmlLang, type Locale } from '@/lib/i18n'
import { getSettings, getMenu, getT, siteName, getImage, mediaUrl } from '@/lib/content'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import OrganizationJsonLd from '@/components/site/OrganizationJsonLd'

const sans = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-sans',
})

const serif = Source_Serif_4({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-serif',
})

export const viewport: Viewport = {
  themeColor: '#1E2A5E',
  width: 'device-width',
  initialScale: 1,
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'tr'
  const settings = await getSettings()
  const name = siteName(settings, locale)
  const base = settings.baseUrl?.trim() || 'https://cetinerlegal.com'

  return {
    metadataBase: new URL(base),
    title: { default: name, template: `%s | ${name}` },
    applicationName: name,
    icons: settings.favicon ? { icon: mediaUrl(settings.favicon.filename) } : undefined,
    robots: { index: true, follow: true },
  }
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  const [settings, menu, t, logo] = await Promise.all([
    getSettings(),
    getMenu(locale),
    getT(locale),
    getImage('seo.defaultOg', locale),
  ])
  void logo

  const accent = settings.accentColor?.trim() || '#A9834B'

  return (
    <html
      lang={htmlLang[locale]}
      className={`${sans.variable} ${serif.variable} no-js`}
      style={{ ['--accent' as string]: accent, ['--accent-soft' as string]: `${accent}1A` }}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        {/* JS varsa reveal güvenliğini kaldır — JS yoksa içerik zaten görünür kalır. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js')`,
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-navy-800 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          {locale === 'tr' ? 'İçeriğe geç' : 'Skip to content'}
        </a>

        <Header
          locale={locale}
          menu={menu}
          siteName={siteName(settings, locale)}
          logoSrc={settings.logo ? mediaUrl(settings.logo.filename) : null}
          contactLabel={t('common.cta.contact')}
          phone={settings.phone}
        />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer locale={locale} menu={menu} />

        <OrganizationJsonLd locale={locale} />
      </body>
    </html>
  )
}
