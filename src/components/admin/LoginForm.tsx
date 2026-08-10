'use client'

import { useActionState } from 'react'
import { loginAction } from '@/app/(admin)/admin/actions'
import { SubmitButton } from './ui'

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, {})

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="field-label" htmlFor="email">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="field-input"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="password">
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field-input"
        />
      </div>

      {state?.error ? (
        <p role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}

      <SubmitButton className="w-full">Giriş yap</SubmitButton>
    </form>
  )
}
