import Link from 'next/link'
import { StaggerItem } from '@/components/motion'
import ServiceIcon from './ServiceIcon'

export default function ServiceCard({
  href: to,
  title,
  excerpt,
  icon,
  cta,
}: {
  href: string
  title: string
  excerpt: string
  icon: string
  cta: string
}) {
  return (
    <StaggerItem as="li" className="group">
      <Link
        href={to}
        className="relative flex h-full flex-col overflow-hidden border border-paper-line bg-white p-7 transition-[border-color,box-shadow] duration-300 hover:border-navy-200 hover:shadow-lift focus-visible:border-navy-300"
      >
        {/* Hover'da üst kenardan soldan sağa açılan ince altın çizgi —
            transform'u yalnızca CSS yönetiyor, Motion bu elemana dokunmuyor. */}
        <span
          className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
          style={{ backgroundColor: 'var(--accent)' }}
          aria-hidden
        />
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-paper-line text-navy-700 transition-colors duration-300 group-hover:border-navy-700 group-hover:bg-navy-700 group-hover:text-white">
          <ServiceIcon name={icon} />
        </span>

        <h3 className="mt-6 font-serif text-xl text-navy-900">{title}</h3>

        {excerpt ? (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite-600">{excerpt}</p>
        ) : (
          <span className="flex-1" />
        )}

        <span className="mt-6 inline-flex items-center gap-2 text-[0.8rem] font-medium uppercase tracking-wider text-navy-700">
          {cta}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </svg>
        </span>
      </Link>
    </StaggerItem>
  )
}
