'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import RichText from './RichText'

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
 * TASARIM KARARI: Türkçe tek görünen alan. Önceki sürümde iki sekme vardı
 * ("Türkçe" / "English") ve bu, her ikisini de doldurmak gerekiyormuş izlenimi
 * veriyordu. Artık:
 *
 *   - Sadece Türkçe kutusu açık duruyor.
 *   - Altında ince bir satırda İngilizcesinin ne olduğu yazıyor.
 *   - İngilizceye dokunmak isteyen "Düzenle"ye basıp açıyor.
 *
 * Böylece "ne yapmam gerekiyor" sorusunun cevabı bakar bakmaz görünüyor:
 * Türkçeyi yaz, gerisi kendiliğinden oluyor.
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
  const [manual, setManual] = useState(status === 'MANUAL')
  const [en, setEn] = useState(valueEn)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)

  const editedRef = useRef(false)

  // Sunucudan yeni değer gelince eşitle; kullanıcı yazdıysa dokunma.
  const [seenEn, setSeenEn] = useState(valueEn)
  const [seenStatus, setSeenStatus] = useState(status)
  if (valueEn !== seenEn || status !== seenStatus) {
    setSeenEn(valueEn)
    setSeenStatus(status)
    if (!editedRef.current) {
      setEn(valueEn)
      setManual(status === 'MANUAL')
    }
  }

  function markEdited(value: string) {
    editedRef.current = true
    setEn(value)
    setManual(true)
  }

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
        setBusy(false)
        setNote(json.error || 'Çeviri başlatılamadı.')
        return
      }
      editedRef.current = false
      setManual(false)
      const settled = await pollUntilSettled(target)
      setBusy(false)
      if (settled === 'FAILED') setNote('Çeviri yapılamadı. Eski İngilizce metin korundu.')
      else if (settled === 'PENDING') setNote('Çeviri sürüyor. Sayfayı birazdan tazeleyin.')
      else setNote(null)
      router.refresh()
    } catch {
      setBusy(false)
      setNote('Çeviri başlatılamadı.')
    }
  }

  const state = busy ? 'PENDING' : manual ? 'MANUAL' : en.trim() ? status || 'AUTO' : 'EMPTY'
  const preview = kind === 'RICH' ? stripHtml(en) : en

  return (
    <div className="border-b border-graphite-200 py-5 last:border-b-0">
      <label className="mb-1.5 block text-sm font-medium text-graphite-800">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </label>

      {help ? <p className="mb-2 text-xs leading-relaxed text-graphite-500">{help}</p> : null}

      {/* Türkçe — yazılacak tek alan */}
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

      {/* İngilizce özeti */}
      <div className="mt-2 flex flex-wrap items-start gap-x-3 gap-y-1 text-xs">
        <span className="mt-0.5 shrink-0 rounded bg-graphite-100 px-1.5 py-0.5 font-mono text-[0.65rem] text-graphite-600">
          EN
        </span>

        <span className="min-w-0 flex-1">
          {state === 'PENDING' ? (
            <span className="text-blue-700">İngilizcesi yazılıyor…</span>
          ) : state === 'EMPTY' ? (
            <span className="text-graphite-500">
              Henüz yok — kaydedince oluşacak. O ana kadar site Türkçe metni gösterir.
            </span>
          ) : (
            <span className="text-graphite-700">{truncate(preview, 110)}</span>
          )}

          {state === 'MANUAL' ? (
            <span className="ml-2 whitespace-nowrap text-amber-700">· elle yazdınız 🔒</span>
          ) : null}
          {state === 'FAILED' ? (
            <span className="ml-2 whitespace-nowrap text-red-700">· çeviri yapılamadı</span>
          ) : null}
        </span>

        <span className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-navy-700 underline underline-offset-2 hover:text-navy-900"
          >
            {open ? 'Kapat' : 'Düzenle'}
          </button>
          {target ? (
            <button
              type="button"
              onClick={retranslate}
              disabled={busy}
              className="text-graphite-600 underline underline-offset-2 hover:text-navy-800 disabled:opacity-50"
            >
              {busy ? 'çevriliyor…' : 'Yeniden çevir'}
            </button>
          ) : null}
        </span>
      </div>

      {/* İngilizce düzenleme — istenirse açılıyor */}
      <div className={open ? 'mt-3 rounded border border-graphite-200 bg-graphite-50 p-3' : 'hidden'}>
        <p className="mb-2 text-xs text-graphite-600">
          Buraya <strong>elle yazarsanız</strong> bu alan kilitlenir ve otomatik çeviri bir daha
          üzerine yazmaz. Kilidi &quot;Yeniden çevir&quot; kaldırır.
        </p>
        {kind === 'RICH' ? (
          <RichText name={`en__${name}`} defaultValue={en} onUserEdit={markEdited} />
        ) : kind === 'LONG' ? (
          <textarea
            name={`en__${name}`}
            value={en}
            onChange={(e) => markEdited(e.target.value)}
            rows={rows}
            className="field-input resize-y"
          />
        ) : (
          <input
            name={`en__${name}`}
            value={en}
            onChange={(e) => markEdited(e.target.value)}
            className="field-input"
          />
        )}
      </div>

      {/* Kapalıyken de değer gönderilmeli: RICH kendi gizli textarea'sını
          taşıdığı için yalnızca düz alanlarda gizli kopya gerekiyor. */}
      {!open && kind !== 'RICH' ? <input type="hidden" name={`en__${name}`} value={en} /> : null}

      <input type="hidden" name={`manual__${name}`} value={manual ? '1' : '0'} />

      {note ? <p className="mt-2 text-xs text-navy-700">{note}</p> : null}
    </div>
  )
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value
  return value.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}

/** Alanın durumu AUTO/FAILED olana kadar yoklar (en fazla ~24 sn). */
async function pollUntilSettled(target: {
  entity: string
  entityId: string
  field: string
}): Promise<'AUTO' | 'FAILED' | 'PENDING'> {
  for (let i = 0; i < 8; i++) {
    await new Promise((r) => setTimeout(r, 3000))
    try {
      const res = await fetch('/api/admin/translation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'field-status', ...target }),
      })
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; status?: string }
      if (json.ok && json.status && json.status !== 'PENDING') {
        return json.status === 'FAILED' ? 'FAILED' : 'AUTO'
      }
    } catch {
      /* ağ hatası — yoklamaya devam */
    }
  }
  return 'PENDING'
}
