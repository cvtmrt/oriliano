import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, pick, type Locale } from '@/lib/i18n'
import { getSettings, getT } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import PageHero from '@/components/site/PageHero'
import { Reveal } from '@/components/motion'

export const revalidate = 300

/**
 * Gizlilik ve çerez politikası + KVKK aydınlatma metni tek sayfada.
 *
 * Bölümler numaralı ve çapalı: KVKK başvurularında "metnin 8. bölümü" diye
 * atıf yapılabiliyor, masaüstünde de yandaki içindekiler listesinden doğrudan
 * o bölüme gidiliyor. Metnin tamamı panelden düzenlenebilir (İçerik →
 * Gizlilik ve KVKK); sayfada tek bir sabit cümle yok.
 */

const SECTIONS = [
  'controller',
  'data',
  'purpose',
  'legal',
  'transfer',
  'retention',
  'security',
  'rights',
  'apply',
  'cookies',
  'changes',
] as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  return buildMetadata('privacy', isLocale(raw) ? raw : 'tr')
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  const [t, settings] = await Promise.all([getT(locale), getSettings()])

  const address = pick(locale, settings.addressTr, settings.addressEn)

  const sections = SECTIONS.map((key, index) => ({
    id: key,
    no: index + 1,
    title: t(`privacy.${key}.title`),
    body: t(`privacy.${key}.body`),
    // Harita yerleştirmesi yoksa üçüncü taraf uyarısı da yazılmaz: metin
    // sitenin gerçek hâlini anlatmalı, olası hâlini değil.
    extra: key === 'cookies' && settings.mapEmbedUrl ? t('privacy.cookies.map') : '',
  }))

  return (
    <>
      <PageHero
        eyebrow={t('privacy.hero.eyebrow')}
        title={t('privacy.hero.title')}
        subtitle={t('privacy.hero.subtitle')}
      />

      <section className="container py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-16">
          <nav aria-label={t('privacy.toc.title')} className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-serif text-sm uppercase tracking-[0.14em] text-navy-900">
              {t('privacy.toc.title')}
            </h2>
            <ol className="mt-5 space-y-2.5 text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="link-underline text-graphite-600 transition-colors hover:text-navy-900"
                  >
                    {section.no}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div>
            <p className="text-sm text-graphite-500">{t('privacy.updated')}</p>

            <Reveal>
              <div
                className="prose-legal mt-6"
                dangerouslySetInnerHTML={{ __html: t('privacy.intro') }}
              />
            </Reveal>

            {sections.map((section) => (
              <section key={section.id} id={section.id} className="mt-14 scroll-mt-28">
                <Reveal>
                  <h2 className="font-serif text-[1.4rem] text-navy-900 sm:text-[1.55rem]">
                    <span className="mr-3 text-graphite-400">{section.no}.</span>
                    {section.title}
                  </h2>
                  <hr className="rule mt-5" />
                  <div
                    className="prose-legal mt-6"
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />
                  {section.extra ? (
                    <div
                      className="prose-legal mt-4"
                      dangerouslySetInnerHTML={{ __html: section.extra }}
                    />
                  ) : null}

                  {/* Veri sorumlusunun iletişim bilgileri paneldeki tek kaynaktan
                      okunuyor; metne elle yazılsaydı adres değişince burada eski
                      kalırdı. */}
                  {section.id === 'controller' ? (
                    <address className="mt-6 border-l-2 border-navy-900 pl-5 not-italic text-sm leading-relaxed text-graphite-600">
                      <strong className="block font-serif text-base not-italic text-navy-900">
                        {pick(locale, settings.siteNameTr, settings.siteNameEn)}
                      </strong>
                      {address ? <span className="mt-2 block whitespace-pre-line">{address}</span> : null}
                      {settings.email ? (
                        <a
                          href={`mailto:${settings.email}`}
                          className="link-underline mt-2 block break-all"
                        >
                          {settings.email}
                        </a>
                      ) : null}
                      {settings.phone ? (
                        <a
                          href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
                          className="link-underline mt-1 block"
                        >
                          {settings.phone}
                        </a>
                      ) : null}
                    </address>
                  ) : null}
                </Reveal>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
