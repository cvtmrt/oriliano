import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getFieldMeta } from '@/lib/translation-queue'
import { saveSeoAction } from '../actions'
import { PageTitle, Card, SubmitButton, Empty } from '@/components/admin/ui'
import SeoRow from '@/components/admin/SeoRow'

export const dynamic = 'force-dynamic'

const routeLabels: Record<string, string> = {
  home: 'Anasayfa',
  about: 'Hakkımızda',
  services: 'Hizmetlerimiz',
  legalServices: 'Avukatlık ve Danışmanlık',
  mediation: 'Arabuluculuk',
  team: 'Ekibimiz',
  contact: 'İletişim',
  publications: 'Yayınlar',
}

export default async function SeoPage() {
  if (!(await getCurrentAdmin())) redirect('/admin/login')

  const rows = await prisma.seoMeta
    .findMany({ include: { ogImage: true } })
    .catch(() => [])

  const ordered = Object.keys(routeLabels)
    .map((key) => rows.find((r) => r.routeKey === key))
    .filter(Boolean) as typeof rows

  const metaEntries = await Promise.all(
    ordered.map(async (row) => [row.id, await getFieldMeta('SeoMeta', row.id)] as const),
  )
  const metaMap = new Map(metaEntries)

  return (
    <>
      <PageTitle
        title="SEO"
        description="Sayfa başlıkları, açıklamaları ve paylaşım görselleri. Hizmet ve ekip detay sayfalarının SEO alanları kendi düzenleme ekranlarındadır."
      />

      {ordered.length === 0 ? (
        <Empty>
          SEO kaydı yok. <code>npm run db:seed</code> komutunu çalıştırın.
        </Empty>
      ) : (
        <form action={saveSeoAction} className="space-y-6">
          {ordered.map((row) => (
            <Card key={row.id} title={routeLabels[row.routeKey] ?? row.routeKey}>
              <SeoRow
                id={row.id}
                titleTr={row.titleTr}
                titleEn={row.titleEn}
                descTr={row.descTr}
                descEn={row.descEn}
                noindex={row.noindex}
                ogImage={row.ogImage}
                titleStatus={metaMap.get(row.id)?.title?.status}
                descStatus={metaMap.get(row.id)?.desc?.status}
              />
            </Card>
          ))}

          <div className="sticky bottom-0 -mx-4 border-t border-graphite-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
            <SubmitButton>SEO ayarlarını kaydet</SubmitButton>
          </div>
        </form>
      )}
    </>
  )
}
