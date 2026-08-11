import { Reveal, RevealOnMount, TextReveal } from '@/components/motion'
import SmartImage from './SmartImage'

/**
 * Alt sayfaların ortak başlık bloğu. Görsel opsiyonel: yuva boşsa yalnızca
 * tipografi kalır, bu da hukuk bürosu için gayet uygun bir görünüm verir.
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  image?: { src: string | null; alt: string } | null
}) {
  const hasImage = Boolean(image?.src)

  return (
    <section className="relative overflow-hidden border-b border-paper-line bg-paper-soft">
      {hasImage ? (
        <>
          <div className="absolute inset-0">
            <SmartImage
              src={image!.src}
              alt={image!.alt}
              ratio="h-full"
              className="h-full w-full"
              priority
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-navy-950/72" />
        </>
      ) : null}

      {/* Sabit min-yükseklik: TR/EN arasında başlık satır sayısı değişince
          hero'nun boyu oynamasın — iki dilde de aynı yükseklik. */}
      <div
        className={`container relative flex min-h-[21rem] flex-col justify-center py-16 sm:min-h-[24rem] sm:py-20 lg:min-h-[27rem] lg:py-24 ${
          hasImage ? 'text-white' : ''
        }`}
      >
        <div className="max-w-3xl">
          {eyebrow ? (
            <RevealOnMount>
              <p className={`eyebrow ${hasImage ? '!text-white/80' : ''}`}>{eyebrow}</p>
            </RevealOnMount>
          ) : null}

          <TextReveal
            text={title}
            delay={80}
            className={`mt-4 font-serif text-display-sm sm:text-display ${
              hasImage ? '!text-white' : ''
            }`}
          />

          {subtitle ? (
            <RevealOnMount delay={260}>
              <p
                className={`mt-6 max-w-2xl text-[1.02rem] leading-relaxed ${
                  hasImage ? 'text-white/85' : 'text-graphite-600'
                }`}
              >
                {subtitle}
              </p>
            </RevealOnMount>
          ) : null}

          <Reveal delay={340}>
            <hr className={`rule mt-8 ${hasImage ? '!bg-white/60' : ''}`} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
