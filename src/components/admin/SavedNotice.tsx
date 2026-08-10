'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

/**
 * Kaydettikten sonra listeye dönüldüğünde gösterilen onay.
 *
 * Kaydeden formlar listeye `?saved=<ad>` ile dönüyor. Mesaj gösterildikten
 * sonra sorgu parametresini adres çubuğundan temizliyoruz; yoksa sayfa
 * yenilenince veya bağlantı paylaşılınca yeniden "kaydedildi" yazardı.
 */
export default function SavedNotice({ label = 'Kaydedildi' }: { label?: string }) {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const saved = params.get('saved')
  const [visible, setVisible] = useState(Boolean(saved))

  useEffect(() => {
    if (!saved) return
    router.replace(pathname, { scroll: false })
    const timer = setTimeout(() => setVisible(false), 6000)
    return () => clearTimeout(timer)
  }, [saved, pathname, router])

  if (!visible || !saved) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-6 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
        <path
          d="m5 13 4 4L19 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        <strong>{saved}</strong> {label.toLowerCase()}.
      </span>
    </div>
  )
}
