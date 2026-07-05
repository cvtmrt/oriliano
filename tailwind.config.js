/** @type {import('tailwindcss').Config} */
// KOYU NÖTR + TERRACOTTA premium tema (framerate.space ile aynı dil):
// near-black nötr yüzeyler, tek sıcak vurgu rengi, ölçülü gri metin skalası.
// Token isimleri (night/chalk/ash...) geriye dönük uyum için korundu:
//   night = koyu zemin · chalk = açık metin · glow = terracotta marka rengi
// cream/carbon: temadan bağımsız krem "nefes" bölümü token'ları (Manifesto).
export default {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./layouts/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Yüzeyler (koyu nötr) ---
        night: "#0E0E0E", // sayfa zemini (near-black)
        coal: "#141414", // alternatif bölüm zemini
        graphite: "#1C1C1C", // kart zemini
        iron: "#262626", // yükseltilmiş yüzey / tarayıcı barı
        // --- Metin ---
        chalk: "#EDEDEB", // ana metin (sıcak beyaz)
        ash: "#9C9992", // ikincil metin
        steel: "#737373", // soluk metin / ayraç (koyu zeminde ≥3:1 kontrast)
        // --- Marka / aksan ---
        glow: "#C96342", // ana marka (terracotta)
        violet: "#E08A5C", // gradient orta ton (sıcak şeftali)
        flame: "#E25C3B", // sıcak ikincil aksan
        ink: { DEFAULT: "#FFFFFF" }, // hairline/ayraç tabanı (koyu zeminde beyaz)
        // --- Krem bölüm (temadan bağımsız) ---
        cream: "#F1EEE7", // Manifesto zemin
        carbon: "#171512", // krem üstü mürekkep metin
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        sans: ["'Onest'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'Geist Mono'", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.03em",
        ultra: "0.32em",
      },
      backgroundImage: {
        "brand-grad": "linear-gradient(120deg, #C96342 0%, #D97A50 50%, #E89468 100%)",
        "brand-soft": "linear-gradient(120deg, rgba(201,99,66,0.16), rgba(217,122,80,0.10), rgba(232,148,104,0.10))",
        "sheen": "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 48%, transparent 60%)",
        "radial-fade": "radial-gradient(ellipse at center, rgba(255,255,255,0.05), transparent 70%)",
        "radial-glow": "radial-gradient(circle at center, rgba(201,99,66,0.16), transparent 65%)",
        "radial-flame": "radial-gradient(circle at center, rgba(226,92,59,0.14), transparent 65%)",
        // Koyu "sahne" için tepeden inen spot ışığı + zemin parıltısı
        "stage-spot": "radial-gradient(ellipse 70% 55% at 50% -8%, rgba(255,255,255,0.14), rgba(255,255,255,0.04) 40%, transparent 68%)",
        "stage-glow": "radial-gradient(ellipse 60% 50% at 50% 110%, rgba(201,99,66,0.20), transparent 70%)",
      },
      boxShadow: {
        soft: "0 18px 50px -24px rgba(0,0,0,0.60)",
        lift: "0 30px 70px -30px rgba(201,99,66,0.45)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-quint": "cubic-bezier(0.83, 0, 0.17, 1)",
      },
      container: { center: true, padding: "1.5rem" },
    },
  },
  plugins: [],
};
