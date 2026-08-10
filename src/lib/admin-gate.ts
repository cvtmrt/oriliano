/**
 * PANEL KAPISI
 *
 * `/admin` adresinin herkese açık bir giriş formu göstermesini istemiyoruz:
 * bot taramaları ve kaba kuvvet denemeleri için hazır bir hedef olur.
 *
 * Bu yüzden panelin önünde ikinci bir sır var. Anahtarı olmayan bir istek
 * giriş formunu bile görmez — sayfa hiç yokmuş gibi **404** döner. Bu, 401
 * dönmekten daha iyidir: 401 "burada bir panel var ama giremedin" bilgisini
 * sızdırır, 404 hiçbir şey söylemez.
 *
 * Açmak için bir kez `/admin?k=<ANAHTAR>` adresine gidilir; anahtar çereze
 * yazılır ve sonraki ziyaretlerde adres normal (`/admin`) çalışır.
 *
 * ADMIN_GATE_KEY tanımlı değilse kapı devre dışıdır (yerel geliştirme).
 */

export const GATE_COOKIE = 'ch_gate'
export const GATE_QUERY = 'k'
export const GATE_MAX_AGE = 60 * 60 * 24 * 180 // 180 gün

/** Sabit zamanlı karşılaştırma — Edge runtime'da crypto'ya bağımlı olmadan. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export function gateKey(): string | null {
  const key = (process.env.ADMIN_GATE_KEY || '').trim()
  return key.length >= 12 ? key : null
}
