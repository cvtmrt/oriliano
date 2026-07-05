import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Vike client hook — SPA navigasyonu BAŞLARKEN çalışır (clientRouting gerekli).
// 1) GSAP pin-spacer'larını React unmount'tan ÖNCE temizle: pinlenmiş bölümler
//    (Hero, yatay galeri) DOM'a sarmalayıcı ekliyor; React eski sayfayı
//    kaldırırken "removeChild not a child" hatası verip sayfayı boş bırakıyordu.
// 2) Scrub tween'lerinin bıraktığı inline stilleri sıfırla: dalış sonunda hero
//    section'ı opacity 0.1'de kalıyordu → geçiş sırasında sayfa "bomboş"
//    görünüyordu. clearProps ile eski sayfa perde altında normal görünür.
// 3) Geçiş perdesini kapat (.is-transitioning → perde aşağıdan yükselir).
export default function onPageTransitionStart() {
  try {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.set("section", { clearProps: "opacity" });
    gsap.set(".hero-headline,.hero-floats,.hero-bg,.hero-fade,.work-track", { clearProps: "transform,opacity" });
    gsap.set(".panel-img,.panel-copy,.panel-num", { clearProps: "transform,opacity" });
  } catch {}
  const el = document.documentElement;
  el.classList.remove("is-leaving");
  el.classList.add("is-transitioning");
}
