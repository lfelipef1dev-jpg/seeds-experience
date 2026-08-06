import { type NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/', '/login', '/convite']

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const B64_MAP: Record<string, number> = {}
for (let i = 0; i < B64.length; i++) B64_MAP[B64[i]] = i

function b64ToBytes(base64: string): Uint8Array {
  const pad = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0
  const len = Math.floor((base64.length * 3) / 4 - pad)
  const bytes = new Uint8Array(len)
  let j = 0
  for (let i = 0; i < base64.length; i += 4) {
    const a = B64_MAP[base64[i]] ?? 0
    const b = B64_MAP[base64[i + 1]] ?? 0
    const c = B64_MAP[base64[i + 2]] ?? 0
    const d = B64_MAP[base64[i + 3]] ?? 0
    const triplet = (a << 18) | (b << 12) | (c << 6) | d
    if (j < len) bytes[j++] = (triplet >> 16) & 0xff
    if (j < len) bytes[j++] = (triplet >> 8) & 0xff
    if (j < len) bytes[j++] = triplet & 0xff
  }
  return bytes
}

function b64UrlToJson(str: string) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const bytes = b64ToBytes(padded)
  const text = new TextDecoder().decode(bytes)
  return JSON.parse(text)
}

function tokenPayload(token: string) {
  const payload = token.split('.')[1]
  if (!payload) return null
  try {
    return b64UrlToJson(payload) as { exp?: number; email?: string; sub?: string }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/app') && !pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('seeds-access-token')?.value
  const payload = token ? tokenPayload(token) : null

  if (!payload || !payload.exp || payload.exp * 1000 < Date.now()) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
