import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { getCurrentAdmin } from '@/lib/auth'
import AdminShell from '@/components/admin/AdminShell'

const sans = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Yönetim Paneli',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentAdmin()

  return (
    <html lang="tr" className={`${sans.variable}`}>
      <body className="min-h-screen bg-graphite-50 font-sans text-graphite-800 antialiased">
        {user ? <AdminShell email={user.email}>{children}</AdminShell> : children}
      </body>
    </html>
  )
}
