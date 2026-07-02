// Yetkinlikler / teknoloji: kategori bazlı. label, name, note { tr, en }.
// Teknoloji isimleri (React, Node.js...) iki dilde de aynıdır.
export const stackGroups = [
  {
    key: "frontend",
    label: { tr: "Önyüz", en: "Frontend" },
    items: [
      { name: { tr: "React", en: "React" }, note: { tr: "Komponent tabanlı, ölçeklenebilir arayüzler", en: "Component-based, scalable interfaces" } },
      { name: { tr: "Next.js / Vike", en: "Next.js / Vike" }, note: { tr: "SSR & hızlı, SEO dostu render", en: "SSR & fast, SEO-friendly rendering" } },
      { name: { tr: "TypeScript", en: "TypeScript" }, note: { tr: "Güvenli, sürdürülebilir kod tabanı", en: "Safe, maintainable codebase" } },
      { name: { tr: "Tailwind CSS", en: "Tailwind CSS" }, note: { tr: "Tutarlı, hızlı tasarım sistemi", en: "Consistent, fast design system" } },
      { name: { tr: "Framer Motion", en: "Framer Motion" }, note: { tr: "Akıcı, fizik tabanlı animasyon", en: "Smooth, physics-based animation" } },
      { name: { tr: "GSAP", en: "GSAP" }, note: { tr: "Scroll & timeline animasyonları", en: "Scroll & timeline animation" } },
      { name: { tr: "Duyarlı Arayüz", en: "Responsive UI" }, note: { tr: "Mobil-öncelikli her ekran", en: "Mobile-first on every screen" } },
    ],
  },
  {
    key: "backend",
    label: { tr: "Arka Uç", en: "Backend" },
    items: [
      { name: { tr: "Node.js", en: "Node.js" }, note: { tr: "Hızlı, olay tabanlı sunucu", en: "Fast, event-driven server" } },
      { name: { tr: "Firebase", en: "Firebase" }, note: { tr: "Realtime & auth altyapısı", en: "Realtime & auth infrastructure" } },
      { name: { tr: "REST API'ler", en: "REST APIs" }, note: { tr: "Temiz, dökümante servis katmanı", en: "Clean, documented service layer" } },
      { name: { tr: "Kimlik Doğrulama", en: "Authentication" }, note: { tr: "Güvenli oturum & yetkilendirme", en: "Secure sessions & authorization" } },
      { name: { tr: "Veritabanı Tasarımı", en: "Database Design" }, note: { tr: "İlişkisel & ölçeklenebilir şema", en: "Relational & scalable schema" } },
    ],
  },
  {
    key: "product",
    label: { tr: "Ürün & Tasarım", en: "Product & Design" },
    items: [
      { name: { tr: "UI / UX", en: "UI / UX" }, note: { tr: "Kullanıcı odaklı akış tasarımı", en: "User-focused flow design" } },
      { name: { tr: "Tel Çerçeve", en: "Wireframing" }, note: { tr: "Hızlı kurgu & doğrulama", en: "Fast layout & validation" } },
      { name: { tr: "Tasarım Sistemleri", en: "Design Systems" }, note: { tr: "Token tabanlı tutarlılık", en: "Token-based consistency" } },
      { name: { tr: "Dönüşüm Sayfaları", en: "Conversion Landing" }, note: { tr: "Dönüşüm için kurgulanmış sayfa", en: "Pages built to convert" } },
      { name: { tr: "SEO Yapısı", en: "SEO Structure" }, note: { tr: "Aranabilir, semantik yapı", en: "Searchable, semantic structure" } },
      { name: { tr: "Marka Yönü", en: "Brand Direction" }, note: { tr: "Görsel dil & marka tonu", en: "Visual language & brand tone" } },
    ],
  },
  {
    key: "focus",
    label: { tr: "Odak Alanları", en: "Business Focus" },
    items: [
      { name: { tr: "Restoranlar", en: "Restaurants" }, note: { tr: "Menü, sipariş, operasyon", en: "Menu, orders, operations" } },
      { name: { tr: "Yerel İşletmeler", en: "Local Businesses" }, note: { tr: "Yerel SEO & dönüşüm", en: "Local SEO & conversion" } },
      { name: { tr: "E-ticaret", en: "E-commerce" }, note: { tr: "Vitrin, sepet, ödeme", en: "Storefront, cart, checkout" } },
      { name: { tr: "SaaS Panelleri", en: "SaaS Dashboards" }, note: { tr: "Veri-yoğun yönetim panelleri", en: "Data-dense management panels" } },
      { name: { tr: "Mobil-öncelikli", en: "Mobile-first" }, note: { tr: "Telefonda kusursuz deneyim", en: "Flawless experience on phones" } },
    ],
  },
];

// Marquee şeridi (dile bağlı değil, İngilizce teknoloji terimleri)
export const marqueeSkills = [
  "React", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "GSAP",
  "Node.js", "REST API", "UI/UX", "Design Systems", "SEO", "Restaurant Tech",
  "QR Menu", "Dashboards", "E-commerce", "Brand Identity",
];
