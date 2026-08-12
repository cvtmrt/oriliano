import { Reveal } from "./_shared.jsx";
import { notes, noteHref } from "../../data/notes.js";
import { useT, txt } from "../../lib/i18n.jsx";
import { site } from "../../lib/site.js";

// ────────────────────────────────────────────────────────────────
// STÜDYODAN — Instagram içerik hattının site içindeki karşılığı.
// Gömülü feed YOK (yavaş, jenerik ve marka dilini bozuyor). Yerine
// aynı sesle yazılmış kısa notlar; her biri Instagram'a çıkar.
// Bölüm kendi başlığını taşır — ana numaralandırmayı (01–04) bozmamak
// için SectionHead yerine daha sessiz bir üst şerit kullanılır.
// ────────────────────────────────────────────────────────────────

export function FromStudio() {
  const t = useT();

  return (
    <section className="border-t border-ink/10 bg-night py-20 sm:py-24">
      <div className="wrap">
        {/* Üst şerit — sol etiket, sağ takip bağlantısı */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/10 pb-8">
          <div>
            <span className="eyebrow text-steel">{t(txt.fromStudio.index)}</span>
            <p className="mt-3 max-w-md text-base leading-relaxed text-ash">
              {t(txt.fromStudio.sub)}
            </p>
          </div>

          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
            className="group inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-ultra text-steel transition-colors duration-300 hover:text-glow focus-visible:text-glow"
          >
            <span>@{site.instagram}</span>
            <span
              className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-0.5"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>
        </div>

        {/* Notlar */}
        <ul className="grid gap-x-8 gap-y-10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {notes.map((n, i) => (
            <li key={n.no}>
              <Reveal delay={i * 0.06}>
                <a
                  href={noteHref(n)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor
                  className="group flex h-full flex-col"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[0.65rem] tabular-nums text-steel">
                      {n.no}
                    </span>
                    <span className="font-mono text-[0.65rem] uppercase tracking-ultra text-glow/70">
                      {t(n.tag)}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold leading-[1.2] tracking-tight text-chalk transition-colors duration-300 group-hover:text-glow">
                    {t(n.title)}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-ash">{t(n.body)}</p>

                  {/* Alt çizgi — hover'da soldan çizilir */}
                  <span
                    className="mt-5 block h-px w-full origin-left scale-x-0 bg-glow/60 transition-transform duration-500 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
