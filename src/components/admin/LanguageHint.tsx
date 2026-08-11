/**
 * İki dilli çalışma mantığını tek bakışta anlatan açıklama.
 *
 * Panelde en çok kafa karıştıran nokta buydu: "İngilizceyi de ben mi
 * doldurmalıyım?" Cevabı sayfanın başında, aramadan görünsün istedik.
 */
export default function LanguageHint({ configured }: { configured: boolean }) {
  return (
    <div className="mb-6 rounded-md border border-navy-200 bg-navy-50 px-4 py-3.5 text-sm leading-relaxed text-navy-900">
      <p className="font-medium">Sadece Türkçe yazmanız yeterli.</p>
      <ul className="mt-2 space-y-1 text-[0.82rem] text-navy-800">
        <li>
          <strong>·</strong> Kaydettiğinizde İngilizcesi{' '}
          {configured ? 'birkaç saniye içinde kendiliğinden oluşur' : 'oluşturulamaz (çeviri kapalı)'}.
        </li>
        <li>
          <strong>·</strong> Her alanın altında <span className="font-mono text-[0.7rem]">EN</span>{' '}
          etiketiyle İngilizcesinin ne olduğu yazar. Beğenmezseniz{' '}
          <em>Düzenle</em> deyip kendiniz yazabilirsiniz.
        </li>
        <li>
          <strong>·</strong> Elle yazdığınız bir İngilizce metnin üzerine otomatik çeviri
          <strong> asla yazmaz</strong>. Tekrar otomatiğe dönmek isterseniz{' '}
          <em>Yeniden çevir</em>.
        </li>
        <li>
          <strong>·</strong> İngilizce boş kalırsa site ziyaretçiye Türkçe metni gösterir; sayfa
          hiçbir zaman boş görünmez.
        </li>
      </ul>
    </div>
  )
}
