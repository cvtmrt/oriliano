import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, pick, type Locale } from '@/lib/i18n'
import { getImage, getServices, getT, serviceSlug } from '@/lib/content'
import { href, serviceHref } from '@/lib/nav'
import { buildMetadata } from '@/lib/seo'
import PageHero from '@/components/site/PageHero'
import ServiceCard from '@/components/site/ServiceCard'
import { Reveal, Stagger } from '@/components/motion'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  return buildMetadata('services', isLocale(raw) ? raw : 'tr')
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  const [t, hero, services] = await Promise.all([
    getT(locale),
    getImage('services.hero.image', locale),
    getServices(),
  ])

  return (
    <>
      <PageHero
        eyebrow={t('services.hero.eyebrow')}
        title={t('services.hero.title')}
        subtitle={t('services.hero.subtitle')}
        image={hero}
      />

      <section className="container py-20 lg:py-24">
        {services.length > 0 ? (
          <Stagger
            as="ul"
            className="grid gap-px overflow-hidden border border-paper-line bg-paper-line sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                href={serviceHref(locale, serviceSlug(service, locale))}
                title={pick(locale, service.titleTr, service.titleEn)}
                excerpt={pick(locale, service.excerptTr, service.excerptEn)}
                icon={service.icon}
                cta={t('common.cta.detail')}
              />
            ))}
          </Stagger>
        ) : (
          <p className="text-graphite-500">{t('publications.empty')}</p>
        )}

        <Reveal delay={120}>
          <div className="mt-14 border-t border-paper-line pt-10">
            <p className="text-[0.98rem] text-graphite-600">{t('home.cta.body')}</p>
            <Link href={href('contact', locale)} className="btn-primary mt-6">
              {t('common.cta.contact')}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
