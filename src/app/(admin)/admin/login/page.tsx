import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import LoginForm from '@/components/admin/LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  if (await isAuthenticated()) redirect('/admin')

  const configured = Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH)

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-serif text-xl text-navy-800">Çetiner Hukuk</p>
          <p className="mt-1 text-sm text-graphite-500">Yönetim Paneli</p>
        </div>

        <div className="rounded-md border border-graphite-200 bg-white p-6">
          <LoginForm />
        </div>

        {!configured ? (
          <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
            <strong>Kurulum gerekli.</strong> <code>ADMIN_EMAIL</code> ve{' '}
            <code>ADMIN_PASSWORD_HASH</code> ortam değişkenleri tanımlı değil. Şifre karması üretmek
            için: <code>npm run hash -- &quot;sifreniz&quot;</code>
          </p>
        ) : null}
      </div>
    </div>
  )
}
