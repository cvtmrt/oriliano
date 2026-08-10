import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteTeamMemberAction } from '../actions'
import { PageTitle, Empty } from '@/components/admin/ui'
import DeleteButton from '@/components/admin/DeleteButton'
import SavedNotice from '@/components/admin/SavedNotice'

export const dynamic = 'force-dynamic'

export default async function TeamAdminPage() {
  if (!(await getCurrentAdmin())) redirect('/admin/login')

  const team = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } }).catch(() => [])

  return (
    <>
      <PageTitle
        title="Ekip"
        description="Her üye kendi detay sayfasına sahiptir."
        action={
          <Link
            href="/admin/team/new"
            className="inline-flex min-h-[44px] items-center rounded bg-navy-700 px-5 text-sm font-medium text-white hover:bg-navy-800"
          >
            Yeni üye
          </Link>
        }
      />

      <SavedNotice />

      {team.length === 0 ? (
        <Empty>Henüz ekip üyesi yok.</Empty>
      ) : (
        <div className="overflow-hidden rounded-md border border-graphite-200 bg-white">
          <ul className="divide-y divide-graphite-200">
            {team.map((member) => (
              <li key={member.id} className="flex flex-wrap items-center gap-3 p-4">
                <span className="w-8 shrink-0 text-xs text-graphite-400">{member.order}</span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/team/${member.id}`}
                    className="font-medium text-navy-800 hover:underline"
                  >
                    {member.name}
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-graphite-500">{member.titleTr}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!member.visible ? (
                    <span className="rounded-full bg-graphite-100 px-2 py-0.5 text-[0.68rem] text-graphite-600">
                      gizli
                    </span>
                  ) : null}
                  {member.seeded ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[0.68rem] text-amber-800">
                      örnek
                    </span>
                  ) : null}
                  <DeleteButton
                    action={deleteTeamMemberAction}
                    id={member.id}
                    confirmText={`"${member.name}" silinsin mi?`}
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
