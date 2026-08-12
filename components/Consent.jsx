import { useEffect, useState } from "react";
import { site } from "../lib/site.js";
import { useT, txt } from "../lib/i18n.jsx";

// ────────────────────────────────────────────────────────────────
// ÇEREZ ONAYI — Meta Pixel YALNIZCA açık rıza sonrası yüklenir.
// KVKK m.5/1 ve Kurul'un çerez rehberi, reklam/ölçüm çerezleri için
// önceden rıza istiyor; bu yüzden pixel <head>'de sabit durmuyor,
// buradan enjekte ediliyor. Tercih localStorage'ta tutulur.
// ────────────────────────────────────────────────────────────────

const KEY = "cookie-consent"; // "granted" | "denied"

function loadPixel(id) {
  if (!id || window.fbq) return;
  // Meta'nın resmi temel kodu.
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", id);
  window.fbq("track", "PageView");
}

export function Consent() {
  const t = useT();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Pixel kimliği yoksa toplanan bir şey de yok; kutuyu hiç gösterme.
    if (!site.metaPixelId) return;
    let saved = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}
    if (saved === "granted") loadPixel(site.metaPixelId);
    else if (saved !== "denied") setShow(true);
  }, []);

  const decide = (value) => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    if (value === "granted") loadPixel(site.metaPixelId);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-[92] sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm"
    >
      <div className="rounded-2xl border border-ink/20 bg-night/95 p-5 shadow-2xl backdrop-blur">
        <p className="text-sm leading-relaxed text-ash">{t(txt.consent.body)}</p>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => decide("granted")}
            className="rounded-full bg-glow px-5 py-2 text-xs font-semibold uppercase tracking-wider text-night transition hover:opacity-90"
          >
            {t(txt.consent.accept)}
          </button>
          <button
            type="button"
            onClick={() => decide("denied")}
            className="rounded-full border border-ink/30 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-ash transition hover:text-chalk"
          >
            {t(txt.consent.reject)}
          </button>
          <a
            href="/gizlilik"
            className="ml-auto font-mono text-xs uppercase tracking-ultra text-steel transition-colors hover:text-chalk"
          >
            {t(txt.consent.more)}
          </a>
        </div>
      </div>
    </div>
  );
}
