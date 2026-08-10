import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import { storeUpload, UploadError } from '@/lib/media'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Yetkisiz.' }, { status: 401 })
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'Geçersiz istek.' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'Dosya bulunamadı.' }, { status: 400 })
  }

  try {
    const media = await storeUpload(file)
    return NextResponse.json({ ok: true, media })
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
    }
    console.error('[media] yükleme hatası:', err)
    return NextResponse.json(
      { ok: false, error: 'Yükleme sırasında beklenmeyen bir hata oluştu.' },
      { status: 500 },
    )
  }
}
