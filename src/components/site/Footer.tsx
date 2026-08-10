import Link from 'next/link'
import Image from 'next/image'
import { getSettings, getT, siteName, mediaUrl } from '@/lib/content'
import { pick, type Locale } from '@/lib/i18n'
import { href, type RouteKey } from '@/lib/routes'
import Wordmark from './Wordmark'

interface MenuEntry {
  routeKey: RouteKey
  label: string
}

const socialFields = [
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'x', label: 'X' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'youtube', label: 'YouTube' },
] as const

export default async function Footer({ locale, menu }: { locale: Locale; menu: MenuEntry[] }) {
  const [settings, t] = await Promise.all([getSettings(), getT(locale)])
  const name = siteName(settings, locale)
  const address = pick(locale, settings.addressTr, settings.addressEn)
  const hours = pick(locale, settings.workingHoursTr, settings.workingHoursEn)
  const year = new Date().getFullYear()

  const socials = socialFields
    .map((f) => ({ ...f, url: (settings as unknown as Record<string, string>)[f.key] }))
    .filter((s) => s.url && s.url.trim())

  // Üstte boşluk (mt-24) YOK: sayfaların son bölümleri zaten kendi alt
  // boşluğunu veriyor. Boşluk verildiğinde anasayfadaki koyu CTA şeridi ile
  // koyu alt bilgi arasında boş bir açık bant kalıyordu.
  return (
    <footer className="border-t border-paper-line bg-navy-900 text-navy-100">
      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="lg:col-span-2">
          {settings.logoDark ? (
            <Image
              src={mediaUrl(settings.logoDark.filename)}
              alt={name}
              width={220}
              height={60}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <div className="text-white">
              <Wordmark name={name} className="[&_span]:!text-white" />
            </div>
          )}
          <p className="mt-6 max-w-md text-sm leading-relaxed text-navy-200">
            {t('footer.about.body')}
          </p>

          {socials.length > 0 ? (
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
              {socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-[0.78rem] uppercase tracking-wider text-navy-200 transition-colors hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-label={t('footer.nav.title')}>
          <h2 className="font-serif text-sm uppercase tracking-[0.14em] text-white">
            {t('footer.nav.title')}
          </h2>
          <ul className="mt-5 space-y-2.5">
            {menu.map((item) => (
              <li key={item.routeKey}>
                <Link
                  href={href(item.routeKey, locale)}
                  className="link-underline text-sm text-navy-200 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-serif text-sm uppercase tracking-[0.14em] text-white">
            {t('footer.contact.title')}
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-navy-200">
            {address ? <li className="whitespace-pre-line leading-relaxed">{address}</li> : null}
            {settings.phone ? (
              <li>
                <a
                  href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
                  className="link-underline transition-colors hover:text-white"
                >
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {settings.email ? (
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="link-underline break-all transition-colors hover:text-white"
                >
                  {settings.email}
                </a>
              </li>
            ) : null}
            {hours ? <li className="text-navy-300">{hours}</li> : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="container flex flex-col gap-4 py-7 text-xs leading-relaxed text-navy-300 md:flex-row md:items-start md:justify-between">
          <p className="max-w-2xl">{t('footer.disclaimer')}</p>
          <p className="shrink-0">
            © {year} {name}. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
