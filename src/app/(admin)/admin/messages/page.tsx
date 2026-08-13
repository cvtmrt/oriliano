import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/date'
import { deleteMessageAction, toggleMessageReadAction } from '../actions'
import { PageTitle, Empty } from '@/components/admin/ui'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
  if (!(await getCurrentAdmin())) redirect('/admin/login')

  const messages = await prisma.contactMessage
    .findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
    .catch(() => [])

  const unread = messages.filter((m) => !m.read).length

  return (
    <>
      <PageTitle
        title="Gelen Kutusu"
        description={
          messages.length > 0
            ? `${messages.length} mesaj · ${unread} okunmamış`
            : 'İletişim formundan gelen mesajlar burada listelenir.'
        }
      />

      {messages.length === 0 ? (
        <Empty>Henüz mesaj yok.</Empty>
      ) : (
        <ul className="space-y-3">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`rounded-md border bg-white p-5 ${
                message.read ? 'border-graphite-200' : 'border-amber-300 bg-amber-50/40'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-navy-900">
                    {message.name}
                    {!message.read ? (
                      <span className="ml-2 rounded-full bg-amber-200 px-2 py-0.5 text-[0.68rem] font-normal text-amber-900">
                        yeni
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-graphite-500">
                    <a href={`mailto:${message.email}`} className="underline underline-offset-2">
                      {message.email}
                    </a>
                    {message.phone ? (
                      <a href={`tel:${message.phone}`} className="underline underline-offset-2">
                        {message.phone}
                      </a>
                    ) : null}
                    <span>{formatDateTime(message.createdAt)}</span>
                    <span className="uppercase">{message.locale}</span>
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <form action={toggleMessageReadAction}>
                    <input type="hidden" name="id" value={message.id} />
                    <button
                      type="submit"
                      className="rounded border border-graphite-300 px-2.5 py-1.5 text-xs text-graphite-700 transition-colors hover:bg-graphite-100"
                    >
                      {message.read ? 'Okunmadı yap' : 'Okundu işaretle'}
                    </button>
                  </form>
                  <DeleteButton
                    action={deleteMessageAction}
                    id={message.id}
                    confirmText="Bu mesaj kalıcı olarak silinsin mi?"
                  />
                </div>
              </div>

              {message.subject ? (
                <p className="mt-3 text-sm font-medium text-graphite-800">{message.subject}</p>
              ) : null}
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-graphite-700">
                {message.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
