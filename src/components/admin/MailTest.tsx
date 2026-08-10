'use client'

import { useState } from 'react'

/**
 * "Test e-postası gönder" — ayarları kaydettikten sonra tek tıkla gerçekten
 * mail gidiyor mu görülür. Kuyruğa veya gelen kutusuna dokunmaz.
 */
export default function MailTest() {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'error'>('idle')
  const [detail, setDetail] = useState<string>('')

  async function run() {
    setState('busy')
    setDetail('')
    try {
      const res = await fetch('/api/admin/mail-test', { method: 'POST' })
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        to?: string[]
        error?: string
      }
      if (!res.ok || !json.ok) {
        setState('error')
        setDetail(json.error || 'Bilinmeyen hata.')
        return
      }
      setState('ok')
      setDetail((json.to ?? []).join(', '))
    } catch (err) {
      setState('error')
      setDetail((err as Error).message)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={run}
        disabled={state === 'busy'}
        className="inline-flex min-h-[44px] items-center rounded border border-graphite-300 bg-white px-5 text-sm font-medium text-graphite-800 transition-colors hover:bg-graphite-50 disabled:opacity-60"
      >
        {state === 'busy' ? 'Gönderiliyor…' : 'Test e-postası gönder'}
      </button>
      <p className="mt-1.5 text-xs text-graphite-500">
        Kaydettiğiniz bildirim adresine örnek bir mesaj gönderir. Önce ayarları kaydedin.
      </p>

      {state === 'ok' ? (
        <p className="mt-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Gönderildi: <strong>{detail}</strong>. Gelen kutusunu (ve spam klasörünü) kontrol edin.
        </p>
      ) : null}
      {state === 'error' ? (
        <p className="mt-3 break-words rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Gönderilemedi: {detail}
        </p>
      ) : null}
    </div>
  )
}
