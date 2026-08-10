'use client'

import { motion, useReducedMotion, type Variants, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * TEK HAREKET KAYNAĞI.
 *
 * Sitedeki her animasyon buradan geçer; böylece süre/easing tek yerden
 * ayarlanır ve `prefers-reduced-motion` her yerde otomatik saygı görür.
 *
 * Tuzaklar (önceki projelerden alınan dersler):
 *  - Aynı elemana hem CSS transform hem Motion transform verme; Motion'ın
 *    inline style'ı CSS'i ezer ve hover bozulur.
 *  - `style={{y}}` (parallax) ile `animate={{y}}` aynı elemanda çakışır.
 *  - Gecikmeli giriş isteniyorsa `transition`ı `animate` NESNESİNİN İÇİNE koy;
 *    dışarıdaki `transition` prop'u `whileHover`a da uygulanır.
 */

export const EASE_OUT = [0.22, 0.61, 0.36, 1] as const
export const DURATION = { fast: 0.35, base: 0.6, slow: 0.9 } as const
export const SPRING = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 } as const

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 18 },
  down: { x: 0, y: -18 },
  left: { x: 18, y: 0 },
  right: { x: -18, y: 0 },
  none: { x: 0, y: 0 },
}

export interface RevealProps {
  children: ReactNode
  /** Gecikme, MİLİSANİYE cinsinden (çağrı yerlerini basit tutmak için). */
  delay?: number
  direction?: Direction
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'span'
  once?: boolean
  amount?: number
}

export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className,
  as = 'div',
  once = true,
  amount = 0.25,
}: RevealProps) {
  const reduce = useReducedMotion()
  const Comp = motion[as] as React.ComponentType<HTMLMotionProps<'div'>>
  const offset = offsets[direction]

  if (reduce) {
    return (
      <Comp className={className} data-reveal>
        {children}
      </Comp>
    )
  }

  return (
    <Comp
      className={className}
      data-reveal
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: DURATION.base, ease: EASE_OUT, delay: delay / 1000 },
      }}
      viewport={{ once, amount }}
    >
      {children}
    </Comp>
  )
}

/** Ekran üstündeki (hero) içerik için: whileInView değil, mount'ta çalışır. */
export function RevealOnMount({
  children,
  delay = 0,
  direction = 'up',
  className,
  as = 'div',
}: Omit<RevealProps, 'once' | 'amount'>) {
  const reduce = useReducedMotion()
  const Comp = motion[as] as React.ComponentType<HTMLMotionProps<'div'>>
  const offset = offsets[direction]

  if (reduce) {
    return (
      <Comp className={className} data-reveal>
        {children}
      </Comp>
    )
  }

  return (
    <Comp
      className={className}
      data-reveal
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: DURATION.slow, ease: EASE_OUT, delay: delay / 1000 },
      }}
    >
      {children}
    </Comp>
  )
}

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
}

export function Stagger({
  children,
  className,
  as = 'div',
  amount = 0.15,
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'ul' | 'section'
  amount?: number
}) {
  const reduce = useReducedMotion()
  const Comp = motion[as] as React.ComponentType<HTMLMotionProps<'div'>>

  if (reduce) {
    return (
      <Comp className={className} data-reveal>
        {children}
      </Comp>
    )
  }

  return (
    <Comp
      className={className}
      data-reveal
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </Comp>
  )
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article'
}) {
  const reduce = useReducedMotion()
  const Comp = motion[as] as React.ComponentType<HTMLMotionProps<'div'>>

  if (reduce) return <Comp className={className}>{children}</Comp>
  return (
    <Comp className={className} variants={staggerChild}>
      {children}
    </Comp>
  )
}

/**
 * Maskeli kelime kelime başlık girişi. Hero başlığı için; SSR'da metin tam
 * olarak basılır (SEO ve JS'siz erişim güvenli), animasyon hidrasyondan sonra
 * devreye girer.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = 'h1',
}: {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'p'
}) {
  const reduce = useReducedMotion()
  const words = text.split(' ').filter(Boolean)

  if (reduce || words.length === 0) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.045, delayChildren: delay / 1000 } },
        }}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: '100%', opacity: 0 },
                show: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } },
              }}
            >
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

export { motion, useReducedMotion }
