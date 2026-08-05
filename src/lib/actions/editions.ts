'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createEdition(formData: FormData) {
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

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const date = String(formData.get('date') || '').trim()

  if (!title) return

  const { error } = await supabase.from('editions').insert({
    title,
    description,
    date: date || null,
  })

  if (error) {
    console.error('createEdition error:', error)
    return
  }

  revalidatePath('/app/historico')
}
