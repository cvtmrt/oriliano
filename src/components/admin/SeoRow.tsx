'use client'

import { StatusBadge } from './ui'
import MediaPicker from './MediaPicker'
import { useBilingualState } from './useBilingualState'

export default function SeoRow({
  id,
  titleTr,
  titleEn,
  descTr,
  descEn,
  noindex,
  ogImage,
  titleStatus,
  descStatus,
}: {
  id: string
  titleTr: string
  titleEn: string
  descTr: string
  descEn: string
  noindex: boolean
  ogImage: { id: string; filename: string } | null
  titleStatus?: string | null
  descStatus?: string | null
}) {
  const title = useBilingualState(titleEn, titleStatus)
  const desc = useBilingualState(descEn, descStatus)

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-graphite-800">Başlık (title)</span>
          <StatusBadge status={title.manual ? 'MANUAL' : titleStatus} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[0.7rem] uppercase tracking-wide text-graphite-500">
              Türkçe
            </label>
            <input name={`tr__title__${id}`} defaultValue={titleTr} className="field-input" />
          </div>
          <div>
            <label className="mb-1 block text-[0.7rem] uppercase tracking-wide text-graphite-500">
              English
            </label>
            <input
              name={`en__title__${id}`}
              value={title.en}
              onChange={(e) => title.edit(e.target.value)}
              className="field-input"
            />
          </div>
        </div>
        <input type="hidden" name={`manual__title__${id}`} value={title.manual ? '1' : '0'} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-graphite-800">Açıklama (description)</span>
          <StatusBadge status={desc.manual ? 'MANUAL' : descStatus} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[0.7rem] uppercase tracking-wide text-graphite-500">
              Türkçe
            </label>
            <textarea
              name={`tr__desc__${id}`}
              defaultValue={descTr}
              rows={3}
              className="field-input resize-y"
            />
          </div>
          <div>
            <label className="mb-1 block text-[0.7rem] uppercase tracking-wide text-graphite-500">
              English
            </label>
            <textarea
              name={`en__desc__${id}`}
              value={desc.en}
              onChange={(e) => desc.edit(e.target.value)}
              rows={3}
              className="field-input resize-y"
            />
          </div>
        </div>
        <p className="mt-1.5 text-xs text-graphite-500">150–160 karakter arası ideal.</p>
        <input type="hidden" name={`manual__desc__${id}`} value={desc.manual ? '1' : '0'} />
      </div>

      <MediaPicker
        name={`ogImageId__${id}`}
        label="Paylaşım görseli (OG)"
        current={ogImage}
        help="Boş bırakılırsa genel varsayılan paylaşım görseli kullanılır. 1200×630 px önerilir."
      />

      <label className="flex min-h-[44px] items-center gap-3 text-sm text-graphite-700">
        <input type="checkbox" name={`noindex__${id}`} defaultChecked={noindex} className="h-4 w-4" />
        Arama motorlarından gizle (noindex)
      </label>
    </div>
  )
}
