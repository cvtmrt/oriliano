import 'server-only'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from 'sharp'
import { prisma } from './prisma'

/**
 * GÖRSEL DEPOLAMA — Railway Volume
 *
 * Railway container'ının dosya sistemi kalıcı DEĞİL: her deploy'da sıfırlanır.
 * Bu yüzden yüklemeler UPLOAD_DIR altına yazılır ve bu dizine Railway'de bir
 * Volume mount edilir (README'de adım adım anlatıldı).
 *
 * Görseller base64 olarak veritabanına GÖMÜLMEZ; DB'de yalnızca dosya adı ve
 * meta bilgi durur. Servis /api/media/<filename> route'u üzerinden yapılır.
 */

export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), '.uploads')

const MAX_BYTES = Number(process.env.UPLOAD_MAX_BYTES || 8 * 1024 * 1024) // 8 MB
const MAX_DIMENSION = Number(process.env.UPLOAD_MAX_DIMENSION || 2400)

const ACCEPTED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
])

export class UploadError extends Error {}

async function ensureDir(): Promise<void> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
}

function randomName(ext: string): string {
  return `${Date.now().toString(36)}-${crypto.randomBytes(6).toString('hex')}${ext}`
}

/** Path traversal koruması: dosya adı sadece dosya adı olabilir. */
export function safeFilename(name: string): string | null {
  const base = path.basename(name)
  if (!base || base === '.' || base === '..') return null
  if (base !== name) return null
  if (!/^[A-Za-z0-9._-]+$/.test(base)) return null
  return base
}

export function resolveUploadPath(filename: string): string | null {
  const safe = safeFilename(filename)
  if (!safe) return null
  const full = path.join(UPLOAD_DIR, safe)
  const root = path.resolve(UPLOAD_DIR)
  if (!path.resolve(full).startsWith(root + path.sep)) return null
  return full
}

export interface StoredMedia {
  id: string
  filename: string
  mimeType: string
  width: number | null
  height: number | null
  sizeBytes: number
}

/**
 * Yüklenen dosyayı doğrular, WebP'ye çevirip yeniden boyutlandırır ve
 * Volume'a yazar. SVG ve GIF dönüştürülmez (vektör / animasyon korunur).
 */
export async function storeUpload(file: File): Promise<StoredMedia> {
  if (!file || file.size === 0) throw new UploadError('Dosya boş.')
  if (file.size > MAX_BYTES) {
    throw new UploadError(`Dosya çok büyük. En fazla ${Math.round(MAX_BYTES / 1024 / 1024)} MB.`)
  }
  if (!ACCEPTED.has(file.type)) {
    throw new UploadError(
      'Desteklenmeyen dosya türü. JPG, PNG, WebP, AVIF, GIF veya SVG yükleyin.',
    )
  }

  await ensureDir()
  const input = Buffer.from(await file.arrayBuffer())

  let output: Buffer = input
  let mimeType = file.type
  let ext = path.extname(file.name).toLowerCase() || '.bin'
  let width: number | null = null
  let height: number | null = null

  if (file.type === 'image/svg+xml') {
    // SVG'yi olduğu gibi sakla ama içerik türünü doğrula.
    const head = input.subarray(0, 1024).toString('utf8').toLowerCase()
    if (!head.includes('<svg')) throw new UploadError('Geçersiz SVG dosyası.')
    ext = '.svg'
  } else if (file.type === 'image/gif') {
    ext = '.gif'
    try {
      const meta = await sharp(input, { animated: true }).metadata()
      width = meta.width ?? null
      height = meta.pageHeight ?? meta.height ?? null
    } catch {
      throw new UploadError('Görsel okunamadı.')
    }
  } else {
    try {
      const pipeline = sharp(input, { failOn: 'none' }).rotate()
      const meta = await pipeline.metadata()
      const needsResize =
        (meta.width ?? 0) > MAX_DIMENSION || (meta.height ?? 0) > MAX_DIMENSION
      const resized = needsResize
        ? pipeline.resize({
            width: MAX_DIMENSION,
            height: MAX_DIMENSION,
            fit: 'inside',
            withoutEnlargement: true,
          })
        : pipeline
      const result = await resized.webp({ quality: 82, effort: 4 }).toBuffer({ resolveWithObject: true })
      output = Buffer.from(result.data)
      width = result.info.width
      height = result.info.height
      mimeType = 'image/webp'
      ext = '.webp'
    } catch {
      throw new UploadError('Görsel işlenemedi. Dosya bozuk olabilir.')
    }
  }

  const filename = randomName(ext)
  const target = resolveUploadPath(filename)
  if (!target) throw new UploadError('Dosya adı üretilemedi.')
  await fs.writeFile(target, output)

  const media = await prisma.media.create({
    data: {
      filename,
      originalName: path.basename(file.name).slice(0, 200),
      mimeType,
      width,
      height,
      sizeBytes: output.length,
    },
  })

  return {
    id: media.id,
    filename: media.filename,
    mimeType: media.mimeType,
    width: media.width,
    height: media.height,
    sizeBytes: media.sizeBytes,
  }
}

/** Kaydı ve dosyayı siler. Kullanımda olan yerlerde ilişki SetNull ile kopar. */
export async function deleteMedia(id: string): Promise<void> {
  const media = await prisma.media.findUnique({ where: { id } })
  if (!media) return
  await prisma.media.delete({ where: { id } })
  const target = resolveUploadPath(media.filename)
  if (target) {
    await fs.unlink(target).catch(() => undefined)
  }
}

export async function listMedia(limit = 200) {
  return prisma.media.findMany({ orderBy: { createdAt: 'desc' }, take: limit })
}

/** Volume gerçekten yazılabilir mi? Panelde uyarı göstermek için. */
export async function storageStatus(): Promise<{ dir: string; writable: boolean; error?: string }> {
  try {
    await ensureDir()
    const probe = path.join(UPLOAD_DIR, `.probe-${Date.now()}`)
    await fs.writeFile(probe, 'ok')
    await fs.unlink(probe)
    return { dir: UPLOAD_DIR, writable: true }
  } catch (err) {
    return { dir: UPLOAD_DIR, writable: false, error: (err as Error).message }
  }
}
