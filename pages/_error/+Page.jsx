import { useT, txt } from "../../lib/i18n.jsx";

export default function Page() {
  const t = useT();
  return (
    <section className="flex min-h-[70vh] items-center bg-night">
      <div className="wrap text-center">
        <span className="eyebrow text-steel">{t(txt.notFoundTitle)}</span>
        <h1 className="mt-6 font-display text-6xl font-black uppercase tracking-tightest text-chalk sm:text-8xl">
          404
        </h1>
        <p className="mx-auto mt-6 max-w-md text-ash">{t(txt.notFoundBody)}</p>
        <a href="/" className="btn btn-outline mt-10" data-cursor>
          {t(txt.backHome)}
        </a>
      </div>
    </section>
  );
}
