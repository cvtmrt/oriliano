import type { PrismaClient } from '@prisma/client'
import {
  SEED_VERSION,
  glossaryDefaults,
  mediaSlotDefaults,
  menuDefaults,
  seoDefaults,
  serviceDefaults,
  settingsExample,
  settingsExampleFields,
  teamDefaults,
  textDefaults,
} from '@/content/defaults'

/**
 * ÖRNEK VERİ YÜKLEME — idempotent.
 *
 * Hem `npm run db:seed` komutu hem panelin "Örnek verileri yükle" düğmesi
 * bu fonksiyonu çağırır. Panelde de olması gerekiyor çünkü Railway'de
 * veritabanı yalnızca özel ağdan erişilebilir; dışarıdan seed atılamıyor.
 *
 * Var olan kayıtların İÇERİĞİNE dokunmaz — yalnızca eksik kayıtları ekler ve
 * teknik alanları (grup, etiket, sıra) günceller. Bu yüzden defalarca
 * çalıştırmak güvenlidir.
 */
export interface SeedResult {
  texts: number
  newTexts: number
  slots: number
  menu: number
  services: number
  team: number
  seo: number
  glossary: number
  settingsCreated: boolean
}

export async function runSeed(prisma: PrismaClient): Promise<SeedResult> {
  let settingsCreated = false

  const existingSettings = await prisma.siteSetting.findUnique({ where: { id: 1 } })
  if (!existingSettings) {
    await prisma.siteSetting.create({
      data: {
        id: 1,
        siteNameTr: 'Çetiner Hukuk ve Danışmanlık',
        siteNameEn: 'Çetiner Hukuk ve Danışmanlık',
        accentColor: '#A9834B',
        ...settingsExample,
        baseUrl: process.env.SITE_URL || 'https://cetinerlegal.com',
        seedVersion: SEED_VERSION,
      },
    })
    settingsCreated = true
  } else {
    // Var olan kayıtta YALNIZCA boş alanları doldur — elle girilen gerçek
    // bilgiye asla dokunma.
    const fill: Record<string, string> = {}
    for (const field of settingsExampleFields) {
      const current = String((existingSettings as unknown as Record<string, unknown>)[field] ?? '')
      const example = settingsExample[field]
      if (!current.trim() && example) fill[field] = example
    }
    await prisma.siteSetting.update({
      where: { id: 1 },
      data: { ...fill, seedVersion: SEED_VERSION },
    })
  }

  let newTexts = 0
  for (const def of textDefaults) {
    const result = await prisma.localizedText.upsert({
      where: { key: def.key },
      create: {
        key: def.key,
        group: def.group,
        label: def.label,
        kind: def.kind,
        order: def.order,
        tr: def.tr,
        en: def.en,
        seeded: true,
      },
      update: { group: def.group, label: def.label, kind: def.kind, order: def.order },
      select: { createdAt: true, updatedAt: true },
    })
    if (result.createdAt.getTime() === result.updatedAt.getTime()) newTexts++
  }

  for (const def of mediaSlotDefaults) {
    await prisma.mediaSlot.upsert({
      where: { key: def.key },
      create: {
        key: def.key,
        group: def.group,
        label: def.label,
        order: def.order,
        altTr: def.altTr,
        altEn: def.altEn,
        seeded: true,
      },
      update: { group: def.group, label: def.label, order: def.order },
    })
  }

  for (const [index, def] of menuDefaults.entries()) {
    await prisma.menuItem.upsert({
      where: { routeKey: def.routeKey },
      create: {
        routeKey: def.routeKey,
        labelTr: def.labelTr,
        labelEn: def.labelEn,
        order: index,
        visible: def.visible,
        seeded: true,
      },
      update: {},
    })
  }

  for (const [index, def] of serviceDefaults.entries()) {
    await prisma.service.upsert({
      where: { slugTr: def.slugTr },
      create: {
        slugTr: def.slugTr,
        slugEn: def.slugEn,
        icon: def.icon,
        order: index,
        visible: true,
        featured: def.featured,
        titleTr: def.titleTr,
        titleEn: def.titleEn,
        excerptTr: def.excerptTr,
        excerptEn: def.excerptEn,
        bodyTr: def.bodyTr,
        bodyEn: def.bodyEn,
        seeded: true,
      },
      update: {},
    })
  }

  for (const [index, def] of teamDefaults.entries()) {
    await prisma.teamMember.upsert({
      where: { slug: def.slug },
      create: {
        slug: def.slug,
        name: def.name,
        order: index,
        visible: true,
        titleTr: def.titleTr,
        titleEn: def.titleEn,
        bioTr: def.bioTr,
        bioEn: def.bioEn,
        expertiseTr: def.expertiseTr,
        expertiseEn: def.expertiseEn,
        email: def.email,
        seeded: true,
      },
      update: {},
    })
  }

  for (const def of seoDefaults) {
    await prisma.seoMeta.upsert({
      where: { routeKey: def.routeKey },
      create: {
        routeKey: def.routeKey,
        titleTr: def.titleTr,
        titleEn: def.titleEn,
        descTr: def.descTr,
        descEn: def.descEn,
        seeded: true,
      },
      update: {},
    })
  }

  for (const [index, term] of glossaryDefaults.entries()) {
    await prisma.glossaryTerm.upsert({
      where: { tr: term.tr },
      create: { tr: term.tr, en: term.en, order: index, active: true, seeded: true },
      update: {},
    })
  }

  return {
    texts: textDefaults.length,
    newTexts,
    slots: mediaSlotDefaults.length,
    menu: menuDefaults.length,
    services: serviceDefaults.length,
    team: teamDefaults.length,
    seo: seoDefaults.length,
    glossary: glossaryDefaults.length,
    settingsCreated,
  }
}
