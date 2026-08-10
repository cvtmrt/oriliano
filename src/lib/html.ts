/**
 * Zengin metin temizliği.
 *
 * İçerik yalnızca giriş yapmış yöneticiden gelir, yani birincil tehdit modeli
 * değil; yine de panelden yapıştırılan Word/web içeriğinin script, iframe ve
 * event handler taşımasını engelliyoruz.
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li',
  'h2', 'h3', 'h4', 'blockquote', 'hr', 'span', 'div', 'table', 'thead',
  'tbody', 'tr', 'th', 'td',
])

const DANGEROUS_BLOCKS = /<(script|style|iframe|object|embed|form|input|button|link|meta)\b[\s\S]*?<\/\1\s*>/gi
const DANGEROUS_SELF = /<(script|style|iframe|object|embed|form|input|button|link|meta)\b[^>]*\/?>/gi

export function sanitizeHtml(input: string): string {
  if (!input) return ''
  let html = input

  html = html.replace(DANGEROUS_BLOCKS, '')
  html = html.replace(DANGEROUS_SELF, '')
  // on* event handler'ları
  html = html.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  // javascript: / data: protokolleri
  html = html.replace(/(href|src)\s*=\s*("|')\s*(javascript|data|vbscript):[^"']*\2/gi, '$1="#"')

  // İzin verilmeyen etiketleri sök (içeriği koru)
  html = html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tag: string) => {
    return ALLOWED_TAGS.has(tag.toLowerCase()) ? match : ''
  })

  // Dış bağlantılara güvenlik nitelikleri
  html = html.replace(/<a\b([^>]*)>/gi, (match, attrs: string) => {
    if (/target\s*=/.test(attrs)) {
      if (!/rel\s*=/.test(attrs)) return `<a${attrs} rel="noopener noreferrer">`
    }
    return match
  })

  return html.trim()
}

/** HTML'i düz metne indirger — meta description ve önizleme için. */
export function htmlToText(input: string, maxLength = 300): string {
  const text = (input || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 1).replace(/\s+\S*$/, '') + '…'
}

/** Panelde textarea ile girilen düz metni paragraflara çevirir. */
export function textToHtml(input: string): string {
  if (!input) return ''
  return input
    .split(/\n{2,}/)
    .map((block) => `<p>${block.trim().replace(/\n/g, '<br />')}</p>`)
    .join('')
}
