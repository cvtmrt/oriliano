import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, pick, type Locale } from '@/lib/i18n'
import { getSettings, getT, getTeamMemberBySlug, mediaUrl, siteName } from '@/lib/content'
import { href, teamHref } from '@/lib/nav'
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
  const member = await getTeamMemberBySlug(slug)
  if (!member) return buildMetadata('team', locale)

  const role = pick(locale, member.titleTr, member.titleEn)
  return buildMetadata('team', locale, {
    title: role ? `${member.name} — ${role}` : member.name,
    description: htmlToText(pick(locale, member.bioTr, member.bioEn), 155),
    slugMap: { tr: member.slug, en: member.slug },
    ogImage: member.photo ? mediaUrl(member.photo.filename) : null,
  })
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  const member = await getTeamMemberBySlug(slug)
  if (!member) notFound()

  const [t, settings] = await Promise.all([getT(locale), getSettings()])
  const role = pick(locale, member.titleTr, member.titleEn)
  const bio = pick(locale, member.bioTr, member.bioEn)
  const expertise = pick(locale, member.expertiseTr, member.expertiseEn)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  const base = settings.baseUrl?.trim() || 'https://cetinerlegal.com'
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    url: `${base}${teamHref(locale, member.slug)}`,
    worksFor: { '@type': 'LegalService', name: siteName(settings, locale), url: `${base}/${locale}` },
  }
  if (role) jsonLd.jobTitle = role
  if (member.email) jsonLd.email = member.email
  if (member.linkedin) jsonLd.sameAs = [member.linkedin]
  if (member.photo) jsonLd.image = `${base}${mediaUrl(member.photo.filename)}`

  return (
    <>
      <section className="border-b border-paper-line bg-paper-soft">
        <div className="container py-8">
          <Breadcrumbs
            items={[
              { label: t('team.hero.eyebrow'), href: href('team', locale) },
              { label: member.name, href: teamHref(locale, member.slug) },
            ]}
          />
        </div>
      </section>

      <section className="container py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[20rem_1fr] lg:gap-16">
          <Reveal direction="right">
            <div className="lg:sticky lg:top-28">
              <SmartImage
                src={member.photo ? mediaUrl(member.photo.filename) : null}
                alt={pick(locale, member.photoAltTr, member.photoAltEn) || member.name}
                ratio="aspect-[4/5]"
                sizes="(min-width: 1024px) 20rem, 100vw"
                className="border border-paper-line"
                priority
              />

              {(member.email || member.phone || member.linkedin) && (
                <div className="mt-6">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-graphite-500">
                    {t('team.detail.contactTitle')}
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm">
                    {member.email ? (
                      <li>
                        <a
                          href={`mailto:${member.email}`}
                          className="link-underline break-all text-navy-700"
                        >
                          {member.email}
                        </a>
                      </li>
                    ) : null}
                    {member.phone ? (
                      <li>
                        <a
                          href={`tel:${member.phone.replace(/[^\d+]/g, '')}`}
                          className="link-underline text-navy-700"
                        >
                          {member.phone}
                        </a>
                      </li>
                    ) : null}
                    {member.linkedin ? (
                      <li>
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-underline text-navy-700"
                        >
                          LinkedIn
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </div>
              )}
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h1 className="font-serif text-display-sm sm:text-[2.5rem]">{member.name}</h1>
              {role ? (
                <p className="mt-2 text-sm uppercase tracking-[0.14em]" style={{ color: 'var(--accent)' }}>
                  {role}
                </p>
              ) : null}
              <hr className="rule mt-6" />
            </Reveal>

            {bio ? (
              <Reveal delay={80}>
                <div className="prose-legal mt-8" dangerouslySetInnerHTML={{ __html: bio }} />
              </Reveal>
            ) : null}

            {expertise.length > 0 ? (
              <Reveal delay={140}>
                <div className="mt-12">
                  <h2 className="font-serif text-lg text-navy-900">{t('team.detail.expertiseTitle')}</h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {expertise.map((item) => (
                      <li
                        key={item}
                        className="rounded-sm border border-paper-line bg-white px-3 py-1.5 text-sm text-graphite-700"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}

            <Reveal delay={200}>
              <div className="mt-12 border-t border-paper-line pt-8">
                <Link href={href('team', locale)} className="btn-ghost link-underline">
                  ← {t('common.cta.allTeam')}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    </>
  )
}
