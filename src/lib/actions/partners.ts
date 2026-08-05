'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createPartner(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return

  const name = String(formData.get('name') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const logo_url = String(formData.get('logo_url') || '').trim()

  if (!name) return

  const { error } = await supabase.from('partners').insert({
    name,
    description,
    logo_url,
    status: 'active',
  })

  if (error) {
    console.error('createPartner error:', error)
    return
  }

  revalidatePath('/app/parceiros')
  revalidatePath('/admin/parceiros')
}
