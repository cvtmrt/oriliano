import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { queueStats } from '@/lib/translation-queue'
import {
  clearSeedDataAction,
  loadSeedDataAction,
  retranslateAllAction,
  retryFailedTranslationsAction,
  translateMissingAction,
} from '../actions'
import { PageTitle, Card, Banner } from '@/components/admin/ui'
import SaveBar from '@/components/admin/SaveBar'
import TranslationTest from '@/components/admin/TranslationTest'
import ConfirmButton from '@/components/admin/ConfirmButton'

export const dynamic = 'force-dynamic'

export default async function ToolsPage() {
  if (!(await getCurrentAdmin())) redirect('/admin/login')

  const [stats, seededCounts, failedList] = await Promise.all([
    queueStats().catch(() => null),
    Promise.all([
      prisma.service.count({ where: { seeded: true } }).catch(() => 0),
      prisma.teamMember.count({ where: { seeded: true } }).catch(() => 0),
      prisma.localizedText.count({ where: { seeded: true } }).catch(() => 0),
      prisma.publication.count({ where: { seeded: true } }).catch(() => 0),
      prisma.localizedText.count({ where: { seeded: false } }).catch(() => 0),
      prisma.service.count().catch(() => 0),
      prisma.teamMember.count().catch(() => 0),
    ]),
    prisma.fieldMeta
      .findMany({ where: { status: 'FAILED' }, take: 20 })
      .catch(() => []),
  ])

  const [seededServices, seededTeam, seededTexts, seededPubs, nonSeededTexts, serviceCount, teamCount] =
    seededCounts
  const totalSeeded = seededServices + seededTeam + seededTexts + seededPubs

  return (
    <>
      <PageTitle title="Araçlar" description="Toplu çeviri ve örnek veri yönetimi." />

      {stats && !stats.configured ? (
        <Banner type="warn">
          Otomatik çeviri kapalı. <code>GEMINI_API_KEY</code> (Google AI Studio&apos;dan ücretsiz
          alınabilir) veya <code>ANTHROPIC_API_KEY</code> ekleyin. İkisi de tanımlıysa Gemini
          kullanılır; <code>TRANSLATION_PROVIDER</code> ile zorlayabilirsiniz.
        </Banner>
      ) : (
        <Banner type="info">Çeviri sağlayıcısı: <strong>{stats?.provider}</strong></Banner>
      )}

      <div className="space-y-6">
        <Card
          title="Çeviri bağlantı testi"
          description="ANTHROPIC_API_KEY ekledikten sonra buradan doğrulayın. Küçük bir cümle çevirir, kuyruğa dokunmaz."
        >
          <TranslationTest />
        </Card>

        <Card
          title="Eksik İngilizce metinleri toplu çevir"
          description="Türkçesi dolu, İngilizcesi boş olan tüm alanları sıraya alır. Elle düzenlenmiş (kilitli) alanlara dokunmaz."
        >
          <p className="mb-4 text-sm text-graphite-600">
            Sırada bekleyen: <strong>{stats?.pending ?? 0}</strong> · Başarısız:{' '}
            <strong>{stats?.failed ?? 0}</strong>
          </p>
          <form action={translateMissingAction}>
            <SaveBar savedLabel="Sıraya alındı" note="çeviri arka planda sürüyor">Eksikleri çevir</SaveBar>
          </form>
        </Card>

        <Card
          title="Tüm İngilizce metinleri yeniden çevir"
          description="Var olan otomatik çevirilerin üzerine yenisini yazar. Terim sözlüğüne bir şey eklediğinizde veya bir çeviri yanlış/eksik göründüğünde kullanın. Elle yazdığınız (kilitli) alanlara dokunmaz."
        >
          <p className="mb-4 text-sm text-graphite-600">
            Yüzlerce alan olabildiği için birkaç dakika sürebilir; arka planda kendi kendine
            ilerler, sayfada beklemeniz gerekmez. Yukarıdaki &quot;sırada bekleyen&quot; sayısı
            azalarak sıfırlanır.
          </p>
          <ConfirmButton
            action={retranslateAllAction}
            confirmText="Tüm otomatik İngilizce metinler yeniden üretilecek. Elle yazdığınız kilitli alanlara dokunulmaz. Devam edilsin mi?"
            label="Hepsini yeniden çevir"
            variant="secondary"
          />
        </Card>

        {failedList.length > 0 ? (
          <Card
            title="Başarısız çeviriler"
            description="Eski İngilizce metinler korundu. Aşağıdaki düğmeyle hepsi yeniden denenir."
          >
            <ul className="mb-4 space-y-1.5 text-xs text-graphite-600">
              {failedList.map((item) => (
                <li key={item.id} className="font-mono">
                  {item.entity}.{item.field}
                  {item.error ? (
                    <span className="ml-2 font-sans text-red-700">— {item.error.slice(0, 120)}</span>
                  ) : null}
                </li>
              ))}
            </ul>
            <form action={retryFailedTranslationsAction}>
              <SaveBar variant="secondary" savedLabel="Yeniden denendi">Başarısızları tekrar dene</SaveBar>
            </form>
          </Card>
        ) : null}

        <Card
          title="Örnek verileri yükle"
          description="Sayfa metinleri, görsel yuvaları, menü, 10 hizmet, 4 ekip üyesi, SEO kayıtları ve terim sözlüğü. Var olan kayıtların içeriğine dokunmaz — istediğiniz kadar çalıştırabilirsiniz."
        >
          <p className="mb-4 text-sm text-graphite-600">
            Şu an veritabanında: {seededTexts + nonSeededTexts} metin, {serviceCount} hizmet,{' '}
            {teamCount} ekip üyesi.
          </p>
          <form action={loadSeedDataAction}>
            <SaveBar variant="secondary" savedLabel="Örnek veriler yüklendi">Örnek verileri yükle</SaveBar>
          </form>
        </Card>

        <Card
          title="Örnek verileri temizle"
          description="Kurulumla gelen yer tutucu içerikleri siler. Sizin eklediğiniz veya düzenlediğiniz kayıtlara dokunmaz."
        >
          <p className="mb-4 text-sm text-graphite-600">
            Örnek işaretli kayıtlar: {seededTexts} metin, {seededServices} hizmet, {seededTeam} ekip
            üyesi, {seededPubs} yayın.
          </p>

          {totalSeeded === 0 ? (
            <Banner type="success">Örnek veri kalmadı.</Banner>
          ) : (
            <>
              <ConfirmButton
                action={clearSeedDataAction}
                confirmText="Örnek veriler silinecek. Sizin girdiğiniz veya düzenlediğiniz içeriğe dokunulmaz. Devam edilsin mi?"
                label="Örnek verileri sil"
              />
              <p className="mt-3 text-xs text-graphite-500">
                Geri alınamaz — ama istediğiniz zaman yukarıdaki düğmeyle yeniden
                yükleyebilirsiniz. İletişim bilgilerinden yalnızca hâlâ örnek değerinde
                olanlar boşaltılır.
              </p>
            </>
          )}
        </Card>

        <Card title="Görsel üretimi hakkında">
          <p className="text-sm leading-relaxed text-graphite-600">
            Hero ve bölüm görselleri boşken sakin bir yer tutucu gösterilir; site kırık görünmez.
            Görsel üretmek gerekirse{' '}
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy-700 underline"
            >
              Google AI Studio
            </a>{' '}
            ücretsiz bir seçenektir. Yükleme öncesi kırpma/oran düzeltme için{' '}
            <a
              href="https://www.photopea.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy-700 underline"
            >
              Photopea
            </a>
            , düşük çözünürlüklü fotoğrafları büyütmek için{' '}
            <a
              href="https://upscayl.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy-700 underline"
            >
              Upscayl
            </a>{' '}
            kullanılabilir. Yükleme sırasında görseller zaten otomatik olarak WebP&apos;ye çevrilir.
          </p>
        </Card>
      </div>
    </>
  )
}
