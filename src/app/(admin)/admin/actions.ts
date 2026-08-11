'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { login, logout, requireAdmin } from '@/lib/auth'
import { sanitizeHtml } from '@/lib/html'
import { deleteMedia } from '@/lib/media'
import { slugify } from '@/lib/translate'
import {
  enqueueEntity,
  enqueueTranslation,
  enqueueAllMissing,
  kickQueue,
  lockFieldManual,
  type EntityName,
} from '@/lib/translation-queue'
import { SEED_VERSION, settingsExample, settingsExampleFields } from '@/content/defaults'
import { runSeed } from '@/lib/seed'
import { normalizeWhatsapp } from '@/lib/phone'

/**
 * Panelin tüm yazma işlemleri. Her aksiyon önce yetki kontrolü yapar.
 *
 * İki dilli alanlar için sözleşme:
 *   tr__<alan>     → Türkçe (kaynak)
 *   en__<alan>     → İngilizce
 *   manual__<alan> → "1" ise admin İngilizceye elle dokundu, kilitle
 */

const RICH_FIELDS = new Set(['body', 'bio', 'value'])

function str(form: FormData, key: string): string {
  const value = form.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function bool(form: FormData, key: string): boolean {
  return form.get(key) === 'on' || form.get(key) === '1' || form.get(key) === 'true'
}

function int(form: FormData, key: string, fallback = 0): number {
  const n = Number(str(form, key))
  return Number.isFinite(n) ? Math.trunc(n) : fallback
}

function nullableId(form: FormData, key: string): string | null {
  const value = str(form, key)
  return value ? value : null
}

/** Formdan iki dilli alanları toplar, kilit/çeviri sıralaması için bilgi üretir. */
function collectBilingual(
  form: FormData,
  fields: { name: string; rich?: boolean }[],
): {
  data: Record<string, string>
  manual: string[]
  sources: Record<string, string>
} {
  const data: Record<string, string> = {}
  const manual: string[] = []
  const sources: Record<string, string> = {}

  for (const field of fields) {
    const rich = field.rich ?? RICH_FIELDS.has(field.name)
    const tr = form.has(`tr__${field.name}`) ? String(form.get(`tr__${field.name}`) ?? '') : ''
    const en = form.has(`en__${field.name}`) ? String(form.get(`en__${field.name}`) ?? '') : ''

    const trValue = rich ? sanitizeHtml(tr) : tr.trim()
    const enValue = rich ? sanitizeHtml(en) : en.trim()

    data[`${field.name}Tr`] = trValue
    data[`${field.name}En`] = enValue
    sources[field.name] = trValue

    if (str(form, `manual__${field.name}`) === '1' && enValue) manual.push(field.name)
  }

  return { data, manual, sources }
}

/** Kaydetme sonrası: kilitleri uygula, değişen alanları çeviri sırasına al. */
async function syncTranslations(
  entity: EntityName,
  entityId: string,
  collected: { manual: string[]; sources: Record<string, string> },
): Promise<void> {
  for (const field of collected.manual) {
    await lockFieldManual(entity, entityId, field)
  }
  for (const [field, source] of Object.entries(collected.sources)) {
    if (collected.manual.includes(field)) continue
    await enqueueTranslation(entity, entityId, field, source)
  }
  kickQueue()
}

function refreshSite(): void {
  revalidatePath('/', 'layout')
}

// ---------------------------------------------------------------------------
// Kimlik doğrulama
// ---------------------------------------------------------------------------
export async function loginAction(
  _prev: { error?: string } | undefined,
  form: FormData,
): Promise<{ error?: string }> {
  const email = str(form, 'email')
  const password = String(form.get('password') ?? '')
  if (!email || !password) return { error: 'E-posta ve şifre gerekli.' }

  try {
    const result = await login(email, password)
    if (!result.ok) return { error: result.error }
  } catch (err) {
    return { error: (err as Error).message }
  }
  redirect('/admin')
}

export async function logoutAction(): Promise<void> {
  await logout()
  redirect('/admin/login')
}

// ---------------------------------------------------------------------------
// Genel ayarlar
// ---------------------------------------------------------------------------
export async function saveSettingsAction(form: FormData): Promise<void> {
  await requireAdmin()

  const bilingual = collectBilingual(form, [
    { name: 'siteName', rich: false },
    { name: 'tagline', rich: false },
    { name: 'address', rich: false },
    { name: 'workingHours', rich: false },
    { name: 'autoReply', rich: false },
    { name: 'whatsappText', rich: false },
  ])

  const data = {
    ...bilingual.data,
    accentColor: str(form, 'accentColor') || '#A9834B',
    phone: str(form, 'phone'),
    phoneSecondary: str(form, 'phoneSecondary'),
    email: str(form, 'email'),
    mapEmbedUrl: str(form, 'mapEmbedUrl'),
    mapLat: str(form, 'mapLat'),
    mapLng: str(form, 'mapLng'),
    linkedin: str(form, 'linkedin'),
    instagram: str(form, 'instagram'),
    x: str(form, 'x'),
    facebook: str(form, 'facebook'),
    youtube: str(form, 'youtube'),
    baseUrl: str(form, 'baseUrl') || 'https://cetinerlegal.com',
    logoId: nullableId(form, 'logoId'),
    logoDarkId: nullableId(form, 'logoDarkId'),
    faviconId: nullableId(form, 'faviconId'),
    notifyEnabled: bool(form, 'notifyEnabled'),
    notifyEmail: str(form, 'notifyEmail'),
    autoReplyEnabled: bool(form, 'autoReplyEnabled'),
    floatingEnabled: bool(form, 'floatingEnabled'),
    // 0532… gibi yerel biçimde girilse de wa.me'nin istediği 90532… hâline
    // çevrilir; yoksa düğme görünür ama tıklayınca hata sayfası açardı.
    whatsappNumber: normalizeWhatsapp(str(form, 'whatsappNumber')),
    showCallButton: bool(form, 'showCallButton'),
  }

  await prisma.siteSetting.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  })

  await syncTranslations('SiteSetting', '1', bilingual)
  refreshSite()
  revalidatePath('/admin/settings')
}

// ---------------------------------------------------------------------------
// Sayfa metinleri + görsel yuvaları
// ---------------------------------------------------------------------------
export async function saveTextsAction(form: FormData): Promise<void> {
  await requireAdmin()
  const group = str(form, 'group')

  const rows = await prisma.localizedText.findMany({ where: { group } })

  for (const row of rows) {
    const rich = row.kind === 'RICH'
    const trRaw = String(form.get(`tr__${row.id}`) ?? '')
    const enRaw = String(form.get(`en__${row.id}`) ?? '')
    const tr = rich ? sanitizeHtml(trRaw) : trRaw.trim()
    const en = rich ? sanitizeHtml(enRaw) : enRaw.trim()
    const manual = str(form, `manual__${row.id}`) === '1' && Boolean(en)

    if (tr === row.tr && en === row.en) continue

    await prisma.localizedText.update({ where: { id: row.id }, data: { tr, en } })

    if (manual) {
      await lockFieldManual('LocalizedText', row.id, 'value')
    } else {
      await enqueueTranslation('LocalizedText', row.id, 'value', tr)
    }
  }

  // Aynı sayfadaki görsel yuvaları
  const slots = await prisma.mediaSlot.findMany({ where: { group } })
  for (const slot of slots) {
    const mediaId = nullableId(form, `media__${slot.id}`)
    const altTr = String(form.get(`tr__alt__${slot.id}`) ?? '').trim()
    const altEn = String(form.get(`en__alt__${slot.id}`) ?? '').trim()
    const manual = str(form, `manual__alt__${slot.id}`) === '1' && Boolean(altEn)

    if (mediaId === slot.mediaId && altTr === slot.altTr && altEn === slot.altEn) continue

    await prisma.mediaSlot.update({ where: { id: slot.id }, data: { mediaId, altTr, altEn } })

    if (manual) {
      await lockFieldManual('MediaSlot', slot.id, 'alt')
    } else {
      await enqueueTranslation('MediaSlot', slot.id, 'alt', altTr)
    }
  }

  kickQueue()
  refreshSite()
  revalidatePath(`/admin/content/${group}`)
}

/** "Bu sayfayı tümüyle çevir" */
export async function translateGroupAction(form: FormData): Promise<void> {
  await requireAdmin()
  const group = str(form, 'group')

  const texts = await prisma.localizedText.findMany({ where: { group } })
  for (const row of texts) {
    await enqueueTranslation('LocalizedText', row.id, 'value', row.tr, { force: true })
  }
  const slots = await prisma.mediaSlot.findMany({ where: { group } })
  for (const slot of slots) {
    await enqueueTranslation('MediaSlot', slot.id, 'alt', slot.altTr, { force: true })
  }

  kickQueue()
  revalidatePath(`/admin/content/${group}`)
}

// ---------------------------------------------------------------------------
// Menü
// ---------------------------------------------------------------------------
export async function saveMenuAction(form: FormData): Promise<void> {
  await requireAdmin()
  const items = await prisma.menuItem.findMany()

  for (const item of items) {
    const labelTr = String(form.get(`tr__${item.id}`) ?? '').trim() || item.labelTr
    const labelEn = String(form.get(`en__${item.id}`) ?? '').trim()
    const order = int(form, `order__${item.id}`, item.order)
    const visible = bool(form, `visible__${item.id}`)
    const manual = str(form, `manual__${item.id}`) === '1' && Boolean(labelEn)

    await prisma.menuItem.update({
      where: { id: item.id },
      data: { labelTr, labelEn, order, visible },
    })

    if (manual) {
      await lockFieldManual('MenuItem', item.id, 'label')
    } else {
      await enqueueTranslation('MenuItem', item.id, 'label', labelTr)
    }
  }

  kickQueue()
  refreshSite()
  revalidatePath('/admin/menu')
}

// ---------------------------------------------------------------------------
// Hizmetler
// ---------------------------------------------------------------------------
const serviceFields = [
  { name: 'title' },
  { name: 'excerpt' },
  { name: 'body', rich: true },
  { name: 'imageAlt' },
  { name: 'seoTitle' },
  { name: 'seoDesc' },
]

export async function saveServiceAction(form: FormData): Promise<void> {
  await requireAdmin()
  const id = str(form, 'id')
  const bilingual = collectBilingual(form, serviceFields)

  const titleTr = bilingual.data.titleTr || 'Yeni hizmet'
  const slugTr = slugify(str(form, 'slugTr') || titleTr) || 'hizmet'
  const slugEn =
    slugify(str(form, 'slugEn') || bilingual.data.titleEn || slugTr) || `${slugTr}-en`

  const base = {
    ...bilingual.data,
    titleTr,
    slugTr,
    slugEn,
    icon: str(form, 'icon') || 'scale',
    order: int(form, 'order'),
    visible: bool(form, 'visible'),
    featured: bool(form, 'featured'),
    imageId: nullableId(form, 'imageId'),
    ogImageId: nullableId(form, 'ogImageId'),
  }

  let serviceId = id
  try {
    if (id) {
      await prisma.service.update({ where: { id }, data: base })
    } else {
      const created = await prisma.service.create({ data: base })
      serviceId = created.id
    }
  } catch (err) {
    if ((err as { code?: string }).code === 'P2002') {
      throw new Error('Bu slug başka bir hizmette kullanılıyor. Farklı bir slug girin.')
    }
    throw err
  }

  await syncTranslations('Service', serviceId, bilingual)
  refreshSite()
  redirect(`/admin/services?saved=${encodeURIComponent(titleTr)}`)
}

export async function deleteServiceAction(form: FormData): Promise<void> {
  await requireAdmin()
  const id = str(form, 'id')
  if (!id) return
  await prisma.service.delete({ where: { id } })
  await prisma.fieldMeta.deleteMany({ where: { entity: 'Service', entityId: id } })
  await prisma.translationJob.deleteMany({ where: { entity: 'Service', entityId: id } })
  refreshSite()
  revalidatePath('/admin/services')
}

// ---------------------------------------------------------------------------
// Ekip
// ---------------------------------------------------------------------------
const teamFields = [
  { name: 'title' },
  { name: 'bio', rich: true },
  { name: 'expertise' },
  { name: 'photoAlt' },
]

export async function saveTeamMemberAction(form: FormData): Promise<void> {
  await requireAdmin()
  const id = str(form, 'id')
  const bilingual = collectBilingual(form, teamFields)

  const name = str(form, 'name') || 'Ad Soyad'
  const slug = slugify(str(form, 'slug') || name) || `uye-${Date.now().toString(36)}`

  const base = {
    ...bilingual.data,
    name,
    slug,
    order: int(form, 'order'),
    visible: bool(form, 'visible'),
    email: str(form, 'email'),
    phone: str(form, 'phone'),
    linkedin: str(form, 'linkedin'),
    photoId: nullableId(form, 'photoId'),
  }

  let memberId = id
  try {
    if (id) {
      await prisma.teamMember.update({ where: { id }, data: base })
    } else {
      const created = await prisma.teamMember.create({ data: base })
      memberId = created.id
    }
  } catch (err) {
    if ((err as { code?: string }).code === 'P2002') {
      throw new Error('Bu slug başka bir ekip üyesinde kullanılıyor.')
    }
    throw err
  }

  await syncTranslations('TeamMember', memberId, bilingual)
  refreshSite()
  redirect(`/admin/team?saved=${encodeURIComponent(name)}`)
}

export async function deleteTeamMemberAction(form: FormData): Promise<void> {
  await requireAdmin()
  const id = str(form, 'id')
  if (!id) return
  await prisma.teamMember.delete({ where: { id } })
  await prisma.fieldMeta.deleteMany({ where: { entity: 'TeamMember', entityId: id } })
  await prisma.translationJob.deleteMany({ where: { entity: 'TeamMember', entityId: id } })
  refreshSite()
  revalidatePath('/admin/team')
}

// ---------------------------------------------------------------------------
// Yayınlar
// ---------------------------------------------------------------------------
const publicationFields = [
  { name: 'title' },
  { name: 'excerpt' },
  { name: 'body', rich: true },
  { name: 'coverAlt' },
  { name: 'seoTitle' },
  { name: 'seoDesc' },
]

export async function savePublicationAction(form: FormData): Promise<void> {
  await requireAdmin()
  const id = str(form, 'id')
  const bilingual = collectBilingual(form, publicationFields)

  const titleTr = bilingual.data.titleTr || 'Yeni yazı'
  const slugTr = slugify(str(form, 'slugTr') || titleTr) || 'yazi'
  const slugEn = slugify(str(form, 'slugEn') || bilingual.data.titleEn || slugTr) || `${slugTr}-en`
  const publishedAtRaw = str(form, 'publishedAt')

  const base = {
    ...bilingual.data,
    titleTr,
    slugTr,
    slugEn,
    order: int(form, 'order'),
    published: bool(form, 'published'),
    publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : null,
    author: str(form, 'author'),
    coverId: nullableId(form, 'coverId'),
  }

  let pubId = id
  try {
    if (id) {
      await prisma.publication.update({ where: { id }, data: base })
    } else {
      const created = await prisma.publication.create({ data: base })
      pubId = created.id
    }
  } catch (err) {
    if ((err as { code?: string }).code === 'P2002') {
      throw new Error('Bu slug başka bir yazıda kullanılıyor.')
    }
    throw err
  }

  await syncTranslations('Publication', pubId, bilingual)
  refreshSite()
  redirect(`/admin/publications?saved=${encodeURIComponent(titleTr)}`)
}

export async function deletePublicationAction(form: FormData): Promise<void> {
  await requireAdmin()
  const id = str(form, 'id')
  if (!id) return
  await prisma.publication.delete({ where: { id } })
  await prisma.fieldMeta.deleteMany({ where: { entity: 'Publication', entityId: id } })
  await prisma.translationJob.deleteMany({ where: { entity: 'Publication', entityId: id } })
  refreshSite()
  revalidatePath('/admin/publications')
}

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------
export async function saveSeoAction(form: FormData): Promise<void> {
  await requireAdmin()
  const rows = await prisma.seoMeta.findMany()

  for (const row of rows) {
    const titleTr = String(form.get(`tr__title__${row.id}`) ?? '').trim()
    const titleEn = String(form.get(`en__title__${row.id}`) ?? '').trim()
    const descTr = String(form.get(`tr__desc__${row.id}`) ?? '').trim()
    const descEn = String(form.get(`en__desc__${row.id}`) ?? '').trim()
    const noindex = bool(form, `noindex__${row.id}`)
    const ogImageId = nullableId(form, `ogImageId__${row.id}`)

    await prisma.seoMeta.update({
      where: { id: row.id },
      data: { titleTr, titleEn, descTr, descEn, noindex, ogImageId },
    })

    if (str(form, `manual__title__${row.id}`) === '1' && titleEn) {
      await lockFieldManual('SeoMeta', row.id, 'title')
    } else {
      await enqueueTranslation('SeoMeta', row.id, 'title', titleTr)
    }

    if (str(form, `manual__desc__${row.id}`) === '1' && descEn) {
      await lockFieldManual('SeoMeta', row.id, 'desc')
    } else {
      await enqueueTranslation('SeoMeta', row.id, 'desc', descTr)
    }
  }

  kickQueue()
  refreshSite()
  revalidatePath('/admin/seo')
}

// ---------------------------------------------------------------------------
// Terim sözlüğü
// ---------------------------------------------------------------------------
export async function saveGlossaryAction(form: FormData): Promise<void> {
  await requireAdmin()
  const rows = await prisma.glossaryTerm.findMany()

  for (const row of rows) {
    if (bool(form, `delete__${row.id}`)) {
      await prisma.glossaryTerm.delete({ where: { id: row.id } })
      continue
    }
    await prisma.glossaryTerm.update({
      where: { id: row.id },
      data: {
        tr: String(form.get(`tr__${row.id}`) ?? '').trim() || row.tr,
        en: String(form.get(`en__${row.id}`) ?? '').trim(),
        order: int(form, `order__${row.id}`, row.order),
        active: bool(form, `active__${row.id}`),
      },
    })
  }

  const newTr = str(form, 'new__tr')
  const newEn = str(form, 'new__en')
  if (newTr && newEn) {
    await prisma.glossaryTerm.upsert({
      where: { tr: newTr },
      create: { tr: newTr, en: newEn, order: rows.length },
      update: { en: newEn },
    })
  }

  revalidatePath('/admin/glossary')
}

// ---------------------------------------------------------------------------
// Mesajlar
// ---------------------------------------------------------------------------
export async function toggleMessageReadAction(form: FormData): Promise<void> {
  await requireAdmin()
  const id = str(form, 'id')
  if (!id) return
  const message = await prisma.contactMessage.findUnique({ where: { id } })
  if (!message) return
  await prisma.contactMessage.update({ where: { id }, data: { read: !message.read } })
  revalidatePath('/admin/messages')
  revalidatePath('/admin')
}

export async function deleteMessageAction(form: FormData): Promise<void> {
  await requireAdmin()
  const id = str(form, 'id')
  if (!id) return
  await prisma.contactMessage.delete({ where: { id } })
  revalidatePath('/admin/messages')
  revalidatePath('/admin')
}

// ---------------------------------------------------------------------------
// Görsel kütüphanesi
// ---------------------------------------------------------------------------
export async function deleteMediaAction(form: FormData): Promise<void> {
  await requireAdmin()
  const id = str(form, 'id')
  if (!id) return
  await deleteMedia(id)
  refreshSite()
  revalidatePath('/admin/media')
}

// ---------------------------------------------------------------------------
// Araçlar
// ---------------------------------------------------------------------------

/** "Eksik İngilizce metinleri toplu çevir" */
export async function translateMissingAction(): Promise<void> {
  await requireAdmin()
  await enqueueAllMissing()
  revalidatePath('/admin/tools')
}

/** Bir varlığın tüm alanlarını yeniden çevir */
export async function retranslateEntityAction(form: FormData): Promise<void> {
  await requireAdmin()
  const entity = str(form, 'entity') as EntityName
  const entityId = str(form, 'entityId')
  if (!entity || !entityId) return
  await enqueueEntity(entity, entityId, { force: true })
  kickQueue()
  revalidatePath('/admin')
}

/** Başarısız çevirileri tekrar dene */
export async function retryFailedTranslationsAction(): Promise<void> {
  await requireAdmin()
  const failed = await prisma.fieldMeta.findMany({ where: { status: 'FAILED' } })
  for (const meta of failed) {
    await prisma.translationJob.updateMany({
      where: { entity: meta.entity, entityId: meta.entityId, field: meta.field },
      data: { attempts: 0, doneAt: null, claimedAt: null, lastError: null },
    })
    await prisma.fieldMeta.update({ where: { id: meta.id }, data: { status: 'PENDING', error: null } })
  }
  kickQueue()
  revalidatePath('/admin/tools')
}

/**
 * "Örnek verileri temizle" — seed'in eklediği kayıtları siler.
 * Elle girilen/düzenlenen içeriğe dokunmaz (seeded=false olanlar kalır).
 */
export async function clearSeedDataAction(): Promise<void> {
  await requireAdmin()

  await prisma.service.deleteMany({ where: { seeded: true } })
  await prisma.teamMember.deleteMany({ where: { seeded: true } })
  await prisma.publication.deleteMany({ where: { seeded: true } })
  await prisma.localizedText.deleteMany({ where: { seeded: true } })
  await prisma.mediaSlot.deleteMany({ where: { seeded: true } })
  await prisma.seoMeta.deleteMany({ where: { seeded: true } })
  await prisma.glossaryTerm.deleteMany({ where: { seeded: true } })

  // Ayarlar tek satır olduğu için silinmez; yalnızca DEĞERİ HÂLÂ ÖRNEK OLAN
  // alanlar boşaltılır. Gerçek bilgi girdiyseniz ona dokunulmaz.
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } })
  if (settings) {
    const reset: Record<string, string> = {}
    for (const field of settingsExampleFields) {
      const current = String((settings as unknown as Record<string, unknown>)[field] ?? '')
      if (current && current === settingsExample[field]) reset[field] = ''
    }
    await prisma.siteSetting.update({
      where: { id: 1 },
      data: { ...reset, seedVersion: null },
    })
  }

  refreshSite()
  revalidatePath('/admin/tools')
  revalidatePath('/admin/settings')
}

/**
 * "Örnek verileri yükle" — Railway'de veritabanına yalnızca özel ağdan
 * erişilebildiği için seed dışarıdan atılamıyor; bu yüzden panelde duruyor.
 * İdempotent: var olan kayıtların içeriğine dokunmaz.
 */
export async function loadSeedDataAction(): Promise<void> {
  await requireAdmin()
  await runSeed(prisma)
  refreshSite()
  revalidatePath('/admin/tools')
  revalidatePath('/admin')
}

export async function markSeedVersionAction(): Promise<void> {
  await requireAdmin()
  await prisma.siteSetting.updateMany({ where: { id: 1 }, data: { seedVersion: SEED_VERSION } })
  revalidatePath('/admin/tools')
}
