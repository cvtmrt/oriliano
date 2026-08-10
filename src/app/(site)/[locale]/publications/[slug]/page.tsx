import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, pick, type Locale } from '@/lib/i18n'
import {
  getPublicationBySlug,
  getSettings,
  getT,
  isRouteVisible,
  mediaUrl,
  publicationSlug,
  siteName,
} from '@/lib/content'
import { href, publicationHref } from '@/lib/nav'
import { buildMetadata, jsonLdScript } from '@/lib/seo'
import { htmlToText } from '@/lib/html'
import Breadcrumbs from '@/components/site/Breadcrumbs'
import SmartImage from '@/components/site/SmartImage'
import { Reveal } from '@/components/motion'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: raw, slug } = await params
  const locale: Locale = isLocale(raw) ? raw : 'tr'
  const item = await getPublicationBySlug(slug)
  if (!item) return buildMetadata('publications', locale)

  return buildMetadata('publications', locale, {
    title:
      pick(locale, item.seoTitleTr, item.seoTitleEn) || pick(locale, item.titleTr, item.titleEn),
    description:
      pick(locale, item.seoDescTr, item.seoDescEn) ||
      pick(locale, item.excerptTr, item.excerptEn) ||
      htmlToText(pick(locale, item.bodyTr, item.bodyEn), 155),
    slugMap: { tr: item.slugTr, en: item.slugEn || item.slugTr },
    ogImage: item.cover ? mediaUrl(item.cover.filename) : null,
  })
}

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  if (!(await isRouteVisible('publications'))) notFound()

  const item = await getPublicationBySlug(slug)
  if (!item) notFound()

  const [t, settings] = await Promise.all([getT(locale), getSettings()])
  const title = pick(locale, item.titleTr, item.titleEn)
  const body = pick(locale, item.bodyTr, item.bodyEn)
  const base = settings.baseUrl?.trim() || 'https://cetinerlegal.com'

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    inLanguage: locale,
    url: `${base}${publicationHref(locale, publicationSlug(item, locale))}`,
    publisher: { '@type': 'Organization', name: siteName(settings, locale) },
  }
  if (item.publishedAt) jsonLd.datePublished = item.publishedAt.toISOString()
  if (item.author) jsonLd.author = { '@type': 'Person', name: item.author }
  if (item.cover) jsonLd.image = `${base}${mediaUrl(item.cover.filename)}`

  return (
    <>
      <section className="border-b border-paper-line bg-paper-soft">
        <div className="container py-8">
          <Breadcrumbs
            items={[
              { label: t('publications.hero.eyebrow'), href: href('publications', locale) },
              { label: title, href: publicationHref(locale, publicationSlug(item, locale)) },
            ]}
          />
        </div>
      </section>

      <article className="container py-14 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h1 className="font-serif text-display-sm sm:text-display">{title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase tracking-wider text-graphite-500">
              {item.publishedAt ? (
                <time dateTime={item.publishedAt.toISOString()}>
                  {item.publishedAt.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              ) : null}
              {item.author ? <span>{item.author}</span> : null}
            </div>
            <hr className="rule mt-6" />
          </Reveal>

          {item.cover ? (
            <Reveal delay={80}>
              <SmartImage
                src={mediaUrl(item.cover.filename)}
                alt={pick(locale, item.coverAltTr, item.coverAltEn) || title}
                ratio="aspect-[16/9]"
                sizes="(min-width: 768px) 48rem, 100vw"
                className="mt-10 border border-paper-line"
                priority
              />
            </Reveal>
          ) : null}

          <Reveal delay={120}>
            <div className="prose-legal mt-10" dangerouslySetInnerHTML={{ __html: body }} />
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-14 border-t border-paper-line pt-8">
              <Link href={href('publications', locale)} className="btn-ghost link-underline">
                ← {t('publications.hero.eyebrow')}
              </Link>
            </div>
          </Reveal>
        </div>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    </>
  )
}
