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
    { href: "#studio", label: { tr: "Studio", en: "Studio" } },
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
      index: { tr: "02 / Yetkinlikler", en: "02 / Capabilities" },
      title: { tr: "Yetkinlikler", en: "Capabilities" },
      sub: { tr: "Strateji, tasarım, yazılım ve büyüme; tek ekipten.", en: "Strategy, design, development and growth; from one team." },
    },
    studio: {
      index: { tr: "03 / Studio", en: "03 / Studio" },
      title: { tr: "Studio", en: "Studio" },
      sub: { tr: "Markanın arkasındaki kişi ve çalışma biçimi.", en: "The person behind the brand and how the work happens." },
    },
    contact: { index: { tr: "04 / İletişim", en: "04 / Contact" } },
  },

  // ── Studio (hakkında) ──────────────────────────────────────────
  studio: {
    // Ana ifade — brief'teki konumlandırma cümlesi.
    statement: {
      tr: "Tek kişilik ajans gibi değil, küçük ama hızlı bir dijital stüdyo gibi çalışıyorum.",
      en: "I don't work like a one-man agency; I work like a small but fast digital studio.",
    },
    body: {
      tr: "Strateji, tasarım, yazılım, yayına alma ve büyüme tek elden ilerliyor. Araya ajans katmanı girmediği için karar hızlı veriliyor, iş erken canlıya çıkıyor ve yayından sonra da sahipsiz kalmıyor.",
      en: "Strategy, design, development, launch and growth all move through one pair of hands. With no agency layer in between, decisions happen fast, work goes live early and nothing is left unattended after launch.",
    },
    // Çalışma aşamaları — süslü "süreç" bölümü değil, tek satırlık şerit.
    phases: [
      { tr: "Strateji", en: "Strategy" },
      { tr: "Tasarım", en: "Design" },
      { tr: "Yazılım", en: "Development" },
      { tr: "Yayın", en: "Launch" },
      { tr: "Büyüme", en: "Growth" },
    ],
    // Kanıt — yalnız doğrulanabilir bilgiler.
    facts: [
      { value: "15+", label: { tr: "Teslim edilen proje", en: "Delivered projects" } },
      { value: "6", label: { tr: "Seçilmiş iş", en: "Selected work" } },
      { value: "CTIS", label: { tr: "Bilkent Üniversitesi mezunu", en: "Bilkent University graduate" } },
      { value: "Ankara", label: { tr: "Merkez, tüm Türkiye'ye", en: "Based here, working Türkiye-wide" } },
    ],
  },

  // ── Stüdyodan (Instagram) ──────────────────────────────────────
  fromStudio: {
    index: { tr: "Stüdyodan", en: "From the Studio" },
    title: { tr: "Stüdyodan", en: "From the Studio" },
    sub: {
      tr: "İşletmelerin dijitalde takıldığı yerler üzerine kısa notlar.",
      en: "Short notes on where businesses get stuck online.",
    },
    follow: { tr: "Instagram'da takip et", en: "Follow on Instagram" },
  },

  // Proje kartları
  // Ok işareti bileşende ayrıca basılır (animasyonlu) — metne ok EKLEME.
  viewCase: { tr: "Detaylara bak", en: "Take a closer look" },
  ownProduct: { tr: "Kendi Ürünümüz", en: "Own Product" },

  // Case (detay) sayfası
  caseAllWork: { tr: "Tüm İşler", en: "All Work" },
  caseNext: { tr: "Sonraki iş", en: "Next project" },
  caseVisitSite: { tr: "Siteyi ziyaret et ↗", en: "Visit the site ↗" },
  caseScope: { tr: "Kapsam", en: "Scope" },
  caseStudyLabel: { tr: "Vaka Çalışması", en: "Case Study" },
  caseScreens: { tr: "Siteden Ekranlar", en: "Screens from the site" },
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

  // Showcase (scroll-driven anasayfa)
  show: {
    heroA: { tr: "Fikri", en: "Ideas," },
    heroB: { tr: "ürüne", en: "turned into" },
    heroC: { tr: "dönüştürüyoruz", en: "products" },
    scroll: { tr: "aşağı kaydır", en: "scroll down" },
    workA: { tr: "Seçili", en: "Selected" },
    workB: { tr: "işler", en: "work" },
    caseA: { tr: "Sonuç", en: "Result" },
    caseB: { tr: "odaklı", en: "driven" },
    caseCta: { tr: "Vakayı incele →", en: "View the case →" },
    servicesA: { tr: "Web · Yazılım", en: "Web · Software" },
    servicesB: { tr: "tasarım", en: "design" },
    stackA: { tr: "Teknoloji", en: "Stack" },
    stackB: { tr: "yığını", en: "we use" },
    processA: { tr: "Süreç", en: "Process" },
    processB: { tr: "beş adım", en: "five steps" },
    proofA: { tr: "Kanıt", en: "Proof" },
    proofB: { tr: "rakamlarla", en: "in numbers" },
    contactLabel: { tr: "Müsait — EST. 2026", en: "Available — EST. 2026" },
    contactA: { tr: "Konuşalım.", en: "Let's talk." },
  },

  // 404
  notFoundTitle: { tr: "Sayfa bulunamadı", en: "Page not found" },
  notFoundBody: {
    tr: "Aradığınız sayfa bulunamadı. Ana sayfaya dönüp işleri inceleyebilirsiniz.",
    en: "The page you are looking for was not found. Head back home to explore the work.",
  },
  backHome: { tr: "Ana sayfaya dön", en: "Back to home" },
};
