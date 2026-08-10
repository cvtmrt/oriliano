/**
 * ÖRNEK VERİ (seed) — idempotent.
 *
 * Aynı komut kaç kez çalışırsa çalışsın sonuç aynıdır ve ELLE YAPILAN
 * DÜZENLEMELER EZİLMEZ: seed yalnızca kaydı ilk kez oluştururken içerik yazar,
 * sonraki çalıştırmalarda yalnızca eksik kayıtları ekler.
 *
 * Eklediği her kayıt `seeded: true` işaretlidir; panelden "örnek verileri
 * temizle" bu işareti kullanır.
 *
 *   npm run db:seed
 */
import { PrismaClient } from '@prisma/client'
import {
  SEED_VERSION,
  glossaryDefaults,
  mediaSlotDefaults,
  menuDefaults,
  seoDefaults,
  serviceDefaults,
  teamDefaults,
  textDefaults,
} from '../src/content/defaults'

const prisma = new PrismaClient()

async function main() {
  console.log('Örnek veriler yükleniyor…')

  // --- Ayarlar (tek satır) -------------------------------------------------
  const existingSettings = await prisma.siteSetting.findUnique({ where: { id: 1 } })
  if (!existingSettings) {
    await prisma.siteSetting.create({
      data: {
        id: 1,
        siteNameTr: 'Çetiner Hukuk ve Danışmanlık',
        siteNameEn: 'Çetiner Hukuk ve Danışmanlık',
        taglineTr: 'Hukuki danışmanlık ve temsil',
        taglineEn: 'Legal advisory and representation',
        accentColor: '#A9834B',
        // Gerçek iletişim bilgileri panelden girilecek — uydurma veri yok.
        phone: '',
        email: '',
        addressTr: '',
        addressEn: '',
        workingHoursTr: 'Pazartesi – Cuma, 09:00 – 18:00',
        workingHoursEn: 'Monday – Friday, 09:00 – 18:00',
        baseUrl: process.env.SITE_URL || 'https://cetinerlegal.com',
        seedVersion: SEED_VERSION,
      },
    })
    console.log('  ✓ Genel ayarlar oluşturuldu')
  } else {
    await prisma.siteSetting.update({ where: { id: 1 }, data: { seedVersion: SEED_VERSION } })
    console.log('  · Genel ayarlar zaten var, dokunulmadı')
  }

  // --- Metinler ------------------------------------------------------------
  let createdTexts = 0
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
      // Var olan kayıtta yalnızca teknik alanlar güncellenir; içeriğe dokunulmaz.
      update: { group: def.group, label: def.label, kind: def.kind, order: def.order },
      select: { id: true, createdAt: true, updatedAt: true },
    })
    if (result.createdAt.getTime() === result.updatedAt.getTime()) createdTexts++
  }
  console.log(`  ✓ Metinler: ${textDefaults.length} anahtar (${createdTexts} yeni)`)

  // --- Görsel yuvaları -----------------------------------------------------
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
  console.log(`  ✓ Görsel yuvaları: ${mediaSlotDefaults.length}`)

  // --- Menü ----------------------------------------------------------------
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
  console.log(`  ✓ Menü: ${menuDefaults.length} öğe`)

  // --- Hizmetler -----------------------------------------------------------
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
  console.log(`  ✓ Hizmetler: ${serviceDefaults.length}`)

  // --- Ekip ----------------------------------------------------------------
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
  console.log(`  ✓ Ekip: ${teamDefaults.length} üye (jenerik yer tutucu)`)

  // --- SEO -----------------------------------------------------------------
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
  console.log(`  ✓ SEO: ${seoDefaults.length} sayfa`)

  // --- Terim sözlüğü -------------------------------------------------------
  for (const [index, term] of glossaryDefaults.entries()) {
    await prisma.glossaryTerm.upsert({
      where: { tr: term.tr },
      create: { tr: term.tr, en: term.en, order: index, active: true, seeded: true },
      update: {},
    })
  }
  console.log(`  ✓ Terim sözlüğü: ${glossaryDefaults.length} terim`)

  // --- Yönetici ------------------------------------------------------------
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const adminHash = process.env.ADMIN_PASSWORD_HASH || ''
  if (adminEmail && adminHash) {
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      create: { email: adminEmail, passwordHash: adminHash },
      update: { passwordHash: adminHash },
    })
    console.log(`  ✓ Yönetici: ${adminEmail}`)
  } else {
    console.log('  ! ADMIN_EMAIL / ADMIN_PASSWORD_HASH tanımlı değil — yönetici oluşturulmadı.')
    console.log('    Karma üretmek için: npm run hash -- "sifreniz"')
  }

  console.log('\nTamamlandı. Panel: /admin')
}

main()
  .catch((err) => {
    console.error('Seed hatası:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
