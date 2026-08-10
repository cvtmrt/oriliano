import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getFieldMeta } from '@/lib/translation-queue'
import { saveMenuAction } from '../actions'
import { PageTitle, Card, Empty } from '@/components/admin/ui'
import SaveBar from '@/components/admin/SaveBar'
import MenuRow from '@/components/admin/MenuRow'
import { routeSegment, type RouteKey } from '@/lib/routes'

export const dynamic = 'force-dynamic'

export default async function MenuPage() {
  if (!(await getCurrentAdmin())) redirect('/admin/login')

  const items = await prisma.menuItem.findMany({ orderBy: { order: 'asc' } }).catch(() => [])

  const metaEntries = await Promise.all(
    items.map(async (item) => [item.id, (await getFieldMeta('MenuItem', item.id)).label] as const),
  )
  const metaMap = new Map(metaEntries)

  return (
    <>
      <PageTitle
        title="Menü"
        description="Üst menüdeki etiketler, sıralama ve görünürlük. Bir sayfayı gizlerseniz doğrudan adresle de açılamaz."
      />

      {items.length === 0 ? (
        <Empty>
          Menü kaydı yok. <code>npm run db:seed</code> komutunu çalıştırın.
        </Empty>
      ) : (
        <form action={saveMenuAction} className="space-y-6">
          <Card>
            <div className="space-y-1">
              {items.map((item) => (
                <MenuRow
                  key={item.id}
                  id={item.id}
                  routeKey={item.routeKey}
                  pathTr={`/tr/${routeSegment(item.routeKey as RouteKey, 'tr')}`}
                  pathEn={`/en/${routeSegment(item.routeKey as RouteKey, 'en')}`}
                  labelTr={item.labelTr}
                  labelEn={item.labelEn}
                  order={item.order}
                  visible={item.visible}
                  status={metaMap.get(item.id)?.status}
                  lockedVisibility={item.routeKey === 'home'}
                />
              ))}
            </div>
          </Card>

          <div className="sticky bottom-0 -mx-4 border-t border-graphite-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
            <SaveBar note="İngilizce çeviri arka planda üretiliyor">Menüyü kaydet</SaveBar>
          </div>
        </form>
      )}
    </>
  )
}
