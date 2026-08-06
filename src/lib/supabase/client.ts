import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://phhurravjunielzxatxe.supabase.co',
    'sb_publishable_nuIOHxvxef55NYUKPV6FBQ_yH6pwfGc'
  )
}
