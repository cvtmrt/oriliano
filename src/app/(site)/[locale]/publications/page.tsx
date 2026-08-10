import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, pick, type Locale } from '@/lib/i18n'
import { getImage, getPublications, getT, isRouteVisible, publicationSlug } from '@/lib/content'
import { publicationHref } from '@/lib/nav'
import { buildMetadata } from '@/lib/seo'
import PageHero from '@/components/site/PageHero'
import { Stagger, StaggerItem } from '@/components/motion'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'tr'
  const visible = await isRouteVisible('publications')
  return buildMetadata('publications', locale, { noindex: !visible })
}

export default async function PublicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  // Brief: Yayınlar altyapısı kurulu ama panelden KAPALI geliyor.
  // Kapalıyken doğrudan URL ile de erişilemesin.
  if (!(await isRouteVisible('publications'))) notFound()

  const [t, hero, items] = await Promise.all([
    getT(locale),
    getImage('publications.hero.image', locale),
    getPublications(),
  ])

  return (
    <>
      <PageHero
        eyebrow={t('publications.hero.eyebrow')}
        title={t('publications.hero.title')}
        subtitle={t('publications.hero.subtitle')}
        image={hero}
      />

      <section className="container py-20 lg:py-24">
        {items.length === 0 ? (
          <p className="max-w-xl text-graphite-600">{t('publications.empty')}</p>
        ) : (
          <Stagger as="ul" className="divide-y divide-paper-line border-y border-paper-line">
            {items.map((item) => {
              const title = pick(locale, item.titleTr, item.titleEn)
              const excerpt = pick(locale, item.excerptTr, item.excerptEn)
              return (
                <StaggerItem as="li" key={item.id}>
                  <Link
                    href={publicationHref(locale, publicationSlug(item, locale))}
                    className="group flex flex-col gap-2 py-8 transition-colors sm:flex-row sm:items-baseline sm:gap-10"
                  >
                    {item.publishedAt ? (
                      <time
                        dateTime={item.publishedAt.toISOString()}
                        className="shrink-0 text-xs uppercase tracking-wider text-graphite-500 sm:w-32"
                      >
                        {item.publishedAt.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    ) : (
                      <span className="shrink-0 sm:w-32" />
                    )}
                    <div>
                      <h2 className="font-serif text-xl text-navy-900 transition-colors group-hover:text-navy-700">
                        {title}
                      </h2>
                      {excerpt ? (
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-graphite-600">
                          {excerpt}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </StaggerItem>
              )
            })}
          </Stagger>
        )}
      </section>
    </>
  )
}
