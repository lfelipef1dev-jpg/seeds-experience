import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  const cookiesToSet: { name: string; value: string; options?: any }[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  return response
}
