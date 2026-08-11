import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getFieldMeta } from '@/lib/translation-queue'
import { saveTextsAction, translateGroupAction } from '../../actions'
import { PageTitle, Card, Banner } from '@/components/admin/ui'
import LanguageHint from '@/components/admin/LanguageHint'
import { translationConfigured } from '@/lib/translate'
import SaveBar from '@/components/admin/SaveBar'
import BilingualField from '@/components/admin/BilingualField'
import MediaPicker from '@/components/admin/MediaPicker'
import SlotAltFields from '@/components/admin/SlotAltFields'
import { mediaSlotDefaultMap } from '@/content/defaults'

export const dynamic = 'force-dynamic'

export default async function ContentGroupPage({
  params,
}: {
  params: Promise<{ group: string }>
}) {
  if (!(await getCurrentAdmin())) redirect('/admin/login')
  const { group } = await params

  const [texts, slots] = await Promise.all([
    prisma.localizedText.findMany({ where: { group }, orderBy: { order: 'asc' } }),
    prisma.mediaSlot.findMany({
      where: { group },
      orderBy: { order: 'asc' },
      include: { media: true },
    }),
  ])

  if (texts.length === 0 && slots.length === 0) notFound()

  const metaEntries = await Promise.all([
    ...texts.map(async (row) => [row.id, (await getFieldMeta('LocalizedText', row.id)).value] as const),
    ...slots.map(async (row) => [row.id, (await getFieldMeta('MediaSlot', row.id)).alt] as const),
  ])
  const metaMap = new Map(metaEntries)

  return (
    <>
      <PageTitle
        title={`İçerik: ${group}`}
        description="Türkçe alanı doldurun. İngilizce boş kalırsa site Türkçeyi gösterir; kaydettiğinizde arka planda otomatik çevrilir."
        action={
          <Link href="/admin/content" className="text-sm text-navy-700 underline underline-offset-2">
            ← Tüm sayfalar
          </Link>
        }
      />

      <LanguageHint configured={translationConfigured()} />

      <form action={translateGroupAction} className="mb-6">
        <input type="hidden" name="group" value={group} />
        <SaveBar variant="secondary" savedLabel="Çeviri sıraya alındı" note="birkaç saniye içinde tamamlanır">Bu sayfayı tümüyle yeniden çevir</SaveBar>
        <p className="mt-2 text-xs text-graphite-500">
          Elle düzenlenmiş (kilitli) alanlar dâhil tüm İngilizce metinler yeniden üretilir.
        </p>
      </form>

      <form action={saveTextsAction} className="space-y-6">
        <input type="hidden" name="group" value={group} />

        {slots.length > 0 ? (
          <Card
            title="Görseller"
            description="Her yuva ayrı ayrı değiştirilebilir. Görsel yüklemediğiniz yuvalarda site, markaya uygun hazır tasarım görselini gösterir; kendi fotoğrafınızı yüklediğinizde onun yerine geçer."
          >
            {slots.map((slot) => (
              <div key={slot.id}>
                <MediaPicker
                  name={`media__${slot.id}`}
                  label={slot.label}
                  current={slot.media}
                  fallbackSrc={mediaSlotDefaultMap[slot.key]?.bundled?.src}
                />
                <SlotAltFields
                  slotId={slot.id}
                  altTr={slot.altTr}
                  altEn={slot.altEn}
                  status={metaMap.get(slot.id)?.status}
                />
              </div>
            ))}
          </Card>
        ) : null}

        {texts.length > 0 ? (
          <Card title="Metinler">
            {texts.map((row) => (
              <BilingualField
                key={row.id}
                name={row.id}
                label={row.label}
                kind={row.kind}
                valueTr={row.tr}
                valueEn={row.en}
                status={metaMap.get(row.id)?.status}
                rows={row.kind === 'LONG' ? 3 : 4}
                target={{ entity: 'LocalizedText', entityId: row.id, field: 'value' }}
              />
            ))}
          </Card>
        ) : null}

        {texts.length === 0 && slots.length === 0 ? (
          <Banner type="warn">Bu grupta içerik yok.</Banner>
        ) : null}

        <div className="sticky bottom-0 -mx-4 border-t border-graphite-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <SaveBar note="İngilizce çeviri arka planda üretiliyor">Değişiklikleri kaydet</SaveBar>
        </div>
      </form>
    </>
  )
}
