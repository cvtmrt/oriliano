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
 * İKİ SAĞLAYICI DESTEKLENİYOR:
 *
 *   gemini    — GEMINI_API_KEY. Ücretsiz katmanı var, bu boyuttaki bir site
 *               için fazlasıyla yeterli. Varsayılan tercih.
 *   anthropic — ANTHROPIC_API_KEY, model claude-opus-5. Kullandıkça öde.
 *
 * Hangisi seçileceği TRANSLATION_PROVIDER ile zorlanabilir; verilmezse hangi
 * anahtar tanımlıysa o kullanılır (ikisi de varsa Gemini). Anahtarlar koda
 * gömülmez, yalnızca ortam değişkeninden okunur.
 */

export type Provider = 'gemini' | 'anthropic'

export const ANTHROPIC_MODEL = 'claude-opus-5'
/** Gemini model adları zamanla değişiyor; env ile geçersiz kılınabilir. */
export const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash'
/**
 * İstenen model bulunamazsa (404) sırayla bunlar denenir.
 * `*-latest` takma adları Google tarafından güncel tutuluyor, bu yüzden
 * sürüm numarası vermek yerine onlara düşüyoruz — model emekliye ayrılsa da
 * çeviri durmaz. (gemini-1.5-flash artık 404 veriyor, bu yüzden listede yok.)
 */
const GEMINI_FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest']

let client: Anthropic | null = null

export function activeProvider(): Provider | null {
  const forced = process.env.TRANSLATION_PROVIDER?.trim().toLowerCase()
  if (forced === 'gemini') return process.env.GEMINI_API_KEY ? 'gemini' : null
  if (forced === 'anthropic') return process.env.ANTHROPIC_API_KEY ? 'anthropic' : null
  if (process.env.GEMINI_API_KEY) return 'gemini'
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic'
  return null
}

export function translationConfigured(): boolean {
  return activeProvider() !== null
}

/** Panelde göstermek için okunabilir ad. */
export function providerLabel(): string {
  const provider = activeProvider()
  if (provider === 'gemini') return `Google Gemini (${GEMINI_MODEL})`
  if (provider === 'anthropic') return `Anthropic (${ANTHROPIC_MODEL})`
  return 'kapalı'
}

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY tanımlı değil.')
  }
  if (!client) {
    // SDK 429/5xx için kendi içinde yeniden dener; kuyruk seviyesinde ayrıca
    // bir deneme hakkı daha var (runQueue → attempts).
    client = new Anthropic({ maxRetries: 3 })
  }
  return client
}

// ---------------------------------------------------------------------------
// Gemini — resmî REST uç noktası, ek bağımlılık yok
// ---------------------------------------------------------------------------
async function geminiGenerate(
  system: string,
  user: string,
  options: { json?: boolean; maxTokens?: number } = {},
): Promise<string> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY tanımlı değil.')

  const body = {
    system_instruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: [{ text: user }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: options.maxTokens ?? 8192,
      ...(options.json ? { responseMimeType: 'application/json' } : {}),
    },
  }

  const models = [GEMINI_MODEL, ...GEMINI_FALLBACK_MODELS.filter((m) => m !== GEMINI_MODEL)]
  let lastError = ''

  for (const model of models) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(body),
      },
    )

    if (res.ok) {
      const json = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[]
        promptFeedback?: { blockReason?: string }
      }
      if (json.promptFeedback?.blockReason) {
        throw new Error(`Gemini isteği reddetti: ${json.promptFeedback.blockReason}`)
      }
      const text = (json.candidates?.[0]?.content?.parts ?? [])
        .map((p) => p.text ?? '')
        .join('')
        .trim()
      if (!text) throw new Error('Gemini boş yanıt döndürdü.')
      return text
    }

    const detail = (await res.text().catch(() => '')).slice(0, 300)
    lastError = `${res.status} ${detail}`
    // Model adı yanlışsa bir sonrakini dene; başka hatada hemen çık.
    if (res.status !== 404) break
  }

  throw new Error(`Gemini çağrısı başarısız: ${lastError}`)
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

  const provider = activeProvider()
  if (!provider) {
    throw new Error(
      'Çeviri sağlayıcısı tanımlı değil. GEMINI_API_KEY (ücretsiz katman) veya ' +
        'ANTHROPIC_API_KEY ortam değişkenlerinden birini ekleyin.',
    )
  }

  const system = await buildSystemPrompt()

  if (provider === 'gemini') {
    return geminiGenerate(system, source, { maxTokens: 8192 })
  }

  const res = await getClient().messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 8000,
    system,
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

  const system = await buildSystemPrompt()
  const userContent =
    'Aşağıdaki JSON nesnesindeki her değeri İngilizceye çevir. Anahtarları AYNEN koru, ' +
    'yalnızca değerleri çevir.\n\n' +
    JSON.stringify(Object.fromEntries(keys.map((k) => [k, entries[k]])), null, 2)

  const provider = activeProvider()
  if (!provider) {
    throw new Error('Çeviri sağlayıcısı tanımlı değil.')
  }

  if (provider === 'gemini') {
    const raw = await geminiGenerate(
      system,
      userContent + '\n\nYalnızca geçerli bir JSON nesnesi döndür.',
      { json: true, maxTokens: 16384 },
    )
    return parseTranslationJson(raw, keys)
  }

  const request = {
    model: ANTHROPIC_MODEL,
    max_tokens: 16000,
    system,
    messages: [{ role: 'user' as const, content: userContent }],
  }

  let res
  try {
    res = await getClient().messages.create({
      ...request,
      output_config: { effort: 'low', format: { type: 'json_schema', schema } },
    })
  } catch (err) {
    // Yapılandırılmış çıktı bu hesap/model için kabul edilmezse tek seferlik
    // yedek yol: şemasız iste, yanıttaki JSON'u kendimiz ayıklayalım.
    // Böylece API yüzeyi değişse bile toplu çeviri tamamen durmaz.
    const status = (err as { status?: number }).status
    if (status !== 400) throw err
    res = await getClient().messages.create({
      ...request,
      output_config: { effort: 'low' },
      messages: [
        {
          role: 'user' as const,
          content:
            userContent +
            '\n\nYalnızca geçerli bir JSON nesnesi döndür; kod bloğu, açıklama veya ön söz ekleme.',
        },
      ],
    })
  }

  if (res.stop_reason === 'refusal') {
    throw new Error('Çeviri modeli isteği reddetti.')
  }

  const raw = res.content
    .filter((b): b is Extract<typeof b, { type: 'text' }> => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()

  return parseTranslationJson(raw, keys)
}

/** Her iki sağlayıcının yanıtı için ortak çözümleme. */
function parseTranslationJson(raw: string, keys: string[]): Record<string, string> {
  let text = raw.trim()

  // Model yanıtı ```json ile sarmalamış olabilir — temizle.
  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/)
  if (fenced) text = fenced[1].trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
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
