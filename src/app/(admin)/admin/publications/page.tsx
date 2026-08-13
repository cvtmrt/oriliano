import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/date'
import { deletePublicationAction } from '../actions'
import { PageTitle, Empty, Banner } from '@/components/admin/ui'
import DeleteButton from '@/components/admin/DeleteButton'
import SavedNotice from '@/components/admin/SavedNotice'

export const dynamic = 'force-dynamic'

export default async function PublicationsAdminPage() {
  if (!(await getCurrentAdmin())) redirect('/admin/login')

  const [items, menuItem] = await Promise.all([
    prisma.publication.findMany({ orderBy: [{ publishedAt: 'desc' }, { order: 'asc' }] }).catch(() => []),
    prisma.menuItem.findUnique({ where: { routeKey: 'publications' } }).catch(() => null),
  ])

  return (
    <>
      <PageTitle
        title="Yayınlar"
        description="Blog / makale altyapısı. Bölüm menüden açılana kadar site tarafında görünmez."
        action={
          <Link
            href="/admin/publications/new"
            className="inline-flex min-h-[44px] items-center rounded bg-navy-700 px-5 text-sm font-medium text-white hover:bg-navy-800"
          >
            Yeni yazı
          </Link>
        }
      />

      <SavedNotice />

      {menuItem && !menuItem.visible ? (
        <Banner type="info">
          Yayınlar bölümü şu an <strong>kapalı</strong>. Siteye açmak için{' '}
          <Link href="/admin/menu" className="underline">
            Menü
          </Link>{' '}
          sayfasından &quot;Yayınlar&quot; öğesini görünür yapın.
        </Banner>
      ) : null}

      {items.length === 0 ? (
        <Empty>Henüz yazı yok.</Empty>
      ) : (
        <div className="overflow-hidden rounded-md border border-graphite-200 bg-white">
          <ul className="divide-y divide-graphite-200">
            {items.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/publications/${item.id}`}
                    className="font-medium text-navy-800 hover:underline"
                  >
                    {item.titleTr}
                  </Link>
                  <p className="mt-0.5 text-xs text-graphite-500">
                    {item.publishedAt
                      ? formatDate(item.publishedAt)
                      : 'Tarih yok'}
                    {item.author ? ` · ${item.author}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.68rem] ${
                      item.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-graphite-100 text-graphite-600'
                    }`}
                  >
                    {item.published ? 'yayında' : 'taslak'}
                  </span>
                  <DeleteButton
                    action={deletePublicationAction}
                    id={item.id}
                    confirmText={`"${item.titleTr}" silinsin mi?`}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
