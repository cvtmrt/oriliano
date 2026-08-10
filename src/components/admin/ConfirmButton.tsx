'use client'

import { SubmitButton } from './ui'

/**
 * Tek tuşluk, onay soran işlem. Form alanına metin yazdırmak yerine
 * tarayıcının onay kutusunu kullanır.
 */
export default function ConfirmButton({
  action,
  confirmText,
  label,
  variant = 'danger',
}: {
  action: () => void | Promise<void>
  confirmText: string
  label: string
  variant?: 'primary' | 'secondary' | 'danger'
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault()
      }}
    >
      <SubmitButton variant={variant}>{label}</SubmitButton>
    </form>
  )
}
