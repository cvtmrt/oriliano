import Link from 'next/link'
import { textDefaultMap } from '@/content/defaults'

/**
 * not-found.tsx params alamaz; dili yoldan okuyamadığımız için Türkçe
 * varsayılan gösterilip İngilizce karşılığı da veriliyor.
 */
export default function NotFound() {
  const title = textDefaultMap['common.notFound.title']
  const body = textDefaultMap['common.notFound.body']
  const cta = textDefaultMap['common.notFound.cta']

  return (
    <section className="container flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-serif text-display-sm sm:text-display">{title?.tr}</h1>
      <p className="mt-5 max-w-xl leading-relaxed text-graphite-600">{body?.tr}</p>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-graphite-500">{body?.en}</p>
      <div className="mt-9 flex flex-wrap gap-4">
        <Link href="/tr" className="btn-primary">
          {cta?.tr}
        </Link>
        <Link href="/en" className="btn-outline">
          {cta?.en}
        </Link>
      </div>
    </section>
  )
}
