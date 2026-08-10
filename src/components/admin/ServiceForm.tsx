'use client'

import Link from 'next/link'
import { saveServiceAction } from '@/app/(admin)/admin/actions'
import { Card, SubmitButton } from './ui'
import BilingualField from './BilingualField'
import MediaPicker from './MediaPicker'
import { serviceIconKeys } from '@/components/site/ServiceIcon'

export interface ServiceFormValues {
  id: string
  slugTr: string
  slugEn: string
  icon: string
  order: number
  visible: boolean
  featured: boolean
  titleTr: string
  titleEn: string
  excerptTr: string
  excerptEn: string
  bodyTr: string
  bodyEn: string
  imageAltTr: string
  imageAltEn: string
  seoTitleTr: string
  seoTitleEn: string
  seoDescTr: string
  seoDescEn: string
  image: { id: string; filename: string; width?: number | null; height?: number | null } | null
  ogImage: { id: string; filename: string } | null
}

export default function ServiceForm({
  values,
  meta,
}: {
  values: ServiceFormValues
  meta: Record<string, { status: string } | undefined>
}) {
  const isNew = !values.id
  const target = (field: string) =>
    values.id ? { entity: 'Service', entityId: values.id, field } : undefined

  return (
    <form action={saveServiceAction} className="space-y-6">
      <input type="hidden" name="id" value={values.id} />

      <Card title="Temel bilgiler">
        <BilingualField
          name="title"
          label="Hizmet adı"
          valueTr={values.titleTr}
          valueEn={values.titleEn}
          status={meta.title?.status}
          target={target('title')}
          required
        />
        <BilingualField
          name="excerpt"
          label="Kısa açıklama"
          kind="LONG"
          rows={3}
          valueTr={values.excerptTr}
          valueEn={values.excerptEn}
          status={meta.excerpt?.status}
          target={target('excerpt')}
          help="Kartlarda ve hizmet detay sayfasının üst kısmında görünür. 1–2 cümle."
        />
        <BilingualField
          name="body"
          label="Detay içeriği"
          kind="RICH"
          valueTr={values.bodyTr}
          valueEn={values.bodyEn}
          status={meta.body?.status}
          target={target('body')}
          help="Bu alanda neler yaptığınız. Ara başlık ve madde listesi kullanabilirsiniz."
        />
      </Card>

      <Card title="Görünüm ve sıra">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="icon">
              İkon
            </label>
            <select id="icon" name="icon" defaultValue={values.icon} className="field-input">
              {serviceIconKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="order">
              Sıra
            </label>
            <input
              id="order"
              name="order"
              type="number"
              defaultValue={values.order}
              className="field-input"
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <label className="flex min-h-[44px] items-center gap-3 text-sm text-graphite-700">
            <input type="checkbox" name="visible" defaultChecked={values.visible} className="h-4 w-4" />
            Sitede görünsün
          </label>
          <label className="flex min-h-[44px] items-center gap-3 text-sm text-graphite-700">
            <input type="checkbox" name="featured" defaultChecked={values.featured} className="h-4 w-4" />
            Anasayfada öne çıkar
          </label>
        </div>
      </Card>

      <Card title="Adres (slug)" description="Detay sayfasının adresinde görünür. Türkçe ve İngilizce ayrıdır.">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="slugTr">
              Türkçe slug
            </label>
            <input id="slugTr" name="slugTr" defaultValue={values.slugTr} className="field-input" />
            <p className="mt-1 font-mono text-xs text-graphite-400">
              /tr/hizmetlerimiz/{values.slugTr || '…'}
            </p>
          </div>
          <div>
            <label className="field-label" htmlFor="slugEn">
              İngilizce slug
            </label>
            <input id="slugEn" name="slugEn" defaultValue={values.slugEn} className="field-input" />
            <p className="mt-1 font-mono text-xs text-graphite-400">
              /en/services/{values.slugEn || '…'}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-graphite-500">
          Boş bırakırsanız başlıktan otomatik üretilir. Yayına girmiş bir sayfanın slug&apos;ını
          değiştirmek eski adresi kırar.
        </p>
      </Card>

      <Card title="Görsel">
        <MediaPicker
          name="imageId"
          label="Hizmet görseli"
          current={values.image}
          help="Detay sayfasının üst görseli. Yüklenmezse hizmetler sayfasının genel görseli kullanılır."
        />
        <BilingualField
          name="imageAlt"
          label="Görsel alternatif metni"
          valueTr={values.imageAltTr}
          valueEn={values.imageAltEn}
          status={meta.imageAlt?.status}
          target={target('imageAlt')}
        />
      </Card>

      <Card title="SEO" description="Boş bırakılırsa hizmet adı ve kısa açıklama kullanılır.">
        <BilingualField
          name="seoTitle"
          label="Sayfa başlığı (title)"
          valueTr={values.seoTitleTr}
          valueEn={values.seoTitleEn}
          status={meta.seoTitle?.status}
          target={target('seoTitle')}
        />
        <BilingualField
          name="seoDesc"
          label="Açıklama (description)"
          kind="LONG"
          rows={3}
          valueTr={values.seoDescTr}
          valueEn={values.seoDescEn}
          status={meta.seoDesc?.status}
          target={target('seoDesc')}
          help="150–160 karakter arası ideal."
        />
        <MediaPicker name="ogImageId" label="Paylaşım görseli (OG)" current={values.ogImage} />
      </Card>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-graphite-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <SubmitButton>{isNew ? 'Hizmeti oluştur' : 'Kaydet'}</SubmitButton>
        <Link href="/admin/services" className="text-sm text-graphite-600 underline underline-offset-2">
          Vazgeç
        </Link>
      </div>
    </form>
  )
}
