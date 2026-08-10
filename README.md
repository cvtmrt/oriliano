# Çetiner Hukuk ve Danışmanlık — Kurumsal Web Sitesi + Yönetim Paneli

Türkçe/İngilizce iki dilli kurumsal hukuk bürosu sitesi ve içeriğin tamamını
yöneten bir panel. **Sitede hardcode edilmiş tek bir metin veya görsel yoktur** —
her şey veritabanından gelir, kod içinde yalnızca varsayılan değerler bulunur
(`src/content/defaults.ts`).

---

## Kısaca

| | |
|---|---|
| **Çatı** | Next.js 15 (App Router) + TypeScript + Tailwind CSS 3 |
| **Veritabanı** | PostgreSQL (Prisma 6) |
| **Hareket** | Framer Motion — tek kaynak: `src/components/motion.tsx` |
| **Diller** | `/tr` ve `/en`, varsayılan `tr`, yerelleştirilmiş adresler |
| **Otomatik çeviri** | Google Gemini (ücretsiz katman) veya Anthropic `claude-opus-5` |
| **Panel erişimi** | Gizli anahtar kapısı + bcrypt giriş |
| **Görsel depolama** | Railway Volume + `sharp` ile otomatik WebP |
| **Deploy** | Railway (Nixpacks) |

---

## 1. Yerelde çalıştırma

```bash
npm install
cp .env.example .env          # değerleri doldurun
npm run db:migrate            # şema oluştur
npm run db:seed               # örnek içerik
npm run dev                   # http://localhost:3000
```

Yönetici şifresinin karmasını üretmek için:

```bash
npm run hash -- "buraya-guclu-bir-sifre"
```

Çıkan `ADMIN_PASSWORD_HASH=...` satırını `.env` dosyasına yapıştırın.
`SESSION_SECRET` için:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 2. Railway'e deploy

### 2.1 Projeyi ve veritabanını oluştur

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
   → bu repoyu ve `claude/cetiner-hukuk-website-sxw171` dalını seçin.
2. Aynı projede **+ New** → **Database** → **Add PostgreSQL**.

### 2.2 Ortam değişkenleri

Servisin **Variables** sekmesine girin:

| Değişken | Değer |
|---|---|
| `DATABASE_URL` | `${{ Postgres.DATABASE_URL }}` — Railway referansı, elle kopyalamayın |
| `SESSION_SECRET` | 32+ karakter rastgele değer |
| `ADMIN_EMAIL` | Giriş yapacağınız e-posta |
| `ADMIN_PASSWORD_HASH` | `npm run hash` çıktısı |
| `GEMINI_API_KEY` | Otomatik çeviri — ücretsiz katman ([AI Studio](https://aistudio.google.com/apikey)) |
| `ANTHROPIC_API_KEY` | Otomatik çeviri alternatifi (kullandıkça öde) |
| `ADMIN_GATE_KEY` | Panel kapısı — en az 12 karakter rastgele değer |
| `UPLOAD_DIR` | `/data/uploads` |
| `SITE_URL` | `https://cetinerlegal.com` |
| `DISALLOW_INDEXING` | Ön izleme ortamında `true`, canlıda `false` |

> `DATABASE_URL` değerini `${{ Postgres.DATABASE_URL }}` şeklinde referansla
> verin. Şifre değişse bile bağlantı kendiliğinden güncellenir.

> ⚠️ **`NODE_ENV=production` EKLEMEYİN.** npm bunu görünce `devDependencies`'i
> kurmaz; Tailwind, PostCSS ve TypeScript build sırasında gerekli olduğu için
> derleme `Cannot find module 'tailwindcss'` ile düşer. Next.js zaten `build`
> ve `start` sırasında `NODE_ENV`'i kendisi ayarlar.

### 2.3 Görsel deposu için Volume — **atlamayın**

Railway container'ının dosya sistemi **kalıcı değildir**: her deploy'da sıfırlanır.
Volume bağlanmazsa panelden yüklenen tüm görseller ilk deploy'da silinir.

1. Servis → **Settings** → **Volumes** → **New Volume**
2. **Mount path:** `/data`
3. `UPLOAD_DIR` değişkeninin `/data/uploads` olduğundan emin olun.

Doğrulama: panelde **Genel Bakış** sayfasında "Görsel dizini yazılabilir: Evet"
yazmalı. "Hayır" görüyorsanız Volume bağlanmamıştır.

> **Neden Volume, neden S3 değil?** Tek servisli, tek replikalı bir kurulum için
> Volume hem daha az hareketli parça hem sıfır ek maliyet. Görseller
> `/api/media/<dosya>` üzerinden, bir yıllık `immutable` önbellekle servis edilir
> (dosya adı içerikle birlikte değiştiği için güvenli). İleride çoklu replikaya
> geçilirse `src/lib/media.ts` içindeki `storeUpload` / `resolveUploadPath`
> fonksiyonlarını S3 uyumlu bir istemciyle değiştirmek yeterlidir; şema ve panel
> değişmez. **Görseller base64 olarak veritabanına gömülmez.**

### 2.4 İlk deploy ve seed

Migration **başlatma komutunda** çalışır, build'de değil:

```
build → prisma generate && next build
start → prisma migrate deploy && next start
```

> **Neden böyle?** Railway'in özel ağı (`postgres.railway.internal`) yalnızca
> çalışma zamanında erişilebilir; build aşamasında veritabanına ulaşılamaz.
> `prisma migrate deploy` build'e konursa deploy `P1001: Can't reach database
> server` ile düşer. Bu yüzden migration ilk açılışta uygulanır.

Örnek içeriği yüklemenin **üç** yolu var. Railway'de veritabanı yalnızca özel
ağdan (`postgres.railway.internal`) erişilebildiği için `railway run npm run
db:seed` **kendi makinenizden çalışmaz** — Postgres servisine bir TCP proxy
eklemediğiniz sürece.

1. **Panelden (en kolay):** `/admin` → **Araçlar** → *Örnek verileri yükle*.
2. **İlk açılışta:** `SEED_ON_BOOT=true` değişkenini ekleyin; sunucu ilk
   açılışta yükler. Yükledikten sonra `false` yapın.
3. **Yerelde:** kendi veritabanınıza karşı `npm run db:seed`.

Seed **idempotenttir** — tekrar çalıştırmak elle yaptığınız düzenlemeleri ezmez,
yalnızca eksik kayıtları ekler.

### 2.5 Giriş — panelin önünde iki kapı var

`ADMIN_GATE_KEY` tanımlıyken `/admin` adresine anahtarsız gelen bir istek **404**
alır; giriş formu bile görünmez. Bu, bot taramalarını ve kaba kuvvet
denemelerini daha form yüklenmeden keser. 401 yerine 404 döndürülür — 401
"burada bir panel var" bilgisini sızdırır, 404 hiçbir şey söylemez.

1. Bir kez `https://<adres>/admin?k=<ADMIN_GATE_KEY>` adresine gidin.
   Anahtar httpOnly çereze yazılır (180 gün) ve sorgusuz adrese yönlendirilirsiniz.
2. Ardından normal giriş: `ADMIN_EMAIL` + şifreniz. Kullanıcı veritabanında
   yoksa ilk girişte ortam değişkenlerinden oluşturulur.

Bu adresi yer imine ekleyin. Anahtarı kaybederseniz Railway&apos;deki değişkenden
okuyabilir veya değiştirebilirsiniz. `ADMIN_GATE_KEY` boş bırakılırsa kapı
devre dışı kalır (yerel geliştirmede pratik).

---

## 3. `cetinerlegal.com` alan adını bağlama

### 3.1 Railway tarafı

1. Servis → **Settings** → **Networking** → **Custom Domain**
2. `cetinerlegal.com` ekleyin → Railway size bir hedef verir
   (`xxx.up.railway.app` gibi).
3. `www.cetinerlegal.com` için de aynı adımı tekrarlayın.

### 3.2 DNS kayıtları

Kök alan adı (`cetinerlegal.com`) için CNAME kullanılamaz; bu yüzden iki yol var:

**A) Cloudflare ile (önerilen)**

1. Alan adını Cloudflare'e ekleyin, kayıt şirketindeki nameserver'ları
   Cloudflare'inkilerle değiştirin.
2. DNS kayıtları:

   | Tür | Ad | İçerik | Proxy |
   |---|---|---|---|
   | CNAME | `@` | Railway'in verdiği hedef | Turuncu bulut (Proxied) |
   | CNAME | `www` | Railway'in verdiği hedef | Turuncu bulut (Proxied) |

   Cloudflare kökte CNAME'i "CNAME flattening" ile çözer.
3. **SSL/TLS → Overview → Full (strict)** seçin.
   *Flexible seçmeyin*: yönlendirme döngüsü oluşur.
4. **Rules → Redirect Rules** ile `www` → kök yönlendirmesi kurun
   (veya tersi; ikisinden birini kanonik seçin).

**B) Cloudflare'siz**

Kayıt şirketiniz "ALIAS" / "ANAME" / "CNAME flattening" destekliyorsa
(Namecheap, DNSimple, Cloudflare DNS) kökte o kaydı kullanın. Desteklemiyorsa
kökü `www`'ya yönlendirin ve yalnızca `www` için CNAME açın.

### 3.3 Bağlantı sonrası

- Panelde **Genel Ayarlar → Alan adı** alanını `https://cetinerlegal.com` yapın.
  Kanonik adresler, `hreflang`, sitemap ve paylaşım görselleri buradan üretilir.
- `DISALLOW_INDEXING` değişkenini `false` yapın.
- [Google Search Console](https://search.google.com/search-console)'a
  `https://cetinerlegal.com/sitemap.xml` adresini gönderin.

---

## 4. Panelde ne var?

| Bölüm | Ne yapılır |
|---|---|
| **Genel Bakış** | Durum özeti, uyarılar, hızlı başlangıç |
| **Sayfa İçerikleri** | Her sayfanın metinleri ve **her görsel yuvası ayrı ayrı** |
| **Hizmetler** | Ekle/sil/sırala, ikon, kısa açıklama, uzun içerik, görsel, SEO slug |
| **Ekip** | Fotoğraf, unvan, özgeçmiş, uzmanlık, e-posta, LinkedIn |
| **Yayınlar** | Blog altyapısı — **menüden kapalı gelir**, açılınca yayınlanır |
| **Gelen Kutusu** | İletişim formu mesajları, okundu işareti |
| **Görseller** | Yüklenen tüm dosyalar, boyut, silme |
| **Menü** | Etiketler (TR/EN), sıra, görünürlük |
| **SEO** | Sayfa bazlı title/description/OG görseli, noindex |
| **Genel Ayarlar** | Site adı, logo, favicon, vurgu rengi, iletişim, sosyal medya, harita |
| **Terim Sözlüğü** | Çevirinin uyacağı hukuki terim listesi |
| **Araçlar** | Toplu çeviri, başarısızları tekrar dene, örnek verileri temizle |

Panel mobilde de tam işlevseldir (44px dokunma hedefleri, hamburger menü).

---

## 5. Otomatik çeviri nasıl çalışır?

**Türkçe kaynaktır.** Kaydet'e bastığınızda İngilizcesi arka planda üretilir;
kaydet tuşu çeviriyi beklemez.

### Hangi sağlayıcı?

| Sağlayıcı | Değişken | Maliyet |
|---|---|---|
| **Google Gemini** (varsayılan tercih) | `GEMINI_API_KEY` | Ücretsiz katman — bu boyuttaki bir site için fazlasıyla yeterli |
| Anthropic | `ANTHROPIC_API_KEY` | Kullandıkça öde |

İkisi de tanımlıysa Gemini kullanılır; `TRANSLATION_PROVIDER=anthropic` ile
zorlayabilirsiniz. Gemini tarafı resmî REST uç noktasına `fetch` ile gider —
ek bir paket kurulmaz. Model adı `GEMINI_MODEL` ile değiştirilebilir;
verilmezse `gemini-2.5-flash` denenir, bulunamazsa `2.0-flash` ve `1.5-flash`
sırasıyla denenir (model adları zamanla değişiyor).

Anahtarı ekledikten sonra **Araçlar → “Çeviri bağlantısını test et”** ile
doğrulayın; hangi sağlayıcının kullanıldığını da yazar.

Her alanın bir durumu vardır:

| Durum | Anlamı |
|---|---|
| `AUTO` | Otomatik çevrildi |
| `MANUAL` 🔒 | Siz elle düzenlediniz — otomatik çeviri bir daha üzerine yazmaz |
| `PENDING` | Sırada / çevriliyor |
| `FAILED` | Çeviri başarısız; **eski İngilizce metin korundu** |

- İngilizce alana elle yazdığınız anda alan `MANUAL` olur.
- Her alanın yanındaki **Yeniden çevir** düğmesi kilidi kırar ve yeniden çevirir.
- Sayfa başına **Bu sayfayı tümüyle yeniden çevir**, genel olarak
  **Araçlar → Eksikleri çevir** vardır.
- Aynı Türkçe metin iki kez çevrilmez: metnin hash'i saklanır, değişmediyse
  API'ye gidilmez.
- Bir sayfanın alanları **tek istekte** JSON şemasıyla çevrilir — hem hızlı hem
  tutarlı.
- 429/5xx için SDK'nın kendi yeniden denemesi + kuyruk seviyesinde 3 deneme ve
  üstel bekleme vardır.
- Firma adı, kişi adları, "Av." unvanı, adres, telefon, e-posta ve sosyal medya
  kullanıcı adları **çevrilmez**.
- Terim sözlüğü koda gömülü değildir; `GlossaryTerm` tablosundan okunur ve
  panelden düzenlenir.

Hiçbir anahtar tanımlı değilse panel çalışmaya devam eder; İngilizce alanları
elle doldurursunuz, boş kalırsa site Türkçe metni gösterir.

---

## 6. Diller ve adresler

Yol segmentleri dile göre değişir:

| Sayfa | Türkçe | İngilizce |
|---|---|---|
| Anasayfa | `/tr` | `/en` |
| Hakkımızda | `/tr/hakkimizda` | `/en/about` |
| Hizmetlerimiz | `/tr/hizmetlerimiz` | `/en/services` |
| Hizmet detayı | `/tr/hizmetlerimiz/is-hukuku` | `/en/services/labour-law` |
| Avukatlık ve Danışmanlık | `/tr/avukatlik-ve-danismanlik` | `/en/legal-representation-and-advisory` |
| Arabuluculuk | `/tr/arabuluculuk` | `/en/mediation` |
| Ekibimiz | `/tr/ekibimiz` | `/en/team` |
| İletişim | `/tr/iletisim` | `/en/contact` |
| Yayınlar | `/tr/yayinlar` | `/en/publications` |

Bu eşleme `src/lib/routes.ts` içinde tek yerde tanımlıdır. `src/middleware.ts`
gelen yerelleştirilmiş adresi dosya yoluna yeniden yazar (adres çubuğu değişmez)
ve kanonik olmayan adresleri 308 ile doğru adrese taşır — böylece aynı içerik
iki ayrı adresten yayınlanmaz.

Hizmet ve yayın slug'ları TR/EN ayrıdır; İngilizce slug otomatik üretilir ama
panelden elle düzeltilebilir.

---

## 7. SEO

- Sayfa bazlı `title` / `description` panelden (`SeoMeta`).
- Her sayfada `canonical` + tüm diller için `hreflang` + `x-default`.
- OpenGraph ve Twitter kartları; sayfa bazlı veya varsayılan OG görseli.
- `sitemap.xml` — statik sayfalar, hizmetler, ekip ve (açıksa) yayınlar,
  her biri dil alternatifleriyle.
- `robots.txt` — `/admin` ve `/api/` kapalı; `DISALLOW_INDEXING=true` ise her şey kapalı.
- JSON-LD: `LegalService` (her sayfada), `Service`, `Person`, `Article`,
  `BreadcrumbList`. **Uydurma puan, yorum veya ödül alanı yoktur** — yalnızca
  panelden girilen gerçek bilgiler yayınlanır.

---

## 8. Erişilebilirlik

- Semantic HTML, tek `h1`, mantıklı başlık hiyerarşisi.
- "İçeriğe geç" bağlantısı, görünür `:focus-visible` halkası.
- Tüm görsellerin `alt` metni panelden ve iki dilli.
- Dokunma hedefleri en az 44px; mobil menü `Escape` ile kapanır.
- `prefers-reduced-motion` tüm animasyonlarda saygı görür.
- JS kapalıyken içerik kaybolmaz (`no-js` güvenliği).

---

## 9. Proje yapısı

```
prisma/
  schema.prisma          Veri modeli
  seed.ts                İdempotent örnek veri
scripts/
  hash-password.ts       bcrypt karması üretici
src/
  app/
    (site)/[locale]/     Kamuya açık sayfalar (kendi kök layout'u)
    (admin)/admin/       Yönetim paneli (ayrı kök layout)
    api/                 media, contact, admin/media, admin/translation
    sitemap.ts robots.ts
  components/
    motion.tsx           TEK hareket kaynağı (Framer Motion)
    site/                Header, Footer, PageHero, kartlar, JSON-LD…
    admin/               BilingualField, MediaPicker, RichText, formlar…
  content/defaults.ts    Kod içindeki TEK metin kaynağı (varsayılanlar)
  lib/
    content.ts           DB okuma katmanı (React cache + fallback)
    routes.ts nav.ts     Yerelleştirilmiş adres haritası
    auth.ts              Oturum (bcrypt + imzalı çerez + DB oturumu)
    media.ts             Yükleme, WebP dönüşümü, Volume yolu
    translate.ts         Anthropic çağrıları
    translation-queue.ts Kuyruk, durum yönetimi, toplu işlemler
    seo.ts html.ts i18n.ts
  middleware.ts          Dil öneki + adres yeniden yazma
```

---

## 10. Tasarım notları

Palet doğrudan logodan türetildi: **lacivert `#1E2A5E`** (logodaki Ç ve r) +
**antrasit `#4A4A4A`** (gövde), kırık beyaz zemin. Logoda altın yok; bu yüzden
bronz yalnızca ince bir vurgu olarak kullanılıyor ve **panelden değiştirilebilir**.

Başlıklarda serif (Source Serif 4), gövdede sans-serif (Inter) — ikisi de
Türkçe karakterleri tam destekleyen `latin-ext` alt kümesiyle yükleniyor.

Panelden logo yüklenene kadar geçici bir yazı logosu (`Wordmark`) gösterilir;
yapısı verilen logoyu izler ve site adı değişince kendiliğinden uyum sağlar.

Hareket katmanı tek dosyada (`src/components/motion.tsx`): süre/easing
token'ları, `Reveal` / `Stagger` / `TextReveal` primitifleri ve her birinde
`useReducedMotion` desteği. **Aynı elemana hem CSS hem Motion transform
verilmez** — Motion'ın inline style'ı CSS'i ezer ve hover bozulur.

---

## 11. Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | `prisma generate` + `next build` |
| `npm start` | `prisma migrate deploy` + üretim sunucusu |
| `npm run smoke` | 46 kontrollük duman testi (DB gerekir) |
| `npm run typecheck` | TypeScript denetimi |
| `npm run db:migrate` | Yerelde yeni migration |
| `npm run db:deploy` | Bekleyen migration'ları uygula |
| `npm run db:seed` | Örnek içerik (idempotent) |
| `npm run hash -- "sifre"` | bcrypt karması |

---

## 12. Yapılmayanlar / bilinçli tercihler

- **Gerçek içerik yok.** Tüm metinler yer tutucudur; gerçek mahkeme kararı,
  müvekkil adı, referans, ödül veya istatistik **uydurulmamıştır**.
- **Görsel yok.** Yuvalar boş; site kırık görünmez, sakin bir yer tutucu
  gösterir. Görseller panelden yüklenecek.
- **"Avukatlık Ortaklığı" ifadesi hiçbir yerde geçmez.**
- `cetiner.av.tr`'den metin veya görsel kopyalanmamıştır; yalnızca genel his
  (sakin, kurumsal, serif başlık) referans alınmıştır.
