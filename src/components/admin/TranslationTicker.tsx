'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/**
 * ÇEVİRİ KUYRUĞUNUN PANELDEN SÜRÜLMESİ
 *
 * Kuyruk işçisi süreç içinde yaşıyor: kaydetme anında `kickQueue()` ile
 * tetikleniyor ve iş kaldıkça kendini yeniden çağırıyor. Bu zincirin bir zayıf
 * yeri var — süreç yeniden başlarsa (yeni dağıtım, container'ın yeniden
 * doğması, uzun bir çağrının düşmesi) zincir kopuyor. Veritabanındaki işler
 * PENDING olarak duruyor ama onları çekecek kimse kalmıyor; panelde alanlar
 * sonsuza kadar "İngilizcesi yazılıyor…" gösteriyor.
 *
 * Bu bileşen o boşluğu kapatıyor: panel açık olduğu sürece bekleyen iş varsa
 * `tick` uç noktasını çağırıp kuyruğu bir tur işletiyor, sayı azaldıkça sayfayı
 * tazeliyor. Sıfırlanınca kendini durduruyor — boşuna istek atmıyor.
 *
 * Yani panel açıksa çeviri ilerler; panel kapalıysa da bir sonraki kaydetmede
 * ya da panel açılışında kaldığı yerden devam eder.
 */

interface Stats {
  pending: number
  failed: number
  configured: boolean
}

const IDLE_MS = 15_000
const BUSY_MS = 4_000

export default function TranslationTicker() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const lastPending = useRef<number | null>(null)
  const stopped = useRef(false)

  const step = useCallback(async (): Promise<number> => {
    // Önce durum: bekleyen iş yoksa kuyruğu hiç meşgul etme.
    const res = await fetch('/api/admin/translation', { cache: 'no-store' })
    if (res.status === 401) {
      stopped.current = true
      return IDLE_MS
    }
    const info = (await res.json().catch(() => null)) as (Stats & { ok?: boolean }) | null
    if (!info?.ok) return IDLE_MS

    if (info.pending === 0) {
      setStats(info)
      setError(null)
      // Az önce bir şey bitmişse sayfayı tazele ki alanlar güncel görünsün.
      if (lastPending.current !== null && lastPending.current > 0) router.refresh()
      lastPending.current = 0
      return IDLE_MS
    }

    if (!info.configured) {
      setStats(info)
      setError('Çeviri sağlayıcısı tanımlı değil — kuyruk ilerleyemiyor.')
      return IDLE_MS
    }

    // Bekleyen iş var: kuyruğu bir tur sür.
    const tick = await fetch('/api/admin/translation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'tick' }),
    })
    const after = (await tick.json().catch(() => null)) as (Stats & { ok?: boolean }) | null
    const current = after?.ok ? after : info

    setStats(current)
    setError(null)
    if (lastPending.current !== null && current.pending !== lastPending.current) router.refresh()
    lastPending.current = current.pending

    return current.pending > 0 ? BUSY_MS : IDLE_MS
  }, [router])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let cancelled = false

    const loop = async () => {
      if (cancelled || stopped.current) return
      let wait = IDLE_MS
      try {
        wait = await step()
      } catch {
        // Ağ hatası — sessizce bir sonraki tura bırak.
      }
      if (!cancelled && !stopped.current) timer = setTimeout(loop, wait)
    }

    loop()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [step])

  if (!stats || (stats.pending === 0 && stats.failed === 0 && !error)) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-40 max-w-xs rounded border border-graphite-200 bg-white px-3 py-2 text-xs shadow-lg"
    >
      {stats.pending > 0 ? (
        <p className="text-navy-800">
          <span className="mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-navy-600 align-middle" />
          {stats.pending} alan çevriliyor…
        </p>
      ) : null}
      {stats.failed > 0 ? (
        <p className="mt-1 text-red-700">
          {stats.failed} alan çevrilemedi —{' '}
          <Link href="/admin/tools" className="underline underline-offset-2">
            Araçlar
          </Link>
          &apos;dan tekrar deneyin.
        </p>
      ) : null}
      {error ? <p className="mt-1 text-red-700">{error}</p> : null}
    </div>
  )
}
