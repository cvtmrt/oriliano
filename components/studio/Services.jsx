import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHead } from "./_shared.jsx";
import { serviceGroups } from "../../data/services.js";
import { useT, txt } from "../../lib/i18n.jsx";

// ────────────────────────────────────────────────────────────────
// YETKİNLİKLER — 4 kümeli editoryal indeks.
// Masaüstü: solda sticky küme indeksi (Kurulum / Büyüme / Zekâ / Deneyim),
// sağda seçili kümenin hizmetleri büyük tipografiyle. Satıra gelince
// açıklama satır altında açılır — ayrı önizleme kartı YOK (jenerik durur).
// Mobil: kümeler yatay şerit, altında aynı liste.
// Tüm hareket transform/opacity; kümeler arası geçiş yükseklik zıplatmaz.
// ────────────────────────────────────────────────────────────────

const ease = [0.16, 1, 0.3, 1];

export function Services() {
  const t = useT();
  const [group, setGroup] = useState(0);
  const [row, setRow] = useState(0);
  const panelId = useId();

  const active = serviceGroups[group];

  // Küme değişince ilk satırı seçili yap — boş açıklama alanı kalmasın.
  const pickGroup = (i) => {
    setGroup(i);
    setRow(0);
  };

  return (
    <section className="bg-night py-24 sm:py-32">
      <div className="wrap">
        <SectionHead
          id="services"
          index={t(txt.sec.services.index)}
          title={t(txt.sec.services.title)}
          sub={t(txt.sec.services.sub)}
        />

        <div className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
          {/* ── Küme indeksi ─────────────────────────────────────── */}
          <div>
            <div className="lg:sticky lg:top-32">
              {/* Masaüstü: dikey indeks */}
              <ul className="hidden lg:flex lg:flex-col" role="tablist" aria-orientation="vertical">
                {serviceGroups.map((g, i) => {
                  const on = group === i;
                  return (
                    <li key={g.key}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={on}
                        aria-controls={`${panelId}-${g.key}`}
                        onMouseEnter={() => pickGroup(i)}
                        onFocus={() => pickGroup(i)}
                        onClick={() => pickGroup(i)}
                        data-cursor
                        className="group flex w-full items-baseline gap-4 border-b border-ink/10 py-4 text-left"
                      >
                        <span
                          className={`font-mono text-[0.65rem] tabular-nums transition-colors duration-300 ${
                            on ? "text-glow" : "text-steel"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-display text-2xl font-extrabold uppercase tracking-tightest transition-all duration-500 ease-out-expo ${
                            on
                              ? "translate-x-1 text-chalk"
                              : "text-steel group-hover:translate-x-1 group-hover:text-ash"
                          }`}
                        >
                          {t(g.label)}
                        </span>
                        <span
                          className={`ml-auto text-glow transition-all duration-500 ease-out-expo ${
                            on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                          }`}
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Küme vaadi — indeksin altında, sessiz editoryal not */}
              <div className="mt-6 hidden min-h-[3.5rem] lg:block">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={active.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4, ease }}
                    className="max-w-[22ch] text-sm leading-relaxed text-ash"
                  >
                    {t(active.blurb)}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Mobil: yatay küme şeridi */}
              <div
                className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                role="tablist"
              >
                {serviceGroups.map((g, i) => {
                  const on = group === i;
                  return (
                    <button
                      key={g.key}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      aria-controls={`${panelId}-${g.key}`}
                      onClick={() => pickGroup(i)}
                      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 font-mono text-[0.7rem] uppercase tracking-widest transition-colors duration-300 ${
                        on
                          ? "border-glow/60 bg-glow/10 text-glow"
                          : "border-ink/15 text-steel"
                      }`}
                    >
                      {t(g.label)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Seçili kümenin hizmetleri ────────────────────────── */}
          <div
            id={`${panelId}-${active.key}`}
            role="tabpanel"
            aria-label={t(active.label)}
            className="border-t border-ink/10"
          >
            <AnimatePresence mode="wait">
              <motion.ul
                key={active.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease }}
              >
                {active.items.map((s, i) => {
                  const on = row === i;
                  return (
                    <li key={s.no} className="border-b border-ink/10">
                      <button
                        type="button"
                        onMouseEnter={() => setRow(i)}
                        onFocus={() => setRow(i)}
                        onClick={() => setRow(on ? -1 : i)}
                        aria-expanded={on}
                        data-cursor
                        className="group flex w-full items-baseline gap-5 py-5 text-left sm:py-6"
                      >
                        <span
                          className={`font-mono text-[0.65rem] tabular-nums transition-colors duration-300 ${
                            on ? "text-glow" : "text-steel"
                          }`}
                        >
                          {s.no}
                        </span>
                        <span
                          className={`flex-1 font-display text-[1.6rem] font-bold uppercase leading-[1.05] tracking-tightest transition-all duration-500 ease-out-expo sm:text-4xl ${
                            on
                              ? "translate-x-1 text-chalk"
                              : "text-steel group-hover:translate-x-1 group-hover:text-ash"
                          }`}
                        >
                          {t(s.title)}
                        </span>
                      </button>

                      {/* Açıklama — grid-rows tekniğiyle yumuşak açılış,
                          max-h tahmini yok (uzun metinler kırpılmaz). */}
                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo motion-reduce:transition-none ${
                          on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-2xl pb-6 pl-[calc(0.65rem+1.25rem)] text-sm leading-relaxed text-ash sm:text-base">
                            {t(s.desc)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
