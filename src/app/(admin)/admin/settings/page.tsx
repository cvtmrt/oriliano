import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getFieldMeta } from '@/lib/translation-queue'
import { mailConfigured } from '@/lib/mail'
import { whatsappLink } from '@/lib/phone'
import { saveSettingsAction } from '../actions'
import { PageTitle, Card, Banner } from '@/components/admin/ui'
import LanguageHint from '@/components/admin/LanguageHint'
import { translationConfigured } from '@/lib/translate'
import SaveBar from '@/components/admin/SaveBar'
import BilingualField from '@/components/admin/BilingualField'
import MediaPicker from '@/components/admin/MediaPicker'
import MailTest from '@/components/admin/MailTest'

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

  const mailReady = mailConfigured()
  const waLink = whatsappLink(settings.whatsappNumber, settings.whatsappTextTr)
  const meta = await getFieldMeta('SiteSetting', '1').catch(() => ({}) as Record<string, { status: string }>)

  return (
    <>
      <PageTitle
        title="Genel Ayarlar"
        description="Site adı, logo, iletişim bilgileri ve sosyal medya. Bu bilgiler üst menü, alt bilgi, iletişim sayfası ve yapılandırılmış veride (SEO) kullanılır."
      />

      <LanguageHint configured={translationConfigured()} />

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
              <input
                id="phone"
                name="phone"
                defaultValue={settings.phone}
                placeholder="+90 (312) 123 45 67"
                className="field-input"
              />
              <p className="mt-1.5 text-xs text-graphite-500">
                Sitede <strong>yazdığınız gibi görünür</strong>; boşluk ve parantez serbest.
                Tıklanabilir arama bağlantısı otomatik üretilir. Bu numara üst menüde, alt bilgide,
                iletişim sayfasında ve &quot;Ara&quot; düğmesinde kullanılır.
              </p>
            </div>
            <div>
              <label className="field-label" htmlFor="phoneSecondary">
                İkinci telefon
              </label>
              <input
                id="phoneSecondary"
                name="phoneSecondary"
                defaultValue={settings.phoneSecondary}
                placeholder="+90 (312) 123 45 68"
                className="field-input"
              />
              <p className="mt-1.5 text-xs text-graphite-500">
                Opsiyonel. Girilirse iletişim sayfasında birincinin altında görünür.
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="email">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={settings.email}
                placeholder="info@cetinerlegal.com"
                className="field-input"
              />
              <p className="mt-1.5 text-xs text-graphite-500">
                Tek adres. Form bildirimlerinin gideceği adresi ayrıca aşağıdan
                belirleyebilirsiniz; boş bırakırsanız bu adres kullanılır.
              </p>
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
              help="Her satırı ayrı yazın (Enter ile); site aynı biçimde gösterir. Örnek: “Kızılırmak Mah. 1450. Sok. No: 5 Kat: 3” alt satır “Çankaya / Ankara”. Adresler çeviride olduğu gibi bırakılır."
            />
            <BilingualField
              name="workingHours"
              label="Çalışma saatleri"
              valueTr={settings.workingHoursTr}
              valueEn={settings.workingHoursEn}
              status={meta.workingHours?.status}
              target={{ entity: 'SiteSetting', entityId: '1', field: 'workingHours' }}
              help="Serbest metin, yazdığınız gibi görünür. Örnek: “Pazartesi – Cuma, 09:00 – 18:00” veya “Hafta içi 09:00–18:00, Cumartesi randevu ile”."
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
                <input
                  id="mapLat"
                  name="mapLat"
                  defaultValue={settings.mapLat}
                  placeholder="39.9208"
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label" htmlFor="mapLng">
                  Boylam (opsiyonel)
                </label>
                <input
                  id="mapLng"
                  name="mapLng"
                  defaultValue={settings.mapLng}
                  placeholder="32.8541"
                  className="field-input"
                />
              </div>
            </div>
            <p className="text-xs text-graphite-500">
              Google Haritalar&apos;da konuma sağ tıklayınca en üstte çıkan iki sayıdır
              (<code>39.9208, 32.8541</code>): soldaki enlem, sağdaki boylam. Nokta kullanın,
              virgül değil. Girilirse arama motorlarına konum bilgisi de sunulur.
            </p>
          </div>
        </Card>

        <Card
          title="Form bildirimleri"
          description="İletişim formu doldurulduğunda e-posta gelsin. Mesaj her hâlükârda Gelen Kutusu'na kaydedilir; bu ayar yalnızca haber verilip verilmeyeceğini belirler."
        >
          {!mailReady ? (
            <Banner type="warn">
              E-posta gönderimi kapalı: <code>RESEND_API_KEY</code> ortam değişkeni tanımlı değil.
              Anahtarı{' '}
              <a
                href="https://resend.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                resend.com
              </a>{' '}
              üzerinden ücretsiz alıp Railway&apos;e ekleyin. Eklenene kadar aşağıdaki ayarlar
              kaydedilir ama e-posta gitmez.
            </Banner>
          ) : null}

          <label className="flex min-h-[44px] items-center gap-3 text-sm text-graphite-700">
            <input
              type="checkbox"
              name="notifyEnabled"
              defaultChecked={settings.notifyEnabled}
              className="h-4 w-4"
            />
            Yeni mesaj gelince e-posta gönder
          </label>

          <div className="mt-4">
            <label className="field-label" htmlFor="notifyEmail">
              Bildirim adresi
            </label>
            <input
              id="notifyEmail"
              name="notifyEmail"
              defaultValue={settings.notifyEmail}
              placeholder={settings.email || 'ornek@cetinerlegal.com'}
              className="field-input"
            />
            <p className="mt-1.5 text-xs text-graphite-500">
              Birden fazla adres için virgülle ayırın. Boş bırakılırsa yukarıdaki iletişim
              e-postası kullanılır. Gelen bildirimde &quot;Yanıtla&quot; doğrudan mesajı yazan
              kişiye gider.
            </p>
          </div>

          <div className="mt-6 border-t border-graphite-200 pt-5">
            <label className="flex min-h-[44px] items-center gap-3 text-sm text-graphite-700">
              <input
                type="checkbox"
                name="autoReplyEnabled"
                defaultChecked={settings.autoReplyEnabled}
                className="h-4 w-4"
              />
              Formu dolduran kişiye otomatik &quot;mesajınızı aldık&quot; yanıtı gönder
            </label>
            <p className="mt-1 text-xs text-graphite-500">
              Bunun çalışması için kendi alan adınızın Resend&apos;de doğrulanmış olması gerekir;
              aksi hâlde gönderim reddedilir. Bu yüzden varsayılan kapalı.
            </p>
            <div className="mt-4">
              <BilingualField
                name="autoReply"
                label="Otomatik yanıt metni"
                kind="LONG"
                rows={4}
                valueTr={settings.autoReplyTr}
                valueEn={settings.autoReplyEn}
                status={meta.autoReply?.status}
                target={{ entity: 'SiteSetting', entityId: '1', field: 'autoReply' }}
                help="Ziyaretçinin diline göre gönderilir."
              />
            </div>
          </div>

          <div className="mt-5">
            <MailTest />
          </div>
        </Card>

        <Card
          title="Hızlı iletişim düğmeleri"
          description="Sayfanın sağ altında sabit duran WhatsApp ve arama düğmeleri. Mobil ziyaretçilerin çoğu form doldurmak yerine arıyor."
        >
          <label className="flex min-h-[44px] items-center gap-3 text-sm text-graphite-700">
            <input
              type="checkbox"
              name="floatingEnabled"
              defaultChecked={settings.floatingEnabled}
              className="h-4 w-4"
            />
            Sabit düğmeleri göster
          </label>

          <div className="mt-4">
            <label className="field-label" htmlFor="whatsappNumber">
              WhatsApp numarası
            </label>
            <input
              id="whatsappNumber"
              name="whatsappNumber"
              defaultValue={settings.whatsappNumber}
              placeholder="905321234567"
              inputMode="numeric"
              className="field-input"
            />
            <p className="mt-1.5 text-xs text-graphite-500">
              <code>0532 123 45 67</code> gibi alışık olduğunuz biçimde yazabilirsiniz; kaydederken
              WhatsApp&apos;ın istediği <code>905321234567</code> biçimine çevrilir. Boş bırakılırsa
              WhatsApp düğmesi görünmez.
            </p>
            {waLink ? (
              <p className="mt-2 text-xs text-graphite-600">
                Şu anki bağlantı:{' '}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all font-mono text-navy-700 underline"
                >
                  {waLink}
                </a>{' '}
                — tıklayıp doğru numaraya gittiğini kontrol edebilirsiniz.
              </p>
            ) : (
              <p className="mt-2 text-xs text-amber-700">
                Numara girilmediği için sitede WhatsApp düğmesi görünmüyor.
              </p>
            )}
          </div>

          <div className="mt-5">
            <BilingualField
              name="whatsappText"
              label="WhatsApp'ta hazır gelen mesaj"
              kind="LONG"
              rows={2}
              valueTr={settings.whatsappTextTr}
              valueEn={settings.whatsappTextEn}
              status={meta.whatsappText?.status}
              target={{ entity: 'SiteSetting', entityId: '1', field: 'whatsappText' }}
              help="Ziyaretçi düğmeye bastığında sohbete önceden yazılmış olarak gelir."
            />
          </div>

          <label className="mt-2 flex min-h-[44px] items-center gap-3 text-sm text-graphite-700">
            <input
              type="checkbox"
              name="showCallButton"
              defaultChecked={settings.showCallButton}
              className="h-4 w-4"
            />
            Arama düğmesi de görünsün (yukarıdaki telefon numarasını kullanır)
          </label>
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
                  placeholder={`https://${key === 'x' ? 'x.com' : key + '.com'}/kullaniciadi`}
                  className="field-input"
                />
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-graphite-500">
            <strong>Kullanıcı adı değil, tam adres yazın</strong> —{' '}
            <code>@cetinerhukuk</code> değil <code>https://instagram.com/cetinerhukuk</code>.
            Adres tarayıcıdan kopyalanabilir. Boş bırakılan hesaplar alt bilgide gösterilmez.
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
            <code>https://</code> ile başlasın, <strong>sonunda eğik çizgi olmasın</strong>:{' '}
            <code>https://cetinerlegal.com</code> (doğru), <code>cetinerlegal.com/</code> (yanlış).
            Kanonik adresler, hreflang etiketleri, sitemap ve paylaşım görselleri bu adrese göre
            üretilir; yanlış girilirse arama motorlarına yanlış adres bildirilir.
          </p>
        </Card>

        <div className="sticky bottom-0 -mx-4 border-t border-graphite-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <SaveBar note="İngilizce çeviri arka planda üretiliyor">Ayarları kaydet</SaveBar>
        </div>
      </form>
    </>
  )
}
