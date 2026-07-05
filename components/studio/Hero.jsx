import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Magnetic } from "../anim/Interactive.jsx";
import { Marquee } from "../anim/Reveal.jsx";
import { HeroScene } from "../anim/HeroScene.jsx";
import { useT, useLang, txt } from "../../lib/i18n.jsx";

const tickerTR = ["Web Tasarım", "SEO", "Google Ads", "E-Ticaret", "Yönetim Paneli", "Marka"];
const tickerEN = ["Web Design", "SEO", "Google Ads", "E-Commerce", "Dashboards", "Brand"];

const ease = [0.16, 1, 0.3, 1];

// 3D sıvı-cam blob'un hero'daki tek sabit durumu — başlığın arkasında,
// merkezde nefes alır. Kısık opaklık: metin kontrastı önde kalır.
const heroSceneState = [{ x: 0, y: 0.12, s: 1.0, o: 0.85 }];

// Sahnede uçuşan az sayıda toz zerresi (spot ışığında).
const motes = [
  { x: "16%", y: "26%", s: 4, d: 0 }, { x: "30%", y: "68%", s: 3, d: 1.4 },
  { x: "70%", y: "30%", s: 4, d: 2.2 }, { x: "84%", y: "60%", s: 3, d: 0.7 },
  { x: "56%", y: "78%", s: 3, d: 2.7 },
];

// SADE HERO — framerate dili: merkez başlık + kısa açıklama + iki CTA,
// arkada tek 3D sahne. Uçan kartlar / notlar / rozetler / ışık hüzmesi /
// zemin ızgarası kaldırıldı (2026-07-05 "karışık duruyor" geri bildirimi).
export function Hero() {
  const t = useT();
  const { lang } = useLang();

  // PIN'SİZ dalış — sayfa normal akar; hero görünümden çıkarken scroll
  // ilerlemesi HeroScene'in sinematik "journey"sini sürer (kamera blob'a
  // yaklaşır, renkler ısınır, halkalar genişler, blob çözülür) ve metin
  // hafif parallax ile yukarı süzülüp söner. Yalnız transform/opacity +
  // WebGL uniform'ları; mobilde journey otomatik kapalı (coarse).
  const ref = useRef(null);
  const progressRef = useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  useEffect(
    () => scrollYProgress.on("change", (v) => { progressRef.current = v; }),
    [scrollYProgress]
  );
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-night text-white">
      {/* Sahne atmosferi — yalnız spot + zemin parıltısı */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-stage-spot" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-stage-glow" />

      {/* Gerçek 3D sahne — başlığın arkasında nefes alan sıvı-cam blob
          (WebGL, lazy). Koyu cam çekirdeği başlık kontrastını korur. */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <HeroScene states={heroSceneState} progressRef={progressRef} />
      </div>

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

      {/* Merkez sahne içeriği — scroll'da yukarı süzülüp söner */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="wrap relative z-20 flex flex-1 flex-col items-center justify-center pt-28 pb-10 text-center [@media(max-height:900px)]:pt-24 [@media(max-height:900px)]:pb-6"
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="eyebrow text-white/55"
        >
          {t(txt.heroEyebrow)}
        </motion.span>

        <h1 className="mt-6 font-display font-black uppercase leading-[0.92] tracking-tightest text-[clamp(2.6rem,min(7vw,12svh),6.25rem)]">
          <Words text={t(txt.heroLine1)} delay={0.1} />
          <Words text={t(txt.heroLine2)} delay={0.28} />
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
          className="mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
        >
          {t(txt.heroPara)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.85 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic href="#work" className="btn btn-brand">{t(txt.heroCtaWork)}</Magnetic>
          <Magnetic href="#contact" className="btn btn-outline border-white/20 text-white hover:border-white hover:text-white">{t(txt.heroCtaStart)}</Magnetic>
        </motion.div>
      </motion.div>

      {/* Kayan ticker şeridi */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.05 }}
        className="relative z-20 border-t border-white/10 py-4 [@media(max-height:900px)]:py-2.5"
      >
        <Marquee>
          {(lang === "en" ? tickerEN : tickerTR).map((w, i) => (
            <span key={i} className="mx-7 font-display text-lg font-bold uppercase tracking-tightest text-white/30 sm:text-xl">
              {w} <span className="text-glow/50">✦</span>
            </span>
          ))}
        </Marquee>
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
