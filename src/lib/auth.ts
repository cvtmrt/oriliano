import 'server-only'
import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { prisma } from './prisma'

const COOKIE_NAME = 'ch_session'
const SESSION_DAYS = 7

function sign(token: string): string {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 16) {
    throw new Error(
      'SESSION_SECRET tanımlı değil veya çok kısa. En az 32 karakterlik rastgele bir değer verin.',
    )
  }
  return crypto.createHmac('sha256', secret).update(token).digest('hex')
}

function cookieValue(token: string): string {
  return `${token}.${sign(token)}`
}

function parseCookie(value: string): string | null {
  const idx = value.lastIndexOf('.')
  if (idx <= 0) return null
  const token = value.slice(0, idx)
  const mac = value.slice(idx + 1)
  const expected = sign(token)
  // Sabit zamanlı karşılaştırma
  const a = Buffer.from(mac)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return null
  return crypto.timingSafeEqual(a, b) ? token : null
}

/**
 * Yönetici kullanıcısını çözer. Kullanıcı tabloda yoksa ve ortam
 * değişkenlerinde ADMIN_EMAIL + ADMIN_PASSWORD_HASH varsa ilk girişte
 * otomatik oluşturulur (bootstrap).
 */
async function resolveUser(email: string) {
  const normalized = email.trim().toLowerCase()
  const existing = await prisma.adminUser.findUnique({ where: { email: normalized } })
  if (existing) return existing

  const envEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const envHash = process.env.ADMIN_PASSWORD_HASH || ''
  if (envEmail && envHash && envEmail === normalized) {
    return prisma.adminUser.create({
      data: { email: normalized, passwordHash: envHash, name: 'Yönetici' },
    })
  }
  return null
}

export async function login(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await resolveUser(email)
  // Kullanıcı yoksa da bcrypt çalıştır: cevap süresinden kullanıcı varlığı anlaşılmasın.
  const hash = user?.passwordHash ?? '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi'
  const valid = await bcrypt.compare(password, hash)
  if (!user || !valid) return { ok: false, error: 'E-posta veya şifre hatalı.' }

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await prisma.adminSession.create({ data: { token, userId: user.id, expiresAt } })
  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

  const store = await cookies()
  store.set(COOKIE_NAME, cookieValue(token), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })
  return { ok: true }
}

export async function logout(): Promise<void> {
  const store = await cookies()
  const raw = store.get(COOKIE_NAME)?.value
  if (raw) {
    const token = parseCookie(raw)
    if (token) {
      await prisma.adminSession.deleteMany({ where: { token } })
    }
  }
  store.delete(COOKIE_NAME)
}

export const getCurrentAdmin = cache(async () => {
  let raw: string | undefined
  try {
    const store = await cookies()
    raw = store.get(COOKIE_NAME)?.value
  } catch {
    return null
  }
  if (!raw) return null

  let token: string | null
  try {
    token = parseCookie(raw)
  } catch {
    return null
  }
  if (!token) return null

  try {
    const session = await prisma.adminSession.findUnique({ where: { token }, include: { user: true } })
    if (!session || session.expiresAt < new Date()) return null
    return session.user
  } catch {
    return null
  }
})

/** Sunucu action / route handler başında çağrılır. */
export async function requireAdmin() {
  const user = await getCurrentAdmin()
  if (!user) throw new Error('UNAUTHORIZED')
  return user
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getCurrentAdmin()) !== null
}

export async function purgeExpiredSessions(): Promise<void> {
  try {
    await prisma.adminSession.deleteMany({ where: { expiresAt: { lt: new Date() } } })
  } catch {
    /* yoksay */
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME
