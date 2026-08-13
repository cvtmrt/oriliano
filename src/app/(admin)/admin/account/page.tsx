import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { PageTitle, Card } from '@/components/admin/ui'
import PasswordForm from '@/components/admin/PasswordForm'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const user = await getCurrentAdmin()
  if (!user) redirect('/admin/login')

  return (
    <>
      <PageTitle
        title="Hesabım"
        description="Giriş bilgileriniz. Şifrenizi buradan dilediğiniz zaman değiştirebilirsiniz."
      />

      <div className="space-y-6">
        <Card title="Giriş e-postanız">
          <p className="font-mono text-sm text-graphite-800">{user.email}</p>
          <p className="mt-2 text-sm text-graphite-500">
            E-posta adresi panelden değiştirilemiyor. Değişmesi gerekirse siteyi kuran ekibe
            yazın.
          </p>
        </Card>

        <Card
          title="Şifre değiştir"
          description="Size iletilen ilk şifreyi kullanıyorsanız, kendi belirlediğiniz bir şifreyle değiştirin."
        >
          <PasswordForm />
        </Card>
      </div>
    </>
  )
}
