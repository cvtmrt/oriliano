/** @type {import('tailwindcss').Config} */
// AÇIK + RENKLİ premium tema; hero / Selected Work / case girişleri
// hardcoded (#0B0B12) koyu sinematik sahneler olarak kalır.
// Token isimleri (night/chalk/ash...) geriye dönük uyum için korundu:
//   night = krem zemin · chalk = mürekkep metin · glow = kobalt marka rengi
// cream/carbon: temadan bağımsız krem bölüm token'ları (Manifesto).
export default {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./layouts/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Yüzeyler (açık) ---
        night: "#F3F0E9", // sayfa zemini (sıcak krem)
        coal: "#ECE7DC", // alternatif bölüm zemini
        graphite: "#FFFFFF", // kart zemini (beyaz)
        iron: "#F6F3EC", // yükseltilmiş yüzey / tarayıcı barı
        // --- Metin ---
        chalk: "#16130F", // ana metin (mürekkep)
        ash: "#6A655B", // ikincil metin
        steel: "#8A8476", // soluk metin / ayraç (krem zeminde ≥3:1 kontrast)
        // --- Marka / aksan ---
        glow: "#2742FF", // ana marka (kobalt)
        violet: "#7A5BFF", // gradient orta ton
        flame: "#FF5B34", // sıcak ikincil aksan
        ink: { DEFAULT: "#16130F" }, // hairline/ayraç tabanı
        // --- Krem bölüm (temadan bağımsız) ---
        cream: "#F3F0E9", // Manifesto zemin
        carbon: "#16130F", // krem üstü mürekkep metin
      },
      fontFamily: {
        display: ["'Archivo'", "system-ui", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'Geist Mono'", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        ultra: "0.32em",
      },
      backgroundImage: {
        "brand-grad": "linear-gradient(120deg, #2742FF 0%, #7A5BFF 45%, #FF5B34 100%)",
        "brand-soft": "linear-gradient(120deg, rgba(39,66,255,0.14), rgba(122,91,255,0.10), rgba(255,91,52,0.10))",
        "sheen": "linear-gradient(105deg, transparent 30%, rgba(0,0,0,0.05) 48%, transparent 60%)",
        "radial-fade": "radial-gradient(ellipse at center, rgba(0,0,0,0.04), transparent 70%)",
        "radial-glow": "radial-gradient(circle at center, rgba(39,66,255,0.16), transparent 65%)",
        "radial-flame": "radial-gradient(circle at center, rgba(255,91,52,0.16), transparent 65%)",
        // Koyu "sahne" için tepeden inen spot ışığı + zemin parıltısı
        "stage-spot": "radial-gradient(ellipse 70% 55% at 50% -8%, rgba(255,255,255,0.16), rgba(255,255,255,0.04) 40%, transparent 68%)",
        "stage-glow": "radial-gradient(ellipse 60% 50% at 50% 110%, rgba(39,66,255,0.22), transparent 70%)",
      },
      boxShadow: {
        soft: "0 18px 50px -24px rgba(22,19,15,0.30)",
        lift: "0 30px 70px -30px rgba(39,66,255,0.35)",
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
