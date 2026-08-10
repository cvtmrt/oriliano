import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PageTitle, Card, Banner } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

const groupLabels: Record<string, { title: string; description: string }> = {
  home: { title: 'Anasayfa', description: 'Hero, tanıtım, ilkeler ve alt çağrı bölümü' },
  about: { title: 'Hakkımızda', description: 'Sayfa başlığı, ana metin ve ilkeler' },
  services: { title: 'Hizmetlerimiz (liste sayfası)', description: 'Liste sayfasının başlık ve açıklamaları' },
  legalServices: { title: 'Avukatlık ve Danışmanlık', description: 'Sayfanın tüm metni' },
  mediation: { title: 'Arabuluculuk', description: 'Sayfanın tüm metni' },
  team: { title: 'Ekibimiz', description: 'Liste sayfası başlıkları' },
  contact: { title: 'İletişim', description: 'Başlıklar, form etiketleri ve KVKK notu' },
  publications: { title: 'Yayınlar', description: 'Liste sayfası başlıkları ve boş liste metni' },
  footer: { title: 'Alt Bilgi', description: 'Alt bilgi metinleri ve yasal uyarı' },
  common: { title: 'Ortak Metinler', description: 'Butonlar ve 404 sayfası' },
  seo: { title: 'Paylaşım Görseli', description: 'Varsayılan sosyal medya görseli' },
}

const order = [
  'home',
  'about',
  'services',
  'legalServices',
  'mediation',
  'team',
  'contact',
  'publications',
  'footer',
  'common',
  'seo',
]

export default async function ContentIndexPage() {
  if (!(await getCurrentAdmin())) redirect('/admin/login')

  let textGroups: { group: string; _count: { _all: number } }[] = []
  let slotGroups: { group: string; _count: { _all: number } }[] = []
  let error: string | null = null

  try {
    ;[textGroups, slotGroups] = await Promise.all([
      prisma.localizedText.groupBy({ by: ['group'], _count: { _all: true } }),
      prisma.mediaSlot.groupBy({ by: ['group'], _count: { _all: true } }),
    ])
  } catch (err) {
    error = (err as Error).message
  }

  const counts = new Map<string, { texts: number; slots: number }>()
  for (const g of textGroups) counts.set(g.group, { texts: g._count._all, slots: 0 })
  for (const g of slotGroups) {
    const existing = counts.get(g.group) ?? { texts: 0, slots: 0 }
    existing.slots = g._count._all
    counts.set(g.group, existing)
  }

  const groups = order.filter((g) => counts.has(g))
  for (const key of counts.keys()) if (!groups.includes(key)) groups.push(key)

  return (
    <>
      <PageTitle
        title="Sayfa İçerikleri"
        description="Sitedeki her metin ve görsel yuvası burada. Türkçe alanı doldurmanız yeterli; İngilizcesi kaydettiğiniz anda arka planda üretilir."
      />

      {error ? <Banner type="error">Veritabanı okunamadı: {error}</Banner> : null}

      {groups.length === 0 && !error ? (
        <Banner type="warn">
          Henüz içerik kaydı yok. <code>npm run db:seed</code> komutunu çalıştırın.
        </Banner>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((group) => {
          const info = groupLabels[group] ?? { title: group, description: '' }
          const count = counts.get(group)!
          return (
            <Link
              key={group}
              href={`/admin/content/${group}`}
              className="rounded-md border border-graphite-200 bg-white p-5 transition-colors hover:border-navy-300"
            >
              <h2 className="font-medium text-navy-900">{info.title}</h2>
              {info.description ? (
                <p className="mt-1 text-sm text-graphite-500">{info.description}</p>
              ) : null}
              <p className="mt-3 text-xs text-graphite-400">
                {count.texts} metin
                {count.slots > 0 ? ` · ${count.slots} görsel` : ''}
              </p>
            </Link>
          )
        })}
      </div>

      <Card title="İpucu" className="mt-8">
        <p className="text-sm leading-relaxed text-graphite-600">
          Hizmet alanları, ekip üyeleri ve yayınlar kendi bölümlerinden yönetilir — bu sayfada
          yalnızca sabit sayfa metinleri bulunur.
        </p>
      </Card>
    </>
  )
}
