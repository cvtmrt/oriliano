'use client'

import Link from 'next/link'
import { saveTeamMemberAction } from '@/app/(admin)/admin/actions'
import { Card, SubmitButton } from './ui'
import BilingualField from './BilingualField'
import MediaPicker from './MediaPicker'

export interface TeamFormValues {
  id: string
  slug: string
  name: string
  order: number
  visible: boolean
  titleTr: string
  titleEn: string
  bioTr: string
  bioEn: string
  expertiseTr: string
  expertiseEn: string
  photoAltTr: string
  photoAltEn: string
  email: string
  phone: string
  linkedin: string
  photo: { id: string; filename: string } | null
}

export default function TeamForm({
  values,
  meta,
}: {
  values: TeamFormValues
  meta: Record<string, { status: string } | undefined>
}) {
  const target = (field: string) =>
    values.id ? { entity: 'TeamMember', entityId: values.id, field } : undefined

  return (
    <form action={saveTeamMemberAction} className="space-y-6">
      <input type="hidden" name="id" value={values.id} />

      <Card title="Kişi">
        <div className="grid gap-5 border-b border-graphite-200 pb-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="name">
              Ad Soyad <span className="text-red-600">*</span>
            </label>
            <input id="name" name="name" defaultValue={values.name} required className="field-input" />
            <p className="mt-1 text-xs text-graphite-500">
              Kişi adları çevrilmez; her iki dilde de aynı görünür. &quot;Av.&quot; unvanı olduğu
              gibi kalır.
            </p>
          </div>
          <div>
            <label className="field-label" htmlFor="slug">
              Adres (slug)
            </label>
            <input id="slug" name="slug" defaultValue={values.slug} className="field-input" />
            <p className="mt-1 font-mono text-xs text-graphite-400">
              /tr/ekibimiz/{values.slug || '…'}
            </p>
          </div>
        </div>

        <BilingualField
          name="title"
          label="Unvan"
          valueTr={values.titleTr}
          valueEn={values.titleEn}
          status={meta.title?.status}
          target={target('title')}
          help="Örnek: Kurucu Avukat, Avukat, Arabulucu"
        />

        <BilingualField
          name="bio"
          label="Özgeçmiş"
          kind="RICH"
          valueTr={values.bioTr}
          valueEn={values.bioEn}
          status={meta.bio?.status}
          target={target('bio')}
        />

        <BilingualField
          name="expertise"
          label="Uzmanlık alanları"
          kind="LONG"
          rows={5}
          valueTr={values.expertiseTr}
          valueEn={values.expertiseEn}
          status={meta.expertise?.status}
          target={target('expertise')}
          help="Her satıra bir alan yazın."
        />
      </Card>

      <Card title="Fotoğraf">
        <MediaPicker name="photoId" label="Portre" current={values.photo} help="Dikey (4:5) oran önerilir." />
        <BilingualField
          name="photoAlt"
          label="Fotoğraf alternatif metni"
          valueTr={values.photoAltTr}
          valueEn={values.photoAltEn}
          status={meta.photoAlt?.status}
          target={target('photoAlt')}
        />
      </Card>

      <Card title="İletişim ve görünürlük">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="email">
              E-posta
            </label>
            <input id="email" name="email" type="email" defaultValue={values.email} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="phone">
              Telefon
            </label>
            <input id="phone" name="phone" defaultValue={values.phone} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="linkedin">
              LinkedIn
            </label>
            <input id="linkedin" name="linkedin" defaultValue={values.linkedin} placeholder="https://…" className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="order">
              Sıra
            </label>
            <input id="order" name="order" type="number" defaultValue={values.order} className="field-input" />
          </div>
        </div>

        <label className="mt-5 flex min-h-[44px] items-center gap-3 text-sm text-graphite-700">
          <input type="checkbox" name="visible" defaultChecked={values.visible} className="h-4 w-4" />
          Sitede görünsün
        </label>
      </Card>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-graphite-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <SubmitButton>{values.id ? 'Kaydet' : 'Üyeyi oluştur'}</SubmitButton>
        <Link href="/admin/team" className="text-sm text-graphite-600 underline underline-offset-2">
          Vazgeç
        </Link>
      </div>
    </form>
  )
}
