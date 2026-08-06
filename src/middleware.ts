import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const publicRoutes = ['/', '/login', '/convite']

function b64ToJson(str: string) {
  const base64 = str.startsWith('base64-') ? str.slice(7) : str
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const text = new TextDecoder().decode(bytes)
  return JSON.parse(text)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/app') && !pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const cookie = request.cookies.get('sb-phhurravjunielzxatxe-auth-token')?.value
  let user = null

  if (cookie) {
    try {
      const session = b64ToJson(cookie)
      const supabase = createClient(
        'https://phhurravjunielzxatxe.supabase.co',
        'sb_publishable_nuIOHxvxef55NYUKPV6FBQ_yH6pwfGc',
        { auth: { persistSession: false, autoRefreshToken: false } }
      )
      const { data, error } = await supabase.auth.getUser(session.access_token)
      if (!error) user = data.user
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
