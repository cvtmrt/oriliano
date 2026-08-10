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

export default function ContactForm({
  locale,
  labels,
}: {
  locale: Locale
  labels: ContactFormLabels
}) {
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')

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
          <input id="cf-phone" name="phone" type="tel" maxLength={40} className="field-input" autoComplete="tel" />
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
          maxLength={4000}
          className="field-input resize-y"
        />
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
