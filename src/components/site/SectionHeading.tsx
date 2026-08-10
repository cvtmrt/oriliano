import { Reveal } from '@/components/motion'

export default function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'left',
  tone = 'light',
}: {
  eyebrow?: string
  title: string
  body?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
}) {
  const dark = tone === 'dark'
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow ? (
        <Reveal>
          <p className={`eyebrow ${dark ? '!text-white/75' : ''}`}>{eyebrow}</p>
        </Reveal>
      ) : null}
      <Reveal delay={60}>
        <h2
          className={`mt-3 font-serif text-[1.85rem] leading-tight sm:text-[2.25rem] ${
            dark ? '!text-white' : ''
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {body ? (
        <Reveal delay={120}>
          <p
            className={`mt-4 text-[0.98rem] leading-relaxed ${
              dark ? 'text-white/80' : 'text-graphite-600'
            }`}
          >
            {body}
          </p>
        </Reveal>
      ) : null}
    </div>
  )
}
