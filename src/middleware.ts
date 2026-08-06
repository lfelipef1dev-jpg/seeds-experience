import { type NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/', '/login', '/convite']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/app') && !pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('seeds-access-token')?.value
  let user = null

  if (token) {
    try {
      const res = await fetch('https://phhurravjunielzxatxe.supabase.co/auth/v1/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: 'sb_publishable_nuIOHxvxef55NYUKPV6FBQ_yH6pwfGc',
        },
      })
      if (res.ok) {
        const data = await res.json()
        user = data
      }
    } catch {}
  }

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
