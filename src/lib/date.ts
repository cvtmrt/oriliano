/**
 * TARİH VE SAAT BİÇİMLENDİRME
 *
 * Sunucu UTC'de çalışıyor (Railway), büro ise Türkiye'de. Saat dilimi
 * belirtilmediğinde tarihler sunucunun saatiyle basılıyor ve her şey 3 saat
 * geride görünüyor.
 *
 * Bu, gelen kutusunda gerçek bir sorun: mesajın ne zaman geldiğini yanlış
 * gösteren bir liste, "sabah gelmiş, akşama kadar beklemiş" gibi hatalı bir
 * izlenim verir. Bu yüzden saat dilimi her çağrıda açıkça yazılıyor —
 * ortam değişkenine (TZ) bırakılmıyor ki dağıtım ayarı değişse de doğru kalsın.
 */

export const TIME_ZONE = 'Europe/Istanbul'

/** Panel listeleri: "13.08.2026 16:24" */
export function formatDateTime(value: Date): string {
  return value.toLocaleString('tr-TR', {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Kısa tarih: "13.08.2026" */
export function formatDate(value: Date): string {
  return value.toLocaleDateString('tr-TR', { timeZone: TIME_ZONE })
}

/** Sitede yayın tarihi: "13 Ağustos 2026" / "13 August 2026" */
export function formatLongDate(value: Date, locale: 'tr' | 'en'): string {
  return value.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
