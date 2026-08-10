import { cache } from 'react'
import { prisma } from './prisma'
import type { Locale } from './i18n'
import { pick } from './i18n'
import {
  mediaSlotDefaultMap,
  textDefaultMap,
  menuDefaults,
  seoDefaults,
} from '@/content/defaults'
import type { RouteKey } from './routes'

/**
 * Tüm site içeriği buradan okunur. React `cache()` sayesinde tek bir istek
 * içinde her tablo en fazla bir kez sorgulanır.
 *
 * DB henüz kurulmamışsa veya bağlantı yoksa varsayılanlara düşer — site
 * ayağa kalkar, sadece içerik varsayılan hâlde görünür.
 */

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[content] veritabanı okunamadı, varsayılana düşüldü:', (err as Error).message)
    }
    return fallback
  }
}

// ---------------------------------------------------------------------------
// Metinler
// ---------------------------------------------------------------------------
export const getTexts = cache(async (): Promise<Map<string, { tr: string; en: string }>> => {
  const rows = await safe(
    () => prisma.localizedText.findMany({ select: { key: true, tr: true, en: true } }),
    [],
  )
  const map = new Map<string, { tr: string; en: string }>()
  for (const row of rows) map.set(row.key, { tr: row.tr, en: row.en })
  return map
})

export type TextReader = (key: string) => string

/** Bir sayfada `const t = await getT(locale)` deyip `t('home.hero.title')` kullanılır. */
export async function getT(locale: Locale): Promise<TextReader> {
  const texts = await getTexts()
  return (key: string) => {
    const row = texts.get(key)
    const fallback = textDefaultMap[key]
    if (row) {
      const value = pick(locale, row.tr, row.en)
      if (value) return value
    }
    if (fallback) return pick(locale, fallback.tr, fallback.en)
    // Anahtar hiç tanımlı değilse sessizce boş dön — sayfa çökmesin.
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[content] tanımsız metin anahtarı: ${key}`)
    }
    return ''
  }
}

// ---------------------------------------------------------------------------
// Görsel yuvaları
// ---------------------------------------------------------------------------
export interface ResolvedMedia {
  src: string | null
  alt: string
  width: number | null
  height: number | null
}

export const getMediaSlots = cache(async () => {
  const rows = await safe(
    () =>
      prisma.mediaSlot.findMany({
        include: { media: true },
      }),
    [],
  )
  const map = new Map<string, (typeof rows)[number]>()
  for (const row of rows) map.set(row.key, row)
  return map
})

export function mediaUrl(filename: string): string {
  return `/api/media/${encodeURIComponent(filename)}`
}

export async function getImage(key: string, locale: Locale): Promise<ResolvedMedia> {
  const slots = await getMediaSlots()
  const slot = slots.get(key)
  const def = mediaSlotDefaultMap[key]
  const alt = slot
    ? pick(locale, slot.altTr, slot.altEn) || (def ? pick(locale, def.altTr, def.altEn) : '')
    : def
      ? pick(locale, def.altTr, def.altEn)
      : ''

  if (!slot?.media) return { src: null, alt, width: null, height: null }
  return {
    src: mediaUrl(slot.media.filename),
    alt,
    width: slot.media.width,
    height: slot.media.height,
  }
}

// ---------------------------------------------------------------------------
// Genel ayarlar
// ---------------------------------------------------------------------------
export type Settings = NonNullable<Awaited<ReturnType<typeof loadSettings>>>

async function loadSettings() {
  return prisma.siteSetting.findUnique({
    where: { id: 1 },
    include: { logo: true, logoDark: true, favicon: true },
  })
}

const settingsFallback = {
  id: 1,
  siteNameTr: 'Çetiner Hukuk ve Danışmanlık',
  siteNameEn: 'Çetiner Hukuk ve Danışmanlık',
  taglineTr: '',
  taglineEn: '',
  logoId: null,
  logo: null,
  logoDarkId: null,
  logoDark: null,
  faviconId: null,
  favicon: null,
  accentColor: '#A9834B',
  phone: '',
  phoneSecondary: '',
  email: '',
  addressTr: '',
  addressEn: '',
  workingHoursTr: '',
  workingHoursEn: '',
  mapEmbedUrl: '',
  mapLat: '',
  mapLng: '',
  linkedin: '',
  instagram: '',
  x: '',
  facebook: '',
  youtube: '',
  baseUrl: process.env.SITE_URL || 'https://cetinerlegal.com',
  seedVersion: null,
  updatedAt: new Date(),
} as unknown as Settings

export const getSettings = cache(async (): Promise<Settings> => {
  const row = await safe(loadSettings, null)
  return row ?? settingsFallback
})

export function siteName(settings: Settings, locale: Locale): string {
  return pick(locale, settings.siteNameTr, settings.siteNameEn) || 'Çetiner Hukuk ve Danışmanlık'
}

// ---------------------------------------------------------------------------
// Menü
// ---------------------------------------------------------------------------
export interface MenuEntry {
  routeKey: RouteKey
  label: string
}

export const getMenu = cache(async (locale: Locale): Promise<MenuEntry[]> => {
  const rows = await safe(
    () => prisma.menuItem.findMany({ orderBy: { order: 'asc' } }),
    [],
  )

  if (rows.length === 0) {
    return menuDefaults
      .filter((d) => d.visible)
      .map((d) => ({ routeKey: d.routeKey as RouteKey, label: pick(locale, d.labelTr, d.labelEn) }))
  }

  return rows
    .filter((r) => r.visible)
    .map((r) => ({ routeKey: r.routeKey as RouteKey, label: pick(locale, r.labelTr, r.labelEn) }))
})

/** Yayınlar sayfası panelden kapatıldıysa doğrudan URL ile de erişilemesin. */
export const isRouteVisible = cache(async (routeKey: RouteKey): Promise<boolean> => {
  const row = await safe(() => prisma.menuItem.findUnique({ where: { routeKey } }), null)
  if (row) return row.visible
  const def = menuDefaults.find((d) => d.routeKey === routeKey)
  return def ? def.visible : true
})

// ---------------------------------------------------------------------------
// Hizmetler
// ---------------------------------------------------------------------------
export const getServices = cache(async () => {
  return safe(
    () =>
      prisma.service.findMany({
        where: { visible: true },
        orderBy: { order: 'asc' },
        include: { image: true },
      }),
    [],
  )
})

export const getServiceBySlug = cache(async (slug: string) => {
  return safe(
    () =>
      prisma.service.findFirst({
        where: { visible: true, OR: [{ slugTr: slug }, { slugEn: slug }] },
        include: { image: true, ogImage: true },
      }),
    null,
  )
})

export function serviceSlug(
  service: { slugTr: string; slugEn: string },
  locale: Locale,
): string {
  return locale === 'tr' ? service.slugTr : service.slugEn || service.slugTr
}

// ---------------------------------------------------------------------------
// Ekip
// ---------------------------------------------------------------------------
export const getTeam = cache(async () => {
  return safe(
    () =>
      prisma.teamMember.findMany({
        where: { visible: true },
        orderBy: { order: 'asc' },
        include: { photo: true },
      }),
    [],
  )
})

export const getTeamMemberBySlug = cache(async (slug: string) => {
  return safe(
    () => prisma.teamMember.findFirst({ where: { slug, visible: true }, include: { photo: true } }),
    null,
  )
})

// ---------------------------------------------------------------------------
// Yayınlar
// ---------------------------------------------------------------------------
export const getPublications = cache(async () => {
  return safe(
    () =>
      prisma.publication.findMany({
        where: { published: true },
        orderBy: [{ publishedAt: 'desc' }, { order: 'asc' }],
        include: { cover: true },
      }),
    [],
  )
})

export const getPublicationBySlug = cache(async (slug: string) => {
  return safe(
    () =>
      prisma.publication.findFirst({
        where: { published: true, OR: [{ slugTr: slug }, { slugEn: slug }] },
        include: { cover: true },
      }),
    null,
  )
})

export function publicationSlug(
  publication: { slugTr: string; slugEn: string },
  locale: Locale,
): string {
  return locale === 'tr' ? publication.slugTr : publication.slugEn || publication.slugTr
}

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------
export const getSeo = cache(async (routeKey: string) => {
  const row = await safe(
    () => prisma.seoMeta.findUnique({ where: { routeKey }, include: { ogImage: true } }),
    null,
  )
  const def = seoDefaults.find((d) => d.routeKey === routeKey)
  return { row, def }
})
