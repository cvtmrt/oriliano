import { Reveal } from "./_shared.jsx";
import { CountUp } from "../anim/Interactive.jsx";
import { proofStats, proofPoints } from "../../data/proof.js";
import { useT } from "../../lib/i18n.jsx";

export function Proof() {
  const t = useT();
  return (
    <section className="border-y border-ink/10 bg-night py-20">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-4">
            {proofStats.map((s, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="bg-night p-7 text-center">
                  <CountUp
                    value={s.value}
                    className="block font-display text-4xl font-black tracking-tightest text-gradient sm:text-5xl"
                  />
                  <div className="mt-2 text-xs uppercase tracking-wide text-ash">{t(s.label)}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <ul className="flex flex-col gap-3">
              {proofPoints.map((p, i) => (
                <li key={i} className="flex items-center gap-3 text-base text-ash">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-glow" />
                  {t(p)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
