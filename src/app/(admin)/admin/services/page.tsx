import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteServiceAction } from '../actions'
import { PageTitle, Empty } from '@/components/admin/ui'
import DeleteButton from '@/components/admin/DeleteButton'
import SavedNotice from '@/components/admin/SavedNotice'

export const dynamic = 'force-dynamic'

export default async function ServicesAdminPage() {
  if (!(await getCurrentAdmin())) redirect('/admin/login')

  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } }).catch(() => [])

  return (
    <>
      <PageTitle
        title="Hizmetler"
        description="Her hizmetin kendi detay sayfası vardır. Sıra numarası küçük olan önce görünür."
        action={
          <Link
            href="/admin/services/new"
            className="inline-flex min-h-[44px] items-center rounded bg-navy-700 px-5 text-sm font-medium text-white hover:bg-navy-800"
          >
            Yeni hizmet
          </Link>
        }
      />

      <SavedNotice />

      {services.length === 0 ? (
        <Empty>Henüz hizmet yok.</Empty>
      ) : (
        <div className="overflow-hidden rounded-md border border-graphite-200 bg-white">
          <ul className="divide-y divide-graphite-200">
            {services.map((service) => (
              <li key={service.id} className="flex flex-wrap items-center gap-3 p-4">
                <span className="w-8 shrink-0 text-xs text-graphite-400">{service.order}</span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/services/${service.id}`}
                    className="font-medium text-navy-800 hover:underline"
                  >
                    {service.titleTr}
                  </Link>
                  <p className="mt-0.5 truncate font-mono text-xs text-graphite-400">
                    /{service.slugTr} · /{service.slugEn}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {service.featured ? (
                    <span className="rounded-full bg-navy-100 px-2 py-0.5 text-[0.68rem] text-navy-800">
                      anasayfada
                    </span>
                  ) : null}
                  {!service.visible ? (
                    <span className="rounded-full bg-graphite-100 px-2 py-0.5 text-[0.68rem] text-graphite-600">
                      gizli
                    </span>
                  ) : null}
                  {service.seeded ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[0.68rem] text-amber-800">
                      örnek
                    </span>
                  ) : null}
                  <DeleteButton
                    action={deleteServiceAction}
                    id={service.id}
                    confirmText={`"${service.titleTr}" silinsin mi?`}
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
