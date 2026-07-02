// ────────────────────────────────────────────────────────────────
// STÜDYO KİMLİĞİ: tüm site bu dosyadan beslenir.
// İsim, iletişim ve sosyal linkleri buradan değiştir; her yere yansır.
// ────────────────────────────────────────────────────────────────
export const site = {
  // Stüdyo adı (logoda iki tonlu: bold "Sen" + serif "Studio")
  name: "Sen",
  nameSuffix: "Studio", // logoda ince serif vurgu
  fullName: "SenStudio", // SEO/başlık/copyright için birleşik ad
  tagline: "Digital Studio",

  // SEO
  seoTitle: "SenStudio / Web Design & Software Studio",
  seoDescription:
    "Restoranlardan yerel işletmelere, SaaS panellerinden SEO odaklı web sitelerine; markaların dijitalde daha güçlü görünmesini ve daha iyi çalışmasını sağlayan bir tasarım & yazılım stüdyosu.",
  url: "https://senstudio.studio", // canlı domain (placeholder)

  // Google Analytics 4 ölçüm kimliği (örn. "G-XXXXXXXXXX").
  // BOŞ bırakılırsa analytics HİÇ yüklenmez. Çerez onayı verilince devreye girer.
  gaId: "",

  // İletişim
  email: "cavit.ergul.42@gmail.com",
  phoneDisplay: "+90 507 541 90 24",
  whatsapp: "905075419024", // ülke kodu + numara, boşluksuz
  whatsappText: "Merhaba, bir proje hakkında konuşmak istiyorum.",

  // Sosyal (placeholder)
  social: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Behance", href: "https://behance.net/" },
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
  ],

  location: "Ankara, Türkiye",
  foundedLabel: "EST. 2026",
};

// Hazır WhatsApp linki
export const whatsappLink = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
  site.whatsappText
)}`;
export const mailLink = `mailto:${site.email}`;
