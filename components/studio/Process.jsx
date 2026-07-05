import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHead } from "./_shared.jsx";
import { processSteps } from "../../data/process.js";
import { useT, txt } from "../../lib/i18n.jsx";

// ────────────────────────────────────────────────────────────────
// SÜREÇ — sticky YIĞIN kartlar. Her adım ekranda yapışır; bir sonraki
// adım üstüne kayarak yığılır. Üstü örtülen kart GSAP ile küçülüp kararır
// (derinlik hissi). Mobil/reduced-motion: sticky yine çalışır, animasyon yok.
// ────────────────────────────────────────────────────────────────

export function Process() {
  const t = useT();
  const wrapRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const wrap = wrapRef.current;
    if (!wrap) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray(".proc-card", wrap);
      const subs = [];
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        subs.push(
          gsap.to(card, {
            scale: 0.92,
            opacity: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top 85%",
              end: "top 30%",
              scrub: true,
            },
          })
        );
      });
      return () => subs.forEach((s) => s.scrollTrigger && s.scrollTrigger.kill());
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="bg-night py-24 sm:py-32">
      <div className="wrap">
        <SectionHead
          id="process"
          index={t(txt.sec.process.index)}
          title={t(txt.sec.process.title)}
          sub={t(txt.sec.process.sub)}
        />
      </div>

      <div ref={wrapRef} className="wrap">
        {processSteps.map((s, i) => (
          <div
            key={s.no}
            className="proc-card sticky origin-top"
            style={{ top: `calc(14vh + ${i * 1.6}rem)` }}
          >
            <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-graphite to-coal p-8 shadow-2xl sm:p-14">
              <span className="pointer-events-none absolute right-6 top-2 font-display text-[8rem] font-black leading-none text-white/[0.04] sm:text-[12rem]">
                {s.no}
              </span>
              <div className="pointer-events-none absolute -left-1/4 top-0 h-full w-1/2 bg-radial-glow opacity-40 blur-3xl" />
              <div className="relative grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-12">
                <span className="font-mono text-sm text-glow">{s.no}</span>
                <div>
                  <h3 className="font-display text-4xl font-extrabold uppercase tracking-tightest text-white sm:text-6xl">
                    {t(s.title)}
                  </h3>
                  <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
                    {t(s.desc)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Yığının son kartından sonra nefes alanı */}
        <div className="h-[10vh]" aria-hidden="true" />
      </div>
    </section>
  );
}
