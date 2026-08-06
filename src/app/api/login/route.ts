import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  const cookiesToSet: { name: string; value: string; options?: any }[] = []

  const supabase = createServerClient(
    'https://phhurravjunielzxatxe.supabase.co',
    'sb_publishable_nuIOHxvxef55NYUKPV6FBQ_yH6pwfGc',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map((c) => ({ name: c.name, value: c.value }))
        },
        setAll(cookies) {
          cookies.forEach((c) => cookiesToSet.push(c))
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.session) {
    return NextResponse.json({ error: error?.message || 'no session' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })
  response.cookies.set('seeds-access-token', data.session.access_token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    secure: true,
    sameSite: 'lax',
  })
  return response
}
