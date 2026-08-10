'use client'

import { useFormStatus } from 'react-dom'
import type { ReactNode } from 'react'

export function PageTitle({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl text-navy-900">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-graphite-600">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function Card({
  title,
  description,
  children,
  className = '',
}: {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-md border border-graphite-200 bg-white p-5 sm:p-6 ${className}`}>
      {title ? (
        <header className="mb-5">
          <h2 className="font-medium text-navy-900">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-relaxed text-graphite-500">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  )
}

export function SubmitButton({
  children = 'Kaydet',
  variant = 'primary',
  className = '',
}: {
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  className?: string
}) {
  const { pending } = useFormStatus()
  const styles: Record<string, string> = {
    primary: 'bg-navy-700 text-white hover:bg-navy-800',
    secondary: 'border border-graphite-300 bg-white text-graphite-800 hover:bg-graphite-50',
    danger: 'border border-red-300 bg-white text-red-700 hover:bg-red-50',
  }
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex min-h-[44px] items-center justify-center rounded px-5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
    >
      {pending ? 'Kaydediliyor…' : children}
    </button>
  )
}

export function Banner({ type, children }: { type: 'info' | 'success' | 'warn' | 'error'; children: ReactNode }) {
  const styles: Record<string, string> = {
    info: 'border-navy-200 bg-navy-50 text-navy-800',
    success: 'border-green-200 bg-green-50 text-green-800',
    warn: 'border-amber-200 bg-amber-50 text-amber-900',
    error: 'border-red-200 bg-red-50 text-red-800',
  }
  return (
    <div className={`mb-6 rounded-md border px-4 py-3 text-sm leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  )
}

export function StatusBadge({ status }: { status?: string | null }) {
  if (!status) return null
  const map: Record<string, { label: string; className: string }> = {
    AUTO: { label: 'otomatik çevrildi', className: 'bg-graphite-100 text-graphite-600' },
    MANUAL: { label: 'elle düzenlendi 🔒', className: 'bg-amber-100 text-amber-800' },
    PENDING: { label: 'çevriliyor…', className: 'bg-blue-100 text-blue-800' },
    FAILED: { label: 'çeviri başarısız', className: 'bg-red-100 text-red-800' },
  }
  const item = map[status]
  if (!item) return null
  return (
    <span className={`rounded-full px-2 py-0.5 text-[0.68rem] font-medium ${item.className}`}>
      {item.label}
    </span>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-graphite-300 px-4 py-8 text-center text-sm text-graphite-500">
      {children}
    </p>
  )
}
