import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, pick, type Locale } from '@/lib/i18n'
import { getImage, getSettings, getT } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import PageHero from '@/components/site/PageHero'
import ContactForm from '@/components/site/ContactForm'
import { Reveal } from '@/components/motion'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  return buildMetadata('contact', isLocale(raw) ? raw : 'tr')
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  const [t, hero, settings] = await Promise.all([
    getT(locale),
    getImage('contact.hero.image', locale),
    getSettings(),
  ])

  const address = pick(locale, settings.addressTr, settings.addressEn)
  const hours = pick(locale, settings.workingHoursTr, settings.workingHoursEn)

  const rows = [
    address ? { label: t('contact.info.address'), value: address, href: null } : null,
    settings.phone
      ? {
          label: t('contact.info.phone'),
          value: settings.phoneSecondary
            ? `${settings.phone}\n${settings.phoneSecondary}`
            : settings.phone,
          href: `tel:${settings.phone.replace(/[^\d+]/g, '')}`,
        }
      : null,
    settings.email
      ? { label: t('contact.info.email'), value: settings.email, href: `mailto:${settings.email}` }
      : null,
    hours ? { label: t('contact.info.hours'), value: hours, href: null } : null,
  ].filter(Boolean) as { label: string; value: string; href: string | null }[]

  return (
    <>
      <PageHero
        eyebrow={t('contact.hero.eyebrow')}
        title={t('contact.hero.title')}
        subtitle={t('contact.hero.subtitle')}
        image={hero}
      />

      <section className="container py-20 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Reveal direction="right">
            <div>
              <dl className="space-y-7">
                {rows.map((row) => (
                  <div key={row.label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-graphite-500">
                      {row.label}
                    </dt>
                    <dd className="mt-2 whitespace-pre-line text-[0.98rem] leading-relaxed text-graphite-800">
                      {row.href ? (
                        <a href={row.href} className="link-underline text-navy-800">
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              {rows.length === 0 ? (
                <p className="text-sm text-graphite-500">
                  {locale === 'tr'
                    ? 'İletişim bilgileri yönetim panelinden girilecek.'
                    : 'Contact details will be entered from the admin panel.'}
                </p>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="card p-7 sm:p-9">
              <h2 className="font-serif text-xl text-navy-900">{t('contact.form.title')}</h2>
              <hr className="rule mt-4" />
              <div className="mt-7">
                <ContactForm
                  locale={locale}
                  labels={{
                    name: t('contact.form.name'),
                    email: t('contact.form.email'),
                    phone: t('contact.form.phone'),
                    subject: t('contact.form.subject'),
                    message: t('contact.form.message'),
                    submit: t('contact.form.submit'),
                    sending: t('contact.form.sending'),
                    success: t('contact.form.success'),
                    error: t('contact.form.error'),
                    consent: t('contact.form.consent'),
                  }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {settings.mapEmbedUrl ? (
        <section aria-label={t('contact.info.address')} className="border-t border-paper-line">
          <div className="h-[420px] w-full bg-paper-soft">
            <iframe
              src={settings.mapEmbedUrl}
              title={t('contact.info.address')}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
      ) : null}
    </>
  )
}
