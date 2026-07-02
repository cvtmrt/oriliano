import { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
  animate,
} from "framer-motion";

const coarse = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Manyetik buton/eleman — imlece doğru hafifçe çekilir.
export function Magnetic({ children, className = "", strength = 0.35, as = "a", ...rest }) {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const M = motion[as] || motion.a;

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <M
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className={className}
      data-cursor
      {...rest}
    >
      {children}
    </M>
  );
}

// Hover'da hafif eğilen kart (3D tilt).
export function Tilt({ children, className = "", max = 6 }) {
  const ref = useRef(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const tRx = useTransform(rx, (v) => `${v}deg`);
  const tRy = useTransform(ry, (v) => `${v}deg`);

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: tRx, rotateY: tRy, transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Premium imleç — küçük nokta + hover'da büyüyen halka.
export function Cursor() {
  const [hidden, setHidden] = useState(true);
  const [active, setActive] = useState(false);
  const x = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40, mass: 0.4 });
  const y = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (coarse()) return; // dokunmatikte yok
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const t = e.target.closest("a, button, [data-cursor]");
      setActive(Boolean(t));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (coarse()) return null;

  return (
    <motion.div
      style={{ x, y }}
      className={`pointer-events-none fixed left-0 top-0 z-[80] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-glow transition-[width,height,background-color] duration-300 lg:block ${
        hidden ? "opacity-0" : "opacity-100"
      } ${active ? "h-12 w-12 bg-glow/10" : "h-3 w-3 bg-glow"}`}
    />
  );
}

// Sayfa kaydırma ilerlemesi — en üstte ince gradient çubuk.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-brand-grad"
    />
  );
}

// Görünür alana girince hedef değere kadar sayan rakam.
// value: "90+", "3+", "∞" gibi; baştaki sayı animasyonlanır, önek/sonek korunur.
export function CountUp({ value, duration = 1.6, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [display, setDisplay] = useState(() => {
    const m = String(value).match(/^(\D*)(\d[\d.,]*)(.*)$/);
    return m ? `${m[1]}0${m[3]}` : String(value);
  });

  useEffect(() => {
    const m = String(value).match(/^(\D*)(\d[\d.,]*)(.*)$/);
    if (!m) { setDisplay(String(value)); return; } // sayı yok (örn. ∞)
    const [, pre, numStr, suf] = m;
    const target = parseFloat(numStr.replace(/,/g, ""));
    const decimals = (numStr.split(".")[1] || "").length;
    if (!inView) return;
    if (reduced()) { setDisplay(`${pre}${numStr}${suf}`); return; }
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(`${pre}${v.toFixed(decimals)}${suf}`),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return <span ref={ref} className={className}>{display}</span>;
}

// Mouse'u takip eden hafif spotlight — bir kapsayıcının içine koy (relative).
// Mobilde otomatik kapanır.
export function Spotlight({ className = "", size = 520, color = "rgba(201,212,255,0.10)" }) {
  const ref = useRef(null);
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (coarse()) return;
    const el = ref.current?.parentElement;
    if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    const leave = () => { x.set(-9999); y.set(-9999); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  const background = useTransform(
    [sx, sy],
    ([lx, ly]) => `radial-gradient(${size}px circle at ${lx}px ${ly}px, ${color}, transparent 70%)`
  );

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 hidden lg:block ${className}`}
      style={{ background }}
    />
  );
}
