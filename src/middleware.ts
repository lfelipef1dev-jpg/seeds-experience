import { type NextRequest, NextResponse } from 'next/server'

function decodeSupabaseCookie(value: string): { exp?: number } | null {
  try {
    let json: string
    if (value.startsWith('base64-')) {
      const b64 = value.slice(7)
      const decoded = atob(b64)
      json = decoded
    } else {
      json = value
    }
    const parsed = JSON.parse(json)
    const accessToken = parsed['access_token']
    if (!accessToken) return null
    const payload = accessToken.split('.')[1]
    if (!payload) return null
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
    const decodedPayload = atob(padded)
    return JSON.parse(decodedPayload)
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/app') && !pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const cookieName = 'sb-phhurravjunielzxatxe-auth-token'
  const cookieValue = request.cookies.get(cookieName)?.value

  if (!cookieValue) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = decodeSupabaseCookie(cookieValue)

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
