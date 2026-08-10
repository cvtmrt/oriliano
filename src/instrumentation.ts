/**
 * Sunucu ilk açılışında bir kez çalışır (Next.js instrumentation kancası).
 *
 * `SEED_ON_BOOT=true` ise örnek içeriği yükler. Railway gibi veritabanının
 * yalnızca özel ağdan erişilebildiği platformlarda dışarıdan seed atılamadığı
 * için ilk kurulumu bu çözüyor.
 *
 * Seed idempotent olduğu için değişken açık kalsa bile zarar vermez; yine de
 * ilk açılıştan sonra `false` yapmak gereksiz sorguyu önler.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (process.env.SEED_ON_BOOT !== 'true') return

  try {
    const { prisma } = await import('@/lib/prisma')
    const { runSeed } = await import('@/lib/seed')
    const result = await runSeed(prisma)
    console.log(
      `[seed] açılışta yüklendi: ${result.texts} metin (${result.newTexts} yeni), ` +
        `${result.services} hizmet, ${result.team} ekip üyesi`,
    )
  } catch (err) {
    // Seed başarısız olsa da sunucu ayağa kalksın; panel uyarıyı gösterir.
    console.error('[seed] açılışta yüklenemedi:', (err as Error).message)
  }
}
