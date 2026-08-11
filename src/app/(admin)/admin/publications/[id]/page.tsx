import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getFieldMeta } from '@/lib/translation-queue'
import { PageTitle } from '@/components/admin/ui'
import LanguageHint from '@/components/admin/LanguageHint'
import { translationConfigured } from '@/lib/translate'
import PublicationForm, { type PublicationFormValues } from '@/components/admin/PublicationForm'

export const dynamic = 'force-dynamic'

const emptyPublication: PublicationFormValues = {
  id: '',
  slugTr: '',
  slugEn: '',
  published: false,
  publishedAt: '',
  order: 0,
  author: '',
  titleTr: '',
  titleEn: '',
  excerptTr: '',
  excerptEn: '',
  bodyTr: '',
  bodyEn: '',
  coverAltTr: '',
  coverAltEn: '',
  seoTitleTr: '',
  seoTitleEn: '',
  seoDescTr: '',
  seoDescEn: '',
  cover: null,
}

export default async function PublicationEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  if (!(await getCurrentAdmin())) redirect('/admin/login')
  const { id } = await params

  if (id === 'new') {
    return (
      <>
        <PageTitle
          title="Yeni yazı"
          action={
            <Link href="/admin/publications" className="text-sm text-navy-700 underline underline-offset-2">
              ← Yayınlar
            </Link>
          }
        />
        <LanguageHint configured={translationConfigured()} />
        <PublicationForm values={emptyPublication} meta={{}} />
      </>
    )
  }

  const item = await prisma.publication
    .findUnique({ where: { id }, include: { cover: true } })
    .catch(() => null)
  if (!item) notFound()

  const meta = await getFieldMeta('Publication', item.id).catch(() => ({}))

  return (
    <>
      <PageTitle
        title={item.titleTr}
        action={
          <Link href="/admin/publications" className="text-sm text-navy-700 underline underline-offset-2">
            ← Yayınlar
          </Link>
        }
      />
      <LanguageHint configured={translationConfigured()} />
      <PublicationForm
        values={{
          id: item.id,
          slugTr: item.slugTr,
          slugEn: item.slugEn,
          published: item.published,
          publishedAt: item.publishedAt ? item.publishedAt.toISOString().slice(0, 10) : '',
          order: item.order,
          author: item.author,
          titleTr: item.titleTr,
          titleEn: item.titleEn,
          excerptTr: item.excerptTr,
          excerptEn: item.excerptEn,
          bodyTr: item.bodyTr,
          bodyEn: item.bodyEn,
          coverAltTr: item.coverAltTr,
          coverAltEn: item.coverAltEn,
          seoTitleTr: item.seoTitleTr,
          seoTitleEn: item.seoTitleEn,
          seoDescTr: item.seoDescTr,
          seoDescEn: item.seoDescEn,
          cover: item.cover,
        }}
        meta={meta}
      />
    </>
  )
}
