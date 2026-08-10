'use client'

import { useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'

/**
 * Kaydet düğmesi + "kaydedildi" geri bildirimi.
 *
 * `useFormStatus` yalnızca formun İÇİNDEKİ bir bileşende çalışır; bu yüzden
 * düğme ve mesaj birlikte duruyor. Gönderim bitişini (pending true→false)
 * yakalayıp kısa süreli bir onay gösteriyoruz — sunucu aksiyonlarının
 * imzasını değiştirmeye gerek kalmıyor.
 *
 * Hata olursa aksiyon zaten fırlatıyor ve admin/error.tsx okunabilir bir
 * ekran gösteriyor; buradaki onay sadece başarılı akış için.
 */
export default function SaveBar({
  children = 'Kaydet',
  savedLabel = 'Kaydedildi',
  note,
  variant = 'primary',
}: {
  children?: string
  savedLabel?: string
  /** Kaydettikten sonra gösterilecek ek açıklama (ör. çeviri sıraya alındı) */
  note?: string
  variant?: 'primary' | 'secondary' | 'danger'
}) {
  const { pending } = useFormStatus()
  const wasPending = useRef(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (pending) {
      wasPending.current = true
      setSaved(false)
    } else if (wasPending.current) {
      wasPending.current = false
      setSaved(true)
    }
  }, [pending])

  useEffect(() => {
    if (!saved) return
    const timer = setTimeout(() => setSaved(false), 6000)
    return () => clearTimeout(timer)
  }, [saved])

  const styles: Record<string, string> = {
    primary: 'bg-navy-700 text-white hover:bg-navy-800',
    secondary: 'border border-graphite-300 bg-white text-graphite-800 hover:bg-graphite-50',
    danger: 'border border-red-300 bg-white text-red-700 hover:bg-red-50',
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex min-h-[44px] items-center justify-center rounded px-5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]}`}
      >
        {pending ? 'Kaydediliyor…' : children}
      </button>

      {/* aria-live: ekran okuyucu da duyursun */}
      <p role="status" aria-live="polite" className="text-sm">
        {saved ? (
          <span className="inline-flex items-center gap-1.5 text-green-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="m5 13 4 4L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {savedLabel}
            {note ? <span className="text-graphite-500"> · {note}</span> : null}
          </span>
        ) : null}
      </p>
    </div>
  )
}
