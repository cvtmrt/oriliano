import { getSettings, siteName, mediaUrl } from '@/lib/content'
import { pick, type Locale } from '@/lib/i18n'
import { jsonLdScript } from '@/lib/seo'

/**
 * LegalService yapılandırılmış verisi. Uydurma puan/yorum/ödül ALANI YOK —
 * yalnızca panelden girilen gerçek bilgiler yayınlanır.
 */
export default async function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const settings = await getSettings()
  const base = settings.baseUrl?.trim() || 'https://cetinerlegal.com'
  const name = siteName(settings, locale)
  const address = pick(locale, settings.addressTr, settings.addressEn)

  const sameAs = [settings.linkedin, settings.instagram, settings.x, settings.facebook, settings.youtube]
    .map((v) => (v || '').trim())
    .filter(Boolean)

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name,
    url: `${base}/${locale}`,
    inLanguage: locale,
  }

  const tagline = pick(locale, settings.taglineTr, settings.taglineEn)
  if (tagline) data.description = tagline
  if (settings.logo) data.logo = `${base}${mediaUrl(settings.logo.filename)}`
  if (settings.phone) data.telephone = settings.phone
  if (settings.email) data.email = settings.email
  if (sameAs.length > 0) data.sameAs = sameAs
  if (address) {
    data.address = { '@type': 'PostalAddress', streetAddress: address, addressCountry: 'TR' }
  }
  if (settings.mapLat && settings.mapLng) {
    data.geo = {
      '@type': 'GeoCoordinates',
      latitude: settings.mapLat,
      longitude: settings.mapLng,
    }
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(data)} />
}
