import "./style.css";
import { MotionConfig } from "framer-motion";
import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";
import { SmoothScroll } from "../components/SmoothScroll.jsx";
import { ScrollProgress } from "../components/anim/Interactive.jsx";
import { Preloader } from "../components/anim/Preloader.jsx";
import { PageCurtain } from "../components/anim/PageCurtain.jsx";
import { Consent } from "../components/Consent.jsx";
import { ClientOnly } from "../components/ClientOnly.jsx";
import { LangProvider } from "../lib/i18n.jsx";

export default function Layout({ children }) {
  return (
    <LangProvider>
      {/* reducedMotion="user": tüm framer animasyonları prefers-reduced-motion'a
          uyar (transform kapanır, opacity korunur) — GSAP tarafı matchMedia ile zaten güvenli. */}
      <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <a href="#main" className="skip-link">İçeriğe atla</a>
        <div className="grain" aria-hidden="true" />
        <Preloader />
        <PageCurtain />
        <ClientOnly><ScrollProgress /></ClientOnly>
        <ClientOnly><Consent /></ClientOnly>
        <div id="top" className="flex min-h-screen flex-col bg-night">
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
        </div>
      </SmoothScroll>
      </MotionConfig>
    </LangProvider>
  );
}
