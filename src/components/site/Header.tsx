'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/components/motion'
import { href, routeKeyFromSegment, type RouteKey } from '@/lib/routes'
import type { Locale } from '@/lib/i18n'
import Wordmark from './Wordmark'
import LocaleSwitch from './LocaleSwitch'

interface MenuEntry {
  routeKey: RouteKey
  label: string
}

export default function Header({
  locale,
  menu,
  siteName,
  logoSrc,
  contactLabel,
  phone,
}: {
  locale: Locale
  menu: MenuEntry[]
  siteName: string
  logoSrc: string | null
  contactLabel: string
  phone: string
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  // Aktif menü öğesini yoldan çöz (dil öneki + segment)
  const segments = (pathname || '').split('/').filter(Boolean)
  const currentSegment = segments[1] ?? ''
  const activeKey: RouteKey | null = segments.length <= 1 ? 'home' : routeKeyFromSegment(currentSegment)

  const navItems = menu.filter((m) => m.routeKey !== 'home')

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled
          ? 'border-paper-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80'
          : 'border-transparent bg-paper'
      }`}
    >
      <div className="container flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
        <Link
          href={href('home', locale)}
          className="flex shrink-0 items-center gap-3"
          aria-label={siteName}
        >
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={siteName}
              width={200}
              height={56}
              priority
              className="h-9 w-auto object-contain lg:h-10"
            />
          ) : (
            <Wordmark name={siteName} />
          )}
        </Link>

        {/* Masaüstü menü */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label={locale === 'tr' ? 'Ana menü' : 'Main navigation'}>
          {navItems.map((item) => {
            const isActive = activeKey === item.routeKey
            return (
              <Link
                key={item.routeKey}
                href={href(item.routeKey, locale)}
                aria-current={isActive ? 'page' : undefined}
                className={`link-underline text-[0.82rem] font-medium tracking-wide transition-colors ${
                  isActive ? 'text-navy-800' : 'text-graphite-600 hover:text-navy-800'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitch locale={locale} />
          <Link
            href={href('contact', locale)}
            className="hidden rounded-sm border border-navy-700 px-4 py-2 text-[0.8rem] font-medium text-navy-800 transition-colors hover:bg-navy-700 hover:text-white lg:inline-flex"
          >
            {contactLabel}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? (locale === 'tr' ? 'Menüyü kapat' : 'Close menu') : locale === 'tr' ? 'Menüyü aç' : 'Open menu'}
            className="flex h-11 w-11 items-center justify-center rounded-sm text-navy-800 transition-colors hover:bg-navy-50 lg:hidden"
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-all duration-300 ${
                  open ? 'top-2 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-2 block h-px w-6 bg-current transition-opacity duration-200 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-all duration-300 ${
                  open ? 'top-2 -rotate-45' : 'top-4'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobil menü */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3, ease: EASE_OUT } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
            className="overflow-hidden border-t border-paper-line bg-paper lg:hidden"
          >
            <nav
              className="container flex flex-col py-3"
              aria-label={locale === 'tr' ? 'Mobil menü' : 'Mobile navigation'}
            >
              {menu.map((item) => {
                const isActive = activeKey === item.routeKey
                return (
                  <Link
                    key={item.routeKey}
                    href={href(item.routeKey, locale)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex min-h-[48px] items-center border-b border-paper-line/70 text-[0.95rem] transition-colors last:border-0 ${
                      isActive ? 'font-medium text-navy-800' : 'text-graphite-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              {phone ? (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-sm bg-navy-700 px-5 text-sm font-medium text-white"
                >
                  {phone}
                </a>
              ) : (
                <Link
                  href={href('contact', locale)}
                  className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-sm bg-navy-700 px-5 text-sm font-medium text-white"
                >
                  {contactLabel}
                </Link>
              )}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
