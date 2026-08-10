import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import { prisma } from '@/lib/prisma'
import { resolveUploadPath } from '@/lib/media'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Yüklenen görselleri Railway Volume'dan servis eder.
 * public/ altında olamazlar, çünkü volume container dışında mount ediliyor.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params
  const decoded = decodeURIComponent(filename)
  const filePath = resolveUploadPath(decoded)
  if (!filePath) {
    return new NextResponse('Not found', { status: 404 })
  }

  let media
  try {
    media = await prisma.media.findUnique({ where: { filename: decoded } })
  } catch {
    media = null
  }

  try {
    const data = await fs.readFile(filePath)
    return new NextResponse(new Uint8Array(data), {
      headers: {
        'Content-Type': media?.mimeType || 'application/octet-stream',
        // İçerik değişirse dosya adı da değişiyor → uzun süre önbelleklenebilir.
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(data.byteLength),
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
