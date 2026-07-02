import { site } from "../lib/site.js";

// Organization + WebSite yapısal verisi (JSON-LD). Arama motorları ve
// yapay zekâ asistanları markayı doğru tanısın (stüdyonun GEO hizmetinin
// kendi sitesinde kanıtı).
const orgSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.fullName,
      url: site.url,
      email: site.email,
      logo: `${site.url}/images/favicon.svg`,
      image: `${site.url}/images/og.jpg`,
      description: site.seoDescription,
      address: { "@type": "PostalAddress", addressLocality: "Ankara", addressCountry: "TR" },
      sameAs: site.social.map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.fullName,
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "tr-TR",
    },
  ],
};

// <head> içeriği — fontlar, favicon, SEO & Open Graph meta.
export default function HeadDefault() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#F3F0E9" />
      <meta name="author" content={site.name} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={site.url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.fullName} />
      <meta property="og:title" content={site.seoTitle} />
      <meta property="og:description" content={site.seoDescription} />
      <meta property="og:url" content={site.url} />
      <meta property="og:image" content={`${site.url}/images/og.jpg`} />
      <meta property="og:locale" content="tr_TR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={site.seoTitle} />
      <meta name="twitter:description" content={site.seoDescription} />
      <meta name="twitter:image" content={`${site.url}/images/og.jpg`} />

      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />

      {/* JS yoksa giriş perdesi/geçiş içeriği gizlemesin */}
      <noscript>
        <style>{`.preloader,.page-curtain{display:none!important}`}</style>
      </noscript>

      {/* Fontlar */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800;900&family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
    </>
  );
}
