import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePageContext } from "vike-react/usePageContext";
import { site, whatsappLink } from "../lib/site.js";
import { ScrambleText } from "../components/anim/Scramble.jsx";
import { useLang, useT, txt } from "../lib/i18n.jsx";

const ease = [0.16, 1, 0.3, 1];

function TRFlag() {
  return (
    <svg viewBox="0 0 30 20" className="h-3.5 w-5 shrink-0 overflow-hidden rounded-[3px]" aria-hidden="true">
      <rect width="30" height="20" fill="#E30A17" />
      <circle cx="12" cy="10" r="5" fill="#fff" />
      <circle cx="13.6" cy="10" r="4" fill="#E30A17" />
      <text x="19.6" y="10.7" fontSize="7.5" fill="#fff" textAnchor="middle" dominantBaseline="central" fontFamily="Arial">★</text>
    </svg>
  );
}

function ENFlag() {
  return (
    <svg viewBox="0 0 60 30" className="h-3.5 w-5 shrink-0 overflow-hidden rounded-[3px]" aria-hidden="true">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="3" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function LangToggle({ className = "", onDark = false }) {
  const { lang, setLang } = useLang();
  const opts = [
    { code: "tr", Flag: TRFlag },
    { code: "en", Flag: ENFlag },
  ];
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {opts.map(({ code, Flag }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`hit-area flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider transition-all ${
            lang === code
              ? "border-glow/40 bg-glow/10 text-glow"
              : onDark
                ? "border-white/15 text-white/60 hover:text-white"
                : "border-ink/10 text-steel hover:text-chalk"
          }`}
        >
          <Flag />
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const t = useT();
  const { urlPathname } = usePageContext();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuBtnRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menü açıkken: scroll kilidi + Escape ile kapama + odak tuzağı (Tab
  // overlay içinde döner, klavye/ekran okuyucu arkadaki sayfaya kaçmaz).
  const wasOpen = useRef(false);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) {
      // Yalnız menü gerçekten kapandıysa odağı butona iade et (ilk yüklemede değil).
      if (wasOpen.current) menuBtnRef.current?.focus({ preventScroll: true });
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    overlayRef.current?.querySelector("button, a")?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab" || !overlayRef.current) return;
      const els = overlayRef.current.querySelectorAll("a[href], button:not([disabled])");
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Anasayfa (showcase) UÇTAN UCA koyu; case sayfalarının yalnız tepesi koyu.
  const fullDark = urlPathname === "/";
  const hasDarkHero = fullDark || urlPathname.startsWith("/case");
  const onDark = fullDark || (hasDarkHero && !scrolled);

  const homeHref = urlPathname === "/" ? "#top" : "/";

  const Logo = (
    <a href={homeHref} className="flex-shrink-0" data-cursor onClick={() => setOpen(false)}>
      <span lang="en" className={`font-display text-xl font-black uppercase leading-none tracking-tightest transition-colors sm:text-2xl ${onDark ? "text-white" : "text-chalk"}`}>
        {site.name}
        <span className={`serif-accent ml-1 ${onDark ? "text-white/55" : "text-ash"}`}>{site.nameSuffix}</span>
      </span>
    </a>
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-expo ${
          scrolled
            ? fullDark
              ? "border-b border-white/10 bg-[#0B0B12]/95"
              : "border-b border-ink/10 bg-night/95"
            : "bg-transparent"
        }`}
      >
        <div className="wrap flex items-center justify-between py-4">
          {Logo}

          <nav className="hidden items-center gap-8 lg:flex">
            {txt.nav.map((n) => (
              <a key={n.href} href={urlPathname === "/" ? n.href : `/${n.href}`} className={`eyebrow transition-colors ${onDark ? "text-white/85 hover:text-white" : "text-chalk hover:text-ash"}`}>
                <ScrambleText text={t(n.label)} />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <LangToggle className="hidden sm:flex" onDark={onDark} />
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-brand-grad px-5 py-2.5 text-[0.7rem] font-medium uppercase tracking-ultra text-white shadow-lift transition-all hover:brightness-110 sm:inline-block"
              data-cursor
            >
              {t(txt.headerCta)}
            </a>
            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setOpen(true)}
              className={`hit-area flex min-h-11 items-center gap-2 text-[0.7rem] font-medium uppercase tracking-ultra ${onDark ? "text-white" : "text-chalk"}`}
              aria-label={t(txt.menu)}
              aria-expanded={open}
            >
              <Burger onDark={onDark} /> {t(txt.menu)}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            role="dialog"
            aria-modal="true"
            aria-label={t(txt.menu)}
            ref={overlayRef}
            className="fixed inset-0 z-[60] overflow-y-auto bg-night"
          >
            <div className="wrap flex items-center justify-between py-4">
              <LangToggle />
              <button type="button" onClick={() => setOpen(false)} className="hit-area eyebrow flex min-h-11 items-center gap-1 text-chalk hover:text-ash">
                {t(txt.close)} ✕
              </button>
            </div>
            <div className="wrap mt-[8vh] grid gap-12 lg:grid-cols-[1.4fr_1fr]">
              <nav className="flex flex-col">
                {txt.nav.map((n, i) => (
                  <motion.a
                    key={n.href}
                    href={urlPathname === "/" ? n.href : `/${n.href}`}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.06 }}
                    className="group flex items-baseline gap-4 border-b border-ink/10 py-4"
                  >
                    <span className="font-mono text-xs text-steel">0{i + 1}</span>
                    <ScrambleText
                      text={t(n.label)}
                      className="font-display text-4xl font-extrabold uppercase tracking-tightest text-chalk transition-transform duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-glow sm:text-6xl"
                    />
                  </motion.a>
                ))}
              </nav>
              <div className="flex flex-col justify-end gap-8 pb-12">
                <div>
                  <span className="eyebrow text-steel">{t(txt.contactLabel)}</span>
                  <a href={`mailto:${site.email}`} className="mt-2 block text-sm text-ash hover:text-chalk">
                    {site.email}
                  </a>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-ash hover:text-chalk">
                    WhatsApp ↗
                  </a>
                </div>
                <div>
                  <span className="eyebrow text-steel">{t(txt.followLabel)}</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {site.social.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-ink/10 px-4 py-1.5 text-xs uppercase tracking-wide text-ash transition-colors hover:border-glow/40 hover:text-glow"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Burger({ onDark = false }) {
  const bar = onDark ? "bg-white" : "bg-chalk";
  return (
    <span className="flex h-3 w-5 flex-col justify-between">
      <span className={`h-px w-full ${bar}`} />
      <span className={`h-px w-full ${bar}`} />
      <span className={`h-px w-full ${bar}`} />
    </span>
  );
}
