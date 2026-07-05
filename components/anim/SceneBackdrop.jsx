import { useEffect, useState } from "react";
import { HeroScene } from "./HeroScene.jsx";

// Bölüm arkasına giren tek-durumlu WebGL sahne (sıvı-cam blob).
// YALNIZ masaüstünde (lg+) mount olur — mobilde WebGL context'i hiç
// açılmaz (GPU/bellek maliyeti sıfır). HeroScene zaten ekran dışında
// rAF'ı uyutur, reduced-motion'da tek statik kare çizer; bu sarmalayıcı
// sadece "nerede hiç var olmasın" kararını verir.
export function SceneBackdrop({ state, className = "" }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const set = () => setOn(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  if (!on) return null;
  return (
    <div className={`pointer-events-none absolute inset-0 z-0 ${className}`} aria-hidden="true">
      <HeroScene states={[state]} />
    </div>
  );
}
