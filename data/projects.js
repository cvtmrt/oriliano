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
  {
    slug: "terk-edilmis",
    index: "05",
    name: "TERK EDİLMİŞ",
    category: { tr: "Oyun Geliştirme", en: "Game Development" },
    year: "2026",
    concept: true,
    conceptLabel: { tr: "Geliştirme aşamasında", en: "In development" },
    summary: {
      tr: "Unity 6 ile geliştirilen birinci şahıs korku oyunu; el yapımı bir Osmanlı konağında geçen atmosfer odaklı bir deneyim.",
      en: "A first-person horror game built with Unity 6; an atmosphere-driven experience set in a hand-crafted Ottoman mansion.",
    },
    scope: [
      { tr: "Oyun Tasarımı", en: "Game Design" },
      { tr: "Seviye Tasarımı", en: "Level Design" },
      { tr: "Atmosfer & Işık", en: "Atmosphere & Lighting" },
      { tr: "C#", en: "C#" },
    ],
    shot: "/images/work-terk-edilmis.jpg",
    caseStudy: {
      problem: {
        tr: "Korku türünde ucuz jump-scare kalabalığından ayrışan, mekânın kendisini ana karakter yapan bir deneyim kurmak istedik.",
        en: "We wanted an experience that stands apart from cheap jump-scare crowds by making the space itself the main character.",
      },
      build: {
        tr: "Unity 6 ve URP üzerinde, mütevazı donanımda bile akıcı çalışacak şekilde optimize edilmiş birinci şahıs korku altyapısı; konak elden, modül modül inşa edildi.",
        en: "A first-person horror foundation on Unity 6 and URP, optimized to run smoothly even on modest hardware; the mansion was built by hand, module by module.",
      },
      design: {
        tr: "Osmanlı konağı mimarisi, kısıtlı ışık ve ses tasarımıyla gerilim mekândan doğuyor; oyuncu neyin gerçek olduğunu sorgulayarak ilerliyor.",
        en: "With Ottoman mansion architecture, restrained lighting and sound design, tension grows out of the space; the player advances questioning what is real.",
      },
      value: {
        tr: "Web dışında da ürün düşünebildiğimizi gösteren bir çalışma: oyun döngüsü, performans bütçesi ve atmosfer aynı disiplinle kurgulandı.",
        en: "Work that shows we think in products beyond the web: game loop, performance budget and atmosphere designed with the same discipline.",
      },
      tech: ["Unity 6", "URP", "C#", "Level Design", "Sound Design"],
    },
  },
  {
    slug: "futbol-tabu",
    index: "06",
    name: "Futbol Tabu",
    category: { tr: "Mobil Parti Oyunu", en: "Mobile Party Game" },
    year: "2026",
    concept: true,
    conceptLabel: { tr: "Mobil uygulama", en: "Mobile app" },
    isProduct: true,
    summary: {
      tr: "Futbol temalı Tabu parti oyunu: 505 kart, takım modu ve tamamen çevrimdışı çalışan akıcı bir mobil deneyim.",
      en: "A football-themed Taboo party game: 505 cards, team mode and a fluid mobile experience that works fully offline.",
    },
    scope: [
      { tr: "Mobil Uygulama", en: "Mobile App" },
      { tr: "Oyun Tasarımı", en: "Game Design" },
      { tr: "Çevrimdışı", en: "Offline-first" },
      { tr: "UI/UX", en: "UI/UX" },
    ],
    shot: "/images/work-futbol-tabu.jpg",
    caseStudy: {
      problem: {
        tr: "Klasik Tabu'yu futbol kültürüyle birleştirip arkadaş ortamında internetsiz bile sorunsuz oynanan bir parti oyunu yapmak istedik.",
        en: "We wanted to merge classic Taboo with football culture into a party game that plays flawlessly with friends, even without internet.",
      },
      build: {
        tr: "React Native ve Expo ile tek kod tabanı; 505 kartlık içerik ayrı bir üretim script'inden derleniyor, oyun durumu Zustand ile yönetiliyor.",
        en: "A single codebase with React Native and Expo; the 505-card deck is compiled from a dedicated build script, game state managed with Zustand.",
      },
      design: {
        tr: "Saha yeşili yerine koyu, premium bir arayüz; kart, süre ve skor her an tek bakışta okunur, akış kesintisiz.",
        en: "Instead of pitch green, a dark premium interface; card, timer and score readable at a glance, the flow uninterrupted.",
      },
      value: {
        tr: "Fikirden yayına uçtan uca kendi ürünümüz: içerik üretimi, oyun döngüsü ve arayüz tek elden kurgulandı.",
        en: "Our own product end to end, from idea to release: content pipeline, game loop and interface designed as one.",
      },
      tech: ["React Native", "Expo", "Zustand", "Offline-first"],
    },
  },
  {
    slug: "rias",
    index: "07",
    name: "RIAS",
    category: { tr: "Yapay Zekâ Sesli Asistan", en: "AI Voice Assistant" },
    year: "2026",
    concept: true,
    conceptLabel: { tr: "Kişisel proje", en: "Personal project" },
    summary: {
      tr: "Türkçe konuşan, gerçek zamanlı yapay zekâ sesli asistan; geçmiş konuşmaları hatırlayan epizodik hafızasıyla süreklilik kurar.",
      en: "A Turkish-speaking, real-time AI voice assistant; its episodic memory recalls past conversations and builds continuity.",
    },
    scope: [
      { tr: "Yapay Zekâ", en: "AI" },
      { tr: "Gerçek Zamanlı Ses", en: "Real-time Voice" },
      { tr: "Hafıza Sistemi", en: "Memory System" },
      { tr: "Masaüstü", en: "Desktop" },
    ],
    shot: "/images/work-rias.jpg",
    caseStudy: {
      problem: {
        tr: "Sesli asistanların çoğu her konuşmaya sıfırdan başlar; Türkçede doğal, kesintisiz ve seni hatırlayan bir asistan yoktu.",
        en: "Most voice assistants start every conversation from zero; there was no assistant in Turkish that felt natural, uninterrupted and remembered you.",
      },
      build: {
        tr: "Gemini Live API üzerine kurulu gerçek zamanlı ses hattı; konuşmalardan süzülen epizodik hafıza katmanı asistana geçmiş bağlamı taşıyor.",
        en: "A real-time voice pipeline built on the Gemini Live API; an episodic memory layer distilled from conversations carries past context to the assistant.",
      },
      design: {
        tr: "Arayüz değil konuşma tasarlandı: doğal kesme/araya girme, Türkçe akıcılık ve tutarlı bir asistan karakteri öncelik oldu.",
        en: "We designed the conversation, not the interface: natural interruption, Turkish fluency and a consistent assistant character came first.",
      },
      value: {
        tr: "Yapay zekâ API'lerini gerçek zamanlı, üretim kalitesinde bir ürüne çevirebildiğimizin kanıtı; hafıza mimarisi başka projelere de taşınabilir.",
        en: "Proof we can turn AI APIs into a real-time, production-grade product; the memory architecture is portable to other projects.",
      },
      tech: ["Gemini Live API", "Real-time Audio", "Epizodik Hafıza", "Windows"],
    },
  },
  {
    slug: "design-studio",
    index: "08",
    name: "Design Studio",
    category: { tr: "Canlı Efekt Galerisi & Tema Stüdyosu", en: "Live Effect Gallery & Theme Studio" },
    year: "2026",
    concept: true,
    conceptLabel: { tr: "Dahili araç", en: "Internal tool" },
    summary: {
      tr: "200'den fazla canlı arayüz efekti demosunu tek çatıda toplayan galeri ve tema stüdyosu; projelere hazır efekt/tema kaynağı.",
      en: "A gallery and theme studio collecting 200+ live UI effect demos under one roof; a ready effect/theme source for projects.",
    },
    scope: [
      { tr: "Arayüz Efektleri", en: "UI Effects" },
      { tr: "Tema Sistemi", en: "Theme System" },
      { tr: "Tasarım Aracı", en: "Design Tooling" },
      { tr: "React", en: "React" },
    ],
    shot: "/images/work-design-studio.jpg",
    caseStudy: {
      problem: {
        tr: "Her projede animasyon ve efekt araştırması sıfırdan başlıyordu; denenmiş efektleri canlı görüp seçebileceğimiz bir kaynak gerekiyordu.",
        en: "Every project restarted animation and effect research from zero; we needed a source where proven effects could be seen live and picked.",
      },
      build: {
        tr: "React ve Vite üzerinde, 200'den fazla demonun tek bir kayıt (registry) dosyasından beslendiği modüler bir galeri; yanında renk ve tipografi deneyen tema stüdyosu.",
        en: "A modular gallery on React and Vite where 200+ demos feed from a single registry file; alongside it, a theme studio for exploring color and typography.",
      },
      design: {
        tr: "Galeri kendisi de bir vitrin: her demo kendi kartında canlı çalışır, kategorilere ayrılır ve tek tıkla incelenir.",
        en: "The gallery is a showcase itself: every demo runs live in its own card, grouped by category and inspected in one click.",
      },
      value: {
        tr: "Müşteri projelerinde efekt seçimini saatlerden dakikalara indiren, sürekli büyüyen bir iç kütüphane.",
        en: "A continuously growing internal library that cuts effect selection from hours to minutes on client projects.",
      },
      tech: ["React", "Vite", "CSS/JS Efektleri", "Tema Sistemi"],
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
