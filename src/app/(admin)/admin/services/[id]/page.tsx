import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getFieldMeta } from '@/lib/translation-queue'
import { PageTitle } from '@/components/admin/ui'
import LanguageHint from '@/components/admin/LanguageHint'
import { translationConfigured } from '@/lib/translate'
import ServiceForm, { type ServiceFormValues } from '@/components/admin/ServiceForm'

export const dynamic = 'force-dynamic'

const emptyService: ServiceFormValues = {
  id: '',
  slugTr: '',
  slugEn: '',
  icon: 'scale',
  order: 0,
  visible: true,
  featured: false,
  titleTr: '',
  titleEn: '',
  excerptTr: '',
  excerptEn: '',
  bodyTr: '',
  bodyEn: '',
  imageAltTr: '',
  imageAltEn: '',
  seoTitleTr: '',
  seoTitleEn: '',
  seoDescTr: '',
  seoDescEn: '',
  image: null,
  ogImage: null,
}

export default async function ServiceEditPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getCurrentAdmin())) redirect('/admin/login')
  const { id } = await params

  if (id === 'new') {
    return (
      <>
        <PageTitle
          title="Yeni hizmet"
          action={
            <Link href="/admin/services" className="text-sm text-navy-700 underline underline-offset-2">
              ← Hizmetler
            </Link>
          }
        />
        <LanguageHint configured={translationConfigured()} />
        <ServiceForm values={emptyService} meta={{}} />
      </>
    )
  }

  const service = await prisma.service
    .findUnique({ where: { id }, include: { image: true, ogImage: true } })
    .catch(() => null)
  if (!service) notFound()

  const meta = await getFieldMeta('Service', service.id).catch(() => ({}))

  return (
    <>
      <PageTitle
        title={service.titleTr}
        description={`/tr/hizmetlerimiz/${service.slugTr}`}
        action={
          <Link href="/admin/services" className="text-sm text-navy-700 underline underline-offset-2">
            ← Hizmetler
          </Link>
        }
      />
      <LanguageHint configured={translationConfigured()} />
      <ServiceForm
        values={{
          id: service.id,
          slugTr: service.slugTr,
          slugEn: service.slugEn,
          icon: service.icon,
          order: service.order,
          visible: service.visible,
          featured: service.featured,
          titleTr: service.titleTr,
          titleEn: service.titleEn,
          excerptTr: service.excerptTr,
          excerptEn: service.excerptEn,
          bodyTr: service.bodyTr,
          bodyEn: service.bodyEn,
          imageAltTr: service.imageAltTr,
          imageAltEn: service.imageAltEn,
          seoTitleTr: service.seoTitleTr,
          seoTitleEn: service.seoTitleEn,
          seoDescTr: service.seoDescTr,
          seoDescEn: service.seoDescEn,
          image: service.image,
          ogImage: service.ogImage,
        }}
        meta={meta}
      />
    </>
  )
}
