import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const publicRoutes = ['/', '/login', '/convite']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  const { pathname } = request.nextUrl

  // Páginas protegidas
  const isProtected = pathname.startsWith('/app') || pathname.startsWith('/admin')

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
