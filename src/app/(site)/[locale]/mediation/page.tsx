import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/i18n'
import { getImage, getSettings, getT, siteName } from '@/lib/content'
import { href } from '@/lib/nav'
import { buildMetadata, jsonLdScript } from '@/lib/seo'
import PageHero from '@/components/site/PageHero'
import { Reveal } from '@/components/motion'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  return buildMetadata('mediation', isLocale(raw) ? raw : 'tr')
}

export default async function MediationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  const [t, hero, settings] = await Promise.all([
    getT(locale),
    getImage('mediation.hero.image', locale),
    getSettings(),
  ])

  const base = settings.baseUrl?.trim() || 'https://cetinerlegal.com'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: locale === 'tr' ? 'Arabuluculuk' : 'Mediation',
    description: t('mediation.hero.subtitle'),
    inLanguage: locale,
    url: `${base}${href('mediation', locale)}`,
    provider: { '@type': 'LegalService', name: siteName(settings, locale), url: `${base}/${locale}` },
  }

  return (
    <>
      <PageHero
        eyebrow={t('mediation.hero.eyebrow')}
        title={t('mediation.hero.title')}
        subtitle={t('mediation.hero.subtitle')}
        image={hero}
      />

      <section className="container py-20 lg:py-28">
        <div className="max-w-3xl">
          <Reveal>
            <div className="prose-legal" dangerouslySetInnerHTML={{ __html: t('mediation.body') }} />
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12 border-t border-paper-line pt-10">
              <Link href={href('contact', locale)} className="btn-primary">
                {t('common.cta.contact')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    </>
  )
}
