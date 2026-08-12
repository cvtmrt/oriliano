// ────────────────────────────────────────────────────────────────
// HİZMETLER — 4 yetkinlik kümesi altında gruplanmış.
// Önceki düz 11'li liste, müşterinin karar sırasına göre kümelendi:
//   BUILD  → işi kur      GROW → müşteri getir
//   INTELLIGENCE → akıllandır   EXPERIENCE → fark ettir
// Her hizmet: no + title { tr, en } + desc { tr, en }.
// Numaralar küme içinde değil, site genelinde tekil (01…16) — editoryal
// index hissi için.
// ────────────────────────────────────────────────────────────────

export const serviceGroups = [
  {
    key: "build",
    label: { tr: "Kurulum", en: "Build" },
    // Kümenin ne vaat ettiği — sol indekste başlığın altında görünür.
    blurb: {
      tr: "İşletmenin dijitalde ayakta duracağı sistemi kurarım.",
      en: "I build the system your business stands on digitally.",
    },
    items: [
      {
        no: "01",
        title: { tr: "Özel Web Tasarımı", en: "Custom Website Design" },
        desc: {
          tr: "Markanıza özel, şablon gibi durmayan; güven veren ve müşteriye dönüştüren web siteleri. Hosting, özel alan adı ve SSL kurulumuyla birlikte teslim ederiz.",
          en: "Brand-specific websites that never feel like a template; they build trust and convert. Delivered with hosting, a custom domain and SSL set up.",
        },
      },
      {
        no: "02",
        title: { tr: "Web Uygulamaları", en: "Web Applications" },
        desc: {
          tr: "Tanıtım sitesinin ötesine geçen, gerçek iş yapan uygulamalar: kullanıcı girişi, veri modeli, iş akışları ve ölçeklenebilir bir arka uç.",
          en: "Applications that go beyond a brochure site and do real work: authentication, data models, workflows and a backend that scales.",
        },
      },
      {
        no: "03",
        title: { tr: "Mobil Uygulama Geliştirme", en: "Mobile App Development" },
        desc: {
          tr: "iOS ve Android için tek kod tabanından, mağazaya hazır mobil uygulamalar; internetsiz bile akıcı çalışan, hızlı ve modern arayüzlerle.",
          en: "Store-ready mobile apps for iOS and Android from a single codebase; fast, modern interfaces that stay fluid even offline.",
        },
      },
      {
        no: "04",
        title: { tr: "E-Ticaret & Ödeme Entegrasyonu", en: "E-Commerce & Payment Integration" },
        desc: {
          tr: "Ürün kataloğu, sepet ve sanal POS / ödeme sistemi entegrasyonu; siparişleri tek panelden yönetin.",
          en: "Product catalog, cart and virtual POS / payment gateway integration; manage orders from a single panel.",
        },
      },
      {
        no: "05",
        title: { tr: "Online Sipariş & QR Menü", en: "Online Ordering & QR Menu" },
        desc: {
          tr: "Aracı platformlara komisyon ödemeden kendi sipariş kanalınız: filtrelenebilir menü, sepet, kapıda ödeme akışı ve masadan okunan QR menü.",
          en: "Your own ordering channel without paying commission to intermediaries: filterable menu, cart, pay-on-delivery flow and a QR menu read right at the table.",
        },
      },
      {
        no: "06",
        title: { tr: "Yönetim Panelleri", en: "Admin Dashboards" },
        desc: {
          tr: "Sitenizi ve işletmenizi kendiniz yönetin: içerik, ürün, sipariş ve raporlar tek ekranda.",
          en: "Run your site and business yourself: content, products, orders and reports on a single screen.",
        },
      },
      {
        no: "07",
        title: { tr: "Hosting, Domain & Teknik Kurulum", en: "Hosting, Domain & Technical Setup" },
        desc: {
          tr: "Hosting, özel alan adı, SSL ve kurumsal e-posta; teknik her şeyi biz kurarız, siz işinize bakarsınız.",
          en: "Hosting, custom domain, SSL and business email; we handle all the technical setup so you can focus on your business.",
        },
      },
    ],
  },
  {
    key: "grow",
    label: { tr: "Büyüme", en: "Grow" },
    blurb: {
      tr: "Kurulan sistemin müşteri getirmesini sağlarım.",
      en: "I make that system bring in customers.",
    },
    items: [
      {
        no: "08",
        title: { tr: "SEO & Google'da Görünürlük", en: "SEO & Google Visibility" },
        desc: {
          tr: "Aramalarda öne çıkın: teknik SEO, içerik yapısı ve hızlı açılış sayfalarıyla Google'da üst sıralara taşırız.",
          en: "Stand out in search: we push you up Google's results with technical SEO, content structure and fast landing pages.",
        },
      },
      {
        no: "09",
        title: { tr: "Google Ads Reklam Yönetimi", en: "Google Ads Management" },
        desc: {
          tr: "Bütçenizi doğru aramalara harcayan, dönüşümü ölçülen reklam kampanyaları; kurulumdan optimizasyona uçtan uca yönetim.",
          en: "Ad campaigns that spend your budget on the right searches with measured conversion; managed end to end, from setup to optimisation.",
        },
      },
      {
        no: "10",
        title: { tr: "Yerel Arama Optimizasyonu", en: "Local Search Optimisation" },
        desc: {
          tr: "Müşteriniz \"yakınımdaki\" diye arattığında sizi bulsun: Google İşletme profili, harita görünürlüğü ve konum odaklı sayfa yapısı.",
          en: "Be there when customers search \"near me\": Google Business profile, map visibility and location-focused page structure.",
        },
      },
      {
        no: "11",
        title: { tr: "Dönüşüm Optimizasyonu", en: "Conversion Optimisation" },
        desc: {
          tr: "Ziyaretçiyi müşteriye çeviren detaylar: net aksiyon yolları, hız, güven unsurları ve ölçüme dayalı iyileştirme.",
          en: "The details that turn visitors into customers: clear action paths, speed, trust signals and measurement-driven iteration.",
        },
      },
      {
        no: "12",
        title: { tr: "Bakım & Büyüme", en: "Maintenance & Growth" },
        desc: {
          tr: "Yayın sonrası performans, SEO ve sürekli iyileştirme ile büyümeyi sürdürürüz.",
          en: "We sustain growth with post-launch performance, SEO and continuous improvement.",
        },
      },
    ],
  },
  {
    key: "intelligence",
    label: { tr: "Zekâ", en: "Intelligence" },
    blurb: {
      tr: "Tekrar eden işi yazılıma ve yapay zekâya devrederim.",
      en: "I hand repetitive work over to software and AI.",
    },
    items: [
      {
        no: "13",
        title: { tr: "Yapay Zekâ Entegrasyonu & Asistanlar", en: "AI Integration & Assistants" },
        desc: {
          tr: "İşinize gömülü yapay zekâ: gerçek zamanlı sesli ve yazılı asistanlar, müşteriyi hatırlayan hafıza sistemleri ve süreçlerinizi hızlandıran akıllı otomasyonlar.",
          en: "AI embedded in your business: real-time voice and chat assistants, memory systems that remember your customers and smart automations that speed up your workflows.",
        },
      },
      {
        no: "14",
        title: { tr: "Otomasyon", en: "Automation" },
        desc: {
          tr: "Elle yapılan tekrarlı işleri sisteme devredin: sipariş bildirimleri, raporlama, veri aktarımı ve servisler arası bağlantılar.",
          en: "Hand repetitive manual work to the system: order notifications, reporting, data transfer and connections between services.",
        },
      },
      {
        no: "15",
        title: { tr: "Yapay Zekâ Görünürlüğü (GEO)", en: "AI Visibility (GEO)" },
        desc: {
          tr: "Markanızın yapay zekâ aramalarında doğru bilgiyle anılmasını sağlarız; özgün içerik ve sağlam teknik altyapıyla dijital itibarınızı yapay zekânın gözünde güçlendiririz.",
          en: "We make sure your brand is referenced with accurate information across AI search; with original content and solid technical groundwork, we strengthen your reputation in the eyes of AI.",
        },
      },
    ],
  },
  {
    key: "experience",
    label: { tr: "Deneyim", en: "Experience" },
    blurb: {
      tr: "Siteyi hatırlanır kılan katmanı eklerim.",
      en: "I add the layer that makes a site memorable.",
    },
    items: [
      {
        no: "16",
        title: { tr: "Arayüz Animasyonları & 3D Deneyimler", en: "UI Animation & 3D Experiences" },
        desc: {
          tr: "Sitenizi sıradanlıktan çıkaran mikro etkileşimler, sinematik geçişler ve tarayıcıda çalışan 3D sahneler; markanıza özel tema ve efekt sistemleriyle.",
          en: "Micro-interactions, cinematic transitions and in-browser 3D scenes that lift your site out of the ordinary; with theme and effect systems tailored to your brand.",
        },
      },
      {
        no: "17",
        title: { tr: "Etkileşimli Arayüzler", en: "Interactive Interfaces" },
        desc: {
          tr: "İmleçle tepki veren, kaydırmaya göre kurgulanan ve kullanıcıyı içine çeken arayüzler; gösteriş için değil, dikkati doğru yere taşımak için.",
          en: "Interfaces that react to the cursor, are choreographed to scroll and pull the user in; not for show, but to move attention to the right place.",
        },
      },
    ],
  },
];

// Düz liste — SEO/şema, sayaç ve eski tüketiciler için geriye dönük uyum.
export const services = serviceGroups.flatMap((g) => g.items);
