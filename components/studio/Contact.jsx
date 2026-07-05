import { Magnetic } from "../anim/Interactive.jsx";
import { Reveal } from "../anim/Reveal.jsx";
import { SceneBackdrop } from "../anim/SceneBackdrop.jsx";
import { site, whatsappLink, mailLink } from "../../lib/site.js";
import { useT, txt } from "../../lib/i18n.jsx";

export function Contact() {
  const t = useT();
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-night py-24 sm:py-32">
      <div className="pointer-events-none absolute left-[35%] top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-glow blur-3xl" />
      <div className="pointer-events-none absolute left-[65%] top-1/2 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-flame blur-3xl" />
      {/* Final sahnesi: başlığın arkasında nefes alan sıvı-cam blob — hero'daki
          sahnenin kapanış yankısı. Koyu cam çekirdek başlık kontrastını korur;
          ekran dışındayken rAF uyur, hero'nunkiyle aynı anda çalışmaz. */}
      <SceneBackdrop state={{ x: 0, y: 0.1, s: 0.92, o: 0.7 }} />

      <div className="wrap relative z-10 text-center">
        <Reveal>
          <span className="eyebrow text-steel">{t(txt.sec.contact.index)}</span>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="mx-auto mt-7 max-w-5xl font-display text-5xl font-black uppercase leading-[0.92] tracking-tightest text-chalk sm:text-8xl">
            {t(txt.contactTitle1)}
            <span className="block serif-accent lowercase tracking-normal text-gradient">
              {t(txt.contactTitle2)}
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-ash sm:text-lg">
            {t(txt.contactPara)}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Magnetic href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-brand">
              {t(txt.ctaWhatsapp)}
            </Magnetic>
            <Magnetic href={mailLink} className="btn btn-outline">
              {t(txt.ctaMail)}
            </Magnetic>
            <Magnetic href="#work" className="btn btn-line" strength={0.25}>
              {t(txt.ctaSeeWork)}
            </Magnetic>
          </div>
        </Reveal>

        <p className="mt-14 font-mono text-xs uppercase tracking-ultra text-steel">
          {site.email} · {site.location}
        </p>
      </div>
    </section>
  );
}
