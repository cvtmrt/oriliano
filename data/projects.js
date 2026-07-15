// ────────────────────────────────────────────────────────────────
// SEÇİLMİŞ İŞLER. Çevirilebilir alanlar { tr, en } biçimindedir.
// `shot`: public/images/ altındaki ekran görüntüsü. Yoksa şık placeholder.
// ────────────────────────────────────────────────────────────────
export const projects = [
  {
    slug: "tavaci-mehmet-efendi",
    index: "01",
    name: "Tavacı Mehmet Efendi",
    category: { tr: "Restoran Web Deneyimi", en: "Restaurant Web Experience" },
    year: "2026",
    url: "https://www.tavacimehmetefendi.com",
    urlLabel: "tavacimehmetefendi.com",
    summary: {
      tr: "Geleneksel restoran markasını modern, iştah açıcı ve mobil uyumlu bir web deneyimine taşıdık.",
      en: "We brought a traditional restaurant brand into a modern, appetizing and mobile-friendly web experience.",
    },
    scope: [
      { tr: "Web Tasarım", en: "Web Design" },
      { tr: "Önyüz", en: "Frontend" },
      { tr: "Menü Sistemi", en: "Menu System" },
      { tr: "Mobil-öncelikli", en: "Mobile-first" },
      { tr: "SEO", en: "SEO" },
    ],
    shot: "/images/work-tavaci.jpg",
    caseStudy: {
      problem: {
        tr: "Köklü bir restoran markasının dijital görünürlüğü ve sipariş yönlendirme akışı, marka kalitesinin gerisindeydi.",
        en: "An established restaurant brand's digital presence and ordering flow lagged behind its real quality.",
      },
      build: {
        tr: "Menü, şubeler, kampanya alanları, franchise sayfası ve mobil uyumlu sipariş yönlendirme akışı içeren tam bir kurumsal web deneyimi.",
        en: "A full brand web experience with menu, branches, campaigns, a franchise page and a mobile-friendly order routing flow.",
      },
      design: {
        tr: "İştah açıcı görseller, sıcak ama premium tipografi ve net hiyerarşi ile geleneksel markayı modern bir dile taşıdık.",
        en: "Appetizing visuals, warm yet premium typography and clear hierarchy moved the traditional brand into a modern voice.",
      },
      value: {
        tr: "Daha profesyonel marka algısı ve müşteriyi menü, şube ve siparişe taşıyan net bir yönlendirme akışı.",
        en: "A more professional brand perception and a clear flow that carries customers to menu, branches and ordering.",
      },
      tech: ["React", "Vike", "Tailwind", "Responsive UI", "SEO"],
    },
    gallery: [
      { shot: "/images/case-tavaci-menu.jpg", caption: { tr: "Kategorili menü ve online sipariş akışı", en: "Categorised menu and online ordering flow" } },
      { shot: "/images/case-tavaci-subeler.jpg", caption: { tr: "Şubeler; telefon, saat ve yol tarifiyle", en: "Branches with phone, hours and directions" } },
    ],
  },
  {
    slug: "akuport",
    index: "02",
    name: "AküPort",
    category: { tr: "SEO & Yerel Hizmet Sitesi", en: "SEO & Local Service Website" },
    year: "2026",
    url: "https://www.akuport.com",
    urlLabel: "akuport.com",
    summary: {
      tr: "Ankara'da yerinde akü değişimi ve acil akü hizmeti için SEO odaklı, hızlı ve dönüşüm hedefli bir işletme sitesi.",
      en: "An SEO-focused, fast and conversion-driven business site for on-site and emergency battery service in Ankara.",
    },
    scope: [
      { tr: "SEO Mimarisi", en: "SEO Architecture" },
      { tr: "Dönüşüm", en: "Conversion" },
      { tr: "Ürün Kataloğu", en: "Product Catalog" },
      { tr: "Yerel Hizmet", en: "Local Service" },
      { tr: "Blog", en: "Blog" },
    ],
    shot: "/images/work-akuport.jpg",
    caseStudy: {
      problem: {
        tr: "Acil hizmet arayan kullanıcıyı hızlıca arama/WhatsApp aksiyonuna götürmek ve Google aramalarında güçlü konumlanmak gerekiyordu.",
        en: "We had to move users seeking emergency service straight to a call/WhatsApp action and rank strongly on Google.",
      },
      build: {
        tr: "SEO landing yapısı, ürün kategorileri, marka vitrinleri, hizmet alanları ve bilgi/blog sayfalarından oluşan dönüşüm odaklı bir mimari.",
        en: "A conversion-focused architecture with an SEO landing structure, product categories, brand showcases, service areas and info/blog pages.",
      },
      design: {
        tr: "Güven unsurları öne çıkan, hızlı yüklenen ve her ekranda net arama/WhatsApp CTA'ları taşıyan sade bir arayüz.",
        en: "A clean interface that surfaces trust signals, loads fast and carries clear call/WhatsApp CTAs on every screen.",
      },
      value: {
        tr: "Yerel aramalarda güçlü duran ve ziyaretçiyi tek adımda aksiyona çeviren, dönüşüm odaklı bir işletme sitesi.",
        en: "A conversion-focused business site that ranks well locally and turns visitors into action in a single step.",
      },
      tech: ["React", "Vike", "Tailwind", "SSR", "SEO", "Drizzle/Postgres"],
    },
    gallery: [
      { shot: "/images/case-akuport-acil.jpg", caption: { tr: "Acil akü sayfası; tek dokunuş arama/WhatsApp", en: "Emergency page; one-tap call/WhatsApp" } },
      { shot: "/images/case-akuport-urunler.jpg", caption: { tr: "Araç tipine göre ürün kategorileri", en: "Product categories by vehicle type" } },
    ],
  },
  {
    slug: "bilye",
    index: "03",
    name: "BilYe",
    category: { tr: "Restoran SaaS Platformu", en: "Restaurant SaaS Platform" },
    year: "2026",
    url: "https://bilye.online",
    urlLabel: "bilye.online",
    summary: {
      tr: "Restoranlar için işletme paneli ve operasyon yönetimi sunan kendi ürünümüz; fikirden ürüne.",
      en: "Our own product offering a business panel and operations management for restaurants; from idea to product.",
    },
    scope: [
      { tr: "Ürün", en: "Product" },
      { tr: "SaaS", en: "SaaS" },
      { tr: "Panel", en: "Dashboard" },
      { tr: "Yönetim Paneli", en: "Admin Panel" },
      { tr: "Arka Uç", en: "Backend" },
    ],
    shot: "/images/work-bilye.jpg",
    isProduct: true,
    caseStudy: {
      problem: {
        tr: "Restoranların menü, sipariş, kurye ve operasyon takibini tek yerden, ölçeklenebilir biçimde yönetmesi gerekiyordu.",
        en: "Restaurants needed to manage menu, orders, couriers and operations from one place, in a scalable way.",
      },
      build: {
        tr: "İşletme paneli, restoran yönetimi ve ürünleşebilir bir SaaS altyapısını product thinking ile baştan kurguladık.",
        en: "We designed a business panel, restaurant management and a productizable SaaS foundation with product thinking from the start.",
      },
      design: {
        tr: "Yoğun operasyon ekranlarında bile sakin kalan, veri-yoğun ama okunabilir bir dashboard dili.",
        en: "A data-dense yet readable dashboard language that stays calm even on busy operations screens.",
      },
      value: {
        tr: "Restoranlar için dijital operasyon sistemi: menü, sipariş ve yönetimi ölçeklenebilir tek bir panelde toplar.",
        en: "A digital operations system for restaurants: menu, orders and management in one scalable panel.",
      },
      tech: ["React", "Node.js", "Auth", "REST API", "Dashboard UI", "Database Design"],
    },
    gallery: [
      { shot: "/images/case-bilye-panel.jpg", caption: { tr: "Panel araçları; istatistik, yorum, menü, duyuru", en: "Panel tools; stats, reviews, menu, announcements" } },
      { shot: "/images/case-bilye-steps.jpg", caption: { tr: "4 adımda işletme kaydı ve onay akışı", en: "4-step business onboarding and approval flow" } },
    ],
  },
];

// Slug ile tek proje bul (case sayfası için).
export function getProject(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

// Bir projeden sonra/önce geleni döndür (case sayfasında "sonraki iş" için).
export function getAdjacentProjects(slug) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}
