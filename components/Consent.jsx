import { useEffect, useState } from "react";
import { site } from "../lib/site.js";

// ────────────────────────────────────────────────────────────────
// KVKK çerez onayı + Google Analytics yükleyici.
// - Analytics YALNIZCA (1) site.gaId dolu VE (2) kullanıcı "Kabul Et" derse yüklenir.
// - Hiç izleme yoksa (gaId boş) banner da gösterilmez (çerez yok → onay gerekmez).
// - Seçim localStorage'ta saklanır. IP anonimleştirilir.
// ────────────────────────────────────────────────────────────────

function loadGA(id) {
  if (!id || window.__gaLoaded) return;
  window.__gaLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
}

export function Consent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!site.gaId) return; // izleme yok → banner yok
    const c = localStorage.getItem("consent");
    if (c === "granted") return loadGA(site.gaId);
    if (c === "denied") return;
    setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("consent", "granted");
    loadGA(site.gaId);
    setShow(false);
  };
  const reject = () => {
    localStorage.setItem("consent", "denied");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Çerez bilgilendirmesi"
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto flex max-w-2xl flex-col gap-4 rounded-2xl border border-ink/10 bg-graphite/95 p-5 shadow-soft backdrop-blur-sm sm:flex-row sm:items-center sm:gap-6"
    >
      <p className="flex-1 text-sm leading-relaxed text-ash">
        Deneyimi iyileştirmek ve trafiği ölçmek için çerez kullanıyoruz.{" "}
        <a href="/gizlilik" className="text-glow underline-offset-2 hover:underline">
          Gizlilik &amp; KVKK
        </a>
      </p>
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={reject}
          className="rounded-full border border-ink/15 px-5 py-2 text-xs font-medium uppercase tracking-ultra text-ash transition-colors hover:text-chalk"
        >
          Reddet
        </button>
        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-brand-grad px-5 py-2 text-xs font-medium uppercase tracking-ultra text-white shadow-lift transition hover:brightness-110"
        >
          Kabul Et
        </button>
      </div>
    </div>
  );
}
