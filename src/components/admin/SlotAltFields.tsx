'use client'

import { useState } from 'react'
import { StatusBadge } from './ui'

/**
 * Görsel yuvasının alternatif metni (erişilebilirlik + SEO).
 * İki dilli; İngilizceye elle dokunulursa alan kilitlenir.
 */
export default function SlotAltFields({
  slotId,
  altTr,
  altEn,
  status,
}: {
  slotId: string
  altTr: string
  altEn: string
  status?: string | null
}) {
  const [manual, setManual] = useState(status === 'MANUAL')
  const [en, setEn] = useState(altEn)

  return (
    <div className="-mt-2 pb-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-graphite-600">
          Alternatif metin (görsel yüklenmezse ve ekran okuyucularda kullanılır)
        </span>
        <StatusBadge status={manual ? 'MANUAL' : status} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[0.7rem] uppercase tracking-wide text-graphite-500">
            Türkçe
          </label>
          <input name={`tr__alt__${slotId}`} defaultValue={altTr} className="field-input" />
        </div>
        <div>
          <label className="mb-1 block text-[0.7rem] uppercase tracking-wide text-graphite-500">
            English
          </label>
          <input
            name={`en__alt__${slotId}`}
            value={en}
            onChange={(e) => {
              setEn(e.target.value)
              setManual(true)
            }}
            className="field-input"
          />
        </div>
      </div>
      <input type="hidden" name={`manual__alt__${slotId}`} value={manual ? '1' : '0'} />
    </div>
  )
}
