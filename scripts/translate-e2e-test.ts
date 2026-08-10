/**
 * Çeviri hattının uçtan uca testi — gerçek sağlayıcıya çıkar.
 *
 *   GEMINI_API_KEY=... npx tsx --conditions=react-server scripts/translate-e2e-test.ts
 *
 * Doğruladıkları: kuyruk → sağlayıcı çağrısı → veritabanına yazma → durum
 * geçişleri (PENDING → AUTO) → elle kilit → kilidin "yeniden çevir" ile
 * kırılması → terim sözlüğüne uyum.
 */
import { PrismaClient } from '@prisma/client'
import {
  enqueueTranslation,
  getFieldMeta,
  lockFieldManual,
  queueStats,
  runQueue,
} from '../src/lib/translation-queue'
import { providerLabel, translationConfigured } from '../src/lib/translate'

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

const KEYS = ['home.hero.eyebrow', 'about.values.1.title', 'common.cta.contact']

async function main() {
  console.log(`\nSağlayıcı: ${providerLabel()}`)
  if (!translationConfigured()) {
    console.log('Anahtar yok — test atlandı.')
    return
  }

  // İngilizceleri boşalt
  await prisma.localizedText.updateMany({ where: { key: { in: KEYS } }, data: { en: '' } })
  await prisma.fieldMeta.deleteMany({ where: { entity: 'LocalizedText' } })
  await prisma.translationJob.deleteMany({})

  const rows = await prisma.localizedText.findMany({ where: { key: { in: KEYS } } })

  console.log('\n— Sıraya alma —')
  for (const row of rows) {
    const result = await enqueueTranslation('LocalizedText', row.id, 'value', row.tr)
    check(`${row.key} sıraya alındı`, result === 'queued', result)
  }
  const before = await getFieldMeta('LocalizedText', rows[0].id)
  check('durum PENDING', before.value?.status === 'PENDING', before.value?.status)

  console.log('\n— Kuyruğu işlet (gerçek API çağrısı) —')
  const result = await runQueue(6)
  console.log(`  işlenen: ${result.processed}, başarısız: ${result.failed}`)
  check('en az bir alan çevrildi', result.processed > 0)
  check('başarısız yok', result.failed === 0)

  console.log('\n— Sonuçlar —')
  const after = await prisma.localizedText.findMany({ where: { key: { in: KEYS } } })
  for (const row of after) {
    console.log(`  ${row.key}`)
    console.log(`    TR: ${row.tr}`)
    console.log(`    EN: ${row.en}`)
    check(`${row.key} İngilizce doldu`, row.en.trim().length > 0)
    check(`${row.key} Türkçeden farklı`, row.en.trim() !== row.tr.trim())
    const meta = await getFieldMeta('LocalizedText', row.id)
    check(`${row.key} durumu AUTO`, meta.value?.status === 'AUTO', meta.value?.status)
  }

  console.log('\n— Elle kilit —')
  const target = after[0]
  await prisma.localizedText.update({ where: { id: target.id }, data: { en: 'Elle yazdığım metin' } })
  await lockFieldManual('LocalizedText', target.id, 'value')
  const locked = await getFieldMeta('LocalizedText', target.id)
  check('durum MANUAL', locked.value?.status === 'MANUAL', locked.value?.status)

  const skipped = await enqueueTranslation('LocalizedText', target.id, 'value', target.tr)
  check('MANUAL alan otomatik sıraya alınmaz', skipped === 'skipped-manual', skipped)
  await runQueue(3)
  const stillManual = await prisma.localizedText.findUniqueOrThrow({ where: { id: target.id } })
  check('elle yazılan metin EZİLMEDİ', stillManual.en === 'Elle yazdığım metin', stillManual.en)

  console.log('\n— "Yeniden çevir" kilidi kırıyor —')
  await enqueueTranslation('LocalizedText', target.id, 'value', target.tr, { force: true })
  await runQueue(3)
  const retranslated = await prisma.localizedText.findUniqueOrThrow({ where: { id: target.id } })
  check('kilit kırıldı, yeniden çevrildi', retranslated.en !== 'Elle yazdığım metin', retranslated.en)
  console.log(`    EN: ${retranslated.en}`)

  console.log('\n— Terim sözlüğü —')
  const glossaryRow = await prisma.localizedText.create({
    data: {
      key: `test.glossary.${Date.now()}`,
      group: 'test',
      label: 'Sözlük testi',
      kind: 'SHORT',
      tr: 'İcra ve İflas Hukuku alanında hizmet veriyoruz.',
    },
  })
  await enqueueTranslation('LocalizedText', glossaryRow.id, 'value', glossaryRow.tr)
  await runQueue(3)
  const translated = await prisma.localizedText.findUniqueOrThrow({ where: { id: glossaryRow.id } })
  console.log(`    EN: ${translated.en}`)
  check(
    'sözlükteki terim birebir kullanıldı',
    /Enforcement and Bankruptcy Law/i.test(translated.en),
    translated.en,
  )
  await prisma.localizedText.delete({ where: { id: glossaryRow.id } })

  console.log(`\nkuyruk: ${JSON.stringify(await queueStats())}`)
  console.log(`\n${pass} geçti, ${fail} başarısız\n`)
  if (fail > 0) process.exitCode = 1
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
