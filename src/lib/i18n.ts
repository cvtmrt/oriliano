export const locales = ['tr', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'tr'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/**
 * İki dilli bir alanı okur. İngilizce boşsa Türkçeye düşer — sayfa asla boş
 * görünmesin diye. (Brief: "EN alanı boşsa TR'ye fallback yap".)
 */
export function pick(locale: Locale, tr: string | null | undefined, en: string | null | undefined): string {
  const trimmedTr = (tr ?? '').trim()
  if (locale === 'tr') return trimmedTr
  const trimmedEn = (en ?? '').trim()
  return trimmedEn || trimmedTr
}

/** `field` + Tr/En son eki olan kayıtlardan doğru dili seçer. */
export function pickField<T extends Record<string, unknown>>(
  locale: Locale,
  row: T,
  field: string,
): string {
  return pick(locale, row[`${field}Tr`] as string, row[`${field}En`] as string)
}

export const htmlLang: Record<Locale, string> = { tr: 'tr-TR', en: 'en' }
export const ogLocale: Record<Locale, string> = { tr: 'tr_TR', en: 'en_US' }

export const localeNames: Record<Locale, string> = { tr: 'Türkçe', en: 'English' }
