import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getFieldMeta } from '@/lib/translation-queue'
import { PageTitle } from '@/components/admin/ui'
import LanguageHint from '@/components/admin/LanguageHint'
import { translationConfigured } from '@/lib/translate'
import TeamForm, { type TeamFormValues } from '@/components/admin/TeamForm'

export const dynamic = 'force-dynamic'

const emptyMember: TeamFormValues = {
  id: '',
  slug: '',
  name: '',
  order: 0,
  visible: true,
  titleTr: '',
  titleEn: '',
  bioTr: '',
  bioEn: '',
  expertiseTr: '',
  expertiseEn: '',
  photoAltTr: '',
  photoAltEn: '',
  email: '',
  phone: '',
  linkedin: '',
  photo: null,
}

export default async function TeamEditPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getCurrentAdmin())) redirect('/admin/login')
  const { id } = await params

  if (id === 'new') {
    return (
      <>
        <PageTitle
          title="Yeni ekip üyesi"
          action={
            <Link href="/admin/team" className="text-sm text-navy-700 underline underline-offset-2">
              ← Ekip
            </Link>
          }
        />
        <LanguageHint configured={translationConfigured()} />
        <TeamForm values={emptyMember} meta={{}} />
      </>
    )
  }

  const member = await prisma.teamMember
    .findUnique({ where: { id }, include: { photo: true } })
    .catch(() => null)
  if (!member) notFound()

  const meta = await getFieldMeta('TeamMember', member.id).catch(() => ({}))

  return (
    <>
      <PageTitle
        title={member.name}
        description={`/tr/ekibimiz/${member.slug}`}
        action={
          <Link href="/admin/team" className="text-sm text-navy-700 underline underline-offset-2">
            ← Ekip
          </Link>
        }
      />
      <LanguageHint configured={translationConfigured()} />
      <TeamForm
        values={{
          id: member.id,
          slug: member.slug,
          name: member.name,
          order: member.order,
          visible: member.visible,
          titleTr: member.titleTr,
          titleEn: member.titleEn,
          bioTr: member.bioTr,
          bioEn: member.bioEn,
          expertiseTr: member.expertiseTr,
          expertiseEn: member.expertiseEn,
          photoAltTr: member.photoAltTr,
          photoAltEn: member.photoAltEn,
          email: member.email,
          phone: member.phone,
          linkedin: member.linkedin,
          photo: member.photo,
        }}
        meta={meta}
      />
    </>
  )
}
