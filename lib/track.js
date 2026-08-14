// ────────────────────────────────────────────────────────────────
// DIŞA GİDEN TIKLAMA ÖLÇÜMÜ
//
// Sitede form yok; tek dönüşüm noktası WhatsApp ve e-posta linkleri.
// Meta bu tıklamaları kendiliğinden görmüyor, PageView dışında hiçbir
// sinyal gitmiyordu. Reklam bu olaya göre optimize edecek.
//
// Dinleyici document üstünde delege çalışıyor: Header, Footer ve
// sonradan eklenecek her link otomatik kapsanır, tek tek onClick
// bağlamaya gerek yok.
//
// Yalnızca çerez onayı verilip pixel yüklendikten sonra kurulur
// (bkz. components/Consent.jsx). Onay yoksa fbq tanımsızdır ve
// track() sessizce hiçbir şey yapmaz.
// ────────────────────────────────────────────────────────────────

let installed = false;

export function track(event, params) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

export function initOutboundTracking() {
  if (installed || typeof document === "undefined") return;
  installed = true;

  document.addEventListener(
    "click",
    (e) => {
      const link = e.target.closest?.("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") || "";

      if (href.startsWith("https://wa.me/")) {
        track("Contact", { content_name: "whatsapp" });
      } else if (href.startsWith("mailto:")) {
        track("Contact", { content_name: "email" });
      } else if (href.startsWith("tel:")) {
        track("Contact", { content_name: "telefon" });
      }
    },
    true,
  );
}
