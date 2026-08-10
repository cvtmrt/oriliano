import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { mailConfigured, parseRecipients, sendMail } from '@/lib/mail'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Panelden tek tıkla bildirim e-postasını dener. */
export async function POST() {
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ ok: false, error: 'Yetkisiz.' }, { status: 401 })

  if (!mailConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'RESEND_API_KEY tanımlı değil. Railway ortam değişkenlerine ekleyin.' },
      { status: 400 },
    )
  }

  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } })
  const recipients = parseRecipients(settings?.notifyEmail || settings?.email || '')
  if (recipients.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'Bildirim adresi boş. Önce bir e-posta girip kaydedin.' },
      { status: 400 },
    )
  }

  const result = await sendMail({
    to: recipients,
    subject: 'Test — web sitesi bildirimi çalışıyor',
    text:
      'Bu bir test mesajıdır.\n\n' +
      'Bu e-postayı aldıysanız iletişim formu bildirimleri doğru kurulmuş demektir. ' +
      'Ziyaretçi form doldurduğunda buraya aynı şekilde bildirim gelecek.',
  })

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 })
  }
  return NextResponse.json({ ok: true, to: recipients })
}
