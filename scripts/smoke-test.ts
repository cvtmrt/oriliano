/**
 * Geçici duman testi — medya yükleme, çeviri kuyruğu ve yetkilendirme
 * mantığını sunucudan bağımsız doğrular.
 *
 *   npx tsx scripts/smoke-test.ts
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { storeUpload, storageStatus, deleteMedia, safeFilename, resolveUploadPath } from '../src/lib/media'
import { enqueueTranslation, getFieldMeta, lockFieldManual, queueStats } from '../src/lib/translation-queue'
import { slugify } from '../src/lib/translate'
import { sanitizeHtml, htmlToText } from '../src/lib/html'
import { pick } from '../src/lib/i18n'

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

async function main() {
  console.log('\n— Depolama —')
  const storage = await storageStatus()
  check('yükleme dizini yazılabilir', storage.writable, storage.error ?? '')

  console.log('\n— Yol güvenliği —')
  check('normal dosya adı kabul', safeFilename('abc-123.webp') === 'abc-123.webp')
  check('path traversal reddedilir', safeFilename('../../etc/passwd') === null)
  check('alt dizin reddedilir', safeFilename('a/b.webp') === null)
  check('boşluklu ad reddedilir', safeFilename('kötü ad.png') === null)
  check('resolveUploadPath traversal reddeder', resolveUploadPath('../x') === null)

  console.log('\n— Görsel yükleme (sharp → WebP) —')
  const bigPng = await sharp({
    create: { width: 3200, height: 1800, channels: 3, background: { r: 30, g: 42, b: 94 } },
  })
    .png()
    .toBuffer()
  const file = new File([new Uint8Array(bigPng)], 'buyuk-gorsel.png', { type: 'image/png' })
  const stored = await storeUpload(file)
  check('WebP’ye çevrildi', stored.mimeType === 'image/webp', stored.mimeType)
  check('uzun kenar 2400’e indirildi', stored.width === 2400, String(stored.width))
  check('dosya diske yazıldı', await fs
    .access(path.join(storage.dir, stored.filename))
    .then(() => true)
    .catch(() => false))
  check('boyut küçüldü', stored.sizeBytes < bigPng.length, `${stored.sizeBytes} < ${bigPng.length}`)

  const tooBig = new File([new Uint8Array(9 * 1024 * 1024)], 'dev.png', { type: 'image/png' })
  let rejectedSize = false
  try {
    await storeUpload(tooBig)
  } catch {
    rejectedSize = true
  }
  check('8 MB üstü reddedilir', rejectedSize)

  const badType = new File([new Uint8Array([1, 2, 3])], 'zararli.exe', { type: 'application/x-msdownload' })
  let rejectedType = false
  try {
    await storeUpload(badType)
  } catch {
    rejectedType = true
  }
  check('desteklenmeyen tür reddedilir', rejectedType)

  await deleteMedia(stored.id)
  check('silinince dosya da kalkar', !(await fs
    .access(path.join(storage.dir, stored.filename))
    .then(() => true)
    .catch(() => false)))

  console.log('\n— HTML temizliği —')
  check('script sökülür', !sanitizeHtml('<p>a</p><script>alert(1)</script>').includes('script'))
  check('onclick sökülür', !sanitizeHtml('<p onclick="x()">a</p>').includes('onclick'))
  check('javascript: adres kırılır', !sanitizeHtml('<a href="javascript:x()">a</a>').includes('javascript:'))
  check('iframe sökülür', !sanitizeHtml('<iframe src="x"></iframe>').includes('iframe'))
  check('izinli etiket korunur', sanitizeHtml('<p><strong>a</strong></p>') === '<p><strong>a</strong></p>')
  check('htmlToText düz metin verir', htmlToText('<h3>Başlık</h3><p>Metin</p>') === 'Başlık Metin')

  console.log('\n— Slug üretimi (Türkçe karakterler) —')
  check('is-hukuku', slugify('İş Hukuku') === 'is-hukuku', slugify('İş Hukuku'))
  check('gayrimenkul-hukuku', slugify('Gayrimenkul Hukuku') === 'gayrimenkul-hukuku')
  check('icra-ve-iflas-hukuku', slugify('İcra ve İflas Hukuku') === 'icra-ve-iflas-hukuku', slugify('İcra ve İflas Hukuku'))
  check('ozel-karakterler', slugify('Çğıöşü ÇĞİÖŞÜ') === 'cgiosu-cgiosu', slugify('Çğıöşü ÇĞİÖŞÜ'))

  console.log('\n— Dil geri düşüşü —')
  check('EN boşsa TR gösterilir', pick('en', 'Türkçe metin', '') === 'Türkçe metin')
  check('EN doluysa EN gösterilir', pick('en', 'Türkçe', 'English') === 'English')
  check('TR her zaman TR', pick('tr', 'Türkçe', 'English') === 'Türkçe')

  console.log('\n— Çeviri kuyruğu —')
  const service = await prisma.service.findFirst({ where: { slugTr: 'is-hukuku' } })
  if (!service) {
    check('test hizmeti bulundu', false)
  } else {
    const r1 = await enqueueTranslation('Service', service.id, 'title', service.titleTr)
    check('alan sıraya alındı', r1 === 'queued', r1)

    const meta1 = await getFieldMeta('Service', service.id)
    check('durum PENDING', meta1.title?.status === 'PENDING', meta1.title?.status)

    const r2 = await enqueueTranslation('Service', service.id, 'title', service.titleTr)
    check('aynı metin tekrar sıraya alınmaz', r2 !== 'queued', r2)

    await lockFieldManual('Service', service.id, 'title')
    const meta2 = await getFieldMeta('Service', service.id)
    check('elle kilit MANUAL yapar', meta2.title?.status === 'MANUAL', meta2.title?.status)

    const r3 = await enqueueTranslation('Service', service.id, 'title', 'Değişmiş başlık')
    check('MANUAL alan otomatik ezilmez', r3 === 'skipped-manual', r3)

    const r4 = await enqueueTranslation('Service', service.id, 'title', 'Değişmiş başlık', { force: true })
    check('"Yeniden çevir" kilidi kırar', r4 === 'queued', r4)

    const r5 = await enqueueTranslation('Service', service.id, 'excerpt', '   ')
    check('boş kaynak sıraya alınmaz', r5 === 'skipped-empty', r5)

    // Test artıklarını temizle
    await prisma.translationJob.deleteMany({ where: { entity: 'Service', entityId: service.id } })
    await prisma.fieldMeta.deleteMany({ where: { entity: 'Service', entityId: service.id } })
  }

  const stats = await queueStats()
  check('API anahtarı yokken kuyruk sessizce durur', stats.configured === Boolean(process.env.ANTHROPIC_API_KEY))

  console.log('\n— Şifre karması —')
  const hash = bcrypt.hashSync('DogruSifre12345', 12)
  check('doğru şifre eşleşir', bcrypt.compareSync('DogruSifre12345', hash))
  check('yanlış şifre eşleşmez', !bcrypt.compareSync('YanlisSifre', hash))

  console.log('\n— Veri bütünlüğü —')
  const [texts, slots, services, team, seo, menu, glossary] = await Promise.all([
    prisma.localizedText.count(),
    prisma.mediaSlot.count(),
    prisma.service.count(),
    prisma.teamMember.count(),
    prisma.seoMeta.count(),
    prisma.menuItem.count(),
    prisma.glossaryTerm.count(),
  ])
  check('87 metin', texts === 87, String(texts))
  check('12 görsel yuvası', slots === 12, String(slots))
  check('10 hizmet', services === 10, String(services))
  check('4 ekip üyesi', team === 4, String(team))
  check('8 SEO kaydı', seo === 8, String(seo))
  check('8 menü öğesi', menu === 8, String(menu))
  check('25 terim', glossary === 25, String(glossary))

  const pubMenu = await prisma.menuItem.findUnique({ where: { routeKey: 'publications' } })
  check('Yayınlar menüden KAPALI geliyor', pubMenu?.visible === false)

  const noAvukatlikOrtakligi = await prisma.localizedText.count({
    where: { OR: [{ tr: { contains: 'Ortaklığı' } }, { en: { contains: 'Partnership' } }] },
  })
  check('"Avukatlık Ortaklığı" ifadesi yok', noAvukatlikOrtakligi === 0, String(noAvukatlikOrtakligi))

  // Mesajın var olduğunu varsaymak yerine kendimiz oluşturup doğruluyoruz.
  const created = await prisma.contactMessage.create({
    data: {
      name: 'Duman Testi',
      email: 'duman@example.com',
      message: 'Bu kayıt duman testi tarafından oluşturuldu ve hemen silinir.',
    },
  })
  const found = await prisma.contactMessage.findUnique({ where: { id: created.id } })
  check('iletişim mesajı kaydedilip okunabiliyor', found?.name === 'Duman Testi')
  check('yeni mesaj okunmamış geliyor', found?.read === false)
  await prisma.contactMessage.delete({ where: { id: created.id } })
  check('mesaj silinebiliyor', (await prisma.contactMessage.findUnique({ where: { id: created.id } })) === null)

  console.log(`\n${pass} geçti, ${fail} başarısız\n`)
  if (fail > 0) process.exitCode = 1
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
