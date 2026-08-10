import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { saveGlossaryAction } from '../actions'
import { PageTitle, Card, SubmitButton } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

export default async function GlossaryPage() {
  if (!(await getCurrentAdmin())) redirect('/admin/login')

  const terms = await prisma.glossaryTerm.findMany({ orderBy: { order: 'asc' } }).catch(() => [])

  return (
    <>
      <PageTitle
        title="Terim Sözlüğü"
        description="Otomatik çeviri bu listeye birebir uyar. Hukuki terimlerin İngilizce karşılığını buradan sabitleyebilirsiniz."
      />

      <form action={saveGlossaryAction} className="space-y-6">
        <Card title="Terimler">
          <div className="hidden gap-3 pb-2 text-[0.7rem] uppercase tracking-wide text-graphite-500 sm:grid sm:grid-cols-[1fr_1fr_5rem_5rem_4rem]">
            <span>Türkçe</span>
            <span>English</span>
            <span>Sıra</span>
            <span>Aktif</span>
            <span>Sil</span>
          </div>

          <div className="space-y-3">
            {terms.map((term) => (
              <div
                key={term.id}
                className="grid gap-3 border-b border-graphite-200 pb-3 last:border-b-0 sm:grid-cols-[1fr_1fr_5rem_5rem_4rem] sm:items-center"
              >
                <input name={`tr__${term.id}`} defaultValue={term.tr} className="field-input" />
                <input name={`en__${term.id}`} defaultValue={term.en} className="field-input" />
                <input
                  name={`order__${term.id}`}
                  type="number"
                  defaultValue={term.order}
                  className="field-input px-2 text-center"
                />
                <label className="flex min-h-[44px] items-center gap-2 text-xs text-graphite-600">
                  <input
                    type="checkbox"
                    name={`active__${term.id}`}
                    defaultChecked={term.active}
                    className="h-4 w-4"
                  />
                  <span className="sm:hidden">Aktif</span>
                </label>
                <label className="flex min-h-[44px] items-center gap-2 text-xs text-red-700">
                  <input type="checkbox" name={`delete__${term.id}`} className="h-4 w-4" />
                  <span className="sm:hidden">Sil</span>
                </label>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Yeni terim ekle">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="new__tr">
                Türkçe
              </label>
              <input id="new__tr" name="new__tr" className="field-input" />
            </div>
            <div>
              <label className="field-label" htmlFor="new__en">
                English
              </label>
              <input id="new__en" name="new__en" className="field-input" />
            </div>
          </div>
        </Card>

        <div className="sticky bottom-0 -mx-4 border-t border-graphite-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <SubmitButton>Sözlüğü kaydet</SubmitButton>
        </div>
      </form>
    </>
  )
}
