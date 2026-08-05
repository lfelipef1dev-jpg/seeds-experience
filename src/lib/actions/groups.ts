'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createGroup(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const name = String(formData.get('name') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const theme = String(formData.get('theme') || '').trim()

  if (!name) return

  const { data, error } = await supabase
    .from('groups')
    .insert({ name, description, theme, created_by: user.id })
    .select()
    .single()

  if (error || !data) {
    console.error('createGroup error:', error)
    return
  }

  await supabase.from('group_members').insert({ group_id: data.id, user_id: user.id })

  revalidatePath('/app/grupos')
}

export async function joinGroup(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const groupId = String(formData.get('group_id') || '')
  if (!groupId) return

  const { error } = await supabase
    .from('group_members')
    .insert({ group_id: groupId, user_id: user.id })

  if (error) {
    console.error('joinGroup error:', error)
    return
  }

  revalidatePath(`/app/grupos/${groupId}`)
  revalidatePath('/app/grupos')
}
