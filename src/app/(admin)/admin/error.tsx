'use client'

import Link from 'next/link'
import { useEffect } from 'react'

/**
 * Panelde bir işlem hata verirse okunabilir bir ekran gösterir.
 *
 * Buna en çok ihtiyaç duyulan yer: aynı slug'ı iki hizmete vermeye çalışmak.
 * Bu ekran olmasaydı kullanıcı ham bir çökme ekranı görürdü.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[admin]', error)
  }, [error])

  return (
    <div className="mx-auto max-w-xl py-12">
      <h1 className="font-serif text-xl text-navy-900">İşlem tamamlanamadı</h1>
      <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800">
        {error.message || 'Beklenmeyen bir hata oluştu.'}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-graphite-600">
        Girdiğiniz bilgiler kaydedilmemiş olabilir. Geri dönüp düzelttikten sonra tekrar deneyin.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] items-center rounded bg-navy-700 px-5 text-sm font-medium text-white hover:bg-navy-800"
        >
          Tekrar dene
        </button>
        <Link
          href="/admin"
          className="inline-flex min-h-[44px] items-center rounded border border-graphite-300 bg-white px-5 text-sm text-graphite-800 hover:bg-graphite-50"
        >
          Genel Bakış&apos;a dön
        </Link>
      </div>
      {error.digest ? (
        <p className="mt-6 font-mono text-xs text-graphite-400">Hata kodu: {error.digest}</p>
      ) : null}
    </div>
  )
}
