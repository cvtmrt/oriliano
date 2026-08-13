'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logoutAction } from '@/app/(admin)/admin/actions'
import TranslationTicker from './TranslationTicker'

const nav = [
  { href: '/admin', label: 'Genel Bakış', exact: true },
  { href: '/admin/content', label: 'Sayfa İçerikleri' },
  { href: '/admin/services', label: 'Hizmetler' },
  { href: '/admin/team', label: 'Ekip' },
  { href: '/admin/publications', label: 'Yayınlar' },
  { href: '/admin/messages', label: 'Gelen Kutusu' },
  { href: '/admin/media', label: 'Görseller' },
  { href: '/admin/menu', label: 'Menü' },
  { href: '/admin/seo', label: 'SEO' },
  { href: '/admin/settings', label: 'Genel Ayarlar' },
  { href: '/admin/glossary', label: 'Terim Sözlüğü' },
  { href: '/admin/tools', label: 'Araçlar' },
]

export default function AdminShell({
  email,
  children,
}: {
  email: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  function isActive(item: (typeof nav)[number]) {
    if (item.exact) return pathname === item.href
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Mobil üst çubuk */}
      <div className="flex items-center justify-between border-b border-graphite-200 bg-white px-4 py-3 lg:hidden">
        <Link href="/admin" className="font-semibold text-navy-800">
          Yönetim Paneli
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded border border-graphite-200 text-navy-800"
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
        >
          <span aria-hidden>{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Kenar çubuğu */}
      <aside
        className={`${
          open ? 'block' : 'hidden'
        } shrink-0 border-b border-graphite-200 bg-white lg:block lg:w-60 lg:border-b-0 lg:border-r`}
      >
        <div className="hidden px-5 py-6 lg:block">
          <Link href="/admin" className="font-serif text-lg text-navy-800">
            Çetiner Hukuk
          </Link>
          <p className="mt-1 text-xs text-graphite-500">Yönetim Paneli</p>
        </div>

        <nav className="px-3 pb-4 lg:pb-6" aria-label="Panel menüsü">
          <ul className="space-y-0.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item) ? 'page' : undefined}
                  className={`flex min-h-[44px] items-center rounded px-3 text-sm transition-colors ${
                    isActive(item)
                      ? 'bg-navy-700 font-medium text-white'
                      : 'text-graphite-700 hover:bg-graphite-100'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-graphite-200 px-3 pt-4">
            <p className="truncate text-xs text-graphite-500" title={email}>
              {email}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a
                href="/tr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-navy-700 underline underline-offset-2"
              >
                Siteyi gör
              </a>
              <form action={logoutAction}>
                <button type="submit" className="text-xs text-red-700 underline underline-offset-2">
                  Çıkış yap
                </button>
              </form>
            </div>
          </div>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>

      {/* Panel açıkken çeviri kuyruğunu sürer; kuyruk boşsa hiçbir şey göstermez. */}
      <TranslationTicker />
    </div>
  )
}
