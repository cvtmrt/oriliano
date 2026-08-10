import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  enqueueEntity,
  enqueueTranslation,
  entitySpecs,
  kickQueue,
  queueStats,
  runQueue,
  type EntityName,
} from '@/lib/translation-queue'
import { providerLabel, translateToEnglish, translationConfigured } from '@/lib/translate'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Panelin çeviri uç noktası.
 *  - action: 'field'  → tek alanı yeniden çevir (kilidi kırar)
 *  - action: 'entity' → bir kaydın tüm alanlarını yeniden çevir
 *  - action: 'tick'   → kuyruğu bir tur işlet (panel yoklaması)
 */
export async function POST(request: Request) {
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ ok: false, error: 'Yetkisiz.' }, { status: 401 })

  let body: { action?: string; entity?: string; entityId?: string; field?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Geçersiz istek.' }, { status: 400 })
  }

  const entity = body.entity as EntityName | undefined

  if (body.action === 'tick') {
    const result = await runQueue(4)
    return NextResponse.json({ ok: true, ...result, ...(await queueStats()) })
  }

  // Panelden tek tıkla bağlantı testi: küçük bir cümle çevirir.
  // API anahtarı ve model erişimi doğru mu, kuyruğa dokunmadan görülür.
  if (body.action === 'test') {
    if (!translationConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Çeviri sağlayıcısı tanımlı değil. GEMINI_API_KEY (ücretsiz katman) veya ANTHROPIC_API_KEY ekleyin.',
        },
        { status: 400 },
      )
    }
    const sample = 'İş Hukuku alanında müvekkillerimize danışmanlık ve dava takibi hizmeti veriyoruz.'
    try {
      const translated = await translateToEnglish(sample)
      return NextResponse.json({ ok: true, source: sample, translated, provider: providerLabel() })
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: (err as Error).message.slice(0, 300) },
        { status: 502 },
      )
    }
  }

  if (!entity || !entitySpecs[entity] || !body.entityId) {
    return NextResponse.json({ ok: false, error: 'Eksik parametre.' }, { status: 400 })
  }

  if (body.action === 'entity') {
    const count = await enqueueEntity(entity, body.entityId, { force: true })
    kickQueue()
    return NextResponse.json({ ok: true, queued: count })
  }

  if (body.action === 'field') {
    const field = body.field
    if (!field || !entitySpecs[entity].fields.includes(field)) {
      return NextResponse.json({ ok: false, error: 'Geçersiz alan.' }, { status: 400 })
    }

    const spec = entitySpecs[entity]
    const row = await spec.read(body.entityId)
    if (!row) return NextResponse.json({ ok: false, error: 'Kayıt bulunamadı.' }, { status: 404 })

    const source = String(row[spec.columns(field).tr] ?? '')
    if (!source.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Türkçe alan boş — çevrilecek bir şey yok.' },
        { status: 400 },
      )
    }

    await enqueueTranslation(entity, body.entityId, field, source, { force: true })
    kickQueue()
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: false, error: 'Bilinmeyen işlem.' }, { status: 400 })
}

export async function GET() {
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ ok: false, error: 'Yetkisiz.' }, { status: 401 })

  const stats = await queueStats()
  const failed = await prisma.fieldMeta.count({ where: { status: 'FAILED' } })
  return NextResponse.json({ ok: true, ...stats, failed })
}
