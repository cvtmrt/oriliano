import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, pick, type Locale } from '@/lib/i18n'
import { href, serviceHref } from '@/lib/nav'
import { getImage, getServices, getT, serviceSlug } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { Parallax, Reveal, RevealOnMount, Stagger, StaggerItem, TextReveal } from '@/components/motion'
import SmartImage from '@/components/site/SmartImage'
import SectionHeading from '@/components/site/SectionHeading'
import ServiceCard from '@/components/site/ServiceCard'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'tr'
  return buildMetadata('home', locale)
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  const [t, hero, introImage, services] = await Promise.all([
    getT(locale),
    getImage('home.hero.image', locale),
    getImage('home.intro.image', locale),
    getServices(),
  ])

  const featured = services.filter((s) => s.featured)
  const shown = (featured.length > 0 ? featured : services).slice(0, 6)

  const principles = [1, 2, 3, 4].map((n) => ({
    n,
    title: t(`home.approach.${n}.title`),
    body: t(`home.approach.${n}.body`),
  }))

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      {/* Görsel yüklüyse fotoğraf + koyu örtü; değilse müşteri isteğiyle düz
          lacivert zemin (sitenin hazır tonları, doku ve ikon yok). */}
      <section className="relative overflow-hidden border-b border-paper-line bg-navy-950">
        {hero.src ? (
          <>
            <div className="absolute inset-0">
              <SmartImage
                src={hero.src}
                alt={hero.alt}
                ratio="h-full"
                className="h-full w-full"
                imageClassName="kenburns"
                priority
                sizes="100vw"
              />
            </div>
            {/* /92 opasite skalasında yok — from rengi hiç üretilmiyordu. */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy-950/90 via-navy-900/85 to-navy-800/70" />
          </>
        ) : (
          <div className="absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950" />
            {/* Süzülen ışımalar: düz zemini öldürmeden nefes aldırır */}
            <div
              className="drift-a absolute -left-48 -top-48 h-[38rem] w-[38rem] rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle, #1E2A5E 0%, transparent 62%)' }}
            />
            <div
              className="drift-b absolute -bottom-56 right-[-10rem] h-[42rem] w-[42rem] rounded-full opacity-[0.13]"
              style={{ background: 'radial-gradient(circle, #A9834B 0%, transparent 60%)' }}
            />
          </div>
        )}

        {/* Alt kenarda, ışığı yavaşça gezen ince altın çizgi */}
        <div className="gold-hairline absolute inset-x-0 bottom-0" aria-hidden />

        {/* Mobilde vh yerine sabit rem: küçük ekranda uzun Türkçe başlık 78vh'i
            aşınca bölüm metinle birlikte büyüyor ve TR/EN yükseklikleri
            farklılaşıyordu. Sabit taban + geniş ekranda vh. */}
        <div className="container relative flex min-h-[46rem] flex-col justify-center py-20 text-white sm:min-h-[80vh] lg:py-28">
          <div className="max-w-3xl">
            <RevealOnMount>
              <p className="eyebrow !text-white/75">{t('home.hero.eyebrow')}</p>
            </RevealOnMount>

            <TextReveal
              text={t('home.hero.title')}
              delay={120}
              className="mt-5 font-serif text-display-sm !text-white sm:text-display lg:text-display-lg"
            />

            <RevealOnMount delay={340}>
              <p className="mt-7 max-w-2xl text-[1.05rem] leading-relaxed text-white/85">
                {t('home.hero.subtitle')}
              </p>
            </RevealOnMount>

            <RevealOnMount delay={460}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href={href('contact', locale)} className="btn-accent">
                  {t('common.cta.contact')}
                </Link>
                <Link
                  href={href('services', locale)}
                  className="btn border border-white/35 text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  {t('common.cta.services')}
                </Link>
              </div>
            </RevealOnMount>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Tanıtım */}
      {/* Görsel yüklenmediyse boş bir kutu göstermek yerine metin tek kolonda
          rahatça akıyor; panelden görsel gelince iki kolona dönüyor. */}
      <section className="container py-20 lg:py-28">
        {introImage.src ? (
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal direction="right">
              <div className="overflow-hidden border border-paper-line">
                {/* Kart içinde hafif ters parallax — fotoğraf %12 büyük tutuluyor */}
                <Parallax amount={26} className="-my-[6%]">
                  <SmartImage
                    src={introImage.src}
                    alt={introImage.alt}
                    ratio="aspect-[5/4]"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </Parallax>
              </div>
            </Reveal>

            <div>
              <SectionHeading
                eyebrow={t('home.intro.eyebrow')}
                title={t('home.intro.title')}
              />
              <Reveal delay={140}>
                <div
                  className="prose-legal mt-6"
                  dangerouslySetInnerHTML={{ __html: t('home.intro.body') }}
                />
              </Reveal>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl">
            <SectionHeading eyebrow={t('home.intro.eyebrow')} title={t('home.intro.title')} />
            <Reveal delay={140}>
              <div
                className="prose-legal mt-6"
                dangerouslySetInnerHTML={{ __html: t('home.intro.body') }}
              />
            </Reveal>
          </div>
        )}
      </section>

      {/* ----------------------------------------------------------- Hizmetler */}
      <section className="border-y border-paper-line bg-paper-soft py-20 lg:py-28">
        <div className="container">
          <SectionHeading
            eyebrow={t('home.services.eyebrow')}
            title={t('home.services.title')}
            body={t('home.services.body')}
          />

          {shown.length > 0 ? (
            <Stagger
              as="ul"
              className="mt-12 grid gap-px overflow-hidden border border-paper-line bg-paper-line sm:grid-cols-2 lg:grid-cols-3"
            >
              {shown.map((service) => (
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
          ) : null}

          <Reveal delay={120}>
            <div className="mt-12">
              <Link href={href('services', locale)} className="btn-outline">
                {t('common.cta.allServices')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------------- Yaklaşım */}
      <section className="container py-20 lg:py-28">
        <SectionHeading eyebrow={t('home.approach.eyebrow')} title={t('home.approach.title')} />

        <Stagger as="ul" className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {principles.map((p) => (
            <StaggerItem as="li" key={p.n}>
              <div className="flex gap-5">
                <span
                  className="mt-1 shrink-0 font-serif text-2xl leading-none"
                  style={{ color: 'var(--accent)' }}
                  aria-hidden
                >
                  {String(p.n).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-serif text-lg text-navy-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite-600">{p.body}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <CtaBand locale={locale} title={t('home.cta.title')} body={t('home.cta.body')} label={t('common.cta.contact')} />
    </>
  )
}

async function CtaBand({
  locale,
  title,
  body,
  label,
}: {
  locale: Locale
  title: string
  body: string
  label: string
}) {
  const bg = await getImage('home.cta.background', locale)
  return (
    <section className="relative overflow-hidden bg-navy-900">
      {/* Hero'nun alt çizgisiyle aynı dil: üst kenarda gezinen altın ışık */}
      <div className="gold-hairline absolute inset-x-0 top-0" aria-hidden />
      {bg.src ? (
        <>
          <div className="absolute inset-0">
            <SmartImage src={bg.src} alt={bg.alt} ratio="h-full" className="h-full w-full" sizes="100vw" />
          </div>
          <div className="absolute inset-0 bg-navy-950/85" />
        </>
      ) : null}

      <div className="container relative flex flex-col items-start gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div className="max-w-2xl">
          <Reveal>
            <h2 className="font-serif text-[1.75rem] leading-tight !text-white sm:text-[2.1rem]">
              {title}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-white/80">{body}</p>
          </Reveal>
        </div>
        <Reveal delay={160}>
          <Link href={href('contact', locale)} className="btn-accent shrink-0">
            {label}
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
