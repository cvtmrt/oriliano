/**
 * Seed → temizle → yeniden seed döngüsünü doğrular.
 *
 * Kritik davranış: temizleme yalnızca DEĞERİ HÂLÂ ÖRNEK OLAN ayar alanlarını
 * boşaltmalı; kullanıcının elle girdiği gerçek bilgiye dokunmamalı.
 *
 *   npx tsx --conditions=react-server scripts/seed-cycle-test.ts
 */
import { PrismaClient } from '@prisma/client'
import { runSeed } from '../src/lib/seed'
import { settingsExample, settingsExampleFields } from '../src/content/defaults'

const prisma = new PrismaClient()
let pass = 0
let fail = 0

function check(name: string, ok: boolean, detail = '') {
  if (ok) {
    pass++
    console.log(`  ✓ ${name}`)
  } else {
    fail++
    console.log(`  ✗ ${name} ${detail}`)
  }
}

/** Panelin clearSeedDataAction'ı ile aynı mantık. */
async function clearSeed() {
  await prisma.service.deleteMany({ where: { seeded: true } })
  await prisma.teamMember.deleteMany({ where: { seeded: true } })
  await prisma.publication.deleteMany({ where: { seeded: true } })
  await prisma.localizedText.deleteMany({ where: { seeded: true } })
  await prisma.mediaSlot.deleteMany({ where: { seeded: true } })
  await prisma.seoMeta.deleteMany({ where: { seeded: true } })
  await prisma.glossaryTerm.deleteMany({ where: { seeded: true } })

  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } })
  if (settings) {
    const reset: Record<string, string> = {}
    for (const field of settingsExampleFields) {
      const current = String((settings as unknown as Record<string, unknown>)[field] ?? '')
      if (current && current === settingsExample[field]) reset[field] = ''
    }
    await prisma.siteSetting.update({ where: { id: 1 }, data: { ...reset, seedVersion: null } })
  }
}

async function main() {
  console.log('\n— 1. tur seed —')
  await runSeed(prisma)
  let s = await prisma.siteSetting.findUniqueOrThrow({ where: { id: 1 } })
  check('telefon örnekle doldu', s.phone === settingsExample.phone, s.phone)
  check('adres örnekle doldu', s.addressTr === settingsExample.addressTr)
  check('e-posta örnekle doldu', s.email === settingsExample.email)
  check('harita bilerek boş', s.mapEmbedUrl === '')
  check('87 metin', (await prisma.localizedText.count()) === 87)
  check('10 hizmet', (await prisma.service.count()) === 10)

  console.log('\n— Kullanıcı gerçek bilgi giriyor —')
  await prisma.siteSetting.update({
    where: { id: 1 },
    data: { phone: '+90 312 555 44 33', email: 'gercek@buro.com' },
  })
  // Bir metni de elle düzenle ve "kullanıcı içeriği" olarak işaretle
  const someText = await prisma.localizedText.findFirstOrThrow({ where: { key: 'home.hero.title' } })
  await prisma.localizedText.update({
    where: { id: someText.id },
    data: { tr: 'Elle yazılmış başlık', seeded: false },
  })
  await prisma.service.create({
    data: { slugTr: 'kendi-hizmetim', slugEn: 'my-service', titleTr: 'Kendi Hizmetim', seeded: false },
  })

  console.log('\n— Temizle —')
  await clearSeed()
  s = await prisma.siteSetting.findUniqueOrThrow({ where: { id: 1 } })
  check('GERÇEK telefon korundu', s.phone === '+90 312 555 44 33', s.phone)
  check('GERÇEK e-posta korundu', s.email === 'gercek@buro.com', s.email)
  check('örnek adres boşaltıldı', s.addressTr === '', s.addressTr)
  check('örnek çalışma saati boşaltıldı', s.workingHoursTr === '', s.workingHoursTr)
  check('seedVersion sıfırlandı', s.seedVersion === null)

  check('elle yazılan metin korundu', (await prisma.localizedText.count()) === 1)
  check(
    'elle yazılan metnin içeriği bozulmadı',
    (await prisma.localizedText.findFirstOrThrow()).tr === 'Elle yazılmış başlık',
  )
  check('kullanıcının hizmeti korundu', (await prisma.service.count()) === 1)
  check(
    'kullanıcının hizmeti doğru kayıt',
    (await prisma.service.findFirstOrThrow()).slugTr === 'kendi-hizmetim',
  )

  console.log('\n— 2. tur seed (geri yükleme) —')
  await runSeed(prisma)
  s = await prisma.siteSetting.findUniqueOrThrow({ where: { id: 1 } })
  check('boşalan adres tekrar doldu', s.addressTr === settingsExample.addressTr)
  check('GERÇEK telefon yine korundu', s.phone === '+90 312 555 44 33', s.phone)
  check('metinler geri geldi', (await prisma.localizedText.count()) === 87)
  check('hizmetler geri geldi (11 = 10 örnek + 1 kendi)', (await prisma.service.count()) === 11)
  check(
    'elle yazılan metin EZİLMEDİ',
    (await prisma.localizedText.findFirstOrThrow({ where: { key: 'home.hero.title' } })).tr ===
      'Elle yazılmış başlık',
  )

  console.log(`\n${pass} geçti, ${fail} başarısız\n`)
  if (fail > 0) process.exitCode = 1
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
