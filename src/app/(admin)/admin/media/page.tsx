import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { listMedia, storageStatus } from '@/lib/media'
import { deleteMediaAction } from '../actions'
import { PageTitle, Empty, Banner, Card } from '@/components/admin/ui'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default async function MediaPage() {
  if (!(await getCurrentAdmin())) redirect('/admin/login')

  const [items, storage] = await Promise.all([listMedia().catch(() => []), storageStatus()])
  const total = items.reduce((sum, item) => sum + item.sizeBytes, 0)

  return (
    <>
      <PageTitle
        title="Görseller"
        description="Yüklenen tüm görseller. Görsel yükleme ilgili içerik sayfalarından yapılır; burası genel kütüphanedir."
      />

      {!storage.writable ? (
        <Banner type="error">
          Depolama yazılabilir değil (<code>{storage.dir}</code>). Railway&apos;de Volume bağlanmadan
          yüklenen görseller ilk deploy&apos;da silinir.
        </Banner>
      ) : null}

      <Card className="mb-6">
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-graphite-500">Dosya sayısı</dt>
            <dd className="mt-0.5 font-medium text-navy-900">{items.length}</dd>
          </div>
          <div>
            <dt className="text-graphite-500">Toplam boyut</dt>
            <dd className="mt-0.5 font-medium text-navy-900">{formatSize(total)}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-graphite-500">Dizin</dt>
            <dd className="mt-0.5 truncate font-mono text-xs text-graphite-700" title={storage.dir}>
              {storage.dir}
            </dd>
          </div>
        </dl>
      </Card>

      {items.length === 0 ? (
        <Empty>Henüz görsel yüklenmemiş.</Empty>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-md border border-graphite-200 bg-white">
              <div className="flex h-36 items-center justify-center bg-graphite-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/media/${encodeURIComponent(item.filename)}`}
                  alt={item.originalName}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-graphite-800" title={item.originalName}>
                  {item.originalName}
                </p>
                <p className="mt-1 text-[0.68rem] text-graphite-500">
                  {item.width && item.height ? `${item.width}×${item.height} · ` : ''}
                  {formatSize(item.sizeBytes)}
                </p>
                <div className="mt-3">
                  <DeleteButton
                    action={deleteMediaAction}
                    id={item.id}
                    confirmText={`"${item.originalName}" silinsin mi? Bu görseli kullanan yerler boş kalır.`}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
