import { createContext, useContext, useState, useEffect } from "react";

// ────────────────────────────────────────────────────────────────
// Basit TR/EN dil altyapısı.
// Varsayılan TR (SSR ile uyumlu); istemcide localStorage'tan okunur.
// ────────────────────────────────────────────────────────────────
const LangContext = createContext({ lang: "tr", setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState("tr");

  useEffect(() => {
    const saved = typeof localStorage !== "undefined" && localStorage.getItem("lang");
    const initial = saved === "tr" || saved === "en" ? saved : "tr";
    setLangState(initial);
    document.documentElement.lang = initial;
  }, []);

  const setLang = (l) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
      document.documentElement.lang = l;
    } catch {}
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

// İki dilli ({ tr, en }) bir değeri aktif dile göre seçer; düz string ise olduğu gibi döner.
export function pick(v, lang) {
  if (v && typeof v === "object" && !Array.isArray(v) && ("tr" in v || "en" in v)) {
    return v[lang] ?? v.tr;
  }
  return v;
}

// Kolaylık: bileşende `const t = useT()` → t(biDilliDeger)
export function useT() {
  const { lang } = useLang();
  return (v) => pick(v, lang);
}

// ────────────────────────────────────────────────────────────────
// UI metinleri (data/ dışındaki sabit arayüz yazıları)
// ────────────────────────────────────────────────────────────────
export const txt = {
  // Header
  headerCta: { tr: "Proje Başlat", en: "Start a Project" },
  menu: { tr: "Menü", en: "Menu" },
  close: { tr: "Kapat", en: "Close" },
  contactLabel: { tr: "İletişim", en: "Contact" },
  followLabel: { tr: "Takip Et", en: "Follow" },

  // Nav (bağlantı etiketleri iki dilli)
  nav: [
    { href: "#work", label: { tr: "İşler", en: "Work" } },
    { href: "#services", label: { tr: "Hizmetler", en: "Services" } },
    { href: "#stack", label: { tr: "Yetkinlikler", en: "Stack" } },
    { href: "#process", label: { tr: "Süreç", en: "Process" } },
    { href: "#contact", label: { tr: "İletişim", en: "Contact" } },
  ],

  // Hero
  heroEyebrow: { tr: "Web Tasarım & Yazılım Stüdyosu", en: "Web Design & Software Studio" },
  heroLine1: { tr: "Dijital ürünler", en: "Digital products" },
  heroLine2: { tr: "özenle", en: "built with" },
  heroLine3: { tr: "tasarlanır", en: "taste" }, // serif gradient vurgu
  heroScrollWork: { tr: "Seçilmiş İşler ↓", en: "Selected Work ↓" },
  heroBadges: [
    { tr: "Web Tasarım", en: "Web Design" },
    { tr: "SEO", en: "SEO" },
    { tr: "Google Ads", en: "Google Ads" },
    { tr: "E-Ticaret", en: "E-Commerce" },
    { tr: "Ödeme Entegrasyonu", en: "Payment Integration" },
    { tr: "Yönetim Paneli", en: "Admin Panel" },
    { tr: "QR Menü", en: "QR Menu" },
    { tr: "Hosting + Domain", en: "Hosting + Domain" },
  ],
  heroPara: {
    tr: "Web sitenizi tasarlıyor; yönetim paneli, hosting ve özel alan adıyla teslim ediyoruz. SEO ve Google Ads ile aramalarda öne çıkarıyor, e-ticaret ve ödeme sistemlerinizi kuruyoruz.",
    en: "We design your website and deliver it with an admin panel, hosting and a custom domain. We push you up the search results with SEO and Google Ads, and set up your e-commerce and payment systems.",
  },
  heroCtaWork: { tr: "İşleri Gör", en: "See Work" },
  heroCtaStart: { tr: "Proje Başlatalım", en: "Start a Project" },
  scroll: { tr: "Kaydır", en: "Scroll" },

  // Bölüm başlıkları (index'ler İngilizce kalır, başlık + alt yazı çevrilir)
  sec: {
    work: {
      index: { tr: "01 / Seçilmiş İşler", en: "01 / Selected Work" },
      title: { tr: "Seçilmiş İşler", en: "Selected Work" },
      sub: { tr: "Markaları dijitalde premium gösteren, iş getiren projeler.", en: "Projects that make brands look premium and drive business." },
    },
    services: {
      index: { tr: "02 / Hizmetler", en: "02 / Services" },
      title: { tr: "Hizmetler", en: "Services" },
      sub: { tr: "Strateji, tasarım, yazılım ve büyüme; tek ekipten.", en: "Strategy, design, development and growth; from one team." },
    },
    stack: {
      index: { tr: "03 / Yetkinlikler", en: "03 / Skills & Stack" },
      title: { tr: "Yetkinlikler", en: "Skills & Stack" },
      sub: { tr: "Modern, hızlı ve sürdürülebilir bir teknoloji yığını.", en: "A modern, fast and maintainable technology stack." },
    },
    process: {
      index: { tr: "04 / Süreç", en: "04 / Process" },
      title: { tr: "Fikirden Yayına", en: "From idea to launch" },
      sub: { tr: "Fikirden yayına; net, öngörülebilir beş adım.", en: "From idea to launch; five clear, predictable steps." },
    },
    contact: { index: { tr: "05 / İletişim", en: "05 / Contact" } },
  },

  // Proje kartları
  viewCase: { tr: "Detaylara bak →", en: "Take a closer look →" },
  ownProduct: { tr: "Kendi Ürünümüz", en: "Own Product" },
  upcomingCta: { tr: "Sıradaki sizin olsun", en: "Yours could be next" },

  // Case (detay) sayfası
  caseAllWork: { tr: "Tüm İşler", en: "All Work" },
  caseNext: { tr: "Sonraki iş", en: "Next project" },
  caseVisitSite: { tr: "Siteyi ziyaret et ↗", en: "Visit the site ↗" },
  caseScope: { tr: "Kapsam", en: "Scope" },
  caseStudyLabel: { tr: "Vaka Çalışması", en: "Case Study" },
  caseCtaTitle: { tr: "Sıradaki iş seninki olsun.", en: "Let yours be the next one." },
  caseCtaButton: { tr: "Proje Başlatalım", en: "Start a Project" },

  // Case study alan etiketleri
  caseFields: {
    problem: { tr: "Problem", en: "Problem" },
    build: { tr: "Ne Yaptık", en: "What we built" },
    design: { tr: "Tasarım Yönü", en: "Design direction" },
    value: { tr: "İş Değeri", en: "Business value" },
    tech: { tr: "Teknik Detaylar", en: "Tech highlights" },
  },

  // Manifesto (krem "nefes" sahnesi)
  manifestoIndex: { tr: "Ara Perde / Manifesto", en: "Interlude / Manifesto" },
  manifesto1: { tr: "Biz sadece web sitesi yapmıyoruz.", en: "We don't just build websites." },
  manifesto2: {
    tr: "Bir markanın internette nasıl göründüğünü, müşterinin neye tıkladığını ve nasıl hatırlandığını tasarlıyoruz.",
    en: "We design how a brand looks online, what the customer clicks and how it is remembered.",
  },
  principles: [
    { word: { tr: "Gözlemle", en: "Observe" }, desc: { tr: "İşi, kullanıcıyı ve problemi önce anlarız.", en: "We understand the business, the user and the problem first." } },
    { word: { tr: "Sadeleştir", en: "Simplify" }, desc: { tr: "Gereksizi atar, en net çözüme indiririz.", en: "We cut the noise and get to the clearest solution." } },
    { word: { tr: "Kur", en: "Build" }, desc: { tr: "Production kalitesinde, ölçeklenebilir kurarız.", en: "We build it scalable, at production quality." } },
  ],
  traits: [
    { tr: "Tasarımı bilen yazılımcılar", en: "Developers who understand design" },
    { tr: "Startup / ürün bakış açısı", en: "Startup / product mindset" },
    { tr: "Restoran & yerel işletme uzmanlığı", en: "Restaurant & local business expertise" },
    { tr: "Sadece güzel site değil, iş getiren sistem", en: "Not just pretty sites, systems that drive business" },
  ],

  // Contact
  contactTitle1: { tr: "Bir sonraki dijital vitrininizi", en: "Let's build your next" },
  contactTitle2: { tr: "birlikte kuralım.", en: "digital presence together." },
  contactPara: {
    tr: "Restoran, yerel işletme, ürün ya da platform fark etmez. Fikirden yayına kadar tasarım, yazılım ve büyüme tarafını birlikte çözelim.",
    en: "Restaurant, local business, product or platform; let's solve design, development and growth together, from idea to launch.",
  },
  ctaWhatsapp: { tr: "WhatsApp'tan Yaz", en: "Message on WhatsApp" },
  ctaMail: { tr: "Mail Gönder", en: "Send an Email" },
  ctaSeeWork: { tr: "İşleri İncele →", en: "See the Work →" },

  // Footer
  footerManifesto: {
    tr: "Markaların internette nasıl göründüğünü, müşterinin neye tıkladığını ve markanın nasıl hatırlandığını tasarlıyoruz.",
    en: "We design how brands look online, what customers click and how brands are remembered.",
  },
  backToTop: { tr: "Yukarı çık ↑", en: "Back to top ↑" },
  rights: { tr: "Tüm hakları saklıdır.", en: "All rights reserved." },

  // 404
  notFoundTitle: { tr: "Sayfa bulunamadı", en: "Page not found" },
  notFoundBody: {
    tr: "Aradığınız sayfa bulunamadı. Ana sayfaya dönüp işleri inceleyebilirsiniz.",
    en: "The page you are looking for was not found. Head back home to explore the work.",
  },
  backHome: { tr: "Ana sayfaya dön", en: "Back to home" },
};
