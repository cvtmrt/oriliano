import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, upcoming } from "../../data/projects.js";
import { useT, txt } from "../../lib/i18n.jsx";

// ────────────────────────────────────────────────────────────────
// SEÇİLMİŞ İŞLER — masaüstünde GSAP ile YATAY pinlenen sinematik galeri.
// Dikey scroll → panel şeridi yana akar. Paneller içinde WebGL distortion
// görselleri + containerAnimation ile scroll'a bağlı derinlik reveal'leri.
// Mobil / reduced-motion: sade dikey akış (aynı DOM, farklı düzen).
// ────────────────────────────────────────────────────────────────

export function SelectedWork() {
  const t = useT();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const panels = gsap.utils.toArray(".work-panel", track);
      const getScroll = () => track.scrollWidth - window.innerWidth;

      // Ana yatay tween — dikey scroll'u X'e çevirir.
      const tween = gsap.to(track, {
        x: () => -getScroll(),
        ease: "none",
      });

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getScroll()}`,
        pin: true,
        scrub: 1,
        animation: tween,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.round(self.progress * (panels.length - 1));
          setActive(i);
          if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
        },
      });

      // Her panel içinde containerAnimation ile derinlik reveal'leri.
      const subs = [];
      panels.forEach((panel) => {
        const img = panel.querySelector(".panel-img");
        const copy = panel.querySelectorAll(".panel-copy");
        const num = panel.querySelector(".panel-num");
        if (img) {
          subs.push(
            gsap.fromTo(
              img,
              { scale: 1.1 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  containerAnimation: tween,
                  trigger: panel,
                  start: "left right",
                  end: "center center",
                  scrub: true,
                },
              }
            )
          );
        }
        if (copy.length) {
          subs.push(
            gsap.fromTo(
              copy,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                  containerAnimation: tween,
                  trigger: panel,
                  start: "left 78%",
                  end: "left 40%",
                  scrub: true,
                },
              }
            )
          );
        }
        if (num) {
          subs.push(
            gsap.fromTo(
              num,
              { xPercent: 40, opacity: 0.15 },
              {
                xPercent: -20,
                opacity: 0.5,
                ease: "none",
                scrollTrigger: {
                  containerAnimation: tween,
                  trigger: panel,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            )
          );
        }
      });

      return () => {
        st.kill();
        tween.kill();
        subs.forEach((s) => s.scrollTrigger && s.scrollTrigger.kill());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative overflow-hidden bg-night text-white scroll-mt-24"
    >
      <div
        ref={trackRef}
        className="work-track flex flex-col gap-16 py-24 lg:h-screen lg:flex-row lg:flex-nowrap lg:items-center lg:gap-0 lg:py-0"
      >
        {/* Giriş paneli */}
        <div className="work-panel wrap flex shrink-0 flex-col justify-center lg:h-screen lg:w-[42vw] lg:pl-12 lg:pr-0">
          <span className="eyebrow text-glow">{t(txt.sec.work.index)}</span>
          <h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.9] tracking-tightest text-white sm:text-7xl">
            {t(txt.sec.work.title)}
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-ash">{t(txt.sec.work.sub)}</p>
          <div className="mt-8 hidden items-center gap-3 text-steel lg:flex">
            <span className="font-mono text-xs uppercase tracking-ultra">{t(txt.scroll)}</span>
            <span className="text-lg">→</span>
          </div>
        </div>

        {/* Proje panelleri */}
        {projects.map((p, i) => (
          <WorkPanel key={p.slug} p={p} n={i + 1} total={projects.length} t={t} />
        ))}

        {/* Çıkış paneli — yaklaşan işler */}
        <OutroPanel t={t} />
      </div>

      {/* İlerleme çubuğu + sayaç (yalnız masaüstü / pin) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden lg:block">
        <div className="wrap flex items-center gap-5 pb-8">
          <span className="font-mono text-sm text-glow">
            {String(active + 1).padStart(2, "0")}
          </span>
          <div className="relative h-px flex-1 overflow-hidden bg-white/10">
            <div ref={barRef} className="absolute inset-0 origin-left bg-gradient-to-r from-glow to-violet" style={{ transform: "scaleX(0)" }} />
          </div>
          <span className="font-mono text-sm text-steel">
            {String(projects.length + 2).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

function WorkPanel({ p, t }) {
  const external = !p.concept;
  return (
    <article className="work-panel wrap flex shrink-0 flex-col justify-center gap-8 lg:h-screen lg:w-[80vw] lg:max-w-[1000px] lg:flex-row lg:items-center lg:gap-12 lg:px-12">
      {/* Görsel — kart her zaman vaka sayfasına götürür; canlı site linki vaka içinde. */}
      <a
        href={`/case/${p.slug}`}
        data-cursor
        className="group relative block lg:w-[58%]"
      >
        <span className="panel-num pointer-events-none absolute -top-16 -left-4 z-0 font-display text-[9rem] font-black leading-none text-white/5 lg:-top-24 lg:text-[14rem]">
          {p.index}
        </span>
        <div className="relative z-10 overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-colors duration-500 group-hover:border-glow/50">
          <div className="panel-img aspect-[16/11] w-full overflow-hidden">
            <picture>
              <source srcSet={p.shot.replace(/\.jpe?g$/i, ".webp")} type="image/webp" />
              <img
                src={p.shot}
                alt={p.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
              />
            </picture>
          </div>
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
          <span className="absolute bottom-4 left-4 z-10 rounded-full border border-white/20 bg-black/50 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-ultra text-white/80">
            {external ? p.urlLabel : t(p.conceptLabel)}
          </span>
        </div>
      </a>

      {/* Metin */}
      <div className="lg:w-[42%]">
        <div className="panel-copy flex items-center gap-3">
          <span className="eyebrow text-glow">{t(p.category)}</span>
          {p.isProduct && (
            <span className="rounded-full border border-glow/40 px-2.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-ultra text-glow">
              {t(txt.ownProduct)}
            </span>
          )}
        </div>
        <h3 className="panel-copy mt-4 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tightest text-white sm:text-5xl">
          {p.name}
        </h3>
        <p className="panel-copy mt-5 max-w-md text-base leading-relaxed text-ash">{t(p.summary)}</p>
        <div className="panel-copy mt-6 flex flex-wrap gap-2">
          {p.scope.map((s, i) => (
            <span key={i} className="rounded-full border border-white/12 px-3 py-1 text-[0.7rem] uppercase tracking-wide text-ash">
              {t(s)}
            </span>
          ))}
        </div>
        <a href={`/case/${p.slug}`} data-cursor className="panel-copy mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-ultra text-white transition-colors hover:text-glow">
          {t(txt.viewCase)} <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

function OutroPanel({ t }) {
  return (
    <div className="work-panel wrap flex shrink-0 flex-col justify-center lg:h-screen lg:w-[58vw] lg:px-12">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 sm:p-12">
        <span className="font-mono text-sm text-steel">{upcoming.index}</span>
        <span className="ml-3 eyebrow text-glow">{t(upcoming.category)}</span>
        <h3 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tightest text-white sm:text-4xl">
          {t(upcoming.name)}
        </h3>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ash">{t(upcoming.summary)}</p>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {upcoming.items.map((it, i) => (
            <span key={i} className="rounded-full border border-white/12 bg-white/[0.02] px-4 py-2 text-sm text-ash transition-colors hover:border-glow/40 hover:text-glow">
              {t(it)}
            </span>
          ))}
        </div>
        <a href="#contact" data-cursor className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-grad px-8 py-4 text-xs font-medium uppercase tracking-ultra text-white shadow-lift transition hover:brightness-110">
          {t(txt.upcomingCta)}
        </a>
      </div>
    </div>
  );
}
