# OrhanKemalKoç — Portfolio

Premium, interaktif tek sayfa portfolyo.
**Stack:** Vike (SSR) + React 18 + Tailwind 3 + Framer Motion + GSAP + Lenis — Express sunucu.
Veritabanı yok; tüm içerik `data/` ve `lib/site.js` dosyalarından beslenir.

## Kurulum

```bash
cd D:\studio
npm install
npm run dev        # http://localhost:3000
```

Üretim:

```bash
npm run build
npm start          # NODE_ENV=production
```

## İçeriği düzenleme (kod bilmeden)

| Ne | Dosya |
|----|-------|
| Stüdyo adı, iletişim, sosyal, SEO | `lib/site.js` |
| Projeler + case study metinleri | `data/projects.js` |
| Hizmetler | `data/services.js` |
| Yetkinlikler / stack | `data/stack.js` |
| Süreç adımları | `data/process.js` |
| Rakamlar / kanıt | `data/proof.js` |
| Navbar linkleri | `data/nav.js` |

**Stüdyo adını değiştirmek için:** `lib/site.js` → `name` ve `nameSuffix`.
**WhatsApp/mail:** `lib/site.js` → `whatsapp`, `email`.

## Ekran görüntüleri (mockup'lar)

Proje kartları, görsel yoksa otomatik şık bir placeholder gösterir.
Gerçek ekran görüntüsü eklemek için dosyaları şu adlarla `public/images/` altına koy:

- `work-tavaci.jpg`
- `work-akuport.jpg`
- `work-bilye.jpg`
- `og.jpg` (1200×630 — sosyal paylaşım önizlemesi)

Yol değiştirmek istersen `data/projects.js` içindeki `shot` alanını güncelle.

## Bölümler

Hero · Selected Work · Case Studies · Services · Stack · Process · Studio · Proof · Contact

## Notlar

- Animasyonlar `prefers-reduced-motion` ve dokunmatik cihazlarda otomatik hafifler.
- SEO + Open Graph meta `layouts/HeadDefault.jsx` içinde; `lib/site.js`'ten beslenir.
- Tasarım sistemi `tailwind.config.js` (renk paleti) + `layouts/style.css` (yardımcı sınıflar).
