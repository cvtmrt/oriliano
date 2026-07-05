import { site, mailLink, whatsappLink } from "../../lib/site.js";
import { SceneBackdrop } from "../../components/anim/SceneBackdrop.jsx";

// KVKK / Gizlilik Politikası — TASLAK. Yayına almadan önce bir hukukçuya
// gözden geçirtmeniz önerilir. Şirket ünvanı/adresi netleşince güncelleyin.
const updated = "1 Temmuz 2026";

export default function Page() {
  return (
    <article className="bg-night">
      {/* Koyu mini-hero */}
      <section className="relative overflow-hidden bg-night pb-14 pt-32 text-white sm:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-stage-spot opacity-70" />
        {/* Sağda çok kısık sahne yankısı — metin okunurluğunu bozmaz */}
        <SceneBackdrop state={{ x: 1.9, y: 0.35, s: 0.5, o: 0.35 }} />
        <div className="wrap relative z-10">
          <a href="/" className="eyebrow text-white/50 transition-colors hover:text-white">← Ana sayfa</a>
          <h1 className="mt-6 font-display text-5xl font-black uppercase tracking-tightest sm:text-7xl">
            Gizlilik &amp; KVKK
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            Kişisel verilerinizi nasıl işlediğimize dair aydınlatma metni.
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-ultra text-white/40">
            Son güncelleme: {updated}
          </p>
        </div>
      </section>

      {/* İçerik */}
      <section className="py-16 sm:py-24">
        <div className="wrap max-w-3xl">
          <div className="rounded-2xl border border-glow/20 bg-brand-soft p-5 text-sm leading-relaxed text-ash">
            <strong className="text-chalk">Not:</strong> Bu metin bir taslaktır. Şirket ünvanınız,
            adresiniz ve kullandığınız araçlar netleştikten sonra güncellenmeli ve yayına almadan
            önce bir hukuk danışmanına gözden geçirtilmelidir.
          </div>

          <Section title="1. Veri Sorumlusu">
            <p>
              Bu web sitesi <strong className="text-chalk">{site.fullName}</strong> tarafından
              işletilmektedir. Veri sorumlusuna aşağıdaki kanallardan ulaşabilirsiniz:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>E-posta: <a href={mailLink} className="text-glow hover:underline">{site.email}</a></li>
              <li>WhatsApp: <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-glow hover:underline">{site.phoneDisplay}</a></li>
              <li>Konum: {site.location}</li>
            </ul>
          </Section>

          <Section title="2. İşlenen Kişisel Veriler">
            <p>Bu sitede yalnızca aşağıdaki sınırlı veriler işlenebilir:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li><strong className="text-chalk">İletişim verileri:</strong> E-posta veya WhatsApp üzerinden bize ulaştığınızda paylaştığınız ad, iletişim bilgisi ve mesaj içeriği.</li>
              <li><strong className="text-chalk">Kullanım verileri:</strong> Onay vermeniz halinde, ziyaret istatistikleri için anonimleştirilmiş analiz verileri (aşağıdaki "Çerezler" bölümüne bakınız).</li>
            </ul>
          </Section>

          <Section title="3. İşleme Amaçları">
            <ul className="list-disc space-y-1 pl-5">
              <li>Taleplerinize ve tekliflere yanıt vermek, iletişimi yürütmek.</li>
              <li>Siteyi geliştirmek ve trafiği ölçmek (yalnızca çerez onayı verilirse).</li>
              <li>Yasal yükümlülükleri yerine getirmek.</li>
            </ul>
          </Section>

          <Section title="4. Çerezler">
            <p>
              Site, zorunlu teknik çerezler dışında çerez kullanmaz. Ziyaret istatistiği için
              Google Analytics yalnızca <strong className="text-chalk">açık rızanız</strong> ile
              (çerez bildiriminde "Kabul Et") yüklenir; IP adresiniz anonimleştirilir. Onayınızı
              tarayıcınızın site verilerini temizleyerek geri alabilirsiniz.
            </p>
          </Section>

          <Section title="5. Verilerin Aktarımı">
            <p>
              Analiz onayı verirseniz, anonim kullanım verileri hizmet sağlayıcı Google tarafından
              işlenebilir. Bunun dışında verileriniz üçüncü kişilerle pazarlama amacıyla paylaşılmaz.
            </p>
          </Section>

          <Section title="6. Haklarınız (KVKK md. 11)">
            <p>Kişisel verilerinize ilişkin olarak; işlenip işlenmediğini öğrenme, bilgi talep etme,
              düzeltilmesini veya silinmesini isteme ve işlemeye itiraz etme haklarına sahipsiniz.
              Taleplerinizi yukarıdaki e-posta adresine iletebilirsiniz.</p>
          </Section>

          <Section title="7. İletişim">
            <p>
              Gizlilik veya kişisel verilerinizle ilgili her türlü soru için{" "}
              <a href={mailLink} className="text-glow hover:underline">{site.email}</a> adresinden
              bize ulaşabilirsiniz.
            </p>
          </Section>
        </div>
      </section>
    </article>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-10 border-t border-ink/10 pt-8">
      <h2 className="font-display text-2xl font-extrabold uppercase tracking-tightest text-chalk">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-base leading-relaxed text-ash">{children}</div>
    </div>
  );
}
