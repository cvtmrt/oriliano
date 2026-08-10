'use client'

import { useRef, useState } from 'react'
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
 *
 * Kilit YALNIZCA gerçek kullanıcı düzenlemesiyle kurulur. Alana tıklayıp
 * çıkmak, ya da arka planda çeviri gelip alanı tazelemek kilit kurmaz.
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

  // Kullanıcı bu alanda yazdı mı? Yazdıysa sunucudan gelen değer üzerine
  // yazmayız — yoksa arka plandaki bir tazeleme yazdığını silerdi.
  const editedRef = useRef(false)

  /**
   * Sunucudan gelen değer değiştiğinde yereli eşitle (React'in "render
   * sırasında state düzeltme" deseni). Arka plan çevirisi bitip sayfa
   * tazelendiğinde kutunun ve rozetin güncellenmesini bu sağlıyor;
   * olmadığında alan eski/boş görünmeye devam ediyordu.
   */
  const [seenEn, setSeenEn] = useState(valueEn)
  const [seenStatus, setSeenStatus] = useState(status)
  if ((valueEn !== seenEn || status !== seenStatus) && !editedRef.current) {
    setSeenEn(valueEn)
    setSeenStatus(status)
    setEn(valueEn)
    setManual(status === 'MANUAL')
  } else if (valueEn !== seenEn || status !== seenStatus) {
    // Kullanıcı yazmışsa yalnızca "gördüğümüz" değeri ilerlet, kutuya dokunma.
    setSeenEn(valueEn)
    setSeenStatus(status)
  }

  function markEdited(value: string) {
    editedRef.current = true
    setEn(value)
    setManual(true)
  }

  async function retranslate() {
    if (!target) return
    setBusy(true)
    setNote('Çeviri sıraya alındı, bekleniyor…')
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

      // Elle kilidi kırdık; artık sunucudan gelen değeri kabul edebiliriz.
      editedRef.current = false
      setManual(false)

      // Bitene kadar yokla — tek seferlik zamanlayıcı, çeviri geç bitince
      // "hiçbir şey olmadı" hissi veriyordu.
      const settled = await pollUntilSettled(target)
      setBusy(false)
      if (settled === 'FAILED') {
        setNote('Çeviri başarısız oldu. Eski İngilizce metin korundu.')
      } else if (settled === 'PENDING') {
        setNote('Çeviri hâlâ sürüyor. Sayfayı birazdan tazeleyin.')
      } else {
        setNote(null)
      }
      router.refresh()
    } catch {
      setBusy(false)
      setNote('Çeviri başlatılamadı.')
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
          <StatusBadge status={busy ? 'PENDING' : effectiveStatus} />
          {target ? (
            <button
              type="button"
              onClick={retranslate}
              disabled={busy}
              className="rounded border border-graphite-300 px-2 py-1 text-[0.7rem] text-graphite-700 transition-colors hover:bg-graphite-100 disabled:opacity-50"
            >
              {busy ? 'Çevriliyor…' : 'Yeniden çevir'}
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
        {/* RichText, defaultValue değişince içeriği kendisi tazeliyor;
            remount gerekmiyor — imleç kaybolmasın diye key vermiyoruz. */}
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
        <p className="mt-1.5 text-xs text-graphite-500">
          Boş bırakırsanız Türkçe metin gösterilir. Buraya <strong>elle yazarsanız</strong> alan
          kilitlenir ve otomatik çeviri üzerine yazmaz; kilidi &quot;Yeniden çevir&quot; kırar.
        </p>
      </div>

      <input type="hidden" name={`manual__${name}`} value={manual ? '1' : '0'} />

      {note ? <p className="mt-2 text-xs text-navy-700">{note}</p> : null}
    </div>
  )
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
