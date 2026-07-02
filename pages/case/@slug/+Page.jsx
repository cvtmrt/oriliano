import { useRef } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { BrowserMock, Reveal } from "../../../components/studio/_shared.jsx";
import { Magnetic } from "../../../components/anim/Interactive.jsx";
import { getProject, getAdjacentProjects } from "../../../data/projects.js";
import { site, whatsappLink } from "../../../lib/site.js";
import { useT, txt } from "../../../lib/i18n.jsx";

const FIELD_KEYS = ["problem", "build", "design", "value"];
const ease = [0.16, 1, 0.3, 1];

export default function Page() {
  const t = useT();
  const { routeParams } = usePageContext();
  const p = getProject(routeParams?.slug);

  const heroRef = useRef(null);
  const detailsRef = useRef(null);

  // Mockup parallaks — hero kaydıkça görsel farklı hızda yükselir (transform).
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const mockY = useTransform(heroP, [0, 1], [0, -70]);
  const mockScale = useTransform(heroP, [0, 1], [1, 1.04]);

  // Künye ilerleme çubuğu — detay bölümünde scroll ile dolar (scaleX).
  const { scrollYProgress: detailsP } = useScroll({ target: detailsRef, offset: ["start center", "end end"] });

  if (!p) {
    return (
      <section className="flex min-h-[70vh] items-center bg-night">
        <div className="wrap text-center">
          <span className="eyebrow text-steel">{t(txt.notFoundTitle)}</span>
          <h1 className="mt-6 font-display text-6xl font-black uppercase tracking-tightest text-chalk sm:text-8xl">404</h1>
          <p className="mx-auto mt-6 max-w-md text-ash">{t(txt.notFoundBody)}</p>
          <a href="/#work" className="btn btn-outline mt-10" data-cursor>{t(txt.caseAllWork)}</a>
        </div>
      </section>
    );
  }

  const { next } = getAdjacentProjects(p.slug);

  // Vaka yapısal verisi (JSON-LD) — arama & AI görünürlüğü.
  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.name,
    headline: p.name,
    description: p.summary.tr,
    url: `${site.url}/case/${p.slug}`,
    image: `${site.url}${p.shot}`,
    inLanguage: "tr-TR",
    creator: { "@type": "Organization", name: site.fullName, url: site.url },
    ...(p.url ? { sameAs: p.url } : {}),
    ...(p.year ? { dateCreated: p.year } : {}),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }} />
      {/* Koyu sinematik mini-hero */}
      <section ref={heroRef} className="relative overflow-hidden bg-[#0B0B12] pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-stage-spot opacity-80" />
        <div className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[60vh] w-[120vw] -translate-x-1/2 rounded-[100%] bg-radial-glow opacity-40 blur-3xl" />
        <div className="grain-dark" aria-hidden="true" />

        <div className="wrap relative z-10">
          <a href="/#work" className="eyebrow text-white/50 transition-colors hover:text-white" data-cursor>
            ← {t(txt.caseAllWork)}
          </a>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="font-mono text-sm text-white/40">{p.index}</span>
            <span className="eyebrow text-white/60">{t(p.category)}</span>
            {p.isProduct && (
              <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-ultra text-glow">
                {t(txt.ownProduct)}
              </span>
            )}
            {p.concept && (
              <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-ultra text-white/60">
                {t(p.conceptLabel)}
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-4xl font-display text-5xl font-black uppercase leading-[0.95] tracking-tightest text-white sm:text-7xl lg:text-8xl">
            {p.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">{t(p.summary)}</p>

          {!p.concept && (
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-sm text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline" data-cursor>
              {p.urlLabel} {t(txt.caseVisitSite)}
            </a>
          )}
        </div>

        {/* Büyük ekran mockup'ı — sahnede yükselen + scroll parallaks */}
        <div className="wrap relative z-10 mt-14">
          <motion.div style={{ y: mockY, scale: mockScale }} className="mx-auto max-w-5xl [perspective:1400px]">
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, ease, delay: 0.15 }}
            >
              <div className="shadow-[0_60px_120px_-40px_rgba(0,0,0,0.8)]">
                <BrowserMock shot={p.shot} url={p.concept ? t(p.conceptLabel) : p.urlLabel} label={p.name} eager />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Açık gövde — vaka detayları */}
      <section ref={detailsRef} className="relative bg-night py-20 sm:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Sol: sticky künye + ilerleme çubuğu */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <span className="eyebrow text-steel">{t(txt.caseStudyLabel)}</span>
              <h2 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tightest text-chalk sm:text-4xl">
                {p.name}
              </h2>

              {/* İlerleme çubuğu (yalnız masaüstü) */}
              <div className="mt-6 hidden h-px w-full overflow-hidden bg-ink/10 lg:block">
                <motion.div style={{ scaleX: detailsP }} className="h-full origin-left bg-gradient-to-r from-glow to-violet" />
              </div>

              <div className="mt-8">
                <span className="eyebrow text-steel">{t(txt.caseScope)}</span>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.scope.map((s, i) => (
                    <span key={i} className="rounded-full border border-ink/10 px-3 py-1 text-[0.7rem] uppercase tracking-wide text-ash">
                      {t(s)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <span className="eyebrow text-steel">{t(txt.caseFields.tech)}</span>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.caseStudy.tech.map((tg) => (
                    <span key={tg} className="rounded-full border border-ink/10 bg-ink/[0.03] px-3.5 py-1.5 font-mono text-xs text-ash">
                      {tg}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </aside>

          {/* Sağ: numaralı anlatı alanları */}
          <div className="flex flex-col">
            {FIELD_KEYS.map((key, i) => {
              const highlight = key === "value";
              return (
                <Reveal key={key} delay={i * 0.05}>
                  <div
                    className={
                      highlight
                        ? "mt-8 rounded-3xl border border-ink/10 bg-gradient-to-br from-graphite to-iron p-8 shadow-soft sm:p-10"
                        : "border-b border-ink/10 py-8 first:pt-0"
                    }
                  >
                    <div className="flex items-center gap-4">
                      <span className={`font-mono text-sm ${highlight ? "text-glow" : "text-steel"}`}>
                        0{i + 1}
                      </span>
                      <span className="eyebrow text-steel">{t(txt.caseFields[key])}</span>
                    </div>
                    <p
                      className={`mt-4 leading-relaxed ${
                        highlight
                          ? "font-display text-2xl font-bold tracking-tight text-chalk sm:text-3xl"
                          : "text-xl text-chalk/90 sm:text-2xl"
                      }`}
                    >
                      {t(p.caseStudy[key])}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sonraki iş + CTA */}
      <section className="border-t border-ink/10 bg-coal py-20 sm:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <a href={`/case/${next.slug}`} className="group block" data-cursor>
              <span className="eyebrow text-steel">{t(txt.caseNext)}</span>
              <h3 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tightest text-chalk transition-all duration-500 ease-out-expo group-hover:translate-x-2 group-hover:text-glow sm:text-5xl">
                {next.name} →
              </h3>
              <p className="mt-3 max-w-sm text-sm text-ash">{t(next.category)}</p>
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-ink/10 bg-graphite p-8 shadow-soft sm:p-10">
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tightest text-chalk sm:text-3xl">
                {t(txt.caseCtaTitle)}
              </h3>
              <div className="mt-6 flex flex-wrap gap-4">
                <Magnetic href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-brand">
                  {t(txt.caseCtaButton)}
                </Magnetic>
                <Magnetic href="/#work" className="btn btn-outline">
                  {t(txt.caseAllWork)}
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
