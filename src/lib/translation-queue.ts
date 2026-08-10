import 'server-only'
import { prisma } from './prisma'
import { hashSource, translateBatch, translationConfigured } from './translate'

/**
 * ARKA PLAN ÇEVİRİ KUYRUĞU
 *
 * Kaydet tuşu çeviriyi beklemez: alan PENDING işaretlenir, iş kuyruğa girer,
 * worker arka planda çalışır. Panel `/api/admin/translation/status` ile
 * durumu yoklar ve bitince kendiliğinden günceller.
 *
 * Tek container'da çalıştığı için kuyruk in-process; Railway'de tek replika
 * yeterli. Ölçek gerekirse aynı tablo harici bir worker'a taşınabilir.
 */

export type EntityName =
  | 'LocalizedText'
  | 'MediaSlot'
  | 'SiteSetting'
  | 'MenuItem'
  | 'Service'
  | 'TeamMember'
  | 'Publication'
  | 'SeoMeta'

interface EntitySpec {
  fields: string[]
  /** Alan adı → (tr kolonu, en kolonu) */
  columns: (field: string) => { tr: string; en: string }
  read: (id: string) => Promise<Record<string, unknown> | null>
  write: (id: string, data: Record<string, string>) => Promise<void>
}

const suffixed = (field: string) => ({ tr: `${field}Tr`, en: `${field}En` })

export const entitySpecs: Record<EntityName, EntitySpec> = {
  LocalizedText: {
    fields: ['value'],
    columns: () => ({ tr: 'tr', en: 'en' }),
    read: (id) => prisma.localizedText.findUnique({ where: { id } }) as Promise<Record<string, unknown> | null>,
    write: async (id, data) => {
      await prisma.localizedText.update({ where: { id }, data })
    },
  },
  MediaSlot: {
    fields: ['alt'],
    columns: suffixed,
    read: (id) => prisma.mediaSlot.findUnique({ where: { id } }) as Promise<Record<string, unknown> | null>,
    write: async (id, data) => {
      await prisma.mediaSlot.update({ where: { id }, data })
    },
  },
  SiteSetting: {
    fields: ['siteName', 'tagline', 'address', 'workingHours'],
    columns: suffixed,
    read: () => prisma.siteSetting.findUnique({ where: { id: 1 } }) as Promise<Record<string, unknown> | null>,
    write: async (_id, data) => {
      await prisma.siteSetting.update({ where: { id: 1 }, data })
    },
  },
  MenuItem: {
    fields: ['label'],
    columns: suffixed,
    read: (id) => prisma.menuItem.findUnique({ where: { id } }) as Promise<Record<string, unknown> | null>,
    write: async (id, data) => {
      await prisma.menuItem.update({ where: { id }, data })
    },
  },
  Service: {
    fields: ['title', 'excerpt', 'body', 'imageAlt', 'seoTitle', 'seoDesc'],
    columns: suffixed,
    read: (id) => prisma.service.findUnique({ where: { id } }) as Promise<Record<string, unknown> | null>,
    write: async (id, data) => {
      await prisma.service.update({ where: { id }, data })
    },
  },
  TeamMember: {
    fields: ['title', 'bio', 'expertise', 'photoAlt'],
    columns: suffixed,
    read: (id) => prisma.teamMember.findUnique({ where: { id } }) as Promise<Record<string, unknown> | null>,
    write: async (id, data) => {
      await prisma.teamMember.update({ where: { id }, data })
    },
  },
  Publication: {
    fields: ['title', 'excerpt', 'body', 'coverAlt', 'seoTitle', 'seoDesc'],
    columns: suffixed,
    read: (id) => prisma.publication.findUnique({ where: { id } }) as Promise<Record<string, unknown> | null>,
    write: async (id, data) => {
      await prisma.publication.update({ where: { id }, data })
    },
  },
  SeoMeta: {
    fields: ['title', 'desc'],
    columns: suffixed,
    read: (id) => prisma.seoMeta.findUnique({ where: { id } }) as Promise<Record<string, unknown> | null>,
    write: async (id, data) => {
      await prisma.seoMeta.update({ where: { id }, data })
    },
  },
}

// ---------------------------------------------------------------------------
// Durum yönetimi
// ---------------------------------------------------------------------------
export async function setFieldStatus(
  entity: EntityName,
  entityId: string,
  field: string,
  status: 'AUTO' | 'MANUAL' | 'PENDING' | 'FAILED',
  extra: { srcHash?: string | null; error?: string | null } = {},
): Promise<void> {
  await prisma.fieldMeta.upsert({
    where: { entity_entityId_field: { entity, entityId, field } },
    create: { entity, entityId, field, status, srcHash: extra.srcHash ?? null, error: extra.error ?? null },
    update: { status, ...(extra.srcHash !== undefined ? { srcHash: extra.srcHash } : {}), error: extra.error ?? null },
  })
}

export async function getFieldMeta(entity: EntityName, entityId: string) {
  const rows = await prisma.fieldMeta.findMany({ where: { entity, entityId } })
  return Object.fromEntries(rows.map((r) => [r.field, r]))
}

/** Admin İngilizce alana elle dokunduysa kilitle. */
export async function lockFieldManual(
  entity: EntityName,
  entityId: string,
  field: string,
): Promise<void> {
  await setFieldStatus(entity, entityId, field, 'MANUAL')
  await prisma.translationJob.deleteMany({ where: { entity, entityId, field, doneAt: null } })
}

// ---------------------------------------------------------------------------
// Kuyruğa alma
// ---------------------------------------------------------------------------
export interface EnqueueOptions {
  /** true → MANUAL kilidini kır ve yeniden çevir ("Yeniden çevir" butonu) */
  force?: boolean
}

export async function enqueueTranslation(
  entity: EntityName,
  entityId: string,
  field: string,
  source: string,
  options: EnqueueOptions = {},
): Promise<'queued' | 'skipped-manual' | 'skipped-unchanged' | 'skipped-empty'> {
  const text = (source ?? '').trim()
  if (!text) {
    await setFieldStatus(entity, entityId, field, 'AUTO', { srcHash: null, error: null })
    return 'skipped-empty'
  }

  const meta = await prisma.fieldMeta.findUnique({
    where: { entity_entityId_field: { entity, entityId, field } },
  })

  if (!options.force && meta?.status === 'MANUAL') return 'skipped-manual'

  const hash = hashSource(text)
  if (!options.force && meta?.srcHash === hash) {
    // Türkçe değişmemiş: zaten çevrilmişse tekrar çevirme.
    if (meta.status === 'AUTO') return 'skipped-unchanged'

    // Zaten kuyrukta bekleyen bir iş varsa ona dokunma — yeniden yazmak
    // uçuştaki işin deneme sayacını sıfırlar ve gereksiz tekrar üretir.
    if (meta.status === 'PENDING') {
      const inFlight = await prisma.translationJob.findUnique({
        where: { entity_entityId_field: { entity, entityId, field } },
      })
      if (inFlight && !inFlight.doneAt) return 'skipped-unchanged'
    }
  }

  await prisma.translationJob.upsert({
    where: { entity_entityId_field: { entity, entityId, field } },
    create: { entity, entityId, field, source: text },
    update: { source: text, attempts: 0, lastError: null, claimedAt: null, doneAt: null },
  })
  await setFieldStatus(entity, entityId, field, 'PENDING', { srcHash: hash })
  return 'queued'
}

/** Bir varlığın tüm çevrilebilir alanlarını sıraya alır. */
export async function enqueueEntity(
  entity: EntityName,
  entityId: string,
  options: EnqueueOptions = {},
): Promise<number> {
  const spec = entitySpecs[entity]
  const row = await spec.read(entityId)
  if (!row) return 0
  let count = 0
  for (const field of spec.fields) {
    const { tr } = spec.columns(field)
    const source = String(row[tr] ?? '')
    const result = await enqueueTranslation(entity, entityId, field, source, options)
    if (result === 'queued') count++
  }
  return count
}

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------
const MAX_ATTEMPTS = 3
const STALE_CLAIM_MS = 3 * 60 * 1000

let running = false

async function backoff(attempt: number): Promise<void> {
  const ms = Math.min(30_000, 800 * 2 ** attempt) + Math.floor(Math.random() * 400)
  await new Promise((r) => setTimeout(r, ms))
}

/**
 * Kuyruğu boşaltır. Aynı varlığın alanları tek API isteğinde birlikte
 * çevrilir (hem daha hızlı hem daha tutarlı).
 */
export async function runQueue(maxBatches = 8): Promise<{ processed: number; failed: number }> {
  if (running) return { processed: 0, failed: 0 }
  if (!translationConfigured()) return { processed: 0, failed: 0 }
  running = true

  let processed = 0
  let failed = 0

  try {
    // Takılı kalmış işleri serbest bırak
    await prisma.translationJob.updateMany({
      where: { doneAt: null, claimedAt: { lt: new Date(Date.now() - STALE_CLAIM_MS) } },
      data: { claimedAt: null },
    })

    for (let batch = 0; batch < maxBatches; batch++) {
      const next = await prisma.translationJob.findFirst({
        where: { doneAt: null, claimedAt: null, attempts: { lt: MAX_ATTEMPTS } },
        orderBy: { createdAt: 'asc' },
      })
      if (!next) break

      // Aynı varlığın bekleyen tüm alanlarını topla
      const group = await prisma.translationJob.findMany({
        where: {
          entity: next.entity,
          entityId: next.entityId,
          doneAt: null,
          claimedAt: null,
          attempts: { lt: MAX_ATTEMPTS },
        },
        take: 12,
      })

      const ids = group.map((j) => j.id)
      await prisma.translationJob.updateMany({
        where: { id: { in: ids } },
        data: { claimedAt: new Date(), attempts: { increment: 1 } },
      })

      const entity = next.entity as EntityName
      const spec = entitySpecs[entity]
      if (!spec) {
        await prisma.translationJob.deleteMany({ where: { id: { in: ids } } })
        continue
      }

      const payload: Record<string, string> = {}
      for (const job of group) payload[job.field] = job.source

      try {
        const translated = await translateBatch(payload)

        const writeData: Record<string, string> = {}
        for (const job of group) {
          const value = translated[job.field]
          if (typeof value === 'string' && value.length > 0) {
            writeData[spec.columns(job.field).en] = value
          }
        }

        if (Object.keys(writeData).length > 0) {
          await spec.write(next.entityId, writeData)
        }

        for (const job of group) {
          const ok = typeof translated[job.field] === 'string' && translated[job.field].length > 0
          if (ok) {
            await setFieldStatus(entity, job.entityId, job.field, 'AUTO', {
              srcHash: hashSource(job.source),
              error: null,
            })
            await prisma.translationJob.update({
              where: { id: job.id },
              data: { doneAt: new Date(), claimedAt: null, lastError: null },
            })
            processed++
          } else {
            await markFailed(job.id, entity, job.entityId, job.field, job.attempts + 1, 'Model bu alan için değer döndürmedi.')
            failed++
          }
        }
      } catch (err) {
        const message = (err as Error).message.slice(0, 500)
        for (const job of group) {
          await markFailed(job.id, entity, job.entityId, job.field, job.attempts + 1, message)
          failed++
        }
        await backoff(next.attempts)
      }
    }
  } finally {
    running = false
  }

  return { processed, failed }
}

async function markFailed(
  jobId: string,
  entity: EntityName,
  entityId: string,
  field: string,
  attempts: number,
  message: string,
): Promise<void> {
  const exhausted = attempts >= MAX_ATTEMPTS
  await prisma.translationJob.update({
    where: { id: jobId },
    data: { claimedAt: null, lastError: message, ...(exhausted ? { doneAt: new Date() } : {}) },
  })
  // Eski İngilizce metin KORUNUR; yalnızca durum FAILED işaretlenir.
  await setFieldStatus(entity, entityId, field, exhausted ? 'FAILED' : 'PENDING', { error: message })
}

/** Kaydetme sonrası tetikleme — isteği bloklamaz. */
export function kickQueue(): void {
  if (!translationConfigured()) return
  setTimeout(() => {
    runQueue().catch((err) => console.error('[translation] kuyruk hatası:', err))
  }, 50)
}

// ---------------------------------------------------------------------------
// Toplu işlemler
// ---------------------------------------------------------------------------

/** "Eksik İngilizce metinleri toplu çevir" — EN boş olan her alanı sıraya alır. */
export async function enqueueAllMissing(): Promise<number> {
  let queued = 0

  const texts = await prisma.localizedText.findMany()
  for (const row of texts) {
    if (row.tr.trim() && !row.en.trim()) {
      if ((await enqueueTranslation('LocalizedText', row.id, 'value', row.tr)) === 'queued') queued++
    }
  }

  const slots = await prisma.mediaSlot.findMany()
  for (const row of slots) {
    if (row.altTr.trim() && !row.altEn.trim()) {
      if ((await enqueueTranslation('MediaSlot', row.id, 'alt', row.altTr)) === 'queued') queued++
    }
  }

  const services = await prisma.service.findMany()
  for (const row of services) {
    for (const field of entitySpecs.Service.fields) {
      const tr = String((row as unknown as Record<string, unknown>)[`${field}Tr`] ?? '')
      const en = String((row as unknown as Record<string, unknown>)[`${field}En`] ?? '')
      if (tr.trim() && !en.trim()) {
        if ((await enqueueTranslation('Service', row.id, field, tr)) === 'queued') queued++
      }
    }
  }

  const team = await prisma.teamMember.findMany()
  for (const row of team) {
    for (const field of entitySpecs.TeamMember.fields) {
      const tr = String((row as unknown as Record<string, unknown>)[`${field}Tr`] ?? '')
      const en = String((row as unknown as Record<string, unknown>)[`${field}En`] ?? '')
      if (tr.trim() && !en.trim()) {
        if ((await enqueueTranslation('TeamMember', row.id, field, tr)) === 'queued') queued++
      }
    }
  }

  const pubs = await prisma.publication.findMany()
  for (const row of pubs) {
    for (const field of entitySpecs.Publication.fields) {
      const tr = String((row as unknown as Record<string, unknown>)[`${field}Tr`] ?? '')
      const en = String((row as unknown as Record<string, unknown>)[`${field}En`] ?? '')
      if (tr.trim() && !en.trim()) {
        if ((await enqueueTranslation('Publication', row.id, field, tr)) === 'queued') queued++
      }
    }
  }

  const seo = await prisma.seoMeta.findMany()
  for (const row of seo) {
    for (const field of entitySpecs.SeoMeta.fields) {
      const tr = String((row as unknown as Record<string, unknown>)[`${field}Tr`] ?? '')
      const en = String((row as unknown as Record<string, unknown>)[`${field}En`] ?? '')
      if (tr.trim() && !en.trim()) {
        if ((await enqueueTranslation('SeoMeta', row.id, field, tr)) === 'queued') queued++
      }
    }
  }

  const menu = await prisma.menuItem.findMany()
  for (const row of menu) {
    if (row.labelTr.trim() && !row.labelEn.trim()) {
      if ((await enqueueTranslation('MenuItem', row.id, 'label', row.labelTr)) === 'queued') queued++
    }
  }

  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } })
  if (settings) {
    for (const field of entitySpecs.SiteSetting.fields) {
      const tr = String((settings as unknown as Record<string, unknown>)[`${field}Tr`] ?? '')
      const en = String((settings as unknown as Record<string, unknown>)[`${field}En`] ?? '')
      if (tr.trim() && !en.trim()) {
        if ((await enqueueTranslation('SiteSetting', '1', field, tr)) === 'queued') queued++
      }
    }
  }

  kickQueue()
  return queued
}

export async function queueStats() {
  const [pending, failed] = await Promise.all([
    prisma.translationJob.count({ where: { doneAt: null } }),
    prisma.fieldMeta.count({ where: { status: 'FAILED' } }),
  ])
  return { pending, failed, configured: translationConfigured() }
}
