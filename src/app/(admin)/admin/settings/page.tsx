import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getFieldMeta } from '@/lib/translation-queue'
import { saveSettingsAction } from '../actions'
import { PageTitle, Card, SubmitButton, Banner } from '@/components/admin/ui'
import BilingualField from '@/components/admin/BilingualField'
import MediaPicker from '@/components/admin/MediaPicker'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  if (!(await getCurrentAdmin())) redirect('/admin/login')

  let settings
  try {
    settings = await prisma.siteSetting.findUnique({
      where: { id: 1 },
      include: { logo: true, logoDark: true, favicon: true },
    })
  } catch {
    settings = null
  }

  if (!settings) {
    return (
      <>
        <PageTitle title="Genel Ayarlar" />
        <Banner type="error">
          Ayar kaydı bulunamadı. Veritabanı bağlantısını ve <code>npm run db:seed</code> adımını
          kontrol edin.
        </Banner>
      </>
    )
  }

  const meta = await getFieldMeta('SiteSetting', '1').catch(() => ({}) as Record<string, { status: string }>)

  return (
    <>
      <PageTitle
        title="Genel Ayarlar"
        description="Site adı, logo, iletişim bilgileri ve sosyal medya. Bu bilgiler üst menü, alt bilgi, iletişim sayfası ve yapılandırılmış veride (SEO) kullanılır."
      />

      <form action={saveSettingsAction} className="space-y-6">
        <Card title="Kimlik">
          <BilingualField
            name="siteName"
            label="Site adı"
            valueTr={settings.siteNameTr}
            valueEn={settings.siteNameEn}
            status={meta.siteName?.status}
            target={{ entity: 'SiteSetting', entityId: '1', field: 'siteName' }}
            help="Üst menüde, alt bilgide ve sekme başlığında görünür. Firma adı çeviride olduğu gibi bırakılır."
            required
          />
          <BilingualField
            name="tagline"
            label="Slogan"
            kind="LONG"
            rows={2}
            valueTr={settings.taglineTr}
            valueEn={settings.taglineEn}
            status={meta.tagline?.status}
            target={{ entity: 'SiteSetting', entityId: '1', field: 'tagline' }}
          />

          <div className="border-b border-graphite-200 py-5">
            <label className="field-label" htmlFor="accentColor">
              Vurgu rengi
            </label>
            <div className="flex items-center gap-3">
              <input
                id="accentColor"
                name="accentColor"
                type="color"
                defaultValue={settings.accentColor || '#A9834B'}
                className="h-11 w-16 cursor-pointer rounded border border-graphite-300 bg-white p-1"
              />
              <span className="text-xs text-graphite-500">
                Butonlarda, üst etiketlerde ve ince çizgilerde kullanılır. Logodaki lacivert ana
                renk olarak sabittir.
              </span>
            </div>
          </div>

          <MediaPicker
            name="logoId"
            label="Logo (açık zemin)"
            current={settings.logo}
            help="Üst menüde kullanılır. Yüklenmezse geçici yazı logosu gösterilir. Şeffaf PNG veya SVG önerilir."
          />
          <MediaPicker
            name="logoDarkId"
            label="Logo (koyu zemin)"
            current={settings.logoDark}
            help="Alt bilgide koyu lacivert zemin üzerinde kullanılır."
          />
          <MediaPicker
            name="faviconId"
            label="Favicon"
            current={settings.favicon}
            help="Tarayıcı sekmesi simgesi. Kare, en az 96×96 px."
          />
        </Card>

        <Card title="İletişim">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="phone">
                Telefon
              </label>
              <input id="phone" name="phone" defaultValue={settings.phone} className="field-input" />
            </div>
            <div>
              <label className="field-label" htmlFor="phoneSecondary">
                İkinci telefon
              </label>
              <input
                id="phoneSecondary"
                name="phoneSecondary"
                defaultValue={settings.phoneSecondary}
                className="field-input"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="email">
                E-posta
              </label>
              <input id="email" name="email" type="email" defaultValue={settings.email} className="field-input" />
            </div>
          </div>

          <div className="mt-5">
            <BilingualField
              name="address"
              label="Adres"
              kind="LONG"
              rows={3}
              valueTr={settings.addressTr}
              valueEn={settings.addressEn}
              status={meta.address?.status}
              target={{ entity: 'SiteSetting', entityId: '1', field: 'address' }}
              help="Satır sonları korunur. Adresler çeviride olduğu gibi bırakılır."
            />
            <BilingualField
              name="workingHours"
              label="Çalışma saatleri"
              valueTr={settings.workingHoursTr}
              valueEn={settings.workingHoursEn}
              status={meta.workingHours?.status}
              target={{ entity: 'SiteSetting', entityId: '1', field: 'workingHours' }}
              help="Örnek: Pazartesi – Cuma, 09:00 – 18:00"
            />
          </div>
        </Card>

        <Card title="Harita">
          <div className="space-y-5">
            <div>
              <label className="field-label" htmlFor="mapEmbedUrl">
                Google Haritalar gömme adresi
              </label>
              <input
                id="mapEmbedUrl"
                name="mapEmbedUrl"
                defaultValue={settings.mapEmbedUrl}
                placeholder="https://www.google.com/maps/embed?pb=…"
                className="field-input"
              />
              <p className="mt-1.5 text-xs text-graphite-500">
                Google Haritalar → Paylaş → Harita yerleştir → <code>src</code> içindeki adresi
                yapıştırın. Boş bırakılırsa iletişim sayfasında harita gösterilmez.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="mapLat">
                  Enlem (opsiyonel)
                </label>
                <input id="mapLat" name="mapLat" defaultValue={settings.mapLat} className="field-input" />
              </div>
              <div>
                <label className="field-label" htmlFor="mapLng">
                  Boylam (opsiyonel)
                </label>
                <input id="mapLng" name="mapLng" defaultValue={settings.mapLng} className="field-input" />
              </div>
            </div>
            <p className="text-xs text-graphite-500">
              Enlem/boylam girilirse arama motorlarına konum bilgisi de sunulur.
            </p>
          </div>
        </Card>

        <Card title="Sosyal medya">
          <div className="grid gap-5 sm:grid-cols-2">
            {(
              [
                ['linkedin', 'LinkedIn'],
                ['instagram', 'Instagram'],
                ['x', 'X'],
                ['facebook', 'Facebook'],
                ['youtube', 'YouTube'],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="field-label" htmlFor={key}>
                  {label}
                </label>
                <input
                  id={key}
                  name={key}
                  defaultValue={(settings as unknown as Record<string, string>)[key]}
                  placeholder="https://…"
                  className="field-input"
                />
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-graphite-500">
            Boş bırakılan hesaplar alt bilgide gösterilmez.
          </p>
        </Card>

        <Card title="Alan adı">
          <label className="field-label" htmlFor="baseUrl">
            Sitenin tam adresi
          </label>
          <input
            id="baseUrl"
            name="baseUrl"
            defaultValue={settings.baseUrl}
            placeholder="https://cetinerlegal.com"
            className="field-input"
          />
          <p className="mt-1.5 text-xs text-graphite-500">
            Kanonik adresler, hreflang etiketleri, sitemap ve paylaşım görselleri bu adrese göre
            üretilir. Sonunda eğik çizgi olmamalı.
          </p>
        </Card>

        <div className="sticky bottom-0 -mx-4 border-t border-graphite-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <SubmitButton>Ayarları kaydet</SubmitButton>
        </div>
      </form>
    </>
  )
}
