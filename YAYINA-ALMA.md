# Yayına alma — cetinerlegal.com

Bu dosya, onay geldiği anda uygulanacak adımların tamamı. Sırayla gidilecek.
Hazırlık kısmı (Bölüm 0) **12 Ağustos 2026'da tamamlandı**; geri kalanı alan adı
onayı gelince yapılacak.

---

## Durum özeti (12 Ağustos 2026)

| Ne | Durum |
|---|---|
| Site | ✅ Canlı: https://cetiner-hukuk-production.up.railway.app (arama motorlarına kapalı) |
| İçerik + fotoğraflar | ✅ Yüklü |
| Alan adı `cetinerlegal.com` | ✅ Kayıtlı — **Turhost**'ta (ad sunucuları `cpns1/cpns2.turhost.com`) |
| Şu an alan adında ne var | Turhost'un boş "hosting altyapısında barınmaktadır" sayfası |
| Railway özel alan adı | ✅ `www.cetinerlegal.com` servise eklendi — **DNS kaydı girilmediği için doğrulanmadı** |
| E-posta (@cetinerlegal.com) | ✅ Çalışıyor, Turhost'ta — **DNS'te bu yüzden dikkatli olunacak** |
| Kalan tek iş | DNS kaydı + 2 anahtar çevirme |

---

## Neden `www` ana adres, kök alan adı değil?

Kök alan adının (`cetinerlegal.com`) A kaydı `94.199.206.152` — Turhost sunucusu.
Alan adının **MX kaydı da `cetinerlegal.com`**, yani posta trafiği bu A kaydının
gösterdiği yere gidiyor. Kök alan adını Railway'e çevirirsek **firmanın e-postası
durur.**

Ayrıca Turhost'un DNS paneli kökte CNAME/ALIAS desteklemiyor; Railway ise özel
alan adı için CNAME istiyor. İkisi birden bunu tek yola indiriyor:

- **`www.cetinerlegal.com` → Railway** (asıl site)
- **`cetinerlegal.com` → Turhost'ta kalır**, oradan `www`'ya kalıcı yönlendirme
  (301). Posta, SPF ve mevcut Google doğrulaması hiç bozulmadan yerinde kalır.

> Not: İleride kök alan adı da doğrudan Railway'e verilmek istenirse yol,
> DNS'i Cloudflare'e taşıyıp CNAME düzleştirmesi kullanmak — ama o zaman MX/SPF
> kayıtlarının eksiksiz taşınması şart. Açılış için gereksiz risk.

---

## 0. Hazırlık — TAMAMLANDI (12 Ağustos)

- [x] `SITE_URL=https://www.cetinerlegal.com` Railway değişkenlerine eklendi.
- [x] Kanonik olmayan konak koruması: yayından sonra
      `cetiner-hukuk-production.up.railway.app` da açık kalacağı için aynı içerik
      iki adresten görünmesin diye middleware, `SITE_URL` dışındaki her konağa
      `X-Robots-Tag: noindex` başlığı ekliyor. (Yönlendirme değil başlık —
      Railway sağlık kontrolü 3xx'i başarısız sayıyor.)
- [x] `DISALLOW_INDEXING=true` iken artık sayfa etiketleri de `noindex`.
      Açılış tek anahtara bakıyor.
- [x] `npm run typecheck`, `npm run lint`, `npm run build` → temiz.
- [x] Dal `claude/cetiner-hukuk-website-sxw171` push'landı, Railway otomatik
      dağıttı.

### Bugün yapılabilecek tek şey (Turhost paneli gerekiyor)

DNS kayıtlarının **TTL'i şu an 14400 saniye (4 saat)**. Yani yarın kaydı
değiştirdikten sonra yayılması 4 saati bulabilir. Turhost panelinden bugün
`www` kaydının TTL'ini **300**'e düşürürsek yarınki geçiş birkaç dakikada
tamamlanır. (Zorunlu değil, sadece bekleme süresini kısaltır.)

---

## 1. Turhost DNS kayıtları (onay gelince)

Turhost müşteri paneli → ilgili hosting → **cPanel → Bölge Düzenleyicisi
(Zone Editor)** → `cetinerlegal.com`.

**Eklenecek / değiştirilecek iki kayıt:**

| İşlem | Tür | Ad | Değer | TTL |
|---|---|---|---|---|
| Değiştir | CNAME | `www` | `yehr1rfr.up.railway.app` | 300 |
| Ekle | TXT | `_railway-verify.www` | `railway-verify=1555934791768a23ef0368118db101fd160c9616bd8b60c27b3a59e6a4c0a768` | 300 |

`www` şu anda `cetinerlegal.com`'a giden bir CNAME — o kayıt düzenlenecek
(gerekirse silinip yenisi eklenecek). cPanel bazı sürümlerde adı `www` yerine
`www.cetinerlegal.com.` biçiminde ister; sondaki noktayı koruyun.

### ⛔ KESİNLİKLE DOKUNULMAYACAK kayıtlar

Bunlardan biri bozulursa firmanın e-postası durur:

- `cetinerlegal.com` **A** → `94.199.206.152`
- **MX** → `cetinerlegal.com` (öncelik 0)
- **TXT (SPF)** → `v=spf1 +a +mx +ip4:94.199.206.151 +ip4:94.199.206.152 +include:_spf.turhost.com -all`
- **TXT** → `google-site-verification=-McONo7eFJ3n5wJrpbQMpUjnNVssqtpOmBnKNqJLgT0`
  (Google Search Console doğrulaması — sitemap'i buradan göndereceğiz)

### Kök alan adını `www`'ya yönlendirme

Aynı cPanel'de **Yönlendirmeler (Redirects)**:

- Tür: **Kalıcı (301)**
- Kaynak: `cetinerlegal.com`
- Hedef: `https://www.cetinerlegal.com`
- "www yönlendirmesi" seçeneği: **"www yönlendirme"yi seçmeyin** — `www` artık
  Turhost'a gelmiyor, sadece kök alan adı yönlendirilecek.
- "Kelimesi kelimesine yönlendirme (wildcard)" işaretlenebilir, alt sayfalar da
  taşınır.

---

## 2. Doğrulama (kayıtları girdikten sonra)

Yayılmayı beklerken, PowerShell'den:

```powershell
Resolve-DnsName www.cetinerlegal.com -Server 8.8.8.8 -Type CNAME
# beklenen: NameHost = yehr1rfr.up.railway.app

Resolve-DnsName _railway-verify.www.cetinerlegal.com -Server 8.8.8.8 -Type TXT
# beklenen: railway-verify=1555934791...
```

Sonra Railway'in sertifikayı üretmesini bekleyin (genelde 1–5 dakika):

```powershell
cd D:\cetiner-hukuk
railway domain status www.cetinerlegal.com --service cetiner-hukuk
# beklenen: Verified: yes  /  Certificate status: ... ISSUED
```

Sertifika çıkınca:

```powershell
curl.exe -sSI https://www.cetinerlegal.com/tr | Select-Object -First 3
# beklenen: HTTP/2 200
```

---

## 3. Yayın anahtarını çevirme

Alan adı https ile açıldığı **doğrulandıktan sonra**, iki iş:

### 3a. Panelden alan adı alanı — ÖNEMLİ

Panel → **Genel Ayarlar → Alan adı** alanını
`https://www.cetinerlegal.com` yapın ve kaydedin.

Bu alan veritabanında duruyor ve **kanonik adresleri, hreflang'leri, sitemap'i ve
paylaşım görsellerini besliyor.** Şu an `https://cetinerlegal.com` (www'suz)
yazıyor — düzeltilmezse Google'a sitenin adresi olarak yönlendirme sayfası
bildirilir.

Panel girişi: `https://www.cetinerlegal.com/admin?k=<ANAHTAR>`

> ⚠️ **Anahtar bu dosyaya yazılmayacak.** Bu depo herkese açık; buraya yazılan
> her şey GitHub üzerinden aranabilir hâle gelir ve git geçmişinden de bir daha
> tam olarak silinmez. Güncel anahtarın tek adresi Railway'deki
> `ADMIN_GATE_KEY` değişkeni:
>
> ```powershell
> railway variables --service cetiner-hukuk --kv | Select-String ADMIN_GATE_KEY
> ```
>
> Anahtar bir yere sızarsa yenisini üretip aynı değişkene yazmak yeterli;
> eski bağlantı o anda ölür.

### 3b. Arama motorlarını içeri alma

```powershell
cd D:\cetiner-hukuk
railway variables --service cetiner-hukuk --set "DISALLOW_INDEXING=false"
```

Bu, servisi yeniden dağıtır (~1–2 dakika). Dağıtım bitince:

```powershell
curl.exe -sS https://www.cetinerlegal.com/robots.txt
# beklenen: "Allow: /" + "Sitemap: https://www.cetinerlegal.com/sitemap.xml"
```

> Sıra önemli: **önce 3a, sonra 3b.** Ters yapılırsa Google, kanonik adresi
> www'suz gösteren sayfaları tarayabilir.

---

## 4. Yayın sonrası kontrol listesi

```powershell
curl.exe -sS https://www.cetinerlegal.com/sitemap.xml | Select-String "www.cetinerlegal.com" | Select-Object -First 3
curl.exe -sSI https://cetinerlegal.com | Select-Object -First 5   # 301 → www bekleniyor
curl.exe -sSI https://cetiner-hukuk-production.up.railway.app/tr | Select-String "X-Robots-Tag"  # noindex bekleniyor
```

Elle:

- [ ] TR ve EN tüm sayfalar gezilecek, görseller yükleniyor mu
- [ ] Telefon / WhatsApp / e-posta düğmeleri doğru numaraya gidiyor mu
- [ ] İletişim formu gönderilip panel gelen kutusuna düştüğü görülecek
- [ ] Mobilde bir tur
- [ ] Google Search Console → cetinerlegal.com mülkü → Site haritaları →
      `https://www.cetinerlegal.com/sitemap.xml` gönderilecek
      (alan adı doğrulaması TXT ile zaten yapılmış)
- [ ] Firmanın e-postasına bir deneme maili atılıp geldiği doğrulanacak
      (DNS'e dokunulduğu için, kayıtları değiştirmedik ama teyit ucuz)

---

## 5. Geri alma

Bir şey ters giderse tek hamle: Turhost'ta `www` CNAME'ini eski hâline
(`cetinerlegal.com`) döndürün — site Railway adresinden çalışmaya devam eder,
alan adı Turhost sayfasına düşer. TTL 300 ise geri dönüş de dakikalar içinde
olur.

Uygulamada bir sorun çıkarsa Railway → Deployments → önceki dağıtımda
**Redeploy**.

---

## 6. Açık kalan tek eksik: form e-posta bildirimi

`RESEND_API_KEY` tanımlı değil. Bunun sonucu:

- İletişim formu **çalışıyor**, mesaj panelin gelen kutusuna düşüyor. ✅
- Ama firmaya "yeni mesajınız var" e-postası **gitmiyor**. ❌

Yani bir mesajı görmek için panele bakmaları gerekiyor. Yayını engellemez ama
bir hukuk bürosu için gerçek bir eksik. Seçenekler:

1. **Resend** (kod hazır, ücretsiz katmanda ayda 3.000 e-posta): hesap açılır,
   `cetinerlegal.com` doğrulanır — bunun için DNS'e bir DKIM ve bir de gönderim
   alt alan adı kaydı eklemek gerekir. Anahtar Railway'e `RESEND_API_KEY` olarak
   girilir, panelden alıcı adres yazılır, "Test e-postası gönder" ile denenir.
   DNS'e zaten girilecekse en verimli zaman yarın.
2. **Turhost SMTP'si** (firmanın kendi posta kutusu): DNS'e hiç dokunmaz ama
   kodda SMTP desteği yazılması gerekiyor (yarım günlük iş).
3. **Şimdilik böyle kalsın**: panelden takip edilir, sonra eklenir.
