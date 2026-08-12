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
  {
    slug: "gold-clover",
    index: "04",
    name: "Gold Clover",
    category: { tr: "Etkinlik & Kuaför — İki Markalı Site", en: "Events & Salon — Two-Brand Site" },
    year: "2026",
    url: "https://goldclover.site",
    urlLabel: "goldclover.site",
    summary: {
      tr: "Ankara merkezli Gold Clover için tek adreste iki marka: etkinlik organizasyonu ve DS Önce Sen kuaför; panelden yönetilen ürün kataloğu ve galeri.",
      en: "Two brands at one address for Ankara-based Gold Clover: event organization and DS Önce Sen salon; panel-managed product catalog and gallery.",
    },
    scope: [
      { tr: "Web Tasarım", en: "Web Design" },
      { tr: "İki Marka Portalı", en: "Two-Brand Portal" },
      { tr: "Yönetim Paneli", en: "Admin Panel" },
      { tr: "Arka Uç", en: "Backend" },
      { tr: "SEO", en: "SEO" },
    ],
    shot: "/images/work-gold-clover.jpg",
    caseStudy: {
      problem: {
        tr: "Aynı işletmenin iki farklı hizmetini (etkinlik organizasyonu ve kuaför) karıştırmadan tek adreste sunmak ve içeriği kod bilmeden yönetmek gerekiyordu.",
        en: "The business needed to present two distinct services (event organization and hair salon) at one address without mixing them, and manage content without touching code.",
      },
      build: {
        tr: "Girişte marka seçtiren bir portal, her marka için ayrı site, panelden yönetilen ürün kataloğu ve kuaför galerisi, talep formları ve şifreli yönetim paneli.",
        en: "An entry portal that lets visitors choose a brand, a separate site per brand, a panel-managed product catalog and salon gallery, lead forms and a secured admin panel.",
      },
      design: {
        tr: "Altın ve krem tonlarında lüks, sinematik bir dil; her iki marka da aynı premium hisse sahip ama kendi kimliğini korur.",
        en: "A luxe, cinematic language in gold and cream; both brands share the same premium feel while keeping their own identity.",
      },
      value: {
        tr: "İki markayı tek adreste net biçimde ayıran, sahibinin ürün ve fotoğraflarını anında güncelleyebildiği, arama motorlarına hazır bir site.",
        en: "A search-ready site that cleanly separates two brands at one address and lets the owner update products and photos instantly.",
      },
      tech: ["React", "React Router", "Express", "PostgreSQL", "Admin Panel", "SEO"],
    },
    gallery: [
      { shot: "/images/case-gold-clover-portal.jpg", caption: { tr: "Girişte marka seçtiren portal ekranı", en: "Entry portal that lets visitors pick a brand" } },
      { shot: "/images/case-gold-clover-kuafor.jpg", caption: { tr: "DS Önce Sen kuaför sitesi ve randevu akışı", en: "DS Önce Sen salon site and appointment flow" } },
    ],
  },
  {
    slug: "incek-sandvic",
    index: "05",
    name: "İncek Sandviç",
    category: { tr: "Restoran & Online Sipariş Sistemi", en: "Restaurant & Online Ordering System" },
    year: "2026",
    url: "https://inceksandvic.com",
    urlLabel: "inceksandvic.com",
    summary: {
      tr: "İncek'in yerel sandviç markası için iştah açıcı bir vitrin, yönetilebilir menü ve kapıda ödeme akışını tek deneyimde buluşturduk.",
      en: "We brought together an appetizing storefront, manageable menu and pay-on-delivery flow for İncek's local sandwich brand.",
    },
    scope: [
      { tr: "Web Tasarım", en: "Web Design" },
      { tr: "Online Sipariş", en: "Online Ordering" },
      { tr: "Yönetim Paneli", en: "Admin Panel" },
      { tr: "QR Menü", en: "QR Menu" },
      { tr: "Yerel SEO", en: "Local SEO" },
    ],
    shot: "/images/work-incek-sandvic.jpg",
    caseStudy: {
      problem: {
        tr: "İşletmenin ürünlerini güçlü bir marka diliyle sergilemesi, güncel menüyü kolayca yönetmesi ve müşteriyi aracı platformlara bağımlı kalmadan siparişe taşıması gerekiyordu.",
        en: "The business needed to showcase its products through a strong brand language, manage an up-to-date menu easily and take customers to ordering without relying on intermediary platforms.",
      },
      build: {
        tr: "Filtrelenebilir ürün kataloğu, ürün özelleştirme, sepet, kapıda ödeme sipariş akışı, QR menü, Adisyo entegrasyonu ve şifreli yönetim panelinden oluşan uçtan uca restoran sistemi.",
        en: "An end-to-end restaurant system with a filterable product catalog, product customization, cart, pay-on-delivery ordering, QR menu, Adisyo integration and a secured admin panel.",
      },
      design: {
        tr: "Markanın turuncu-sarı renklerinden beslenen; güçlü tipografi, gerçek ürün fotoğrafları ve mobilde iştah açıcı, hızlı bir alışveriş deneyimi sunan sıcak bir görsel dil.",
        en: "A warm visual language built around the brand's orange-yellow palette, bold typography, real product photography and a fast, appetizing mobile shopping experience.",
      },
      value: {
        tr: "Menüden teslimat siparişine kadar tüm müşteri yolculuğunu tek yerde toplayan; işletmeye içerik kontrolü, müşteriye hızlı ve doğrudan sipariş imkânı veren canlı bir satış kanalı.",
        en: "A live sales channel that brings the full customer journey from menu to delivery order into one place, giving the business content control and customers a fast, direct way to order.",
      },
      tech: ["JavaScript", "Express", "PostgreSQL", "Adisyo API", "Admin Panel", "Local SEO"],
    },
    gallery: [
      { shot: "/images/case-incek-sandvic-menu.jpg", caption: { tr: "Arama, kategori filtreleri ve güncel ürünlerle yönetilebilir menü", en: "Manageable menu with search, category filters and up-to-date products" } },
      { shot: "/images/case-incek-sandvic-qr.jpg", caption: { tr: "Temassız menü ve yol tarifi için markalı QR deneyimi", en: "Branded QR experience for contactless menu access and directions" } },
    ],
  },
  {
    slug: "my-yapi",
    index: "06",
    name: "MY YAPI",
    category: { tr: "İnşaat & Yapı Malzemeleri Sitesi", en: "Construction & Building Materials Site" },
    year: "2026",
    url: "https://myyapiinsaat.com.tr",
    urlLabel: "myyapiinsaat.com.tr",
    summary: {
      tr: "Ankara Çankaya'da inşaat, taahhüt ve yapı malzemeleri alanında çalışan MY YAPI için kömür-amber dilinde, teklif almaya odaklı kurumsal bir site.",
      en: "A charcoal-and-amber corporate site focused on quote requests for MY YAPI, working in construction, contracting and building materials in Çankaya, Ankara.",
    },
    scope: [
      { tr: "Web Tasarım", en: "Web Design" },
      { tr: "Hizmet Mimarisi", en: "Service Architecture" },
      { tr: "Ürün Kataloğu", en: "Product Catalog" },
      { tr: "Yerel SEO", en: "Local SEO" },
      { tr: "Ölçümleme", en: "Analytics" },
    ],
    shot: "/images/work-myyapi.jpg",
    caseStudy: {
      problem: {
        tr: "İnşaattan dekorasyona, malzeme tedariğinden imalata kadar çok geniş bir hizmet yelpazesi vardı; bunu ziyaretçiyi boğmadan anlatmak ve her sayfadan teklif talebine taşımak gerekiyordu.",
        en: "The service range was very broad — from construction to decoration, material supply to manufacturing; it had to be told without overwhelming visitors and channelled into quote requests from every page.",
      },
      build: {
        tr: "Hizmetler, ürünler, projeler ve hizmet bölgeleri olarak ayrılmış bir mimari; numaralı hizmet kartları, marka ve kategori kataloğu, her ekranda duran telefon CTA'sı ve sabit WhatsApp erişimi.",
        en: "An architecture split into services, products, projects and service areas; numbered service cards, a brand and category catalog, a phone CTA present on every screen and persistent WhatsApp access.",
      },
      design: {
        tr: "Kömür siyahı zemin üzerinde amber vurgu; sahadan gerçek fotoğraflar, kalın başlıklar ve sektörün alıştığı şablon görünümünden bilinçli olarak uzaklaşan sakin bir yerleşim.",
        en: "An amber accent over charcoal black; real photography from the field, heavy headlines and a calm layout that deliberately steps away from the template look common in the sector.",
      },
      value: {
        tr: "Yerel aramalarda konumlanan, hizmet genişliğini net anlatan ve ziyaretçiyi tek dokunuşta telefon veya WhatsApp'a taşıyan bir teklif kanalı.",
        en: "A quote channel that ranks in local search, communicates the breadth of services clearly and moves visitors to phone or WhatsApp in a single tap.",
      },
      tech: ["React", "Vite", "Yerel SEO", "Google Tag Manager", "Responsive UI"],
    },
    gallery: [
      {
        shot: "/images/case-myyapi-hizmetler.jpg",
        caption: { tr: "Numaralı hizmet kartlarıyla uçtan uca yapı çözümleri", en: "End-to-end building solutions in numbered service cards" },
      },
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
