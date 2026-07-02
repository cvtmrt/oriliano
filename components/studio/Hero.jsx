import { useRef, useEffect } from "react";
import { motion, useTransform, useMotionValue, useSpring } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Magnetic } from "../anim/Interactive.jsx";
import { Marquee } from "../anim/Reveal.jsx";
import { useT, useLang, txt } from "../../lib/i18n.jsx";

const tickerTR = ["Müsait", "Web Tasarım", "Yazılım", "SEO", "QR Menü", "Panel", "Restoran Teknolojisi", "Marka"];
const tickerEN = ["Available", "Web Design", "Software", "SEO", "QR Menu", "Dashboards", "Restaurant Tech", "Brand"];

const ease = [0.16, 1, 0.3, 1];

// Hero sahnesinde yüzen cam araç kartları (marka stack'i).
const tools = [
  { mark: "Fi", name: "Figma", l1: { tr: "Arayüz Tasarımı", en: "UI Design" }, l2: { tr: "Wireframe / Sistem", en: "Wireframe / Systems" }, pos: "left-0 top-[14%]", depth: 30 },
  { mark: "Cl", name: "Claude", l1: { tr: "Tasarım Sistemleri", en: "Design Systems" }, l2: { tr: "Önyüz Kodlama", en: "Frontend Coding" }, pos: "right-0 top-[10%]", depth: 44 },
  { mark: "Re", name: "React / Vike", l1: { tr: "Hızlı Önyüz", en: "Fast Frontend" }, l2: { tr: "SSR / SEO", en: "SSR / SEO" }, pos: "left-[3%] bottom-[16%]", depth: 52 },
  { mark: "No", name: "Node.js", l1: { tr: "Arka Uç", en: "Backend" }, l2: { tr: "REST API / Panel", en: "REST API / Dashboard" }, pos: "right-[2%] bottom-[12%]", depth: 36 },
];

const notes = [
  { text: { tr: "Gözlemle.\nSadeleştir.\nKur.", en: "Observe.\nSimplify.\nBuild." }, pos: "left-[20%] top-[34%]", rot: "-7deg", depth: 64 },
  { text: { tr: "Şablon değil.\nÖzel kurgu.", en: "Not a template.\nCustom build." }, pos: "right-[18%] bottom-[34%]", rot: "6deg", depth: 58 },
];

// Sahnede uçuşan toz zerreleri (spot ışığında).
const motes = [
  { x: "12%", y: "22%", s: 5, d: 0 }, { x: "28%", y: "62%", s: 3, d: 1.4 },
  { x: "44%", y: "30%", s: 4, d: 2.2 }, { x: "60%", y: "70%", s: 3, d: 0.7 },
  { x: "74%", y: "26%", s: 5, d: 3.1 }, { x: "86%", y: "58%", s: 4, d: 1.9 },
  { x: "38%", y: "82%", s: 3, d: 2.7 }, { x: "66%", y: "44%", s: 4, d: 0.4 },
];

export function Hero() {
  const t = useT();
  const { lang } = useLang();
  const ref = useRef(null);

  // Sinematik pinlenen "dalış" — scroll ile başlık büyür, katmanlar
  // derinlikte ayrışır, sahne kararır. Yalnız masaüstü + reduced-motion güvenli.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = ref.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(section);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=90%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
      // 3 katman derinlik: arka blob 0.3x, orta kartlar 0.6x, başlık 1x —
      // dalışta katmanlar farklı hızda ayrışır (parallax storytelling).
      tl.to(q(".hero-headline"), { scale: 1.42, y: -30, ease: "none" }, 0)
        .to(q(".hero-floats"), { yPercent: -32, opacity: 0, ease: "none" }, 0)
        .to(q(".hero-bg"), { yPercent: -10, ease: "none" }, 0)
        .to(q(".hero-fade"), { opacity: 0, y: -24, ease: "none" }, 0.12)
        .to(section, { opacity: 0.1, ease: "none" }, 0.6);
      return () => tl.kill();
    });
    return () => mm.revert();
  }, []);

  // Mouse parallaks — kartlar/notlar imlece göre derinlikli kayar.
  // Düşük stiffness + yüksek damping: sıvı, sinematik takip (sekme yok).
  const mx = useSpring(useMotionValue(0), { stiffness: 42, damping: 22, mass: 0.6 });
  const my = useSpring(useMotionValue(0), { stiffness: 42, damping: 22, mass: 0.6 });
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0B0B12] text-white [perspective:1200px]">
      {/* Sahne atmosferi */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-stage-spot" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-stage-glow" />
      {/* Volumetrik ışık huzmesi (tepeden inen koni) */}
      <div className="light-beam animate-beam" aria-hidden="true" />
      <div className="stage-floor" aria-hidden="true" />
      <div className="hero-bg pointer-events-none absolute -left-1/4 top-1/4 z-0 h-[55vh] w-[55vh] rounded-full bg-radial-glow opacity-50 blur-3xl animate-aurora" />
      <div className="hero-bg pointer-events-none absolute -right-1/4 top-1/3 z-0 h-[50vh] w-[50vh] rounded-full bg-radial-flame opacity-40 blur-3xl animate-aurora" style={{ animationDelay: "-9s", animationDuration: "28s" }} />

      {/* Uçuşan toz zerreleri */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block" aria-hidden="true">
        {motes.map((m, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/40 blur-[1px] animate-floaty"
            style={{ left: m.x, top: m.y, height: m.s, width: m.s, animationDelay: `${m.d}s`, animationDuration: `${6 + m.s}s` }}
          />
        ))}
      </div>
      <div className="grain-dark" aria-hidden="true" />

      {/* Yüzen kartlar + notlar (yalnız geniş ekran) */}
      <div className="hero-floats pointer-events-none absolute inset-0 z-10 hidden lg:block">
        <div className="relative mx-auto h-full max-w-[1440px] px-12">
          {tools.map((tool, i) => (
            <ParallaxItem key={tool.name} mx={mx} my={my} depth={tool.depth} tilt={7} className={`absolute ${tool.pos} w-64`}>
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease, delay: 0.6 + i * 0.12 }}
                className="glass-dark animate-floaty rounded-2xl p-5"
                style={{ animationDelay: `${i * 1.3}s` }}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-glow to-violet font-display text-sm font-black text-white">
                    {tool.mark}
                  </span>
                  <span lang="en" className="font-display text-lg font-bold tracking-tight">{tool.name}</span>
                </div>
                <p className="mt-3 text-sm text-white/75">{t(tool.l1)}</p>
                <p className="text-sm text-white/60">{t(tool.l2)}</p>
              </motion.div>
            </ParallaxItem>
          ))}

          {notes.map((note, i) => (
            <ParallaxItem key={i} mx={mx} my={my} depth={note.depth} className={`absolute ${note.pos} w-40`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease, delay: 1 + i * 0.15 }}
                className="sticky-note whitespace-pre-line rounded-sm px-4 py-3 font-serif text-base italic leading-snug"
                style={{ rotate: note.rot }}
              >
                {t(note.text)}
              </motion.div>
            </ParallaxItem>
          ))}
        </div>
      </div>

      {/* Merkez sahne içeriği */}
      <div className="wrap relative z-20 flex flex-1 flex-col items-center justify-center pt-32 pb-16 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="eyebrow text-white/55"
        >
          {t(txt.heroEyebrow)}
        </motion.span>

        <h1 className="hero-headline mt-7 font-display font-black uppercase leading-[0.86] tracking-tightest text-[clamp(3rem,9vw,8.5rem)]">
          <Words text={t(txt.heroLine1)} delay={0.1} wordClass="headline-3d" />
          <Words text={t(txt.heroLine2)} delay={0.28} wordClass="headline-3d" />
          <Words
            text={t(txt.heroLine3)}
            delay={0.46}
            wordClass="serif-accent lowercase tracking-normal text-gradient-shimmer"
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.7 }}
          className="mt-9 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
        >
          {t(txt.heroPara)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.85 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic href="#work" className="btn btn-brand">{t(txt.heroCtaWork)}</Magnetic>
          <Magnetic href="#contact" className="btn btn-outline border-white/20 text-white hover:border-white hover:text-white">{t(txt.heroCtaStart)}</Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.05 }}
          className="mt-12 flex max-w-2xl flex-wrap justify-center gap-2"
        >
          {txt.heroBadges.map((b, i) => (
            <span key={i} className="rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 text-[0.7rem] font-medium uppercase tracking-wide text-white/60">
              {t(b)}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Kayan ticker şeridi */}
      <motion.div className="hero-fade relative z-20 border-t border-white/10 py-4">
        <Marquee>
          {(lang === "en" ? tickerEN : tickerTR).map((w, i) => (
            <span key={i} className="mx-7 font-display text-lg font-extrabold uppercase tracking-tightest text-white/35 sm:text-2xl">
              {w} <span className="text-glow/60">✦</span>
            </span>
          ))}
        </Marquee>
      </motion.div>

      {/* Scroll göstergesi */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="hero-fade wrap relative z-20 flex items-center gap-4 pb-7"
      >
        <span className="eyebrow text-white/60">{t(txt.scroll)}</span>
        <div className="relative h-px flex-1 overflow-hidden bg-white/10">
          <div className="absolute inset-y-0 left-0 w-1/3 animate-drift bg-gradient-to-r from-transparent via-glow to-transparent" />
        </div>
        <span className="eyebrow text-white/60">{t(txt.heroScrollWork)}</span>
      </motion.div>
    </section>
  );
}

// Kelime kelime maskeli yukarı kayış — her kelime kendi maskesinde,
// 50ms stagger ile. Satır bloğu korunur (layout shift yok).
function Words({ text, delay = 0, wordClass = "" }) {
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
            transition={{ duration: 1.1, ease, delay: delay + i * 0.05 }}
            className={`inline-block ${wordClass}`}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Mouse parallaks taşıyıcı — derinliğe göre imleci ters yönde takip eder.
// tilt > 0 ise imlece göre 3D eğilir (kartlara derinlik hissi).
function ParallaxItem({ children, className = "", depth = 0, tilt = 0, mx, my }) {
  const x = useTransform(mx, (v) => v * -depth);
  const y = useTransform(my, (v) => v * -depth);
  const rotateY = useTransform(mx, (v) => v * tilt);
  const rotateX = useTransform(my, (v) => v * -tilt);
  return (
    <motion.div style={{ x, y, rotateX, rotateY, transformPerspective: 900 }} className={className}>
      {children}
    </motion.div>
  );
}
