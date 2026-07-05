import { useRef } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { BrowserMock, Reveal } from "../../../components/studio/_shared.jsx";
import { Magnetic, Tilt } from "../../../components/anim/Interactive.jsx";
import { SceneBackdrop } from "../../../components/anim/SceneBackdrop.jsx";
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
      <section ref={heroRef} className="relative overflow-hidden bg-night pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-stage-spot opacity-80" />
        <div className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[60vh] w-[120vw] -translate-x-1/2 rounded-[100%] bg-radial-glow opacity-40 blur-3xl" />
        {/* Sağda süzülen sıvı-cam blob — başlık solda, çakışma yok; söndürülmüş
            opaklık mockup kontrastını korur. Mobilde hiç mount olmaz. */}
        <SceneBackdrop state={{ x: 1.75, y: 0.45, s: 0.62, o: 0.55 }} />
        <div className="grain-dark" aria-hidden="true" />

        <div className="wrap relative z-10">
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            href="/#work"
            className="inline-block eyebrow text-white/50 transition-colors hover:text-white"
            data-cursor
          >
            ← {t(txt.caseAllWork)}
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <span className="font-mono text-sm text-glow">{p.index}</span>
            <span className="eyebrow text-white/60">{t(p.category)}</span>
            {p.year && <span className="font-mono text-xs text-white/35">{p.year}</span>}
            {p.isProduct && (
              <span className="rounded-full border border-glow/40 px-2.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-ultra text-glow">
                {t(txt.ownProduct)}
              </span>
            )}
            {p.concept && (
              <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-ultra text-white/60">
                {t(p.conceptLabel)}
              </span>
            )}
          </motion.div>

          {/* Kelime kelime maskeli başlık — anasayfa hero'nun dilinde */}
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-black uppercase leading-[0.95] tracking-tightest text-white sm:text-7xl lg:text-8xl">
            <WordsIn text={p.name} delay={0.18} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.4 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl"
          >
            {t(p.summary)}
          </motion.p>

          {!p.concept && (
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
              data-cursor
            >
              {p.urlLabel} {t(txt.caseVisitSite)}
            </motion.a>
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
              <Tilt max={3.5} className="shadow-[0_60px_120px_-40px_rgba(0,0,0,0.8)]">
                <BrowserMock shot={p.shot} url={p.concept ? t(p.conceptLabel) : p.urlLabel} label={p.name} eager />
              </Tilt>
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

          {/* Sağ: numaralı anlatı alanları — hayalet numara + görününce
              soldan çizilen accent çizgisi (transform/opacity) */}
          <div className="flex flex-col">
            {FIELD_KEYS.map((key, i) => {
              const highlight = key === "value";
              return (
                <Reveal key={key} delay={i * 0.05}>
                  {highlight ? (
                    <Tilt max={3} className="mt-8">
                      <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-br from-graphite to-iron p-8 shadow-soft sm:p-10">
                        <div className="pointer-events-none absolute -right-1/4 -top-1/2 h-full w-2/3 bg-radial-glow opacity-60 blur-2xl" />
                        <span className="pointer-events-none absolute -right-3 -bottom-8 select-none font-display text-[9rem] font-black leading-none text-white/[0.04]">
                          0{i + 1}
                        </span>
                        <div className="relative">
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-sm text-glow">0{i + 1}</span>
                            <span className="eyebrow text-steel">{t(txt.caseFields[key])}</span>
                          </div>
                          <p className="mt-4 font-display text-2xl font-bold leading-relaxed tracking-tight text-chalk sm:text-3xl">
                            {t(p.caseStudy[key])}
                          </p>
                        </div>
                      </div>
                    </Tilt>
                  ) : (
                    <div className="relative border-b border-ink/10 py-8 first:pt-0">
                      <span className="pointer-events-none absolute right-0 top-4 select-none font-display text-[6rem] font-black leading-none text-white/[0.03]">
                        0{i + 1}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-sm text-steel">0{i + 1}</span>
                        <span className="eyebrow text-steel">{t(txt.caseFields[key])}</span>
                        <motion.span
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true, margin: "-15% 0px" }}
                          transition={{ duration: 0.9, ease, delay: 0.15 }}
                          className="h-px flex-1 origin-left bg-gradient-to-r from-glow/60 to-transparent"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-4 text-xl leading-relaxed text-chalk/90 sm:text-2xl">
                        {t(p.caseStudy[key])}
                      </p>
                    </div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Siteden ek ekranlar — canlı sayfalardan kareler (lazy + webp) */}
      {p.gallery?.length > 0 && (
        <section className="bg-night pb-20 sm:pb-28">
          <div className="wrap">
            <Reveal>
              <span className="eyebrow text-steel">{t(txt.caseScreens)}</span>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {p.gallery.map((g, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <Tilt max={5}>
                  <figure className="group overflow-hidden rounded-2xl border border-ink/10 bg-graphite shadow-soft transition-colors duration-500 hover:border-glow/40">
                    <div className="overflow-hidden">
                      <picture>
                        <source srcSet={g.shot.replace(/\.jpe?g$/i, ".webp")} type="image/webp" />
                        <img
                          src={g.shot}
                          alt={t(g.caption)}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
                        />
                      </picture>
                    </div>
                    <figcaption className="flex items-center justify-between gap-3 border-t border-ink/10 px-5 py-3 font-mono text-[0.7rem] uppercase tracking-wide text-ash">
                      {t(g.caption)}
                      <span className="text-glow opacity-0 transition-all duration-500 ease-out-expo -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true">→</span>
                    </figcaption>
                  </figure>
                  </Tilt>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sonraki iş + CTA */}
      <section className="border-t border-ink/10 bg-coal py-20 sm:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            {/* Sinematik "sonraki iş" — hover'da arkada sıradaki projenin
                görseli belirir (opacity+scale, compositing-dostu) */}
            <a
              href={`/case/${next.slug}`}
              className="group relative block overflow-hidden rounded-3xl border border-ink/10 p-8 transition-colors duration-500 hover:border-glow/30 sm:p-10"
              data-cursor
            >
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <picture>
                  <source srcSet={next.shot.replace(/\.jpe?g$/i, ".webp")} type="image/webp" />
                  <img
                    src={next.shot}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full scale-110 object-cover object-top opacity-0 transition-all duration-700 ease-out-expo group-hover:scale-100 group-hover:opacity-25"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-r from-coal via-coal/70 to-transparent" />
              </div>
              <div className="relative">
                <span className="eyebrow text-steel">{t(txt.caseNext)}</span>
                <h3 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tightest text-chalk transition-all duration-500 ease-out-expo group-hover:translate-x-2 group-hover:text-glow sm:text-5xl">
                  {next.name} →
                </h3>
                <p className="mt-3 max-w-sm text-sm text-ash">{t(next.category)}</p>
              </div>
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

// Kelime kelime maskeli yukarı kayış — anasayfa hero'daki Words'ün
// vaka başlığı için kopyası (satır bloğu korunur, layout shift yok).
function WordsIn({ text, delay = 0 }) {
  const words = String(text).split(" ");
  return (
    <span className="block">
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.08em] align-top [&:not(:last-child)]:mr-[0.22em]"
        >
          <motion.span
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease, delay: delay + i * 0.06 }}
            className="inline-block"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
