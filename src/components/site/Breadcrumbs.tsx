import Link from 'next/link'
import { getSettings } from '@/lib/content'
import { jsonLdScript } from '@/lib/seo'

export interface Crumb {
  label: string
  href: string
}

export default async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const settings = await getSettings()
  const base = settings.baseUrl?.trim() || 'https://cetinerlegal.com'

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${base}${item.href}`,
    })),
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-[0.78rem] text-graphite-500">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-2">
              {i > 0 ? <span aria-hidden>/</span> : null}
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-graphite-700">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-navy-700">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(data)} />
    </>
  )
}
