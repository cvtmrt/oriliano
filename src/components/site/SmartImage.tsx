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
  // Görsel yokken düz, sakin bir lacivert yüzey — müşteri isteği üzerine
  // ikon/doku yok. Panelden görsel yüklenince kendiliğinden gerçek görsele döner.
  if (!src) {
    return (
      <div
        className={`relative overflow-hidden ${ratio} ${className}`}
        role="img"
        aria-label={alt}
        style={{ background: 'linear-gradient(170deg, #16204A 0%, #0A0F22 100%)' }}
      />
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
