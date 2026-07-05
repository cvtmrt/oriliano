import { site } from "../../lib/site.js";

// ────────────────────────────────────────────────────────────────
// SAYFA GEÇİŞİ PERDESİ — sadece işaret. Navigasyonu Vike'ın SPA router'ı
// yapar; perde `pages/+onPageTransitionStart|End` hook'larının <html>'e
// eklediği `.is-transitioning` / `.is-leaving` sınıflarıyla CSS'te sürülür.
// (window.location hijack'i KALDIRILDI — Vike clientRouting ile çakışıp
// sayfayı boş bırakıyordu.)
// ────────────────────────────────────────────────────────────────

export function PageCurtain() {
  return (
    <div
      aria-hidden="true"
      className="page-curtain fixed inset-0 z-[96] flex items-center justify-center bg-night"
    >
      <span lang="en" className="font-display text-4xl font-black uppercase tracking-tightest text-white sm:text-6xl">
        {site.name}
        <span className="serif-accent text-glow">{site.nameSuffix}</span>
      </span>
    </div>
  );
}
