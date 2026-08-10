import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().default(''),
  subject: z.string().trim().max(160).optional().default(''),
  message: z.string().trim().min(10).max(4000),
  locale: z.enum(['tr', 'en']).optional().default('tr'),
})

// Basit hız sınırı: aynı IP dakikada 3 mesaj. Tek container için yeterli.
const hits = new Map<string, number[]>()
const WINDOW_MS = 60_000
const LIMIT = 3

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (list.length >= LIMIT) {
    hits.set(ip, list)
    return true
  }
  list.push(now)
  hits.set(ip, list)
  if (hits.size > 5000) hits.clear()
  return false
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Çok fazla deneme. Lütfen biraz sonra tekrar deneyin.' },
      { status: 429 },
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Geçersiz istek.' }, { status: 400 })
  }

  const parsed = schema.safeParse(payload)
  if (!parsed.success) {
    const locale = (payload as { locale?: string })?.locale === 'en' ? 'en' : 'tr'
    return NextResponse.json(
      {
        ok: false,
        error:
          locale === 'en'
            ? 'Please check the form fields.'
            : 'Lütfen form alanlarını kontrol edin.',
      },
      { status: 400 },
    )
  }

  const data = parsed.data

  try {
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        locale: data.locale,
        ip,
      },
    })
  } catch (err) {
    console.error('[contact] kayıt hatası:', err)
    return NextResponse.json(
      {
        ok: false,
        error:
          data.locale === 'en'
            ? 'The message could not be saved. Please try again later.'
            : 'Mesaj kaydedilemedi. Lütfen daha sonra tekrar deneyin.',
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
