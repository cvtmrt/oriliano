import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Magnetic } from "../anim/Interactive.jsx";
import { CountUp } from "../anim/Interactive.jsx";
import { HeroScene } from "../anim/HeroScene.jsx";
import { projects } from "../../data/projects.js";
import { services } from "../../data/services.js";
import { stackGroups } from "../../data/stack.js";
import { processSteps } from "../../data/process.js";
import { proofStats, proofPoints } from "../../data/proof.js";
import { site, whatsappLink, mailLink } from "../../lib/site.js";
import { useT, txt } from "../../lib/i18n.jsx";

const ease = [0.16, 1, 0.3, 1];

// ────────────────────────────────────────────────────────────────
// SCROLL-DRIVEN SHOWCASE — tek sayfa sunum akışı.
// Sabit "Showcase Canvas" (yüzen tarayıcı mockup'ı) aktif bölüme göre
// morph'lar (yalnız transform+opacity → composite, 60fps). Metin katmanı
// bölüm bazında girer/çıkar (whileInView, once:false).
// Fallback: <1024px / dokunmatik → canvas CSS ile gizli (lg:flex), her
// bölüm kendi statik görseliyle akar. reduced-motion → MotionConfig
// transformları kapatır (Layout'ta global), halkalar CSS reset'iyle durur.
// ────────────────────────────────────────────────────────────────

// Bölüm başına canvas durumu: transform + gösterilen shot + overlay'ler.
const STATES = [
  { x: "23vw", y: "2vh", rx: 8, ry: -22, s: 0.95, shot: 0, glow: 0.3, dim: 0 }, // hero: diyagonal
  { x: "25vw", y: "0vh", rx: 0, ry: 0, s: 1, shot: 0, glow: 0.15, dim: 0 }, // işler: cephe
  { x: "23vw", y: "-3vh", rx: 0, ry: 0, s: 1.32, shot: 1, glow: 0.2, dim: 0 }, // vaka: zoom
  { x: "25vw", y: "0vh", rx: 26, ry: -12, s: 0.92, shot: 2, glow: 0.35, dim: 0, exploded: true }, // hizmet: katmanlı
  { x: "24vw", y: "2vh", rx: 52, ry: 0, s: 1.02, shot: 2, glow: 0.7, dim: 0 }, // stack: tepeden + glow
  { x: "18vw", y: "0vh", rx: 0, ry: 0, s: 0.62, shot: 2, glow: 0.2, dim: 0.55, rings: true }, // süreç: halkalar
  { x: "24vw", y: "0vh", rx: 30, ry: 0, s: 1.04, shot: 1, glow: 0.6, dim: 0 }, // kanıt: readout
  { x: "27vw", y: "-32vh", rx: 14, ry: 0, s: 0.55, shot: 1, glow: 0.4, dim: 0.55, light: true }, // iletişim: ayrılış
];

const SHOTS = projects.filter((p) => !p.concept).slice(0, 3);

function ShowcaseCanvas({ index }) {
  const st = STATES[Math.min(index, STATES.length - 1)] || STATES[0];
  return (
    <div className="pointer-events-none fixed inset-0 z-10 hidden items-center justify-center [perspective:1600px] lg:flex" aria-hidden="true">
      {/* Alt "davet" ışığı (iletişim) */}
      <motion.div
        animate={{ opacity: st.light ? 1 : 0 }}
        transition={{ duration: 1.1, ease }}
        className="absolute inset-x-0 bottom-0 h-[60vh] bg-stage-glow"
      />

      {/* Süreç halkaları — yalnız aktifken mount (boşta rAF maliyeti yok) */}
      {st.rings && (
        <div className="absolute left-[62%] top-1/2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="ring-pulse rounded-full border border-glow/50"
              style={{ width: 260 + i * 200, height: 260 + i * 200, animationDelay: `${i * 0.7}s` }}
            />
          ))}
        </div>
      )}

      {/* Cihaz — tek composite katman; yalnız transform/opacity anime olur */}
      <motion.div
        animate={{ x: st.x, y: st.y, rotateX: st.rx, rotateY: st.ry, scale: st.s }}
        transition={{ duration: 1.15, ease }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-[44vw] max-w-[760px]"
      >
        {/* Kobalt glow (arkada) */}
        <motion.div
          animate={{ opacity: st.glow }}
          transition={{ duration: 1, ease }}
          className="absolute -inset-16 rounded-full bg-radial-glow blur-2xl"
        />

        {/* Tarayıcı çerçevesi */}
        <div className="relative overflow-hidden rounded-xl border border-white/12 bg-[#161616] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85)]">
          <div className="flex items-center gap-2 border-b border-white/8 bg-[#1C1C1C] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-flame/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-glow/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-violet/50" />
            <div className="ml-3 flex-1 truncate rounded-md bg-white/5 px-3 py-0.5 font-mono text-[0.6rem] text-white/45">
              {SHOTS[st.shot]?.urlLabel || "senstudio"}
            </div>
          </div>
          <div className="relative aspect-[16/10] w-full">
            {/* Shot'lar üst üste; crossfade. Hepsi baştan yüklü → swap'ta pop-in yok */}
            {SHOTS.map((p, i) => (
              <motion.div
                key={p.slug}
                animate={{ opacity: st.shot === i ? 1 : 0 }}
                transition={{ duration: 0.7, ease }}
                className="absolute inset-0"
              >
                <picture>
                  <source srcSet={p.shot.replace(/\.jpe?g$/i, ".webp")} type="image/webp" />
                  <img
                    src={p.shot}
                    alt=""
                    decoding="async"
                    className="h-full w-full object-cover object-top"
                  />
                </picture>
              </motion.div>
            ))}
            {/* Karartma (halka/ayrılış sahneleri) */}
            <motion.div
              animate={{ opacity: st.dim }}
              transition={{ duration: 0.9, ease }}
              className="absolute inset-0 bg-[#0E0E0E]"
            />
          </div>
        </div>

        {/* "Exploded" cam katmanlar — yalnız hizmet sahnesinde görünür */}
        <motion.div
          animate={{ opacity: st.exploded ? 1 : 0, x: st.exploded ? -56 : -20, y: st.exploded ? -44 : 0 }}
          transition={{ duration: 0.9, ease }}
          className="glass-dark absolute left-6 top-8 h-24 w-44 rounded-xl"
        />
        <motion.div
          animate={{ opacity: st.exploded ? 1 : 0, x: st.exploded ? 64 : 20, y: st.exploded ? 52 : 0 }}
          transition={{ duration: 0.9, ease, delay: 0.05 }}
          className="glass-dark absolute bottom-6 right-8 h-28 w-52 rounded-xl"
        />

        {/* Zemin yansıması — çok hafif, blur'lu iz */}
        <div className="absolute -bottom-9 inset-x-12 h-8 rounded-[100%] bg-white/10 opacity-25 blur-xl" />
      </motion.div>
    </div>
  );
}

// Bölüm şablonu — 100svh, metin sol; canvas sağda sabit katmanda.
function Panel({ id, children, wide = false }) {
  return (
    <section id={id} className="showcase-panel relative z-20 flex min-h-[100svh] items-center scroll-mt-0">
      <div className="wrap">
        <div className={wide ? "" : "lg:max-w-[44%]"}>{children}</div>
      </div>
    </section>
  );
}

// Metin giriş/çıkışı — bölüme girince yükselir, çıkınca kaybolur (once:false).
function T({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.4, once: false }}
      transition={{ duration: 0.8, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Bold sans + ince serif ikili başlık (bölüm kimliği).
function Duo({ a, b }) {
  return (
    <h2 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tightest text-white sm:text-7xl">
      {a}
      <span className="serif-accent block lowercase tracking-normal text-white/70">{b}</span>
    </h2>
  );
}

// Mobil / dokunmatik fallback görseli (canvas gizliyken bölüm içi statik kare).
function StaticShot({ p }) {
  if (!p) return null;
  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-white/12 lg:hidden">
      <picture>
        <source srcSet={p.shot.replace(/\.jpe?g$/i, ".webp")} type="image/webp" />
        <img src={p.shot} alt={p.name} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover object-top" />
      </picture>
    </div>
  );
}

export function Showcase() {
  const t = useT();
  const [active, setActive] = useState(0);
  const caseP = projects[1]; // vaka vurgusu: AküPort (dönüşüm hikâyesi)

  // Aktif bölüm takibi — IntersectionObserver (scroll dinleyicisi yok, ucuz).
  useEffect(() => {
    const panels = [...document.querySelectorAll(".showcase-panel")];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(panels.indexOf(e.target))),
      { threshold: 0.5 }
    );
    panels.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  // Yumuşak snap — scroll durunca en yakın bölüm başına nazikçe çeker.
  // CSS snap Lenis'le çakışır; Lenis.scrollTo scroll-jack hissi vermeden hizalar.
  // reduced-motion / dokunmatik / dar ekranda tamamen kapalı.
  useEffect(() => {
    const ok = window.matchMedia("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
    if (!ok) return;
    let timer;
    let lock = false;
    const onScroll = () => {
      if (lock) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const panels = document.querySelectorAll(".showcase-panel");
        let best = null;
        let bestD = Infinity;
        panels.forEach((p) => {
          const d = p.getBoundingClientRect().top;
          if (Math.abs(d) < Math.abs(bestD)) { bestD = d; best = p; }
        });
        if (best && Math.abs(bestD) > 10 && Math.abs(bestD) < window.innerHeight * 0.3) {
          lock = true;
          window.__lenis?.scrollTo(best, { duration: 0.8 });
          setTimeout(() => { lock = false; }, 900);
        }
      }, 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(timer); };
  }, []);

  return (
    <div className="relative bg-night text-chalk">
      {/* Sahne atmosferi (statik — kare maliyeti yok) */}
      <div className="pointer-events-none absolute inset-0 bg-stage-spot" />
      <div className="grain-dark" aria-hidden="true" />

      {/* Gerçek 3D sahne — sıvı-cam blob, bölümden bölüme süzülür (WebGL).
          Mockup'ın (z-10) ve metnin (z-20) arkasında sabit katman. */}
      <div className="pointer-events-none fixed inset-0 z-[5]">
        <HeroScene active={active} />
      </div>

      <ShowcaseCanvas index={active} />

      {/* S1 — HERO */}
      <Panel id="top">
        <T>
          <span className="eyebrow text-white/55">{t(txt.heroEyebrow)}</span>
        </T>
        <T delay={0.08}>
          <h1 className="mt-6 font-display font-black uppercase leading-[0.88] tracking-tightest text-white text-[clamp(2.8rem,6.5vw,6.5rem)]">
            {t(txt.show.heroA)} {t(txt.show.heroB)}
            <span className="serif-accent block lowercase tracking-normal text-gradient-shimmer">
              {t(txt.show.heroC)}
            </span>
          </h1>
        </T>
        <T delay={0.16}>
          <p className="mt-7 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">{t(txt.heroPara)}</p>
        </T>
        <T delay={0.24}>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic href="#work" className="btn btn-brand">{t(txt.heroCtaWork)}</Magnetic>
            <Magnetic href="#contact" className="btn btn-outline border-white/20 text-white hover:border-white hover:text-white">
              {t(txt.heroCtaStart)}
            </Magnetic>
          </div>
        </T>
        <StaticShot p={SHOTS[0]} />
        {/* Aşağı kaydır — merkezde küçük lowercase */}
        <div className="pointer-events-none absolute inset-x-0 bottom-7 hidden justify-center lg:flex">
          <span className="font-mono text-[0.65rem] lowercase tracking-ultra text-white/40">
            {t(txt.show.scroll)} ↓
          </span>
        </div>
      </Panel>

      {/* S2 — SEÇİLİ İŞLER */}
      <Panel id="work">
        <T><Duo a={t(txt.show.workA)} b={t(txt.show.workB)} /></T>
        <T delay={0.1}>
          <ul className="mt-10 flex flex-col border-t border-white/10">
            {projects.map((p, i) => (
              <li key={p.slug} className="border-b border-white/10">
                <a href={`/case/${p.slug}`} data-cursor className="group flex items-baseline gap-4 py-4 transition-transform duration-500 ease-out-expo hover:translate-x-2">
                  <span className="font-mono text-xs text-glow">{p.index}</span>
                  <span className="flex-1 font-display text-xl font-bold uppercase tracking-tight text-white transition-colors group-hover:text-glow sm:text-2xl">
                    {p.name}
                  </span>
                  <span className="hidden font-mono text-[0.65rem] uppercase tracking-wide text-white/45 sm:block">
                    {t(p.category)} · {p.year}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </T>
        <StaticShot p={SHOTS[0]} />
      </Panel>

      {/* S3 — VAKA VURGUSU */}
      <Panel id="case">
        <T>
          <span className="eyebrow text-glow">{t(caseP.category)}</span>
        </T>
        <T delay={0.06}><div className="mt-4"><Duo a={t(txt.show.caseA)} b={t(txt.show.caseB)} /></div></T>
        <T delay={0.14}>
          <p className="mt-7 max-w-lg text-base leading-relaxed text-white/70">{t(caseP.caseStudy.value)}</p>
        </T>
        <T delay={0.2}>
          <div className="mt-8 flex items-end gap-4">
            <CountUp value={proofStats[2].value} className="font-display text-6xl font-black tabular-nums tracking-tightest text-gradient sm:text-7xl" />
            <span className="pb-2 font-mono text-[0.65rem] uppercase tracking-ultra text-white/50">
              {t(proofStats[2].label)}
            </span>
          </div>
          <a href={`/case/${caseP.slug}`} data-cursor className="mt-8 inline-block font-mono text-xs uppercase tracking-ultra text-white underline-offset-4 transition-colors hover:text-glow hover:underline">
            {t(txt.show.caseCta)}
          </a>
        </T>
        <StaticShot p={SHOTS[1]} />
      </Panel>

      {/* S4 — HİZMETLER */}
      <Panel id="services">
        <T><Duo a={t(txt.show.servicesA)} b={t(txt.show.servicesB)} /></T>
        <T delay={0.1}>
          <ul className="mt-10 grid gap-x-10 gap-y-3 border-t border-white/10 pt-6 sm:grid-cols-2">
            {services.slice(0, 8).map((s) => (
              <li key={s.no} className="flex items-baseline gap-3">
                <span className="font-mono text-[0.65rem] text-glow">{s.no}</span>
                <span className="text-sm text-white/85">{t(s.title)}</span>
              </li>
            ))}
          </ul>
        </T>
        <StaticShot p={SHOTS[2]} />
      </Panel>

      {/* S5 — TEKNOLOJİ */}
      <Panel id="stack">
        <T><Duo a={t(txt.show.stackA)} b={t(txt.show.stackB)} /></T>
        <T delay={0.1}>
          <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-6">
            {stackGroups.slice(0, 3).map((g) => (
              <div key={g.key}>
                <span className="font-mono text-[0.65rem] uppercase tracking-ultra text-glow">{t(g.label)}:</span>
                <p className="mt-1.5 font-mono text-sm leading-relaxed text-white/75">
                  {g.items.slice(0, 4).map((it) => t(it.name)).join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </T>
      </Panel>

      {/* S6 — SÜREÇ */}
      <Panel id="process">
        <T><Duo a={t(txt.show.processA)} b={t(txt.show.processB)} /></T>
        <T delay={0.1}>
          <ol className="mt-8 flex flex-col gap-3.5 border-t border-white/10 pt-5">
            {processSteps.map((s) => (
              <li key={s.no} className="flex items-baseline gap-5">
                <span className="font-display text-2xl font-black tabular-nums tracking-tightest text-glow/80 sm:text-3xl">{s.no}</span>
                <div>
                  <span className="font-display text-base font-bold uppercase tracking-tight text-white sm:text-lg">{t(s.title)}</span>
                  <p className="mt-0.5 max-w-md text-[0.82rem] leading-relaxed text-white/55">{t(s.desc)}</p>
                </div>
              </li>
            ))}
          </ol>
        </T>
      </Panel>

      {/* S7 — KANIT */}
      <Panel id="proof">
        <T><Duo a={t(txt.show.proofA)} b={t(txt.show.proofB)} /></T>
        <T delay={0.1}>
          <div className="mt-10 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
            {proofStats.map((s, i) => (
              <div key={i}>
                <CountUp value={s.value} className="block font-display text-4xl font-black tabular-nums tracking-tightest text-gradient sm:text-5xl" />
                <span className="mt-1 block font-mono text-[0.65rem] uppercase tracking-wide text-white/50">{t(s.label)}</span>
              </div>
            ))}
          </div>
          <ul className="mt-8 flex flex-col gap-2.5">
            {proofPoints.map((p, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-glow" />
                {t(p)}
              </li>
            ))}
          </ul>
        </T>
      </Panel>

      {/* S8 — STÜDYO + İLETİŞİM */}
      <Panel id="contact" wide>
        <div className="lg:max-w-[60%]">
          <T>
            <span className="font-mono text-[0.65rem] uppercase tracking-ultra text-glow">
              {t(txt.show.contactLabel)}
            </span>
          </T>
          <T delay={0.08}>
            <h2 className="mt-5 font-display font-black uppercase leading-[0.88] tracking-tightest text-white text-[clamp(3rem,8vw,8rem)]">
              {t(txt.show.contactA)}
            </h2>
          </T>
          <T delay={0.16}>
            <p className="mt-6 max-w-xl font-serif text-xl italic leading-snug text-white/70 sm:text-2xl">
              {t(txt.manifesto1)}
            </p>
          </T>
          <T delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-brand">
                {t(txt.ctaWhatsapp)}
              </Magnetic>
              <Magnetic href={mailLink} className="btn btn-outline border-white/20 text-white hover:border-white hover:text-white">
                {t(txt.ctaMail)}
              </Magnetic>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
              {site.social.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="font-mono text-[0.65rem] uppercase tracking-wide text-white/50 transition-colors hover:text-glow">
                  {s.label} ↗
                </a>
              ))}
            </div>
            <p className="mt-8 font-mono text-xs uppercase tracking-ultra text-white/40">
              {site.email} · {site.location}
            </p>
          </T>
        </div>
      </Panel>
    </div>
  );
}
