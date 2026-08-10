'use client'

export default function DeleteButton({
  action,
  id,
  confirmText,
  label = 'Sil',
}: {
  action: (formData: FormData) => void | Promise<void>
  id: string
  confirmText: string
  label?: string
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded border border-red-200 px-2.5 py-1.5 text-xs text-red-700 transition-colors hover:bg-red-50"
      >
        {label}
      </button>
    </form>
  )
}
