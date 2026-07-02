# SenStudio — Sinematik Redesign Prompt

> Bu prompt mevcut kod tabanı (Vike + React 18 + Tailwind 3 + Framer Motion + GSAP + Lenis)
> üzerinde çalışacak şekilde yazıldı. Sıfırdan değil, mevcut mimariyi **yükseltiyoruz.**

---

## ROL & HEDEF

Sen ödüllü (Awwwards / FWA seviyesi) bir creative developer'sın. Elimizde `SenStudio` adında
bir dijital tasarım & yazılım stüdyosu portfolyosu var. Mevcut hali iyi ama "güvenli". Hedefimiz:
**ilk 3 saniyede nefes kesen, kaydırdıkça hikâye anlatan, detaylarında ustalık hissedilen** bir site.

Kural: Mevcut stack'i koru (Vike, React 18, Tailwind, Framer Motion, GSAP + ScrollTrigger, Lenis).
Yeni ağır bağımlılık ekleme; gerekiyorsa sadece hafif eklentiler öner ve gerekçelendir.

## ART DIRECTION (uygulanacak yön)

**Konsept:** "The Studio as a Stage" — koyu, sinematik bir sahne dünyası; her bölüm bir perde/sahne.
Editorial (dergi) tipografi disiplini + parallax storytelling akışı + sinema karanlığı atmosferi.

- **Mod:** Koyu-öncelikli sinematik. Açık krem bölümler yalnızca kontrast "nefes alma" sahneleri olarak.
- **Zemin:** Saf siyah DEĞİL — `#0B0B12 → #050506` derin gradient. OLED smear'dan kaçın.
- **Atmosfer:** Yavaş salınan ambient ışık blob'ları (opacity 0.08–0.12, blur 30–50), ince film grain,
  volumetrik ışık huzmesi. Zaten var olan `stage-spot`, `light-beam`, `aurora` dilini derinleştir.
- **Marka rengi korunur:** kobalt `#2742FF` → violet `#7A5BFF` → flame `#FF5B34` gradienti kimliğin kalbi.
  Accent'i CTA ve tek bir "kahraman kelime" dışında ölçülü kullan — az ama vurucu.
- **Kenar / köşe dili:** Sinematik yüzeylerde yumuşak (radius 16–24), editorial bölümlerde daha keskin
  hairline ayraçlar. İkisini bilinçli ayır, rastgele karıştırma.

### Palet (semantic token olarak tanımla)
```
--bg-deep:   #050506      --bg-base:   #0B0B12     --bg-elevated: #14141C
--surface:   rgba(255,255,255,0.05)               --border: rgba(255,255,255,0.10)
--fg:        #EDEDEF      --fg-muted:  #8A8F98
--brand:     #2742FF      --brand-mid: #7A5BFF     --flame:     #FF5B34
--cream:     #F3F0E9  (kontrast bölüm zemini)      --ink: #16130F (krem üstü metin)
```

### Tipografi (editorial disiplin)
- Display: **Archivo** (mevcut) — 800/900, `tracking-tightest`, `leading-[0.86]`, dev başlıklar.
- Vurgu: **Instrument Serif** italik — yalnızca "kahraman kelime" ve pull-quote'larda.
- Body: **Inter** 400–500, satır yüksekliği 1.5–1.65, ölçü 60–75 karakter.
- Label/meta: **Geist Mono** uppercase `tracking-ultra` — tarih, numara, etiket.
- Ölçek: Hero clamp(3rem, 9vw, 8.5rem). H1:Body kontrast oranı ≥ 5:1 olsun. Sayılar tabular-nums.

## BÖLÜM BÖLÜM YÖNERGE

1. **Preloader** — sayı sayan / logo çizen 1.2s'lik sinematik açılış; sonra perde yukarı kalkar.
   Zaten var olan `PageCurtain` dilini kullan. Reduced-motion'da tamamen atla.
2. **Hero** — mevcut "dalış" (pinned scroll) efektini koru ama derinleştir: 3 katman parallax
   (arka blob 0.3x, orta kartlar 0.6x, başlık 1x). Kahraman başlık kelime kelime maskeli yukarı kayar.
   İmleç parallax'ı daha yumuşak spring ile. İlk kare ekranda "poster" gibi durmalı.
3. **Selected Work** — asimetrik editorial grid + masonry. Kart hover'da: görsel hafif zoom (scale 1.04),
   proje adı satır satır açılır, ince magnetic imleç etkileşimi. Görsel yoksa şık gradient placeholder.
   Kartlar viewport'a girerken 40ms stagger ile.
4. **Case Study geçişi** — shared-element / hero transition: karta tıklayınca görsel büyüyerek
   case sayfasına akar (View Transitions API veya GSAP Flip ile). Yönlü perde geçişi.
5. **Services / Stack / Process** — kaydırma ile ilerleyen "sticky chapter" anlatısı. Her hizmet
   bir satır olarak açılır (accordion değil, scroll-driven reveal). Process adımları sinematik zaman çizelgesi.
6. **Krem "nefes" bölümü** (Studio/Manifesto) — koyu akışı kırar; büyük serif pull-quote, bol boşluk,
   editorial drop-cap. Buraya geçiş göz yormamalı — yumuşak crossfade.
7. **Proof / Rakamlar** — sayaç animasyonu (viewport'a girince, tabular figürler, reduced-motion'da statik).
8. **Contact** — mıknatıslı büyük CTA, gradient dolgu, hover'da gradient içinde kayar. WhatsApp + mail.
   Form varsa: görünür label, blur'da inline validation, hata alan altında, submit'te loading→success.
9. **Footer** — dev tipografik stüdyo adı, marquee, sosyal linkler, EST. 2026.

## HAREKET (motion) İLKELERİ
- Easing tek dil: `cubic-bezier(0.16, 1, 0.3, 1)` (expo.out) giriş, çıkış %60–70 daha hızlı.
- Yalnızca `transform` + `opacity` anime et (layout shift / CLS yok).
- Ekran başına 1–2 kilit eleman anime olsun; her animasyon bir neden-sonuç anlatsın (dekor değil).
- Stagger 30–50ms. Spring fizik hissi (framer `useSpring`) parallax ve kartlarda.
- Sayfa geçişleri yönlü ve mekânsal süreklilikli (Vike transition hook'ları zaten var).

## KALİTE ÇITASI (teslim öncesi checklist)
- [ ] `prefers-reduced-motion`: tüm scroll/parallax/marquee/sayaç kapanır, içerik anında okunur.
- [ ] Kontrast: koyu zeminde ana metin ≥ 4.5:1, ikincil ≥ 3:1; krem zeminde mürekkep metin ≥ 4.5:1.
- [ ] Klavye: görünür focus ring (mevcut çift katman korunur), tab sırası görsel sırayla eşleşir.
- [ ] Dokunma hedefleri ≥ 44px; hover'a bağımlı kritik etkileşim yok.
- [ ] Performans: görseller WebP/AVIF + lazy, aspect-ratio ile CLS < 0.1, GSAP pin'lerde blur'dan kaçın.
- [ ] Responsive doğrulama: 375 / 768 / 1024 / 1440. Mobilde parallax hafifler, yatay scroll yok.
- [ ] İkonlar SVG (Lucide/Heroicons), emoji yok. Tek stroke dili.
- [ ] Semantic renk token'ları (raw hex bileşende yok). SEO/OG meta korunur.

## ÇIKTI BİÇİMİ
1. Önce 2–3 cümlelik art direction özeti + hangi bölümde ne değişiyor listesi.
2. `tailwind.config.js` ve `layouts/style.css` için token/utility güncellemeleri.
3. Bölüm bölüm, mevcut component'leri düzenleyen kod (yeni dosya gerekiyorsa gerekçesiyle).
4. Her adımda erişilebilirlik ve reduced-motion davranışını belirt.
