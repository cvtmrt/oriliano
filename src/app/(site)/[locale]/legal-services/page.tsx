import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/i18n'
import { getImage, getT } from '@/lib/content'
import { href } from '@/lib/nav'
import { buildMetadata } from '@/lib/seo'
import PageHero from '@/components/site/PageHero'
import { Reveal } from '@/components/motion'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  return buildMetadata('legalServices', isLocale(raw) ? raw : 'tr')
}

export default async function LegalServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  const [t, hero] = await Promise.all([getT(locale), getImage('legalServices.hero.image', locale)])

  return (
    <>
      <PageHero
        eyebrow={t('legalServices.hero.eyebrow')}
        title={t('legalServices.hero.title')}
        subtitle={t('legalServices.hero.subtitle')}
        image={hero}
      />

      <section className="container py-20 lg:py-28">
        <div className="max-w-3xl">
          <Reveal>
            <div className="prose-legal" dangerouslySetInnerHTML={{ __html: t('legalServices.body') }} />
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12 flex flex-wrap gap-4 border-t border-paper-line pt-10">
              <Link href={href('contact', locale)} className="btn-primary">
                {t('common.cta.contact')}
              </Link>
              <Link href={href('services', locale)} className="btn-outline">
                {t('common.cta.allServices')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
