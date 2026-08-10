'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RichText from './RichText'
import { StatusBadge } from './ui'

export type FieldKind = 'SHORT' | 'LONG' | 'RICH'

export interface BilingualFieldProps {
  /** Form alan adı — sunucuda `tr__<name>` / `en__<name>` olarak okunur */
  name: string
  label: string
  kind?: FieldKind
  valueTr: string
  valueEn: string
  status?: string | null
  help?: string
  required?: boolean
  rows?: number
  /** "Yeniden çevir" düğmesi için — verilmezse düğme gizlenir */
  target?: { entity: string; entityId: string; field: string }
}

/**
 * İki dilli alan.
 *
 * Türkçe kaynak, İngilizce hedef. Admin İngilizce alana dokunursa gizli
 * `manual__<name>` bayrağı 1 olur; sunucu bunu görünce alanı MANUAL kilitler
 * ve otomatik çeviri bir daha üzerine yazmaz.
 */
export default function BilingualField({
  name,
  label,
  kind = 'SHORT',
  valueTr,
  valueEn,
  status,
  help,
  required,
  rows = 4,
  target,
}: BilingualFieldProps) {
  const router = useRouter()
  const [tab, setTab] = useState<'tr' | 'en'>('tr')
  const [manual, setManual] = useState(status === 'MANUAL')
  const [en, setEn] = useState(valueEn)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)

  async function retranslate() {
    if (!target) return
    setBusy(true)
    setNote(null)
    try {
      const res = await fetch('/api/admin/translation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'field', ...target }),
      })
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !json.ok) {
        setNote(json.error || 'Çeviri başlatılamadı.')
      } else {
        setManual(false)
        setNote('Çeviri sıraya alındı. Birkaç saniye içinde güncellenecek.')
        setTimeout(() => router.refresh(), 4000)
      }
    } catch {
      setNote('Çeviri başlatılamadı.')
    } finally {
      setBusy(false)
    }
  }

  const effectiveStatus = manual ? 'MANUAL' : status

  return (
    <div className="border-b border-graphite-200 py-5 last:border-b-0">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm font-medium text-graphite-800">
          {label}
          {required ? <span className="ml-1 text-red-600">*</span> : null}
        </label>

        <div className="flex items-center gap-2">
          <StatusBadge status={effectiveStatus} />
          {target ? (
            <button
              type="button"
              onClick={retranslate}
              disabled={busy}
              className="rounded border border-graphite-300 px-2 py-1 text-[0.7rem] text-graphite-700 transition-colors hover:bg-graphite-100 disabled:opacity-50"
            >
              {busy ? '…' : 'Yeniden çevir'}
            </button>
          ) : null}
        </div>
      </div>

      {help ? <p className="mb-2 text-xs leading-relaxed text-graphite-500">{help}</p> : null}

      {/* Sekmeler */}
      <div className="mb-2 flex gap-1" role="tablist">
        {(['tr', 'en'] as const).map((code) => (
          <button
            key={code}
            type="button"
            role="tab"
            aria-selected={tab === code}
            onClick={() => setTab(code)}
            className={`rounded-t px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === code
                ? 'bg-graphite-100 text-navy-800'
                : 'text-graphite-500 hover:text-graphite-800'
            }`}
          >
            {code === 'tr' ? 'Türkçe (kaynak)' : 'English'}
          </button>
        ))}
      </div>

      {/* Türkçe — her zaman DOM'da, sekme sadece görünürlüğü değiştiriyor
          (gizlenirse de form değeri gönderilsin diye). */}
      <div className={tab === 'tr' ? 'block' : 'hidden'}>
        {kind === 'RICH' ? (
          <RichText name={`tr__${name}`} defaultValue={valueTr} />
        ) : kind === 'LONG' ? (
          <textarea
            name={`tr__${name}`}
            defaultValue={valueTr}
            rows={rows}
            required={required}
            className="field-input resize-y"
          />
        ) : (
          <input name={`tr__${name}`} defaultValue={valueTr} required={required} className="field-input" />
        )}
      </div>

      <div className={tab === 'en' ? 'block' : 'hidden'}>
        {kind === 'RICH' ? (
          <RichText
            name={`en__${name}`}
            defaultValue={valueEn}
            onInput={(html) => {
              if (html !== valueEn) setManual(true)
            }}
          />
        ) : kind === 'LONG' ? (
          <textarea
            name={`en__${name}`}
            value={en}
            onChange={(e) => {
              setEn(e.target.value)
              setManual(true)
            }}
            rows={rows}
            className="field-input resize-y"
          />
        ) : (
          <input
            name={`en__${name}`}
            value={en}
            onChange={(e) => {
              setEn(e.target.value)
              setManual(true)
            }}
            className="field-input"
          />
        )}
        <p className="mt-1.5 text-xs text-graphite-500">
          Boş bırakırsanız Türkçe metin gösterilir. Buraya elle yazarsanız alan kilitlenir ve
          otomatik çeviri üzerine yazmaz.
        </p>
      </div>

      <input type="hidden" name={`manual__${name}`} value={manual ? '1' : '0'} />

      {note ? <p className="mt-2 text-xs text-navy-700">{note}</p> : null}
    </div>
  )
}
