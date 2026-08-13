import 'server-only'
import nodemailer, { type Transporter } from 'nodemailer'

/**
 * E-POSTA GÖNDERİMİ — SMTP veya Resend
 *
 * İKİ SAĞLAYICI DESTEKLENİYOR:
 *
 *   smtp    — SMTP_HOST/PORT/USER/PASS. Firmanın kendi posta kutusundan
 *             gönderir (Turhost). DNS'e dokunmak gerekmez, alan adı zaten
 *             o sunucuda barınıyor; SPF de hâlihazırda Turhost'u yetkilendiriyor,
 *             yani postalar spam'e düşmeden gider. Varsayılan tercih.
 *   resend  — RESEND_API_KEY. Ayrı bir servis; alan adı doğrulaması için
 *             DNS'e DKIM kaydı eklemek gerekir.
 *
 * İkisi de tanımlıysa SMTP kullanılır. Hiçbiri tanımlı değilse gönderim
 * sessizce atlanır — form yine çalışır ve mesaj panelin gelen kutusuna düşer.
 * Panelde bu durum uyarı olarak görünür.
 *
 * Sır/anahtar ayrımı bilinçli: şifreler ve anahtarlar yalnızca ortam
 * değişkeninde durur, veritabanına ve panele yazılmaz. Kime gideceği,
 * açık/kapalı olması ve otomatik yanıt metni ise panelden yönetilir —
 * bunlar sır değil, günlük ayar.
 */

export const MAIL_FROM_FALLBACK = 'Çetiner Hukuk <onboarding@resend.dev>'

export type MailProvider = 'smtp' | 'resend'

function smtpHost(): string {
  return process.env.SMTP_HOST?.trim() || ''
}

export function activeMailProvider(): MailProvider | null {
  if (smtpHost()) return 'smtp'
  if (process.env.RESEND_API_KEY) return 'resend'
  return null
}

export function mailConfigured(): boolean {
  return activeMailProvider() !== null
}

/** Panelde göstermek için okunabilir ad. */
export function mailProviderLabel(): string {
  const provider = activeMailProvider()
  if (provider === 'smtp') return `Kendi posta sunucunuz (${smtpHost()})`
  if (provider === 'resend') return 'Resend'
  return 'kapalı'
}

export function mailFrom(): string {
  const explicit = process.env.MAIL_FROM?.trim()
  if (explicit) return explicit
  // SMTP'de gönderen, kimlik doğrulanan kutuyla aynı olmalı — sunucular
  // başka bir adresten göndermeyi çoğunlukla reddeder.
  const user = process.env.SMTP_USER?.trim()
  if (smtpHost() && user) return `Çetiner Hukuk <${user}>`
  return MAIL_FROM_FALLBACK
}

export interface SendResult {
  ok: boolean
  error?: string
  id?: string
}

// Bağlantı havuzu: her mesajda yeni TLS el sıkışması yapmak yerine açık
// bağlantı yeniden kullanılıyor.
let transporter: Transporter | null = null

function getTransporter(): Transporter {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465)
    transporter = nodemailer.createTransport({
      host: smtpHost(),
      port,
      // 465 örtük TLS ister; 587 düz başlayıp STARTTLS'e yükselir.
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER?.trim() || '',
        pass: process.env.SMTP_PASS || '',
      },
      pool: true,
      maxConnections: 2,
      connectionTimeout: 15_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    })
  }
  return transporter
}

async function sendViaSmtp(options: {
  to: string[]
  subject: string
  text: string
  html?: string
  replyTo?: string
}): Promise<SendResult> {
  try {
    const info = await getTransporter().sendMail({
      from: mailFrom(),
      to: options.to,
      subject: options.subject,
      text: options.text,
      ...(options.html ? { html: options.html } : {}),
      ...(options.replyTo ? { replyTo: options.replyTo } : {}),
    })
    return { ok: true, id: info.messageId }
  } catch (err) {
    return { ok: false, error: (err as Error).message.slice(0, 250) }
  }
}

export async function sendMail(options: {
  to: string[]
  subject: string
  text: string
  html?: string
  replyTo?: string
}): Promise<SendResult> {
  const provider = activeMailProvider()
  if (!provider) {
    return { ok: false, error: 'E-posta gönderimi yapılandırılmamış.' }
  }

  const to = options.to.map((t) => t.trim()).filter(Boolean)
  if (to.length === 0) return { ok: false, error: 'Alıcı adresi yok.' }

  if (provider === 'smtp') {
    return sendViaSmtp({ ...options, to })
  }

  const key = process.env.RESEND_API_KEY as string

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
