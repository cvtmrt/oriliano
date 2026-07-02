import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHead, Reveal } from "./_shared.jsx";
import { services } from "../../data/services.js";
import { useT, txt } from "../../lib/i18n.jsx";

// ────────────────────────────────────────────────────────────────
// HİZMETLER — interaktif liste. Masaüstünde solda sticky ÖNİZLEME kartı,
// sağda hizmet listesi; satırın üstüne gelince önizleme o hizmete geçer.
// Mobilde: dokunINCA açılan akordeon.
// ────────────────────────────────────────────────────────────────

export function Services() {
  const t = useT();
  const [active, setActive] = useState(0);

  return (
    <section className="bg-night py-24 sm:py-32">
      <div className="wrap">
        <SectionHead
          id="services"
          index={t(txt.sec.services.index)}
          title={t(txt.sec.services.title)}
          sub={t(txt.sec.services.sub)}
        />

        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Sticky önizleme (yalnız masaüstü) */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-br from-graphite to-iron shadow-soft">
                <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-70" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={services[active].no}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10"
                  >
                    <span className="font-mono text-sm text-glow">{services[active].no} / {services.length}</span>
                    <div>
                      <span className="block font-display text-[7rem] font-black leading-none tracking-tightest text-gradient">
                        {services[active].no}
                      </span>
                      <h3 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tightest text-chalk">
                        {t(services[active].title)}
                      </h3>
                      <p className="mt-4 max-w-sm text-base leading-relaxed text-ash">
                        {t(services[active].desc)}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Liste */}
          <ul className="flex flex-col border-t border-ink/10">
            {services.map((s, i) => {
              const on = active === i;
              return (
                <li key={s.no} className="border-b border-ink/10">
                  <Reveal delay={i * 0.04}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(on ? -1 : i)}
                    data-cursor
                    className="group flex w-full items-center gap-5 py-5 text-left transition-colors sm:py-6"
                  >
                    <span className={`font-mono text-xs transition-colors ${on ? "text-glow" : "text-steel"}`}>
                      {s.no}
                    </span>
                    <span
                      className={`flex-1 font-display text-2xl font-bold uppercase tracking-tight transition-all duration-500 ease-out-expo sm:text-3xl ${
                        on ? "translate-x-1 text-glow" : "text-chalk group-hover:text-glow"
                      }`}
                    >
                      {t(s.title)}
                    </span>
                    <span
                      className={`text-glow transition-all duration-500 ease-out-expo ${
                        on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                      }`}
                    >
                      →
                    </span>
                  </button>

                  {/* Mobil akordeon açıklaması */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-out-expo lg:hidden ${
                      on ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="pb-5 text-sm leading-relaxed text-ash">{t(s.desc)}</p>
                  </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
