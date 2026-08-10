'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/components/motion'

/**
 * Sağ altta sabit duran hızlı iletişim düğmeleri.
 *
 * Hukuk bürosu trafiğinin çoğu mobil ve insanlar form doldurmak yerine
 * arıyor ya da WhatsApp yazıyor. Tamamı panelden yönetiliyor: açık/kapalı,
 * numara, hazır mesaj ve arama düğmesinin görünürlüğü.
 *
 * Sayfanın en altındayken gizleniyor — orada zaten alt bilgideki iletişim
 * bilgileri ve iletişim bağlantısı var, üstlerine binmesin.
 */
export default function FloatingContact({
  whatsappNumber,
  whatsappText,
  phone,
  showCall,
  labels,
}: {
  whatsappNumber: string
  whatsappText: string
  phone: string
  showCall: boolean
  labels: { whatsapp: string; call: string }
}) {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function update() {
      const y = window.scrollY
      const atBottom = y + window.innerHeight >= document.body.scrollHeight - 220
      setVisible(y > 320 && !atBottom)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const digits = whatsappNumber.replace(/\D/g, '')
  const telHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : null
  const waHref = digits
    ? `https://wa.me/${digits}${whatsappText ? `?text=${encodeURIComponent(whatsappText)}` : ''}`
    : null

  if (!waHref && !(showCall && telHref)) return null

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_OUT } }}
          exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
          className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 print:hidden"
        >
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={labels.whatsapp}
              className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#1F9D55] text-white shadow-lift transition-transform duration-200 hover:scale-105 sm:h-auto sm:w-auto sm:gap-2.5 sm:rounded-full sm:px-5 sm:py-3.5"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0">
                <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
                <path d="M12.04 2C6.6 2 2.18 6.42 2.17 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.84 9.84 0 0 0 4.7 1.2h.01c5.43 0 9.85-4.42 9.86-9.86A9.79 9.79 0 0 0 19.03 5 9.79 9.79 0 0 0 12.04 2Zm5.76 15.62c-.24.68-1.42 1.31-1.96 1.36-.5.06-1.14.08-1.84-.11-.42-.13-.97-.31-1.67-.61-2.94-1.27-4.86-4.23-5.01-4.43-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.59-.37.79-.37h.57c.18 0 .43-.07.67.51.25.6.84 2.05.91 2.2.08.15.13.32.03.52-.1.2-.15.32-.3.5-.15.17-.32.39-.45.52-.15.14-.3.3-.13.6.17.29.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.29.14.47.12.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.08.12.08.71-.17 1.41Z" />
              </svg>
              <span className="hidden text-sm font-medium sm:inline">{labels.whatsapp}</span>
            </a>
          ) : null}

          {showCall && telHref ? (
            <a
              href={telHref}
              aria-label={labels.call}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-700 text-white shadow-lift transition-transform duration-200 hover:scale-105 sm:h-auto sm:w-auto sm:gap-2.5 sm:px-5 sm:py-3.5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
                <path
                  d="M6.5 3h2.2l1.4 3.6-1.7 1.3a12.6 12.6 0 0 0 5.7 5.7l1.3-1.7L19 13.3v2.2a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden text-sm font-medium sm:inline">{labels.call}</span>
            </a>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
