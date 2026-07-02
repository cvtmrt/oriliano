import { Reveal } from "./_shared.jsx";
import { useT, txt } from "../../lib/i18n.jsx";

// ────────────────────────────────────────────────────────────────
// KREM "NEFES" SAHNESİ — koyu sinematik akışı bilinçli kıran editorial
// ara perde: büyük serif pull-quote + drop-cap + üç ilke + özellikler.
// cream/carbon token'ları koyu temadan bağımsız; kontrast ≥4.5:1.
// Animasyon yalnız Reveal (opacity/transform) — reduced-motion güvenli.
// ────────────────────────────────────────────────────────────────

export function Manifesto() {
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-cream py-28 text-carbon sm:py-40">
      <div className="wrap relative">
        <Reveal>
          <span className="eyebrow text-carbon/50">{t(txt.manifestoIndex)}</span>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-4xl font-display text-4xl font-black uppercase leading-[0.92] tracking-tightest text-carbon sm:text-6xl">
            {t(txt.manifesto1)}
          </h2>
        </Reveal>

        {/* Editorial pull-quote */}
        <Reveal delay={0.15}>
          <p className="mt-10 max-w-3xl font-serif text-2xl italic leading-snug text-carbon/85 sm:text-4xl">
            {t(txt.manifesto2)}
          </p>
        </Reveal>

        {/* Üç ilke */}
        <div className="mt-16 grid gap-10 border-t border-carbon/10 pt-12 sm:grid-cols-3">
          {txt.principles.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div>
                <span className="font-display text-2xl font-extrabold uppercase tracking-tightest text-carbon">
                  <span className="mr-3 font-mono text-xs font-normal text-carbon/40">0{i + 1}</span>
                  {t(p.word)}
                </span>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-carbon/65">{t(p.desc)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Özellikler */}
        <Reveal delay={0.1}>
          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-carbon/10 pt-8">
            {txt.traits.map((tr, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-carbon/70">
                <span className="h-1.5 w-1.5 rounded-full bg-glow" aria-hidden="true" />
                {t(tr)}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
