/**
 * WhatsApp numarası normalleştirme.
 *
 * wa.me adresi ülke koduyla ve başında sıfır olmadan ister. Kullanıcı panele
 * alışkanlıkla yerel biçimde yazıyor:
 *
 *   0532 123 45 67   →  905321234567
 *   +90 532 123 4567 →  905321234567
 *   532 123 45 67    →  905321234567
 *
 * Yalnızca rakamları süzmek yetmiyordu: `05321234567` olarak kaydedilir ve
 * wa.me bu numarayı bulamayıp hata sayfası gösterirdi. Sessiz bir kırılma
 * olurdu — düğme görünür ama tıklayınca çalışmaz.
 *
 * Türkiye dışı numaralar için: kullanıcı ülke kodunu kendisi yazdıysa
 * (11 haneden uzun veya 90 ile başlıyor) olduğu gibi bırakılır.
 */
export function normalizeWhatsapp(input: string): string {
  const digits = (input || '').replace(/\D/g, '')
  if (!digits) return ''

  // 0090... → 90...
  if (digits.startsWith('00')) return digits.slice(2)

  // Zaten ülke koduyla: 90 + 10 hane
  if (digits.startsWith('90') && digits.length === 12) return digits

  // Yerel biçim: 0 + 10 hane (05321234567)
  if (digits.startsWith('0') && digits.length === 11) return '90' + digits.slice(1)

  // Ülke kodu ve sıfır olmadan: 5321234567
  if (digits.length === 10 && digits.startsWith('5')) return '90' + digits

  // Tanımadığımız biçim — kullanıcı yabancı numara girmiş olabilir, dokunma.
  return digits
}

/** Panelde "şu adrese gidecek" önizlemesi için. */
export function whatsappLink(number: string, text = ''): string | null {
  const normalized = normalizeWhatsapp(number)
  if (!normalized) return null
  return `https://wa.me/${normalized}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}
