// ────────────────────────────────────────────────────────────────
// STÜDYO KİMLİĞİ: tüm site bu dosyadan beslenir.
// İsim, iletişim ve sosyal linkleri buradan değiştir; her yere yansır.
// ────────────────────────────────────────────────────────────────
export const site = {
  // Site adı (logoda iki tonlu: bold "OrhanKemal" + serif "Koç")
  name: "OrhanKemal",
  nameSuffix: "Koç", // logoda ince serif vurgu
  fullName: "OrhanKemalKoç", // SEO/başlık/copyright için birleşik ad
  tagline: "Digital Studio",

  // SEO
  seoTitle: "Orhan Kemal Koç / Web Design & Software",
  seoDescription:
    "Web tasarımı, SEO, Google Ads ve e-ticaret; yönetim paneli, hosting ve özel alan adıyla birlikte. Markaların aramalarda öne çıkmasını ve dijitalde daha iyi çalışmasını sağlayan tasarım & yazılım işleri.",
  url: "https://orhankemalkoc.com", // canlı domain (placeholder)

  // Google Analytics 4 ölçüm kimliği (örn. "G-XXXXXXXXXX").
  // BOŞ bırakılırsa analytics HİÇ yüklenmez. Çerez onayı verilince devreye girer.
  gaId: "",

  // İletişim
  email: "oriliano1361@gmail.com",
  phoneDisplay: "+90 507 541 90 24",
  whatsapp: "905075419024", // ülke kodu + numara, boşluksuz
  whatsappText: "Merhaba, bir proje hakkında konuşmak istiyorum.",

  // Sosyal
  social: [
    { label: "GitHub", href: "https://github.com/oriliano" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/orhan-kemal-koc/" },
  ],

  location: "Ankara, Türkiye",
  foundedLabel: "EST. 2026",
};

// Hazır WhatsApp linki
export const whatsappLink = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
  site.whatsappText
)}`;
export const mailLink = `mailto:${site.email}`;
