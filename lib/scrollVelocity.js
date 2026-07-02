// ────────────────────────────────────────────────────────────────
// Global scroll-hız takipçisi (singleton).
// WebGL shader'ları ve parallaks katmanları "scroll hızına göre" tepki
// versin diye tek bir rAF döngüsünde normalize edilmiş hız üretir.
// -1.5 .. 1.5 aralığında (yaklaşık), yumuşatılmış.
// ────────────────────────────────────────────────────────────────
let vel = 0;
let prevY = 0;
let raf = null;

function loop() {
  const y = window.scrollY || window.pageYOffset || 0;
  const delta = y - prevY;
  prevY = y;
  // ~40px/frame hızlı bir scroll'u ~1.0'a eşler.
  const target = Math.max(-1.5, Math.min(1.5, delta / 40));
  vel += (target - vel) * 0.18;
  if (Math.abs(vel) < 0.0002 && Math.abs(target) < 0.0002) vel = 0;
  raf = requestAnimationFrame(loop);
}

export function startVelocity() {
  if (raf != null || typeof window === "undefined") return;
  prevY = window.scrollY || window.pageYOffset || 0;
  loop();
}

export function getVelocity() {
  return vel;
}
