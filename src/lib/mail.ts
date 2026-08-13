import 'server-only'
import { randomUUID } from 'crypto'
import nodemailer, { type Transporter } from 'nodemailer'

/**
 * E-POSTA BİLDİRİMİ — IMAP, SMTP veya Resend
 *
 * ÜÇ YOL DESTEKLENİYOR:
 *
 *   imap    — IMAP_HOST/USER/PASS. Mesajı GÖNDERMİYOR, doğrudan firmanın
 *             kendi posta kutusunun içine yazıyor. Outlook'ta normal bir gelen
 *             mail gibi görünüyor.
 *
 *             Neden var: bulut sağlayıcıları spam'i önlemek için giden SMTP
 *             bağlantılarını kapatıyor (Railway de kapatıyor — 465 ve 587'ye
 *             yapılan bağlantılar zaman aşımına uğruyor). IMAP portu genelde
 *             açık kalıyor. Bu yolda mesaj Turhost'un dışına hiç çıkmıyor:
 *             ne üçüncü taraf, ne yurt dışına aktarım, ne SPF/DKIM derdi.
 *             Bir hukuk bürosu için en temiz seçenek bu.
 *
 *   smtp    — SMTP_HOST/PORT/USER/PASS. Klasik gönderim. Sağlayıcı giden
 *             bağlantıya izin veriyorsa en doğal yol.
 *
 *   resend  — RESEND_API_KEY. HTTPS üzerinden gönderdiği için hiçbir port
 *             engeline takılmıyor, ama mesaj üçüncü bir şirketin sunucusundan
 *             geçiyor.
 *
 * Birden fazlası tanımlıysa sıra yukarıdaki gibi: önce IMAP, sonra SMTP,
 * sonra Resend. Hiçbiri yoksa gönderim sessizce atlanır — form yine çalışır ve
 * mesaj panelin gelen kutusuna düşer. Panelde bu durum uyarı olarak görünür.
 *
 * Sır/anahtar ayrımı bilinçli: şifreler ve anahtarlar yalnızca ortam
 * değişkeninde durur, veritabanına ve panele yazılmaz. Kime gideceği,
 * açık/kapalı olması ve otomatik yanıt metni ise panelden yönetilir —
 * bunlar sır değil, günlük ayar.
 */

export const MAIL_FROM_FALLBACK = 'Çetiner Hukuk <onboarding@resend.dev>'

export type MailProvider = 'imap' | 'smtp' | 'resend'

function smtpHost(): string {
  return process.env.SMTP_HOST?.trim() || ''
}

function imapHost(): string {
  return process.env.IMAP_HOST?.trim() || ''
}

/** IMAP kimlik bilgileri verilmemişse SMTP'dekiler kullanılır — aynı kutu. */
function imapUser(): string {
  return process.env.IMAP_USER?.trim() || process.env.SMTP_USER?.trim() || ''
}

function imapPass(): string {
  return process.env.IMAP_PASS || process.env.SMTP_PASS || ''
}

export function activeMailProvider(): MailProvider | null {
  if (imapHost() && imapUser()) return 'imap'
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
  if (provider === 'imap') return `Doğrudan posta kutunuza (${imapUser()})`
  if (provider === 'smtp') return `Kendi posta sunucunuz (${smtpHost()})`
  if (provider === 'resend') return 'Resend'
  return 'kapalı'
}

/**
 * IMAP yolunda bildirim, kimlik doğrulanan kutunun içine yazılıyor. Yani
 * "kime gidecek" sorusunun cevabı paneldeki adres değil, bu kutu. Panelde
 * doğru bilgiyi göstermek için dışarı veriliyor.
 */
export function imapMailbox(): string | null {
  return activeMailProvider() === 'imap' ? imapUser() : null
}

export function mailFrom(): string {
  const explicit = process.env.MAIL_FROM?.trim()
  if (explicit) return explicit
  // SMTP'de gönderen, kimlik doğrulanan kutuyla aynı olmalı — sunucular
  // başka bir adresten göndermeyi çoğunlukla reddeder. IMAP'ta teslim eden
  // biz olduğumuz için böyle bir zorunluluk yok, yine de tutarlı duruyor.
  const user = imapUser() || process.env.SMTP_USER?.trim()
  if ((imapHost() || smtpHost()) && user) return `Çetiner Hukuk <${user}>`
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

/**
 * MESAJIN KENDİSİ — neden elle kuruluyor
 *
 * Bu iş önce nodemailer'ın MailComposer'ına yaptırılıyordu. O, gövdeyi
 * quoted-printable'a çeviriyor: "Koç" → "Ko=C3=A7", `style="..."` →
 * `style=3D"..."`. Kurallara uygun bir mesaj ve giden posta için doğru olan
 * da bu. Ama kutuya doğrudan yazılan bu mesajlarda Outlook kodlamayı
 * çözmüyor, gövdeyi ham hâliyle gösteriyordu — Türkçe harfler ve HTML
 * etiketleri okunmaz hâldeydi. (Sunucu tarafı doğruydu: hem ham kaynak hem
 * IMAP'in bildirdiği gövde yapısı "quoted-printable" diyordu, sunucunun
 * kendi çözümü de düzgün çalışıyordu.)
 *
 * Çözüm kodlamayı düzeltmek değil, hiç kodlamamak: IMAP bağlantısı 8 bit
 * temiz olduğu için gövde olduğu gibi UTF-8 yazılıp `8bit` deniyor. Ortada
 * çözülecek bir şey kalmayınca hangi istemci olursa olsun doğru görüyor.
 *
 * Bu yalnızca IMAP yolunda geçerli. SMTP'de nodemailer'ın kendi kodlaması
 * kullanılmaya devam ediyor; orada sunucu 8 bit kabul etmeyebilir.
 */

/** Başlıkta ASCII dışı karakter varsa RFC 2047 ile kodlar (Subject, ad soyad). */
function encodeHeaderValue(value: string): string {
  if (!/[^ -~]/.test(value)) return value

  // Kodlanmış her parça en fazla 75 karakter olabilir; `=?UTF-8?B?` + `?=`
  // payı düşülünce base64'e 60 karakter kalıyor, o da 45 bayt ham veri.
  const words: string[] = []
  let chunk = ''
  for (const char of value) {
    if (Buffer.byteLength(chunk + char) > 45) {
      words.push(chunk)
      chunk = ''
    }
    chunk += char
  }
  if (chunk) words.push(chunk)

  // Katlanan satırın devamı boşlukla başlar.
  return words.map((w) => `=?UTF-8?B?${Buffer.from(w, 'utf8').toString('base64')}?=`).join('\r\n ')
}

/** "Çetiner Hukuk <info@x.com>" → görünen ad kodlanır, adres olduğu gibi kalır. */
function encodeAddressValue(value: string): string {
  const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/)
  if (!match) return value
  const [, name, address] = match
  if (!name) return `<${address}>`
  return `${encodeHeaderValue(name.replace(/^"|"$/g, ''))} <${address}>`
}

/**
 * Satırlar 998 baytı geçemez (RFC 5322). Kodlama kullanmadığımız için bunu
 * kendimiz gözetiyoruz: uzun satırlar boşluktan bölünüyor. HTML'de boşluk
 * zaten anlamsız; düz metinde de uzun paragrafın sarılması normal görünür.
 */
function wrapLongLines(body: string, limit = 900): string {
  return body
    .split('\n')
    .map((line) => {
      if (Buffer.byteLength(line) <= limit) return line
      const out: string[] = []
      let current = ''
      for (const word of line.split(' ')) {
        if (current && Buffer.byteLength(`${current} ${word}`) > limit) {
          out.push(current)
          current = word
        } else {
          current = current ? `${current} ${word}` : word
        }
      }
      if (current) out.push(current)
      return out.join('\n')
    })
    .join('\n')
}

function rfc5322Date(date: Date): string {
  // "Thu, 13 Aug 2026 14:02:52 GMT" → sondaki bölge adı sayıya çevriliyor.
  return date.toUTCString().replace(/GMT$/, '+0000')
}

function buildMimeMessage(options: {
  from: string
  to: string[]
  subject: string
  text: string
  html?: string
  replyTo?: string
}): Buffer {
  const crlf = (value: string) => wrapLongLines(value).replace(/\r?\n/g, '\r\n')
  const domain = options.from.match(/@([^>\s]+)/)?.[1] || 'localhost'
  const address = options.from.match(/<([^>]+)>/)?.[1] || options.from
  const now = new Date()

  /**
   * Teslim izleri — mesaj önemsiz klasörüne düşmesin diye.
   *
   * Normal bir mail posta sunucusundan geçerken `Received` ve `Return-Path`
   * kazanır. Biz kutuya doğrudan yazdığımız için bunlar hiç oluşmuyordu;
   * üstüne gönderen ile alıcı da aynı adres. Outlook'un filtresi bu ikisini
   * birlikte görünce mesajı sahtecilik sanıp önemsize atıyor.
   *
   * Aşağıdaki satırlar uydurma değil, mesajın gerçek yolunu anlatıyor: siteden
   * üretildi, kutuya IMAP ile bırakıldı. Kendi kutumuza kendi yazdığımızı
   * dürüstçe söylemek, hiçbir iz bırakmamaktan hem daha doğru hem daha güvenli.
   */
  const trace = [
    `Received: by ${domain} (web sitesi iletisim formu) with IMAP; ${rfc5322Date(now)}`,
    `Return-Path: <${address}>`,
    `X-Mailer: ${domain} iletisim formu`,
  ]

  const headers = [
    ...trace,
    `From: ${encodeAddressValue(options.from)}`,
    `To: ${options.to.join(', ')}`,
    ...(options.replyTo ? [`Reply-To: ${options.replyTo}`] : []),
    `Subject: ${encodeHeaderValue(options.subject)}`,
    `Date: ${rfc5322Date(now)}`,
    `Message-ID: <${randomUUID()}@${domain}>`,
    'MIME-Version: 1.0',
  ]

  if (!options.html) {
    return Buffer.from(
      [
        ...headers,
        'Content-Type: text/plain; charset=utf-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        crlf(options.text),
        '',
      ].join('\r\n'),
      'utf8',
    )
  }

  // Sınır dizgisi gövdede rastlanamayacak kadar benzersiz olmalı.
  const boundary = `=_cetiner_${randomUUID()}`
  return Buffer.from(
    [
      ...headers,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      crlf(options.text),
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=utf-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      crlf(options.html),
      '',
      `--${boundary}--`,
      '',
    ].join('\r\n'),
    'utf8',
  )
}

/**
 * IMAP ile doğrudan kutuya bırakma.
 *
 * Mesaj bir posta sunucusuna teslim edilmiyor; MIME olarak kurulup kutunun
 * INBOX'ına ekleniyor. Okunmamış işaretleniyor ki Outlook'ta yeni mail gibi
 * belirsin. Zaman aşımı bilinçli olarak kısa: bağlantı engelliyse formun
 * yanıtını bekletmenin anlamı yok, mesaj zaten panele kaydedilmiş oluyor.
 */
async function deliverViaImap(options: {
  to: string[]
  subject: string
  text: string
  html?: string
  replyTo?: string
}): Promise<SendResult> {
  const { ImapFlow } = await import('imapflow')

  const raw = buildMimeMessage({ ...options, from: mailFrom() })

  const client = new ImapFlow({
    host: imapHost(),
    port: Number(process.env.IMAP_PORT || 993),
    secure: true,
    auth: { user: imapUser(), pass: imapPass() },
    logger: false,
    // Bağlantı engelliyse hızlı vazgeç.
    socketTimeout: 20_000,
    greetingTimeout: 12_000,
    connectionTimeout: 12_000,
  })

  try {
    await client.connect()
    // Kutu içi tarih de veriliyor; yoksa sunucunun saati esas alınır ve
    // sıralama mesajın kendi tarihinden kayabilir.
    const result = await client.append('INBOX', raw, [], new Date())
    return { ok: true, id: result && 'uid' in result ? String(result.uid) : undefined }
  } catch (err) {
    return { ok: false, error: (err as Error).message.slice(0, 250) }
  } finally {
    await client.logout().catch(() => undefined)
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

  if (provider === 'imap') {
    return deliverViaImap({ ...options, to })
  }

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
