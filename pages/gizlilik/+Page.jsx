import { site, mailLink } from "../../lib/site.js";

// ────────────────────────────────────────────────────────────────
// GİZLİLİK & ÇEREZ POLİTİKASI
// Bilerek Türkçe: KVKK kapsamındaki bir aydınlatma metni, hedef kitlesi
// Türkiye'deki ziyaretçiler. Makine çevirisi hukuki metinde zarar verir.
//
// Metin sitenin GERÇEK davranışını anlatır. Pixel'i onaya bağlayan yer
// `components/Consent.jsx`; oradaki mantık değişirse burası da değişmeli.
// ────────────────────────────────────────────────────────────────

const UPDATED = "12 Ağustos 2026";

function H({ children }) {
  return (
    <h2 className="mt-14 font-display text-2xl font-black uppercase tracking-tight text-chalk sm:text-3xl">
      {children}
    </h2>
  );
}

function P({ children }) {
  return <p className="mt-4 leading-relaxed text-ash">{children}</p>;
}

function LI({ children }) {
  return (
    <li className="mt-2.5 leading-relaxed text-ash marker:text-steel">{children}</li>
  );
}

// Çerez tercihini sıfırlar; kutu bir sonraki açılışta tekrar çıkar.
function resetConsent() {
  try {
    localStorage.removeItem("cookie-consent");
  } catch {}
  location.reload();
}

export default function Page() {
  return (
    <section className="bg-night px-0 pb-24 pt-36 sm:pt-44">
      <div className="wrap max-w-3xl">
        <span className="eyebrow text-steel">Yasal</span>
        <h1 className="mt-6 font-display text-4xl font-black uppercase leading-[0.95] tracking-tightest text-chalk sm:text-6xl">
          Gizlilik ve
          <span className="block serif-accent lowercase tracking-normal text-gradient">
            çerez politikası
          </span>
        </h1>
        <p className="mt-6 font-mono text-xs uppercase tracking-ultra text-steel">
          Son güncelleme: {UPDATED}
        </p>

        <H>Kısaca</H>
        <P>
          Bu sitede form yok, üyelik yok, sepet yok. Bana ulaşmak istersen WhatsApp'a
          yazıyorsun ya da e-posta gönderiyorsun. Bunun dışında site, reklamlarımın işe
          yarayıp yaramadığını ölçmek için Meta Pixel kullanıyor — o da yalnızca sen
          kabul edersen çalışıyor. Hiçbir veri satılmıyor, kiralanmıyor, pazarlanmıyor.
        </P>

        <H>Veri sorumlusu</H>
        <P>
          Orhan Kemal Koç — {site.location}. İletişim:{" "}
          <a href={mailLink} className="text-chalk underline underline-offset-4 hover:text-glow">
            {site.email}
          </a>
        </P>

        <H>İşlenen veriler</H>
        <P>
          <strong className="text-chalk">1 · Senin gönderdiklerin.</strong> WhatsApp'tan veya
          e-postadan yazarsan adın, iletişim bilgin ve mesajının içeriği bana ulaşır. Bu
          yazışmalar ilgili uygulamanın (WhatsApp/Meta, Google) altyapısında tutulur ve o
          şirketlerin kendi gizlilik politikalarına tabidir.
        </P>
        <P>
          <strong className="text-chalk">2 · Otomatik toplananlar.</strong> Çerez onayı
          verirsen Meta Pixel şunları kaydeder: IP adresin, tarayıcı ve cihaz bilgin,
          gezdiğin sayfalar, siteye hangi kaynaktan geldiğin ve ziyaret zamanı. Bu veriler
          Meta Platforms Ireland Ltd.'e iletilir. Onay vermezsen pixel hiç yüklenmez ve bu
          verilerin hiçbiri toplanmaz.
        </P>

        <H>Neden işleniyor</H>
        <ul className="mt-4 list-disc pl-5">
          <LI>Talebine cevap vermek, teklif hazırlamak ve işi yürütmek</LI>
          <LI>Instagram ve Facebook reklamlarının performansını ölçmek</LI>
          <LI>Siteyi ziyaret etmiş kişilere yeniden reklam gösterebilmek</LI>
        </ul>

        <H>Hukuki sebep</H>
        <P>
          İletişim verileri için KVKK m.5/2-c (sözleşmenin kurulması veya ifasıyla
          doğrudan ilgili olması) ve m.5/2-f (meşru menfaat). Reklam ve ölçüm çerezleri
          için m.5/1 uyarınca <strong className="text-chalk">açık rıza</strong> — bu yüzden
          pixel, sen kabul etmeden çalışmıyor.
        </P>

        <H>Çerezler</H>
        <P>
          Sitenin çalışması için zorunlu olan teknik çerezler dışında yalnızca Meta Pixel
          kullanılıyor. Tercihini tarayıcının yerel deposunda tutuyorum; bu bir takip
          kaydı değil, sadece "kabul etti / etmedi" bilgisi.
        </P>
        <P>Fikrini değiştirebilirsin:</P>
        <button
          type="button"
          onClick={resetConsent}
          className="mt-5 rounded-full border border-ink/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-ash transition hover:text-chalk"
        >
          Çerez tercihimi sıfırla
        </button>
        <P>
          Ayrıca tarayıcı ayarlarından çerezleri tamamen engelleyebilir,{" "}
          <a
            href="https://www.facebook.com/adpreferences"
            target="_blank"
            rel="noopener noreferrer"
            className="text-chalk underline underline-offset-4 hover:text-glow"
          >
            Meta reklam tercihleri
          </a>{" "}
          sayfasından da sana gösterilen reklamları yönetebilirsin.
        </P>

        <H>Kimlerle paylaşılıyor</H>
        <P>
          Reklam ölçümü kapsamında Meta ile. Site Railway altyapısında barındırıldığı için
          teknik sunucu kayıtları orada oluşur. Bunun dışında hiçbir üçüncü tarafa veri
          aktarılmıyor. Yasal bir zorunluluk doğarsa yetkili mercilere bildirim yapılır.
        </P>

        <H>Saklama süresi</H>
        <P>
          Yazışmalar, iş ilişkisi sürdüğü sürece ve sonrasında yasal saklama süreleri
          boyunca tutulur. Pixel verilerinin saklama süresini Meta belirler; reklam
          hedefleme havuzları azami 180 gün sonra kendiliğinden düşer.
        </P>

        <H>Hakların</H>
        <P>
          KVKK m.11 kapsamında; verilerinin işlenip işlenmediğini öğrenme, bilgi talep
          etme, amacına uygun kullanılıp kullanılmadığını öğrenme, düzeltilmesini veya
          silinmesini isteme ve işlemeye itiraz etme hakkın var. Talebini{" "}
          <a href={mailLink} className="text-chalk underline underline-offset-4 hover:text-glow">
            {site.email}
          </a>{" "}
          adresine yazman yeterli; en geç 30 gün içinde dönüş yapılır.
        </P>

        <p className="mt-16 border-t border-ink/10 pt-8 text-sm leading-relaxed text-steel">
          <span lang="en">
            This page is available in Turkish only, as it covers rights under Turkish data
            protection law (KVKK). For questions in English, write to {site.email}.
          </span>
        </p>

        <a
          href="/"
          className="mt-10 inline-block font-mono text-xs uppercase tracking-ultra text-ash transition-colors hover:text-chalk"
        >
          ← Ana sayfaya dön
        </a>
      </div>
    </section>
  );
}
