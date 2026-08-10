import type { Config } from 'tailwindcss'

/**
 * Marka paleti logodan türetildi: lacivert (Ç ve r harfleri) + antrasit (gövde).
 * Bronz sadece ince bir vurgu olarak kullanılıyor — logoda altın yok, bu yüzden
 * ölçülü tutuldu. Vurgu rengi panelden değiştirilebildiği için CSS değişkeni
 * üzerinden okunuyor (globals.css → --accent).
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        navy: {
          50: '#F2F4F9',
          100: '#E2E7F2',
          200: '#C3CCE3',
          300: '#94A3CA',
          400: '#5F73AB',
          500: '#3B4F8D',
          600: '#2A3B6E',
          700: '#1E2A5E',
          800: '#16204A',
          900: '#101733',
          950: '#0A0F22',
        },
        graphite: {
          50: '#F7F7F7',
          100: '#EDEDED',
          200: '#DCDCDC',
          300: '#BFBFBF',
          400: '#9A9A9A',
          500: '#7A7A7A',
          600: '#5E5E5E',
          700: '#4A4A4A',
          800: '#3A3A3A',
          900: '#2A2A2A',
        },
        paper: {
          DEFAULT: '#FBFAF8',
          soft: '#F4F2EE',
          line: '#E7E4DE',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        display: ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,23,51,0.04), 0 8px 24px -12px rgba(16,23,51,0.12)',
        lift: '0 2px 4px rgba(16,23,51,0.05), 0 18px 40px -20px rgba(16,23,51,0.25)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up .7s cubic-bezier(.22,.61,.36,1) both',
        'fade-in': 'fade-in .6s ease both',
      },
    },
  },
  plugins: [],
}

export default config
