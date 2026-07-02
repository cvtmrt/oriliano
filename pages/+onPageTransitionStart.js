import { ScrollTrigger } from "gsap/ScrollTrigger";

// Vike client hook — SPA navigasyonu BAŞLARKEN çalışır (clientRouting gerekli).
// 1) GSAP pin-spacer'larını React unmount'tan ÖNCE temizle: pinlenmiş bölümler
//    (Hero, yatay galeri) DOM'a sarmalayıcı ekliyor; React eski sayfayı
//    kaldırırken "removeChild not a child" hatası verip sayfayı boş bırakıyordu.
// 2) Geçiş perdesini kapat (.is-transitioning → perde aşağıdan yükselir).
export default function onPageTransitionStart() {
  try {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  } catch {}
  const el = document.documentElement;
  el.classList.remove("is-leaving");
  el.classList.add("is-transitioning");
}
