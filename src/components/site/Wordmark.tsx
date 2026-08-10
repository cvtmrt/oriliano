/**
 * Geçici wordmark — panelden logo yüklenene kadar kullanılır.
 *
 * Yapı, verilen logodan alındı: ilk kelime küçük harf, ilk ve son harf
 * lacivert, gövde antrasit; altında ince lacivert çizgi ve harf aralığı
 * açılmış büyük harfli ikinci satır. Site adı panelden değiştiğinde
 * kendiliğinden uyum sağlar.
 */
export default function Wordmark({
  name,
  className = '',
  compact = false,
}: {
  name: string
  className?: string
  compact?: boolean
}) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const first = words[0] ?? 'Çetiner'
  const rest = words.slice(1).join(' ')

  const chars = Array.from(first.toLocaleLowerCase('tr-TR'))
  const lastIndex = chars.length - 1

  return (
    <span className={`inline-flex flex-col leading-none ${className}`} aria-hidden>
      <span
        className={`font-semibold lowercase tracking-tight text-graphite-700 ${
          compact ? 'text-lg' : 'text-xl sm:text-2xl'
        }`}
        style={{ fontFamily: 'var(--font-wordmark), var(--font-sans), sans-serif' }}
      >
        {chars.map((ch, i) => (
          <span key={i} className={i === 0 || i === lastIndex ? 'text-navy-700' : undefined}>
            {ch}
          </span>
        ))}
      </span>
      {rest ? (
        <>
          <span className="mt-1 block h-px w-full bg-navy-700/70" />
          <span
            className={`mt-1 font-medium uppercase text-graphite-600 ${
              compact ? 'text-[0.5rem] tracking-[0.22em]' : 'text-[0.58rem] tracking-[0.26em]'
            }`}
            style={{ fontFamily: 'var(--font-wordmark), var(--font-sans), sans-serif' }}
          >
            {rest}
          </span>
        </>
      ) : null}
    </span>
  )
}
