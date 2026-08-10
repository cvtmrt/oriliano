/**
 * Örnek veri yükleme — komut satırı sarmalayıcısı.
 *
 *   npm run db:seed
 *
 * Asıl mantık `src/lib/seed.ts` içinde; panelin "Örnek verileri yükle"
 * düğmesi de aynı fonksiyonu çağırıyor. İdempotenttir: tekrar çalıştırmak
 * elle yapılan düzenlemeleri ezmez, yalnızca eksik kayıtları ekler.
 */
import { PrismaClient } from '@prisma/client'
import { runSeed } from '../src/lib/seed'

const prisma = new PrismaClient()

async function main() {
  console.log('Örnek veriler yükleniyor…')

  const r = await runSeed(prisma)

  console.log(
    r.settingsCreated
      ? '  ✓ Genel ayarlar oluşturuldu'
      : '  · Genel ayarlar zaten var, dokunulmadı',
  )
  console.log(`  ✓ Metinler: ${r.texts} anahtar (${r.newTexts} yeni)`)
  console.log(`  ✓ Görsel yuvaları: ${r.slots}`)
  console.log(`  ✓ Menü: ${r.menu} öğe`)
  console.log(`  ✓ Hizmetler: ${r.services}`)
  console.log(`  ✓ Ekip: ${r.team} üye (jenerik yer tutucu)`)
  console.log(`  ✓ SEO: ${r.seo} sayfa`)
  console.log(`  ✓ Terim sözlüğü: ${r.glossary} terim`)

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
