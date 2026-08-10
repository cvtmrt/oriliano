'use client'

import Link from 'next/link'
import { savePublicationAction } from '@/app/(admin)/admin/actions'
import { Card, SubmitButton } from './ui'
import BilingualField from './BilingualField'
import MediaPicker from './MediaPicker'

export interface PublicationFormValues {
  id: string
  slugTr: string
  slugEn: string
  published: boolean
  publishedAt: string
  order: number
  author: string
  titleTr: string
  titleEn: string
  excerptTr: string
  excerptEn: string
  bodyTr: string
  bodyEn: string
  coverAltTr: string
  coverAltEn: string
  seoTitleTr: string
  seoTitleEn: string
  seoDescTr: string
  seoDescEn: string
  cover: { id: string; filename: string } | null
}

export default function PublicationForm({
  values,
  meta,
}: {
  values: PublicationFormValues
  meta: Record<string, { status: string } | undefined>
}) {
  const target = (field: string) =>
    values.id ? { entity: 'Publication', entityId: values.id, field } : undefined

  return (
    <form action={savePublicationAction} className="space-y-6">
      <input type="hidden" name="id" value={values.id} />

      <Card title="Yazı">
        <BilingualField
          name="title"
          label="Başlık"
          valueTr={values.titleTr}
          valueEn={values.titleEn}
          status={meta.title?.status}
          target={target('title')}
          required
        />
        <BilingualField
          name="excerpt"
          label="Özet"
          kind="LONG"
          rows={3}
          valueTr={values.excerptTr}
          valueEn={values.excerptEn}
          status={meta.excerpt?.status}
          target={target('excerpt')}
        />
        <BilingualField
          name="body"
          label="İçerik"
          kind="RICH"
          valueTr={values.bodyTr}
          valueEn={values.bodyEn}
          status={meta.body?.status}
          target={target('body')}
        />
      </Card>

      <Card title="Yayın bilgisi">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="author">
              Yazar
            </label>
            <input id="author" name="author" defaultValue={values.author} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="publishedAt">
              Yayın tarihi
            </label>
            <input
              id="publishedAt"
              name="publishedAt"
              type="date"
              defaultValue={values.publishedAt}
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="slugTr">
              Türkçe slug
            </label>
            <input id="slugTr" name="slugTr" defaultValue={values.slugTr} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="slugEn">
              İngilizce slug
            </label>
            <input id="slugEn" name="slugEn" defaultValue={values.slugEn} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="order">
              Sıra
            </label>
            <input id="order" name="order" type="number" defaultValue={values.order} className="field-input" />
          </div>
        </div>

        <label className="mt-5 flex min-h-[44px] items-center gap-3 text-sm text-graphite-700">
          <input type="checkbox" name="published" defaultChecked={values.published} className="h-4 w-4" />
          Yayınla
        </label>
        <p className="mt-1 text-xs text-graphite-500">
          Yayınlar bölümü şu an menüden kapalı. Açmak için Menü sayfasından &quot;Yayınlar&quot;
          öğesini görünür yapın.
        </p>
      </Card>

      <Card title="Kapak ve SEO">
        <MediaPicker name="coverId" label="Kapak görseli" current={values.cover} />
        <BilingualField
          name="coverAlt"
          label="Kapak alternatif metni"
          valueTr={values.coverAltTr}
          valueEn={values.coverAltEn}
          status={meta.coverAlt?.status}
          target={target('coverAlt')}
        />
        <BilingualField
          name="seoTitle"
          label="SEO başlığı"
          valueTr={values.seoTitleTr}
          valueEn={values.seoTitleEn}
          status={meta.seoTitle?.status}
          target={target('seoTitle')}
        />
        <BilingualField
          name="seoDesc"
          label="SEO açıklaması"
          kind="LONG"
          rows={3}
          valueTr={values.seoDescTr}
          valueEn={values.seoDescEn}
          status={meta.seoDesc?.status}
          target={target('seoDesc')}
        />
      </Card>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-graphite-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <SubmitButton>{values.id ? 'Kaydet' : 'Yazıyı oluştur'}</SubmitButton>
        <Link href="/admin/publications" className="text-sm text-graphite-600 underline underline-offset-2">
          Vazgeç
        </Link>
      </div>
    </form>
  )
}
