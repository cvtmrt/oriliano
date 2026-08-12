import { motion } from "framer-motion";
import { SectionHead, Reveal } from "./_shared.jsx";
import { useT, txt } from "../../lib/i18n.jsx";
import { site } from "../../lib/site.js";

// ────────────────────────────────────────────────────────────────
// STUDIO — "hakkımda" değil, konumlandırma bölümü.
// Büyük tek cümle + kısa gövde; altında aşamalar şeridi ve dört
// künye bilgisi. CV listesi, zaman çizelgesi ve rozet yığını YOK.
// Rakamlar data/proof.js yerine i18n'deki doğrulanmış künyeden gelir.
// ────────────────────────────────────────────────────────────────

const ease = [0.16, 1, 0.3, 1];
const inView = { once: true, margin: "-10% 0px" };

export function Studio() {
  const t = useT();

  return (
    <section className="relative overflow-hidden bg-coal py-24 sm:py-32">
      {/* Sessiz atmosfer — tek radyal, parıltı yığını değil */}
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-40" aria-hidden="true" />

      <div className="wrap relative">
        <SectionHead
          id="studio"
          index={t(txt.sec.studio.index)}
          title={t(txt.sec.studio.title)}
          sub={t(txt.sec.studio.sub)}
        />

        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
          {/* ── Ana ifade ─────────────────────────────────────── */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.9, ease }}
              className="max-w-[18ch] font-display text-[clamp(1.9rem,4.4vw,3.4rem)] font-extrabold leading-[1.04] tracking-tightest text-chalk"
            >
              {t(txt.studio.statement)}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.9, ease, delay: 0.12 }}
              className="mt-8 max-w-xl text-base leading-relaxed text-ash"
            >
              {t(txt.studio.body)}
            </motion.p>

            {/* Aşamalar — tek satır, ayraçlı; "süreç" bölümü değil */}
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={inView}
              transition={{ duration: 0.8, ease, delay: 0.24 }}
              className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2"
            >
              {txt.studio.phases.map((p, i) => (
                <li key={i} className="flex items-center gap-3">
                  {i > 0 && (
                    <span className="text-steel/50" aria-hidden="true">
                      /
                    </span>
                  )}
                  <span className="font-mono text-[0.7rem] uppercase tracking-ultra text-ash">
                    {t(p)}
                  </span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* ── Künye ─────────────────────────────────────────── */}
          <div className="lg:pt-2">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-1 lg:gap-y-7">
              {txt.studio.facts.map((f, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className="border-t border-ink/10 pt-4">
                    <dt className="font-display text-2xl font-black tracking-tightest text-glow sm:text-3xl">
                      {f.value}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-snug text-ash">{t(f.label)}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>

            <Reveal delay={0.3}>
              <p className="mt-8 font-mono text-[0.7rem] uppercase tracking-ultra text-steel">
                {site.location}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
