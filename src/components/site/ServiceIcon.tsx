/**
 * Hizmet ikonları. Panelde ikon anahtarı seçiliyor; buradaki listede olmayan
 * bir anahtar gelirse varsayılan terazi ikonu gösterilir.
 */

export const serviceIconKeys = [
  'scale',
  'briefcase',
  'building',
  'heart',
  'gavel',
  'home',
  'file',
  'scroll',
  'landmark',
  'shield',
  'sparkle',
  'handshake',
] as const

export type ServiceIconKey = (typeof serviceIconKeys)[number]

const paths: Record<string, string> = {
  scale: 'M12 3v18M5 7h14M7 7l-3 6a3 3 0 0 0 6 0L7 7Zm10 0-3 6a3 3 0 0 0 6 0l-3-6ZM8 21h8',
  briefcase:
    'M3 8.5h18v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-10Zm6 0V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2.5M3 13h18',
  building: 'M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M14 10h4a2 2 0 0 1 2 2v9M7 8h4M7 12h4M7 16h4M17 14h1M17 18h1M2 21h20',
  heart: 'M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7 2.7C19 15.6 12 20 12 20Z',
  gavel: 'm14 4 6 6M11 7l6 6M8.5 9.5 4 14a2 2 0 0 0 2.8 2.8l4.5-4.5M13 3.5 20.5 11M4 21h9',
  home: 'M3 11 12 4l9 7M5.5 9.8V20h13V9.8M10 20v-5.5h4V20',
  file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5M9 13h6M9 17h4',
  scroll: 'M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6M6 4a2 2 0 0 0-2 2v1h3M6 4a2 2 0 0 1 2 2v12a2 2 0 0 0 2 2M9 9h7M9 13h7',
  landmark: 'M3 21h18M4 21V10m4 11V10m4 11V10m4 11V10m4 11V10M2 10h20L12 3 2 10Z',
  shield: 'M12 3.5 20 6v6c0 4.6-3.3 7.7-8 9-4.7-1.3-8-4.4-8-9V6l8-2.5Z',
  sparkle: 'M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18l-1.8-5.4L4.5 10.8 10.2 9 12 3.5ZM18.5 16l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1Z',
  handshake: 'm8 12-2.5 2.5a2 2 0 0 0 2.8 2.8L11 14.8M11 14.8l2.1 2.1a1.8 1.8 0 0 0 2.6-2.6M13.1 16.9l1.6 1.6a1.7 1.7 0 0 0 2.4-2.4M3 9l4-4 3 1.5L14 5l3 1.5L21 9M3 9l3 3M21 9l-3 3',
}

export default function ServiceIcon({
  name,
  className = 'h-6 w-6',
}: {
  name: string
  className?: string
}) {
  const d = paths[name] ?? paths.scale
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
