'use client'

import { useState } from 'react'
import { StatusBadge } from './ui'
import MediaPicker from './MediaPicker'

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
  const [titleManual, setTitleManual] = useState(titleStatus === 'MANUAL')
  const [descManual, setDescManual] = useState(descStatus === 'MANUAL')
  const [enTitle, setEnTitle] = useState(titleEn)
  const [enDesc, setEnDesc] = useState(descEn)

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-graphite-800">Başlık (title)</span>
          <StatusBadge status={titleManual ? 'MANUAL' : titleStatus} />
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
              value={enTitle}
              onChange={(e) => {
                setEnTitle(e.target.value)
                setTitleManual(true)
              }}
              className="field-input"
            />
          </div>
        </div>
        <input type="hidden" name={`manual__title__${id}`} value={titleManual ? '1' : '0'} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-graphite-800">Açıklama (description)</span>
          <StatusBadge status={descManual ? 'MANUAL' : descStatus} />
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
              value={enDesc}
              onChange={(e) => {
                setEnDesc(e.target.value)
                setDescManual(true)
              }}
              rows={3}
              className="field-input resize-y"
            />
          </div>
        </div>
        <p className="mt-1.5 text-xs text-graphite-500">150–160 karakter arası ideal.</p>
        <input type="hidden" name={`manual__desc__${id}`} value={descManual ? '1' : '0'} />
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
