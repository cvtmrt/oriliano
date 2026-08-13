'use client'

import { useActionState } from 'react'
import { changePasswordAction, type PasswordFormState } from '@/app/(admin)/admin/actions'
import { SubmitButton } from './ui'

export default function PasswordForm() {
  const [state, formAction] = useActionState<PasswordFormState, FormData>(changePasswordAction, {})

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {/* Tarayıcı şifre yöneticisinin hangi hesabı güncelleyeceğini bilmesi
          için gizli kullanıcı alanı — yoksa kaydedilen şifreyi eşleştiremiyor. */}
      <input type="hidden" name="username" autoComplete="username" />

      <div>
        <label className="field-label" htmlFor="currentPassword">
          Mevcut şifreniz
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="field-input"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="newPassword">
          Yeni şifre
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className="field-input"
        />
        <p className="mt-1.5 text-xs text-graphite-500">
          En az 10 karakter. Tahmin edilmesi zor, sizin hatırlamanız kolay bir şey seçin —
          uzunluk, karmaşıklıktan daha çok işe yarar.
        </p>
      </div>

      <div>
        <label className="field-label" htmlFor="repeatPassword">
          Yeni şifre (tekrar)
        </label>
        <input
          id="repeatPassword"
          name="repeatPassword"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className="field-input"
        />
      </div>

      {state?.error ? (
        <p
          role="alert"
          className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {state.error}
        </p>
      ) : null}

      {state?.done ? (
        <p
          role="status"
          className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
        >
          Şifreniz değiştirildi. Bu tarayıcıda açık kalıyorsunuz; başka bir cihazda açık
          oturumunuz varsa kapatıldı.
        </p>
      ) : null}

      <SubmitButton>Şifreyi değiştir</SubmitButton>
    </form>
  )
}
