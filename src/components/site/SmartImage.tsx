import Image from 'next/image'

/**
 * Görsel yuvası boşken kırık resim yerine sakin bir yer tutucu gösterir.
 * Panelden görsel yüklenince kendiliğinden gerçek görsele döner.
 */
export default function SmartImage({
  src,
  alt,
  className = '',
  imageClassName = '',
  priority = false,
  sizes = '100vw',
  ratio = 'aspect-[4/3]',
}: {
  src: string | null
  alt: string
  className?: string
  imageClassName?: string
  priority?: boolean
  sizes?: string
  ratio?: string
}) {
  if (!src) {
    return (
      <div
        className={`relative overflow-hidden bg-navy-900 ${ratio} ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_10%,#1E2A5E_0%,#101733_55%,#0A0F22_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, #ffffff 0 1px, transparent 1px 14px)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            className="opacity-30"
            aria-hidden
          >
            <path
              d="M12 3v18M5 7h14M7 7l-3 6a3 3 0 0 0 6 0L7 7Zm10 0-3 6a3 3 0 0 0 6 0l-3-6ZM8 21h8"
              stroke="#fff"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${ratio} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${imageClassName}`}
      />
    </div>
  )
}
