import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/i18n'
import { getImage, getT } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import PageHero from '@/components/site/PageHero'
import SmartImage from '@/components/site/SmartImage'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  return buildMetadata('about', isLocale(raw) ? raw : 'tr')
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  const [t, hero, bodyImage] = await Promise.all([
    getT(locale),
    getImage('about.hero.image', locale),
    getImage('about.body.image', locale),
  ])

  const values = [1, 2, 3].map((n) => ({
    n,
    title: t(`about.values.${n}.title`),
    body: t(`about.values.${n}.body`),
  }))

  return (
    <>
      <PageHero
        eyebrow={t('about.hero.eyebrow')}
        title={t('about.hero.title')}
        subtitle={t('about.hero.subtitle')}
        image={hero}
      />

      <section className="container py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <Reveal>
            <div className="prose-legal" dangerouslySetInnerHTML={{ __html: t('about.body') }} />
          </Reveal>

          <Reveal direction="left" delay={100}>
            <SmartImage
              src={bodyImage.src}
              alt={bodyImage.alt}
              ratio="aspect-[3/4]"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="border border-paper-line lg:sticky lg:top-28"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-paper-line bg-paper-soft py-20 lg:py-24">
        <div className="container">
          <Reveal>
            <h2 className="font-serif text-[1.75rem] sm:text-[2rem]">{t('about.values.title')}</h2>
            <hr className="rule mt-6" />
          </Reveal>

          <Stagger as="ul" className="mt-12 grid gap-10 sm:grid-cols-3">
            {values.map((value) => (
              <StaggerItem as="li" key={value.n}>
                <h3 className="font-serif text-lg text-navy-900">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-graphite-600">{value.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  )
}
