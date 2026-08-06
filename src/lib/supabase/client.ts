'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://phhurravjunielzxatxe.supabase.co',
    'sb_publishable_nuIOHxvxef55NYUKPV6FBQ_yH6pwfGc',
    {
      cookies: {
        getAll() {
          return document.cookie.split('; ').filter(Boolean).map((cookie) => {
            const [name, ...rest] = cookie.split('=')
            return { name, value: decodeURIComponent(rest.join('=') || '') }
          })
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const flags: string[] = []
            flags.push(`Path=${options?.path ?? '/'}`)
            flags.push(`Max-Age=${options?.maxAge ?? 60 * 60 * 24 * 365}`)
            if (options?.sameSite) flags.push(`SameSite=${options.sameSite}`)
            if (options?.secure || typeof window !== 'undefined' && location.protocol === 'https:') flags.push('Secure')
            document.cookie = `${name}=${encodeURIComponent(value)}; ${flags.join('; ')}`
          })
        },
      },
    }
  )
}
