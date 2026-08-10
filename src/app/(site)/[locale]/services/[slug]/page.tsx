import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, pick, type Locale } from '@/lib/i18n'
import {
  getImage,
  getServiceBySlug,
  getServices,
  getSettings,
  getT,
  mediaUrl,
  serviceSlug,
  siteName,
} from '@/lib/content'
import { href, serviceHref } from '@/lib/nav'
import { buildMetadata, jsonLdScript } from '@/lib/seo'
import { htmlToText } from '@/lib/html'
import PageHero from '@/components/site/PageHero'
import Breadcrumbs from '@/components/site/Breadcrumbs'
import ServiceIcon from '@/components/site/ServiceIcon'
import LocaleSwitch from '@/components/site/LocaleSwitch'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: raw, slug } = await params
  const locale: Locale = isLocale(raw) ? raw : 'tr'
  const service = await getServiceBySlug(slug)
  if (!service) return buildMetadata('services', locale)

  const title =
    pick(locale, service.seoTitleTr, service.seoTitleEn) ||
    pick(locale, service.titleTr, service.titleEn)
  const description =
    pick(locale, service.seoDescTr, service.seoDescEn) ||
    pick(locale, service.excerptTr, service.excerptEn) ||
    htmlToText(pick(locale, service.bodyTr, service.bodyEn), 155)

  return buildMetadata('services', locale, {
    title,
    description,
    slugMap: { tr: service.slugTr, en: service.slugEn || service.slugTr },
    ogImage: service.ogImage ? mediaUrl(service.ogImage.filename) : null,
  })
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  const service = await getServiceBySlug(slug)
  if (!service) notFound()

  const [t, all, settings, heroFallback] = await Promise.all([
    getT(locale),
    getServices(),
    getSettings(),
    getImage('services.hero.image', locale),
  ])

  // Yanlış dildeki slug ile gelinmişse doğru slug'a yönlendirmek yerine
  // kanonik etiketle bırakıyoruz (buildMetadata canonical'ı doğru üretiyor).
  const title = pick(locale, service.titleTr, service.titleEn)
  const body = pick(locale, service.bodyTr, service.bodyEn)
  const excerpt = pick(locale, service.excerptTr, service.excerptEn)

  const image = service.image
    ? { src: mediaUrl(service.image.filename), alt: pick(locale, service.imageAltTr, service.imageAltEn) || title }
    : heroFallback

  const others = all.filter((s) => s.id !== service.id).slice(0, 6)
  const base = settings.baseUrl?.trim() || 'https://cetinerlegal.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description: excerpt || htmlToText(body, 200),
    serviceType: title,
    inLanguage: locale,
    url: `${base}${serviceHref(locale, serviceSlug(service, locale))}`,
    provider: { '@type': 'LegalService', name: siteName(settings, locale), url: `${base}/${locale}` },
    ...(settings.addressTr
      ? { areaServed: { '@type': 'Country', name: 'Türkiye' } }
      : {}),
  }

  return (
    <>
      <PageHero eyebrow={t('services.hero.eyebrow')} title={title} subtitle={excerpt} image={image} />

      <div className="container pt-8">
        <Breadcrumbs
          items={[
            { label: t('services.hero.eyebrow'), href: href('services', locale) },
            { label: title, href: serviceHref(locale, serviceSlug(service, locale)) },
          ]}
        />
      </div>

      <section className="container py-14 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1fr_18rem] lg:gap-20">
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-paper-line"
                  style={{ color: 'var(--accent)' }}
                >
                  <ServiceIcon name={service.icon} className="h-6 w-6" />
                </span>
                <h2 className="font-serif text-xl text-navy-900">{t('services.detail.scopeTitle')}</h2>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="prose-legal mt-8" dangerouslySetInnerHTML={{ __html: body }} />
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-12 border-t border-paper-line pt-8">
                <Link href={href('contact', locale)} className="btn-primary">
                  {t('common.cta.contact')}
                </Link>
              </div>
            </Reveal>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-serif text-base uppercase tracking-[0.12em] text-navy-900">
              {t('services.detail.otherTitle')}
            </h2>
            <hr className="rule mt-4" />
            <Stagger as="ul" className="mt-6 space-y-1">
              {others.map((other) => (
                <StaggerItem as="li" key={other.id}>
                  <Link
                    href={serviceHref(locale, serviceSlug(other, locale))}
                    className="flex items-center justify-between gap-3 border-b border-paper-line py-3 text-sm text-graphite-700 transition-colors hover:text-navy-800"
                  >
                    <span>{pick(locale, other.titleTr, other.titleEn)}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
                      <path
                        d="M5 12h14m-6-6 6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>

            <div className="mt-8">
              <LocaleSwitch
                locale={locale}
                slugMap={{ tr: service.slugTr, en: service.slugEn || service.slugTr }}
              />
            </div>
          </aside>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    </>
  )
}
