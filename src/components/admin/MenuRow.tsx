'use client'

import { useState } from 'react'
import { StatusBadge } from './ui'

export default function MenuRow({
  id,
  routeKey,
  pathTr,
  pathEn,
  labelTr,
  labelEn,
  order,
  visible,
  status,
  lockedVisibility,
}: {
  id: string
  routeKey: string
  pathTr: string
  pathEn: string
  labelTr: string
  labelEn: string
  order: number
  visible: boolean
  status?: string | null
  lockedVisibility?: boolean
}) {
  const [manual, setManual] = useState(status === 'MANUAL')
  const [en, setEn] = useState(labelEn)

  return (
    <div className="grid gap-3 border-b border-graphite-200 py-4 last:border-b-0 sm:grid-cols-[4rem_1fr_1fr_auto] sm:items-start">
      <div>
        <label className="mb-1 block text-[0.7rem] uppercase tracking-wide text-graphite-500">
          Sıra
        </label>
        <input
          name={`order__${id}`}
          type="number"
          defaultValue={order}
          className="field-input px-2 py-2 text-center"
        />
      </div>

      <div>
        <label className="mb-1 block text-[0.7rem] uppercase tracking-wide text-graphite-500">
          Etiket (Türkçe)
        </label>
        <input name={`tr__${id}`} defaultValue={labelTr} className="field-input" />
        <p className="mt-1 font-mono text-[0.68rem] text-graphite-400">{pathTr}</p>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between gap-2">
          <label className="text-[0.7rem] uppercase tracking-wide text-graphite-500">
            Etiket (English)
          </label>
          <StatusBadge status={manual ? 'MANUAL' : status} />
        </div>
        <input
          name={`en__${id}`}
          value={en}
          onChange={(e) => {
            setEn(e.target.value)
            setManual(true)
          }}
          className="field-input"
        />
        <p className="mt-1 font-mono text-[0.68rem] text-graphite-400">{pathEn}</p>
      </div>

      <div className="sm:pt-6">
        <label className="flex min-h-[44px] items-center gap-2 text-sm text-graphite-700">
          <input
            type="checkbox"
            name={`visible__${id}`}
            defaultChecked={visible}
            disabled={lockedVisibility}
            className="h-4 w-4"
          />
          Görünür
        </label>
        {lockedVisibility ? (
          <p className="text-[0.68rem] text-graphite-400">Anasayfa gizlenemez</p>
        ) : null}
        <input type="hidden" name={`manual__${id}`} value={manual ? '1' : '0'} />
        <input type="hidden" name={`routeKey__${id}`} value={routeKey} />
      </div>
    </div>
  )
}
