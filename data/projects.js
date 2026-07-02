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
      tr: "Restoranlar için işletme paneli, QR menü ve operasyon yönetimi sunan kendi ürünümüz; fikirden ürüne.",
      en: "Our own product offering a business panel, QR menu and operations management for restaurants; from idea to product.",
    },
    scope: [
      { tr: "Ürün", en: "Product" },
      { tr: "SaaS", en: "SaaS" },
      { tr: "Panel", en: "Dashboard" },
      { tr: "QR Menü", en: "QR Menu" },
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
        tr: "İşletme paneli, restoran yönetimi, QR menü mantığı ve ürünleşebilir bir SaaS altyapısını product thinking ile baştan kurguladık.",
        en: "We designed a business panel, restaurant management, QR menu logic and a productizable SaaS foundation with product thinking from the start.",
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
  {
    slug: "geo-gorunurluk",
    index: "04",
    name: "GEO Görünürlük",
    category: { tr: "Yapay Zekâ Arama Görünürlüğü", en: "AI Search Visibility" },
    year: "2026",
    concept: true,
    conceptLabel: { tr: "Konsept çalışma", en: "Concept work" },
    summary: {
      tr: "Markaların ChatGPT, Claude, Perplexity ve Gemini gibi asistanlarda doğru bilgiyle önerilmesi için tasarladığımız görünürlük sistemi.",
      en: "A visibility system we design so brands get recommended with accurate information across assistants like ChatGPT, Claude, Perplexity and Gemini.",
    },
    scope: [
      { tr: "GEO", en: "GEO" },
      { tr: "İçerik Mimarisi", en: "Content Architecture" },
      { tr: "Yapay Zekâ SEO", en: "AI SEO" },
      { tr: "Dijital İtibar", en: "Digital Reputation" },
    ],
    shot: "/images/work-geo.jpg",
    caseStudy: {
      problem: {
        tr: "Klasik SEO, arama davranışı yapay zekâ asistanlarına kaydıkça tek başına yetmiyor; markaların bu asistanların yanıtlarında doğru bilgiyle yer alması gerekiyor.",
        en: "Classic SEO is no longer enough as search behavior shifts to AI assistants; brands need to appear with accurate information inside those answers.",
      },
      build: {
        tr: "Markayı yapay zekânın anlayacağı biçimde yapılandıran içerik mimarisi, yapısal veri ve sürekli ölçülen bir görünürlük paneli tasarladık.",
        en: "We designed a content architecture that structures the brand for AI to understand, structured data and a continuously measured visibility panel.",
      },
      design: {
        tr: "Karmaşık veriyi sakin tutan, görünürlük skorunu ve asistan bazlı performansı tek bakışta okutan açık, premium bir panel dili.",
        en: "A clean, premium panel language that keeps complex data calm and makes the visibility score and per-assistant performance readable at a glance.",
      },
      value: {
        tr: "Marka, yapay zekâya bir şey sorulduğunda önerilen isimlerden biri olur; dijital itibarını ölçülebilir ve sürdürülebilir biçimde güçlendirir.",
        en: "The brand becomes one of the names recommended when AI is asked; it strengthens its digital reputation in a measurable, sustainable way.",
      },
      tech: ["GEO", "Schema.org", "Structured Data", "İçerik Stratejisi", "Analytics"],
    },
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

// "More experiments / upcoming work"
export const upcoming = {
  index: "05",
  name: { tr: "Yeni Sistemler", en: "Upcoming Systems" },
  category: { tr: "Yeni denemeler & süregelen işler", en: "More experiments & ongoing work" },
  summary: {
    tr: "Sürekli geliştirdiğimiz ürün ve sistem alanları; sıradaki işiniz bunlardan biri olabilir.",
    en: "Product and system areas we keep developing; your next project could be one of them.",
  },
  items: [
    { tr: "Restoran sipariş sistemleri", en: "Restaurant ordering systems" },
    { tr: "QR menü platformları", en: "QR menu platforms" },
    { tr: "Özel işletme siteleri", en: "Custom business websites" },
    { tr: "E-ticaret arayüzleri", en: "E-commerce interfaces" },
    { tr: "Yönetim panelleri", en: "Admin dashboards" },
    { tr: "SEO landing sayfaları", en: "SEO landing pages" },
    { tr: "Marka kimliği + web sistemleri", en: "Brand identity + web systems" },
    { tr: "Otomasyon araçları", en: "Automation tools" },
  ],
};
