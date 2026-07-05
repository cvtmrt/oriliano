import { SceneBackdrop } from "../../components/anim/SceneBackdrop.jsx";
import { useT, txt } from "../../lib/i18n.jsx";

export default function Page() {
  const t = useT();
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-night">
      {/* Sahne atmosferi + merkezde nefes alan sıvı-cam blob (masaüstü) */}
      <div className="pointer-events-none absolute inset-0 bg-stage-spot opacity-70" />
      <SceneBackdrop state={{ x: 0, y: 0.05, s: 1.0, o: 0.8 }} />
      <div className="grain-dark" aria-hidden="true" />

      <div className="wrap relative z-10 text-center">
        <span className="eyebrow text-steel">{t(txt.notFoundTitle)}</span>
        <h1 className="mt-6 font-display text-7xl font-black uppercase tracking-tightest text-chalk sm:text-9xl">
          <span className="inline-block animate-floaty">404</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-ash">{t(txt.notFoundBody)}</p>
        <a href="/" className="btn btn-outline mt-10" data-cursor>
          {t(txt.backHome)}
        </a>
      </div>
    </section>
  );
}
