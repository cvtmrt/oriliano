import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { site } from "../../lib/site.js";

// ────────────────────────────────────────────────────────────────
// GİRİŞ PRELOADER — ekranı dolduran marka kompozisyonu + alt ilerleme çubuğu
// (yüzde küçük ve satır-içi; eski dev "000" sayaç kaldırıldı). İlk ziyarette
// 0→100 dolar, sonraki yüklemelerde hızlı geçer (sessionStorage: introDone).
// SSR'da render edilir (flash yok). reduced-motion: anında kaldırılır.
// no-JS: HeadDefault <noscript> gizler.
// ────────────────────────────────────────────────────────────────

const WORDS = ["Web Tasarım", "Yazılım", "Arayüz", "SEO", "Marka"];

export function Preloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const pctRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo(0, 0);
    const finish = () => setDone(true);
    if (reduce) return finish();

    const seen = sessionStorage.getItem("introDone");
    sessionStorage.setItem("introDone", "1");

    const c = { v: 0 };
    const tl = gsap.timeline({ onComplete: finish });
    // Tıkla/tuşla atlanabilir — animasyon kullanıcıyı asla rehin almasın.
    const skip = () => tl.progress(1);
    root.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    tl.to(c, {
      v: 100,
      duration: seen ? 0.5 : 0.9,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(c.v);
        if (barRef.current) barRef.current.style.transform = `scaleX(${c.v / 100})`;
        if (pctRef.current) pctRef.current.textContent = `%${v}`;
      },
    })
      .to(root.querySelectorAll(".pl-fade"), { opacity: 0, y: -16, duration: 0.4, ease: "power2.in" }, "+=0.12")
      .to(root, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "-=0.15");

    return () => {
      root.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="preloader fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#0B0B12] px-6 py-8 text-white sm:px-12 sm:py-10"
    >
      {/* Atmosfer */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[60vh] w-[80vw] -translate-x-1/2 rounded-b-[100%] bg-radial-glow opacity-40 blur-3xl" />

      {/* Üst satır */}
      <div className="pl-fade relative flex items-center justify-between">
        <span className="font-mono text-[0.7rem] uppercase tracking-ultra text-white/50">
          {site.fullName}®
        </span>
        <span className="font-mono text-[0.7rem] uppercase tracking-ultra text-white/40">
          {site.location}
        </span>
      </div>

      {/* Merkez marka */}
      <div className="relative flex flex-1 flex-col items-center justify-center text-center">
        <span
          lang="en"
          className="pl-fade font-display text-6xl font-black uppercase leading-[0.9] tracking-tightest sm:text-8xl lg:text-9xl"
        >
          {site.name}
          <span className="serif-accent text-glow">{site.nameSuffix}</span>
        </span>
        <span className="pl-fade mt-5 max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
          {site.seoDescription.split(";")[0]}.
        </span>
        <div className="pl-fade mt-6 flex flex-wrap justify-center gap-x-2 gap-y-1">
          {WORDS.map((w, i) => (
            <span key={w} className="font-mono text-[0.65rem] uppercase tracking-ultra text-white/35">
              {w}{i < WORDS.length - 1 && <span className="ml-2 text-glow/50">/</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Alt ilerleme */}
      <div className="relative">
        <div className="mb-3 flex items-end justify-between">
          <span className="font-mono text-[0.7rem] uppercase tracking-ultra text-white/50">Yükleniyor</span>
          <span ref={pctRef} className="font-display text-lg font-bold tabular-nums text-white sm:text-2xl">%0</span>
        </div>
        <div className="h-px w-full overflow-hidden bg-white/12">
          <div ref={barRef} className="h-full origin-left bg-gradient-to-r from-glow to-violet" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
