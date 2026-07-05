import { useRef } from "react";
import { motion } from "framer-motion";
import { SectionHead, Reveal } from "./_shared.jsx";
import { stackGroups, marqueeSkills } from "../../data/stack.js";
import { useT, txt } from "../../lib/i18n.jsx";

// ────────────────────────────────────────────────────────────────
// YETKİNLİKLER — üstte SÜRÜKLE-FIRLAT sticker duvarı (fizik momentumlu),
// altında kategori listesi. Stickerları tutup fırlatabilirsin; kutunun
// kenarlarından esner. Konumlar deterministik (SSR/hydration güvenli).
// ────────────────────────────────────────────────────────────────

export function Stack() {
  const t = useT();
  return (
    <section className="overflow-hidden bg-coal py-24 sm:py-32">
      <div className="wrap">
        <SectionHead
          id="stack"
          index={t(txt.sec.stack.index)}
          title={t(txt.sec.stack.title)}
          sub={t(txt.sec.stack.sub)}
        />

        <StickerWall />

        <div className="mt-16 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {stackGroups.map((g, gi) => (
            <Reveal key={g.key} delay={gi * 0.06}>
              <div>
                <h3 className="eyebrow text-glow">{t(g.label)}</h3>
                <ul className="mt-5 flex flex-col gap-px">
                  {g.items.map((it, ii) => (
                    <li key={ii} className="group relative border-b border-ink/10 py-2.5">
                      <span className="text-base text-chalk transition-colors group-hover:text-glow sm:text-lg">
                        {t(it.name)}
                      </span>
                      <span className="block max-h-0 overflow-hidden text-sm text-ash opacity-0 transition-all duration-500 ease-out-expo group-hover:mt-1 group-hover:max-h-16 group-hover:opacity-100">
                        {t(it.note)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Sürükle-fırlat sticker duvarı.
function StickerWall() {
  const boxRef = useRef(null);
  const cols = 4;
  const palette = [
    "from-glow/25 to-violet/15 border-glow/40 text-chalk",
    "from-flame/25 to-glow/15 border-flame/40 text-chalk",
    "from-violet/25 to-glow/15 border-violet/40 text-chalk",
    "from-white/15 to-white/5 border-white/25 text-chalk",
  ];

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 text-steel">
        <span className="font-mono text-[0.65rem] uppercase tracking-ultra">
          ↔ tut · sürükle · fırlat
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div
        ref={boxRef}
        className="relative h-[380px] overflow-hidden rounded-3xl border border-ink/10 bg-white/[0.04] sm:h-[440px]"
      >
        <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-50 blur-2xl" />
        {marqueeSkills.map((s, i) => {
          // Deterministik dağılım (SSR/hydration güvenli).
          const left = 4 + (i % cols) * 23 + ((i * 37) % 9);
          const top = 6 + Math.floor(i / cols) * 22 + ((i * 53) % 8);
          const rot = ((i * 47) % 20) - 10;
          return (
            <motion.button
              key={s}
              type="button"
              drag
              dragConstraints={boxRef}
              dragElastic={0.65}
              dragMomentum
              whileTap={{ scale: 1.12, cursor: "grabbing" }}
              whileHover={{ scale: 1.06 }}
              initial={{ rotate: rot }}
              style={{ left: `${left}%`, top: `${top}%` }}
              className={`absolute cursor-grab select-none rounded-full border bg-gradient-to-br px-4 py-2 font-display text-sm font-bold uppercase tracking-tight shadow-lift active:cursor-grabbing sm:text-base ${palette[i % palette.length]}`}
            >
              {s}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
