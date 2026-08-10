import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { storageStatus } from '@/lib/media'
import { queueStats } from '@/lib/translation-queue'
import { PageTitle, Card, Banner } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

async function counts() {
  try {
    const [services, team, publications, unread, texts, media] = await Promise.all([
      prisma.service.count(),
      prisma.teamMember.count(),
      prisma.publication.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.localizedText.count(),
      prisma.media.count(),
    ])
    return { services, team, publications, unread, texts, media, ok: true as const }
  } catch (err) {
    return { ok: false as const, error: (err as Error).message }
  }
}

export default async function AdminDashboard() {
  const user = await getCurrentAdmin()
  if (!user) redirect('/admin/login')

  const [stats, storage, queue] = await Promise.all([counts(), storageStatus(), queueStats().catch(() => null)])

  return (
    <>
      <PageTitle
        title="Genel Bakış"
        description="Sitedeki tüm metin ve görseller bu panelden yönetilir. Türkçe yazın; İngilizcesi arka planda otomatik üretilir."
      />

      {!stats.ok ? (
        <Banner type="error">
          Veritabanına bağlanılamadı: {stats.error}
          <br />
          <code>DATABASE_URL</code> tanımlı mı ve migration çalıştırıldı mı kontrol edin.
        </Banner>
      ) : null}

      {!storage.writable ? (
        <Banner type="warn">
          <strong>Görsel deposu yazılabilir değil.</strong> Dizin: <code>{storage.dir}</code>
          {storage.error ? ` — ${storage.error}` : ''}
          <br />
          Railway&apos;de bu yola bir <strong>Volume</strong> bağlanmalı, aksi hâlde yüklenen
          görseller ilk deploy&apos;da silinir.
        </Banner>
      ) : null}

      {queue && !queue.configured ? (
        <Banner type="warn">
          <strong>Otomatik çeviri kapalı.</strong> <code>ANTHROPIC_API_KEY</code> tanımlı değil.
          İngilizce alanları elle doldurabilirsiniz; boş kalırsa site Türkçe metni gösterir.
        </Banner>
      ) : null}

      {queue && queue.configured && queue.pending > 0 ? (
        <Banner type="info">
          {queue.pending} alan çeviri sırasında. Birkaç saniye içinde tamamlanır.
        </Banner>
      ) : null}

      {queue && queue.failed > 0 ? (
        <Banner type="error">
          {queue.failed} alanın çevirisi başarısız oldu. Eski İngilizce metinler korundu.{' '}
          <Link href="/admin/tools" className="underline">
            Araçlar sayfasından tekrar deneyin.
          </Link>
        </Banner>
      ) : null}

      {stats.ok ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Okunmamış mesaj" value={stats.unread} href="/admin/messages" highlight={stats.unread > 0} />
          <StatCard label="Hizmet alanı" value={stats.services} href="/admin/services" />
          <StatCard label="Ekip üyesi" value={stats.team} href="/admin/team" />
          <StatCard label="Yayın" value={stats.publications} href="/admin/publications" />
          <StatCard label="Metin alanı" value={stats.texts} href="/admin/content" />
          <StatCard label="Yüklü görsel" value={stats.media} href="/admin/media" />
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card title="Nereden başlamalı?">
          <ol className="space-y-2.5 text-sm leading-relaxed text-graphite-700">
            <li>
              <strong>1.</strong>{' '}
              <Link href="/admin/settings" className="text-navy-700 underline">
                Genel Ayarlar
              </Link>{' '}
              — logo, telefon, adres, e-posta ve harita.
            </li>
            <li>
              <strong>2.</strong>{' '}
              <Link href="/admin/content" className="text-navy-700 underline">
                Sayfa İçerikleri
              </Link>{' '}
              — anasayfa ve alt sayfaların metin/görselleri.
            </li>
            <li>
              <strong>3.</strong>{' '}
              <Link href="/admin/services" className="text-navy-700 underline">
                Hizmetler
              </Link>{' '}
              ve{' '}
              <Link href="/admin/team" className="text-navy-700 underline">
                Ekip
              </Link>{' '}
              — örnek kayıtları gerçek bilgilerle değiştirin.
            </li>
            <li>
              <strong>4.</strong>{' '}
              <Link href="/admin/tools" className="text-navy-700 underline">
                Araçlar
              </Link>{' '}
              — işiniz bitince örnek verileri temizleyin.
            </li>
          </ol>
        </Card>

        <Card title="Depolama">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-graphite-500">Görsel dizini</dt>
              <dd className="truncate font-mono text-xs text-graphite-700" title={storage.dir}>
                {storage.dir}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-graphite-500">Yazılabilir</dt>
              <dd className={storage.writable ? 'text-green-700' : 'text-red-700'}>
                {storage.writable ? 'Evet' : 'Hayır'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-graphite-500">Otomatik çeviri</dt>
              <dd className={queue?.configured ? 'text-green-700' : 'text-amber-700'}>
                {queue?.configured ? 'Etkin (claude-opus-5)' : 'Kapalı'}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  )
}

function StatCard({
  label,
  value,
  href,
  highlight,
}: {
  label: string
  value: number
  href: string
  highlight?: boolean
}) {
  return (
    <Link
      href={href}
      className={`rounded-md border bg-white p-5 transition-colors hover:border-navy-300 ${
        highlight ? 'border-amber-300 bg-amber-50' : 'border-graphite-200'
      }`}
    >
      <p className="text-sm text-graphite-500">{label}</p>
      <p className="mt-1 font-serif text-3xl text-navy-900">{value}</p>
    </Link>
  )
}
