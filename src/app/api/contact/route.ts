import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { contactNotificationBody, mailConfigured, parseRecipients, sendMail } from '@/lib/mail'
import { pick } from '@/lib/i18n'

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

  let saved
  try {
    saved = await prisma.contactMessage.create({
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

  // Bildirim gönderimi mesajın kaydından SONRA ve isteği BLOKLAMADAN yapılır:
  // e-posta sağlayıcısı yavaşsa ya da düşerse ziyaretçi beklemesin, mesaj da
  // kaybolmasın — o zaten veritabanında.
  void notify(saved.id, data).catch((err) => console.error('[contact] bildirim:', err))

  return NextResponse.json({ ok: true })
}

async function notify(
  id: string,
  data: { name: string; email: string; phone: string; subject: string; message: string; locale: 'tr' | 'en' },
): Promise<void> {
  if (!mailConfigured()) return

  let settings
  try {
    settings = await prisma.siteSetting.findUnique({ where: { id: 1 } })
  } catch {
    return
  }
  if (!settings) return

  const base = (settings.baseUrl?.trim() || '').replace(/\/$/, '')

  // 1) Büroya bildirim
  if (settings.notifyEnabled) {
    const recipients = parseRecipients(settings.notifyEmail || settings.email || '')
    if (recipients.length > 0) {
      const body = contactNotificationBody({
        ...data,
        panelUrl: `${base}/admin/messages`,
      })
      const result = await sendMail({
        to: recipients,
        subject: `Web sitesi mesajı — ${data.name}${data.subject ? ` · ${data.subject}` : ''}`,
        text: body.text,
        html: body.html,
        // Yanıtla'ya basınca doğrudan ziyaretçiye gitsin
        replyTo: data.email,
      })
      if (!result.ok) console.error('[contact] bildirim gönderilemedi:', result.error, id)
    }
  }

  // 2) Ziyaretçiye otomatik yanıt (varsayılan kapalı — kendi alan adınız
  //    doğrulanmadan gönderim reddedilebilir)
  if (settings.autoReplyEnabled) {
    const body = pick(data.locale, settings.autoReplyTr, settings.autoReplyEn).trim()
    if (body) {
      const siteName = pick(data.locale, settings.siteNameTr, settings.siteNameEn)
      const result = await sendMail({
        to: [data.email],
        subject:
          data.locale === 'en'
            ? `We received your message — ${siteName}`
            : `Mesajınızı aldık — ${siteName}`,
        text: body,
        replyTo: settings.email || undefined,
      })
      if (!result.ok) console.error('[contact] otomatik yanıt gönderilemedi:', result.error, id)
    }
  }
}
