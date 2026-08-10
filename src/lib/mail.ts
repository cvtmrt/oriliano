import 'server-only'

/**
 * E-POSTA GÖNDERİMİ — Resend
 *
 * Ek paket yok, resmî REST uç noktasına `fetch` ile gidiliyor.
 *
 * Sır/anahtar ayrımı bilinçli:
 *   - `RESEND_API_KEY` ve `MAIL_FROM` ortam değişkeninde durur. Anahtarı
 *     veritabanına ve panele koymuyoruz.
 *   - Kime gideceği, açık/kapalı olması ve otomatik yanıt metni panelden
 *     yönetilir; bunlar sır değil, günlük ayar.
 *
 * Anahtar tanımlı değilse gönderim sessizce atlanır — form yine çalışır ve
 * mesaj panelin gelen kutusuna düşer. Panelde bu durum uyarı olarak görünür.
 */

export const MAIL_FROM_FALLBACK = 'Çetiner Hukuk <onboarding@resend.dev>'

export function mailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

export function mailFrom(): string {
  return process.env.MAIL_FROM?.trim() || MAIL_FROM_FALLBACK
}

export interface SendResult {
  ok: boolean
  error?: string
  id?: string
}

export async function sendMail(options: {
  to: string[]
  subject: string
  text: string
  html?: string
  replyTo?: string
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY
  if (!key) return { ok: false, error: 'RESEND_API_KEY tanımlı değil.' }

  const to = options.to.map((t) => t.trim()).filter(Boolean)
  if (to.length === 0) return { ok: false, error: 'Alıcı adresi yok.' }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: mailFrom(),
        to,
        subject: options.subject,
        text: options.text,
        ...(options.html ? { html: options.html } : {}),
        ...(options.replyTo ? { reply_to: options.replyTo } : {}),
      }),
    })

    if (!res.ok) {
      const detail = (await res.text().catch(() => '')).slice(0, 300)
      return { ok: false, error: `${res.status} ${detail}` }
    }

    const json = (await res.json().catch(() => ({}))) as { id?: string }
    return { ok: true, id: json.id }
  } catch (err) {
    return { ok: false, error: (err as Error).message.slice(0, 200) }
  }
}

/** Panelin adres listesini ayrıştırır: "a@x.com, b@y.com" → ["a@x.com","b@y.com"] */
export function parseRecipients(value: string): string[] {
  return value
    .split(/[,;\n]/)
    .map((v) => v.trim())
    .filter((v) => v.includes('@'))
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Gelen form mesajı için bildirim gövdesi. */
export function contactNotificationBody(message: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  locale: string
  panelUrl: string
}): { text: string; html: string } {
  const rows: [string, string][] = [
    ['Ad Soyad', message.name],
    ['E-posta', message.email],
    ['Telefon', message.phone || '—'],
    ['Konu', message.subject || '—'],
    ['Dil', message.locale.toUpperCase()],
  ]

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    `\n\nMesaj:\n${message.message}\n\nPanel: ${message.panelUrl}`

  const html = `
<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#2A2A2A;line-height:1.6">
  <h2 style="margin:0 0 16px;font-size:18px;color:#1E2A5E">Web sitesinden yeni mesaj</h2>
  <table style="border-collapse:collapse;font-size:14px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 16px 4px 0;color:#6B7488">${escapeHtml(k)}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
      )
      .join('')}
  </table>
  <p style="margin:20px 0 6px;color:#6B7488;font-size:13px">Mesaj</p>
  <div style="white-space:pre-line;border-left:3px solid #1E2A5E;padding:8px 0 8px 14px;font-size:14px">${escapeHtml(
    message.message,
  )}</div>
  <p style="margin-top:24px;font-size:13px">
    <a href="${escapeHtml(message.panelUrl)}" style="color:#1E2A5E">Panelde aç</a>
  </p>
</div>`.trim()

  return { text, html }
}
