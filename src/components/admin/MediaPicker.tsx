'use client'

import { useRef, useState } from 'react'

interface MediaValue {
  id: string
  filename: string
  originalName?: string
  width?: number | null
  height?: number | null
}

/**
 * Tek görsel yuvası: yükle / değiştir / kaldır.
 * Seçilen görselin id'si gizli input ile forma yazılır.
 */
export default function MediaPicker({
  name,
  label,
  current,
  help,
  fallbackSrc,
}: {
  name: string
  label: string
  current: MediaValue | null
  help?: string
  /** Yuva boşken sitede gösterilen paket tasarım görseli (varsa) */
  fallbackSrc?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<MediaValue | null>(current)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(file: File) {
    setBusy(true)
    setError(null)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/media', { method: 'POST', body })
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
        media?: MediaValue
      }
      if (!res.ok || !json.ok || !json.media) {
        setError(json.error || 'Yükleme başarısız.')
        return
      }
      setValue(json.media)
    } catch {
      setError('Yükleme başarısız.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="border-b border-graphite-200 py-5 last:border-b-0">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-graphite-800">{label}</span>
        {value ? (
          <button
            type="button"
            onClick={() => setValue(null)}
            className="rounded border border-graphite-300 px-2 py-1 text-[0.7rem] text-red-700 transition-colors hover:bg-red-50"
          >
            Kaldır
          </button>
        ) : null}
      </div>

      {help ? <p className="mb-3 text-xs leading-relaxed text-graphite-500">{help}</p> : null}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded border border-graphite-200 bg-graphite-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api/media/${encodeURIComponent(value.filename)}`}
              alt=""
              className="h-full w-full object-contain"
            />
          ) : fallbackSrc ? (
            <div className="relative h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fallbackSrc} alt="" className="h-full w-full object-cover opacity-80" />
              <span className="absolute inset-x-0 bottom-0 bg-navy-950/80 px-1 py-0.5 text-center text-[0.6rem] text-white/90">
                paket tasarım görseli
              </span>
            </div>
          ) : (
            <span className="text-[0.7rem] text-graphite-400">Görsel yok</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void upload(file)
            }}
            className="block w-full text-sm text-graphite-600 file:mr-3 file:min-h-[40px] file:rounded file:border-0 file:bg-navy-700 file:px-4 file:text-sm file:text-white hover:file:bg-navy-800"
          />
          <p className="mt-1.5 text-xs text-graphite-500">
            JPG, PNG, WebP, AVIF, GIF veya SVG. En fazla 8 MB. Yükleme sırasında otomatik olarak
            WebP&apos;ye çevrilip yeniden boyutlandırılır.
          </p>
          {busy ? <p className="mt-1 text-xs text-navy-700">Yükleniyor…</p> : null}
          {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
          {value?.width && value?.height ? (
            <p className="mt-1 text-xs text-graphite-400">
              {value.width}×{value.height} px
            </p>
          ) : null}
        </div>
      </div>

      <input type="hidden" name={name} value={value?.id ?? ''} />
    </div>
  )
}
