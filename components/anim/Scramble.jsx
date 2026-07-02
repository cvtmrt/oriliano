import { useRef, useState, useEffect } from "react";

// ────────────────────────────────────────────────────────────────
// Hover'da harf-karıştırma (scramble). React STATE ile çalışır (ham DOM
// mutasyonu YOK → SPA unmount'ta removeChild hatası riski yok). rAF yalnızca
// hover süresince (~480ms). reduced-motion'da devre dışı. SSR güvenli.
// ────────────────────────────────────────────────────────────────

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+<>/";

export function ScrambleText({ text, className = "", as: Tag = "span" }) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  // Dil/metin değişince güncelle + hover animasyonunu iptal et.
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    setOut(text);
  }, [text]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const run = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const final = String(text);
    const dur = 480;
    const t0 = performance.now();
    cancelAnimationFrame(raf.current);
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const lock = Math.floor(p * final.length);
      let s = "";
      for (let i = 0; i < final.length; i++) {
        const c = final[i];
        s += i < lock || c === " " ? c : CHARS[(Math.random() * CHARS.length) | 0];
      }
      setOut(s);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setOut(final);
    };
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <Tag onMouseEnter={run} onFocus={run} className={className}>
      {out}
    </Tag>
  );
}
