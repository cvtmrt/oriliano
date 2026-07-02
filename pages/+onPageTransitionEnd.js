import { ScrollTrigger } from "gsap/ScrollTrigger";

// Vike client hook — SPA navigasyonu BİTİNCE (yeni sayfa hazır) çalışır.
// Perdeyi yukarı çıkarıp yeni sayfayı açar (.is-leaving), sonra sıfırlar.
// SPA'da bileşenler yeniden monte olduğu için GSAP scroll pozisyonlarını
// yenile (pin/parallaks doğru hizalansın).
export default function onPageTransitionEnd() {
  const el = document.documentElement;
  el.classList.remove("is-transitioning");
  el.classList.add("is-leaving");
  window.scrollTo(0, 0);
  setTimeout(() => {
    el.classList.remove("is-leaving");
    try {
      ScrollTrigger.refresh();
    } catch {}
  }, 600);
}
