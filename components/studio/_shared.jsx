import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, ease } from "../anim/Reveal.jsx";

const inView = { once: true, margin: "-10% 0px" };

// Bölüm üst etiketi: numara + İngilizce premium başlık + opsiyonel açıklama.
// Görününce: eyebrow süzülür, başlık kelime kelime açılır (maskesiz —
// opacity+y, tetiklenmezse bile içerik güvenli), ayırıcı üzerinde
// terracotta çizgi soldan çizilir. Hepsi transform/opacity.
export function SectionHead({ index, title, sub, id }) {
  const words = String(title).split(" ");
  return (
    <div id={id} className="section-label relative scroll-mt-28">
      <div>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.7, ease }}
          className="eyebrow inline-block text-steel"
        >
          {index}
        </motion.span>
        <h2 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tightest text-chalk sm:text-5xl">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.8, ease, delay: 0.06 + i * 0.07 }}
              className="inline-block [&:not(:last-child)]:mr-[0.25em]"
            >
              {w}
            </motion.span>
          ))}
        </h2>
      </div>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
          className="hidden max-w-xs text-sm leading-relaxed text-ash sm:block"
        >
          {sub}
        </motion.p>
      )}
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={inView}
        transition={{ duration: 1.1, ease, delay: 0.25 }}
        className="absolute bottom-[-1px] left-0 h-px w-44 origin-left bg-gradient-to-r from-glow to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

// Tarayıcı çerçeveli "canlı site" mockup'ı.
// `shot` görseli SSR'da doğrudan basılır (JS beklemez → hızlı LCP + SEO
// görünürlüğü); dosya yoksa onError ile şık gradient placeholder'a düşer.
// `eager`: ekranın üstündeki kritik görsel için (case hero) öncelikli yükleme.
export function BrowserMock({ shot, url = "", label = "", className = "", parallax = false, eager = false }) {
  const [failed, setFailed] = useState(false);
  const webp = shot ? shot.replace(/\.jpe?g$/i, ".webp") : shot;
  const showImg = Boolean(shot) && !failed;
  const imgProps = {
    src: shot,
    alt: label,
    decoding: "async",
    onError: () => setFailed(true),
    ...(eager ? { fetchpriority: "high" } : { loading: "lazy" }),
  };

  // Scroll parallaks: kart görünür alandan geçerken uzun ekran görüntüsü
  // yukarı kayar; "canlı sitede aşağı iniliyormuş" hissi verir.
  const frameRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });
  const shotY = useTransform(scrollYProgress, [0, 1], ["0%", "-37.5%"]);

  return (
    <div className={`overflow-hidden rounded-xl border border-ink/10 bg-graphite shadow-soft ${className}`}>
      {/* Tarayıcı barı */}
      <div className="flex items-center gap-2 border-b border-ink/8 bg-iron px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-flame/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-glow/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-violet/40" />
        <div className="ml-3 flex-1 truncate rounded-md bg-ink/5 px-3 py-1 font-mono text-[0.65rem] text-ash">
          {url || "preview"}
        </div>
      </div>
      {/* İçerik alanı */}
      <div ref={frameRef} className="relative aspect-[16/10] w-full overflow-hidden">
        {/* gradient placeholder (her zaman arkada) */}
        <div className="absolute inset-0 bg-gradient-to-br from-iron via-graphite to-night" />
        <div className="absolute inset-0 bg-radial-glow opacity-60" />
        {showImg ? (
          parallax ? (
            <picture>
              <source srcSet={webp} type="image/webp" />
              <motion.img
                {...imgProps}
                style={{ y: shotY }}
                className="absolute inset-x-0 top-0 h-[160%] w-full object-cover object-top"
              />
            </picture>
          ) : (
            <picture>
              <source srcSet={webp} type="image/webp" />
              <img
                {...imgProps}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </picture>
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="font-display text-2xl font-black uppercase tracking-tightest text-chalk/90">
              {label}
            </span>
            <span className="font-mono text-[0.65rem] uppercase tracking-ultra text-steel">
              Screenshot placeholder
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export { Reveal };
