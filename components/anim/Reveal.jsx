import { motion } from "framer-motion";

export const ease = [0.16, 1, 0.3, 1];

// Görünür alana girince yumuşak yukarı-açılış.
export function Reveal({ children, delay = 0, y = 28, className = "", as = "div" }) {
  const M = motion[as] || motion.div;
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
    >
      {children}
    </M>
  );
}

// Kelime kelime kademeli açılan başlık (scroll reveal).
export function TextReveal({ text, className = "", delay = 0, wordClass = "" }) {
  const words = String(text).split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block ${wordClass}`}
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.85, ease, delay: delay + i * 0.05 }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Yatay sonsuz akış şeridi (CSS marquee).
export function Marquee({ children, className = "" }) {
  return (
    <div className={`marquee-pause overflow-hidden ${className}`}>
      <div className="flex w-max animate-marquee-x">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
