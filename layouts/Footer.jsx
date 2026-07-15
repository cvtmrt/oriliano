import { usePageContext } from "vike-react/usePageContext";
import { Marquee, Reveal } from "../components/anim/Reveal.jsx";
import { site, whatsappLink, mailLink } from "../lib/site.js";
import { useT, txt } from "../lib/i18n.jsx";

export function Footer() {
  const t = useT();
  const { urlPathname } = usePageContext();
  const navHref = (href) => (urlPathname === "/" ? href : `/${href}`);
  return (
    <footer className="relative border-t border-ink/10 bg-coal">
      <div className="wrap py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Marka + manifesto */}
          <Reveal>
          <div>
            <span lang="en" className="font-display text-3xl font-black uppercase tracking-tightest text-chalk">
              {site.name}
              <span className="serif-accent ml-1 text-ash">{site.nameSuffix}</span>
            </span>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ash">
              {t(txt.footerManifesto)}
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-ultra text-steel">
              {site.location} · {site.foundedLabel}
            </p>
          </div>
          </Reveal>

          {/* Navigasyon */}
          <Reveal delay={0.08}>
          <div>
            <span className="eyebrow text-steel">{t(txt.menu)}</span>
            <ul className="mt-4 space-y-2">
              {txt.nav.map((n) => (
                <li key={n.href}>
                  <a href={navHref(n.href)} className="inline-block text-sm text-ash transition-[color,transform] duration-300 hover:translate-x-1 hover:text-chalk" data-cursor>
                    {t(n.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          </Reveal>

          {/* İletişim + sosyal */}
          <Reveal delay={0.16}>
          <div>
            <span className="eyebrow text-steel">{t(txt.contactLabel)}</span>
            <ul className="mt-4 space-y-2">
              <li>
                <a href={mailLink} className="inline-block text-sm text-ash transition-[color,transform] duration-300 hover:translate-x-1 hover:text-chalk" data-cursor>
                  {site.email}
                </a>
              </li>
              <li>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-ash transition-[color,transform] duration-300 hover:translate-x-1 hover:text-chalk" data-cursor>
                  WhatsApp ↗
                </a>
              </li>
            </ul>

            <span className="eyebrow mt-8 block text-steel">{t(txt.followLabel)}</span>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-ash transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-chalk" data-cursor>
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
          </Reveal>
        </div>

        {/* Dev tipografik marka şeridi — yavaş marquee, dekoratif.
            reduced-motion'da CSS animasyonu kapanır, statik durur. */}
        <div className="mt-16 select-none" aria-hidden="true">
          <Marquee>
            <span lang="en" className="mx-10 whitespace-nowrap font-display text-[11vw] font-black uppercase leading-[0.85] tracking-tightest text-white/[0.05]">
              {site.fullName}
            </span>
            <span className="whitespace-nowrap serif-accent text-[7vw] lowercase text-glow/20">
              {site.tagline}
            </span>
          </Marquee>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-steel">
            © {new Date().getFullYear()} {site.fullName}. {t(txt.rights)}
          </p>
          <div className="flex items-center gap-6">
            <a href="#top" className="font-mono text-xs uppercase tracking-ultra text-ash hover:text-chalk" data-cursor>
              {t(txt.backToTop)}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
