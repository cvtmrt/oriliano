'use client'

import { useState } from 'react'

/**
 * Çeviri bağlantı testi. ANTHROPIC_API_KEY eklendikten sonra tek tıkla
 * anahtarın ve model erişiminin doğru olduğunu doğrular; kuyruğa dokunmaz.
 */
export default function TranslationTest() {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'error'>('idle')
  const [result, setResult] = useState<{
    source?: string
    translated?: string
    provider?: string
    error?: string
  }>({})

  async function run() {
    setState('busy')
    setResult({})
    try {
      const res = await fetch('/api/admin/translation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' }),
      })
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        source?: string
        translated?: string
        provider?: string
        error?: string
      }
      if (!res.ok || !json.ok) {
        setState('error')
        setResult({ error: json.error || 'Bilinmeyen hata.' })
        return
      }
      setState('ok')
      setResult({ source: json.source, translated: json.translated, provider: json.provider })
    } catch (err) {
      setState('error')
      setResult({ error: (err as Error).message })
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
        {state === 'busy' ? 'Deneniyor…' : 'Çeviri bağlantısını test et'}
      </button>

      {state === 'ok' ? (
        <div className="mt-4 rounded border border-green-200 bg-green-50 p-4 text-sm">
          <p className="font-medium text-green-800">
            Çeviri çalışıyor{result.provider ? ` — ${result.provider}` : ''}.
          </p>
          <p className="mt-2 text-graphite-600">
            <span className="text-graphite-400">TR:</span> {result.source}
          </p>
          <p className="mt-1 text-graphite-800">
            <span className="text-graphite-400">EN:</span> {result.translated}
          </p>
        </div>
      ) : null}

      {state === 'error' ? (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Çeviri çalışmıyor.</p>
          <p className="mt-1 break-words">{result.error}</p>
        </div>
      ) : null}
    </div>
  )
}
