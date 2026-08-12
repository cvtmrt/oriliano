// ────────────────────────────────────────────────────────────────
// STÜDYODAN — Instagram içerik hattıyla aynı dili konuşan kısa notlar.
// Site ile Instagram tek marka gibi dursun diye buradalar.
//
// NOT: `href` bilerek profil adresine gider. Tek tek gönderi linkleri,
// gerçek post URL'leri elde olmadan uydurulmaz — kırık link üretmez.
// Bir notu belirli bir gönderiye bağlamak istersen o notun `href`
// alanına gerçek gönderi adresini yaz; bileşen otomatik onu kullanır.
// ────────────────────────────────────────────────────────────────
import { site } from "../lib/site.js";

export const notes = [
  {
    no: "01",
    title: {
      tr: "Bir işletmenin internette aslında 3 şeye ihtiyacı var",
      en: "A business really only needs three things online",
    },
    body: {
      tr: "Bulunmak, güven vermek ve iletişime geçirmek. Geri kalan her şey bu üçünün üstüne kurulan süs.",
      en: "To be found, to look trustworthy and to make contact easy. Everything else is decoration on top of those three.",
    },
    tag: { tr: "Temel", en: "Basics" },
  },
  {
    no: "02",
    title: {
      tr: "Google'da müşteriniz sizi aradığında ne görüyor?",
      en: "What does your customer see when they search for you?",
    },
    body: {
      tr: "Çoğu işletme kendi adını aratmayı hiç denemiyor. Bir deneyin: çıkan sonuç, müşterinin sizinle ilgili ilk izlenimi.",
      en: "Most businesses never search their own name. Try it: what comes up is your customer's first impression of you.",
    },
    tag: { tr: "Görünürlük", en: "Visibility" },
  },
  {
    no: "03",
    title: {
      tr: "Sitenizi kendiniz güncelleyemiyorsanız, o site sizin değil",
      en: "If you can't update your site yourself, it isn't yours",
    },
    body: {
      tr: "Menü değişikliği için birini beklemek zorunda kalmak bir tasarım sorunu değil, teslim sorunudur. Panel şart.",
      en: "Waiting on someone else to change a menu isn't a design problem, it's a delivery problem. You need a panel.",
    },
    tag: { tr: "Yönetim", en: "Control" },
  },
  {
    no: "04",
    title: {
      tr: "Hız, en ucuz pazarlama bütçesidir",
      en: "Speed is the cheapest marketing budget there is",
    },
    body: {
      tr: "Açılmayan sayfa reklamı da boşa harcar, SEO'yu da. Önce site hızlansın, sonra bütçe konuşulsun.",
      en: "A page that won't load wastes your ads and your SEO alike. Make the site fast first, talk budget after.",
    },
    tag: { tr: "Performans", en: "Performance" },
  },
];

// Not: gönderi linki verilmemişse profile düş.
export function noteHref(note) {
  return note.href || site.instagramUrl;
}
