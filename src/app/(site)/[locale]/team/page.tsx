import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, pick, type Locale } from '@/lib/i18n'
import { getImage, getT, getTeam, mediaUrl } from '@/lib/content'
import { teamHref } from '@/lib/nav'
import { buildMetadata } from '@/lib/seo'
import PageHero from '@/components/site/PageHero'
import TeamCard from '@/components/site/TeamCard'
import { Stagger } from '@/components/motion'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  return buildMetadata('team', isLocale(raw) ? raw : 'tr')
}

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  const [t, hero, team] = await Promise.all([
    getT(locale),
    getImage('team.hero.image', locale),
    getTeam(),
  ])

  return (
    <>
      <PageHero
        eyebrow={t('team.hero.eyebrow')}
        title={t('team.hero.title')}
        subtitle={t('team.hero.subtitle')}
        image={hero}
      />

      <section className="container py-20 lg:py-24">
        <Stagger as="ul" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <TeamCard
              key={member.id}
              href={teamHref(locale, member.slug)}
              name={member.name}
              title={pick(locale, member.titleTr, member.titleEn)}
              photo={{
                src: member.photo ? mediaUrl(member.photo.filename) : null,
                alt: pick(locale, member.photoAltTr, member.photoAltEn) || member.name,
              }}
              expertise={pick(locale, member.expertiseTr, member.expertiseEn)
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)}
            />
          ))}
        </Stagger>
      </section>
    </>
  )
}
