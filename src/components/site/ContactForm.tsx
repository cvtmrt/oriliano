'use client'

import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE_OUT } from '@/components/motion'
import type { Locale } from '@/lib/i18n'

export interface ContactFormLabels {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  submit: string
  sending: string
  success: string
  error: string
  consent: string
}

type State = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Alan ipuçları ve en kısa mesaj uzunluğu.
 *
 * Telefon biçimi bir metin değil bir örnek olduğu için panelden değil buradan
 * geliyor; ziyaretçinin "başında sıfır olacak mı, +90 mı yazsam" diye
 * duraksamaması için hem yer tutucuda hem alt satırda gösteriliyor.
 */
const MIN_MESSAGE = 10

const HINTS = {
  tr: {
    phonePlaceholder: '0532 123 45 67',
    phoneHelp: 'Başında sıfırla yazabilirsiniz. Yurt dışından: +90 532 123 45 67',
    messageHelp: `En az ${MIN_MESSAGE} karakter.`,
    messageShort: 'Mesajınız çok kısa. Talebinizi birkaç cümleyle anlatın.',
  },
  en: {
    phonePlaceholder: '+90 532 123 45 67',
    phoneHelp: 'Include the country code if you are calling from abroad.',
    messageHelp: `At least ${MIN_MESSAGE} characters.`,
    messageShort: 'Your message is too short. Please describe your request briefly.',
  },
} as const

export default function ContactForm({
  locale,
  labels,
}: {
  locale: Locale
  labels: ContactFormLabels
}) {
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')
  const hints = HINTS[locale] ?? HINTS.tr

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'sending') return

    const form = event.currentTarget
    const data = new FormData(form)
    // Bot tuzağı: gerçek kullanıcı bu alanı doldurmaz.
    if ((data.get('website') as string)?.trim()) {
      setState('sent')
      setMessage(labels.success)
      return
    }

    // Sunucuya gitmeden önce en sık takılan kural burada yakalanıyor: ziyaretçi
    // hatayı anında ve alanın kendisinde görüyor.
    const typed = String(data.get('message') ?? '').trim()
    if (typed.length < MIN_MESSAGE) {
      setState('error')
      setMessage(hints.messageShort)
      form.querySelector<HTMLTextAreaElement>('#cf-message')?.focus()
      return
    }

    setState('sending')
    setMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          subject: data.get('subject'),
          message: data.get('message'),
          locale,
        }),
      })

      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !json.ok) {
        setState('error')
        setMessage(json.error || labels.error)
        return
      }

      form.reset()
      setState('sent')
      setMessage(labels.success)
    } catch {
      setState('error')
      setMessage(labels.error)
    }
  }

  const disabled = state === 'sending'

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="cf-name">
            {labels.name} <span aria-hidden className="text-graphite-400">*</span>
          </label>
          <input id="cf-name" name="name" required maxLength={120} className="field-input" autoComplete="name" />
        </div>
        <div>
          <label className="field-label" htmlFor="cf-email">
            {labels.email} <span aria-hidden className="text-graphite-400">*</span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            maxLength={160}
            className="field-input"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="cf-phone">
            {labels.phone}
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            maxLength={40}
            placeholder={hints.phonePlaceholder}
            aria-describedby="cf-phone-help"
            className="field-input"
            autoComplete="tel"
          />
          <p id="cf-phone-help" className="mt-1.5 text-xs text-graphite-500">
            {hints.phoneHelp}
          </p>
        </div>
        <div>
          <label className="field-label" htmlFor="cf-subject">
            {labels.subject}
          </label>
          <input id="cf-subject" name="subject" maxLength={160} className="field-input" />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="cf-message">
          {labels.message} <span aria-hidden className="text-graphite-400">*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={6}
          minLength={MIN_MESSAGE}
          maxLength={4000}
          aria-describedby="cf-message-help"
          className="field-input resize-y"
        />
        <p id="cf-message-help" className="mt-1.5 text-xs text-graphite-500">
          {hints.messageHelp}
        </p>
      </div>

      <p className="text-xs leading-relaxed text-graphite-500">{labels.consent}</p>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary min-w-[10rem]" disabled={disabled}>
          {disabled ? labels.sending : labels.submit}
        </button>

        <AnimatePresence mode="wait">
          {message ? (
            <motion.p
              key={message}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className={`text-sm ${state === 'error' ? 'text-red-700' : 'text-green-800'}`}
            >
              {message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  )
}
