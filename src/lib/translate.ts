import 'server-only'
import crypto from 'node:crypto'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from './prisma'
import { glossaryDefaults } from '@/content/defaults'

/**
 * OTOMATİK ÇEVİRİ — Türkçe kaynak, İngilizce hedef.
 *
 * Kural: Türkçe alan tek doğruluk kaynağıdır. Kaydetme anında İngilizce
 * otomatik üretilir. Admin İngilizce alana kendi eliyle dokunursa alan MANUAL
 * olur ve bir daha otomatik ezilmez.
 *
 * Model: claude-opus-5 (brief gereği). API anahtarı ANTHROPIC_API_KEY
 * ortam değişkeninden okunur, koda gömülmez.
 */

export const TRANSLATION_MODEL = 'claude-opus-5'

let client: Anthropic | null = null

export function translationConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY tanımlı değil. Railway ortam değişkenlerine ekleyin; otomatik çeviri onsuz çalışmaz.',
    )
  }
  if (!client) {
    // SDK 429/5xx için kendi içinde yeniden dener; kuyruk seviyesinde ayrıca
    // bir deneme hakkı daha var (processJob → attempts).
    client = new Anthropic({ maxRetries: 3 })
  }
  return client
}

export function hashSource(text: string): string {
  return crypto.createHash('sha256').update(text.trim()).digest('hex').slice(0, 32)
}

// ---------------------------------------------------------------------------
// Terim sözlüğü — veritabanından okunur, panelden düzenlenebilir
// ---------------------------------------------------------------------------
async function glossaryLines(): Promise<string> {
  let terms: { tr: string; en: string }[]
  try {
    const rows = await prisma.glossaryTerm.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: { tr: true, en: true },
    })
    terms = rows.length > 0 ? rows : glossaryDefaults
  } catch {
    terms = glossaryDefaults
  }
  return terms.map((t) => `  ${t.tr} = ${t.en}`).join('\n')
}

async function buildSystemPrompt(): Promise<string> {
  const glossary = await glossaryLines()
  return `Sen bir Türk hukuk bürosunun kurumsal web sitesi için Türkçe→İngilizce çeviri yapıyorsun. Kurallar:
- Resmî, kurumsal, sade hukuk İngilizcesi kullan. Reklam dili kullanma.
- Sadece çeviriyi döndür; açıklama, ön söz, tırnak ekleme.
- HTML/Markdown biçimlendirmesini ve satır yapısını aynen koru. HTML etiketlerinin
  içindeki nitelikleri (href, class, src) değiştirme; yalnızca görünen metni çevir.
- Özel isimleri (firma adı, kişi adları, adres, sokak/mahalle adları) çevirme,
  olduğu gibi bırak.
- "Av." unvanını "Att." yapma, olduğu gibi bırak.
- Telefon numarası, e-posta adresi ve sosyal medya kullanıcı adlarını değiştirme.
- Kanun adlarını ve numaralarını olduğu gibi bırak (ör. "6284 sayılı Kanun" →
  "Law No. 6284").
- Terim sözlüğüne birebir uy:
${glossary}`
}

// ---------------------------------------------------------------------------
// Tekil çeviri
// ---------------------------------------------------------------------------
export async function translateToEnglish(turkish: string): Promise<string> {
  const source = turkish.trim()
  if (!source) return ''

  const res = await getClient().messages.create({
    model: TRANSLATION_MODEL,
    max_tokens: 8000,
    system: await buildSystemPrompt(),
    // Kısa kurumsal metinler için düşük efor yeterli: hızlı ve ucuz.
    output_config: { effort: 'low' },
    messages: [{ role: 'user', content: source }],
  })

  if (res.stop_reason === 'refusal') {
    throw new Error('Çeviri modeli isteği reddetti.')
  }

  return res.content
    .filter((b): b is Extract<typeof b, { type: 'text' }> => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
}

// ---------------------------------------------------------------------------
// Toplu çeviri — tek istekte sözlük gönderilir, JSON şemayla dönülür
// ---------------------------------------------------------------------------
export async function translateBatch(
  entries: Record<string, string>,
): Promise<Record<string, string>> {
  const keys = Object.keys(entries).filter((k) => entries[k]?.trim())
  if (keys.length === 0) return {}
  if (keys.length === 1) {
    const only = keys[0]
    return { [only]: await translateToEnglish(entries[only]) }
  }

  const schema = {
    type: 'object',
    properties: Object.fromEntries(
      keys.map((k) => [k, { type: 'string', description: `"${k}" alanının İngilizce karşılığı` }]),
    ),
    required: keys,
    additionalProperties: false,
  }

  const res = await getClient().messages.create({
    model: TRANSLATION_MODEL,
    max_tokens: 16000,
    system: await buildSystemPrompt(),
    output_config: {
      effort: 'low',
      format: { type: 'json_schema', schema },
    },
    messages: [
      {
        role: 'user',
        content:
          'Aşağıdaki JSON nesnesindeki her değeri İngilizceye çevir. Anahtarları AYNEN koru, ' +
          'yalnızca değerleri çevir.\n\n' +
          JSON.stringify(Object.fromEntries(keys.map((k) => [k, entries[k]])), null, 2),
      },
    ],
  })

  if (res.stop_reason === 'refusal') {
    throw new Error('Çeviri modeli isteği reddetti.')
  }

  const raw = res.content
    .filter((b): b is Extract<typeof b, { type: 'text' }> => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Çeviri yanıtı JSON olarak çözümlenemedi.')
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Çeviri yanıtı beklenen biçimde değil.')
  }

  const out: Record<string, string> = {}
  for (const key of keys) {
    const value = (parsed as Record<string, unknown>)[key]
    if (typeof value === 'string') out[key] = value.trim()
  }
  return out
}

// ---------------------------------------------------------------------------
// Slug üretimi — İngilizce slug otomatik, panelden elle düzeltilebilir
// ---------------------------------------------------------------------------
const TR_MAP: Record<string, string> = {
  ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i', ö: 'o', Ö: 'o',
  ş: 's', Ş: 's', ü: 'u', Ü: 'u', â: 'a', î: 'i', û: 'u',
}

export function slugify(input: string): string {
  return input
    .split('')
    .map((ch) => TR_MAP[ch] ?? ch)
    .join('')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}
