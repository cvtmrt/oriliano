import { ScrollTrigger } from "gsap/ScrollTrigger";

// Vike client hook — SPA navigasyonu BİTİNCE (yeni sayfa hazır) çalışır.
// Perdeyi yukarı çıkarıp yeni sayfayı açar (.is-leaving), sonra sıfırlar.
// SPA'da bileşenler yeniden monte olduğu için GSAP scroll pozisyonlarını
// yenile (pin/parallaks doğru hizalansın).

// Yeni sayfayı EN BAŞA al. Lenis kendi scroll pozisyonunu ayrı tuttuğu için
// tek başına window.scrollTo(0,0) yetmiyor: bir sonraki rAF karesinde Lenis
// eski değeri geri yazıyor ve sayfa, önceki sayfada bulunduğun yükseklikten
// (kartlara aşağıdan tıklandıysa footer'dan) açılıyordu.
function toTop() {
  const lenis = window.__lenis;
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

export default function onPageTransitionEnd() {
  const el = document.documentElement;
  el.classList.remove("is-transitioning");
  el.classList.add("is-leaving");
  toTop();
  // Lenis'in raf'ı bu kareden sonra bir kez daha yazabildiği için tekrarla.
  requestAnimationFrame(toTop);
  setTimeout(() => {
    el.classList.remove("is-leaving");
    try {
      // Yeni sayfanın yüksekliği farklı: önce Lenis'in sınırlarını,
      // sonra ScrollTrigger ölçümlerini güncelle.
      window.__lenis?.resize();
      ScrollTrigger.refresh();
    } catch {}
  }, 600);
}
