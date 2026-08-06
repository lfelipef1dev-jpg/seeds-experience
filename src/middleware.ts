import { type NextRequest, NextResponse } from 'next/server'

function b64UrlToJson(str: string) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const text = atob(padded)
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
