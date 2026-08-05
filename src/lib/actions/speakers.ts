'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createSpeaker(formData: FormData) {
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
  const business = String(formData.get('business') || '').trim()
  const bio = String(formData.get('bio') || '').trim()
  const photoUrl = String(formData.get('photo_url') || '').trim()
  const eventId = String(formData.get('event_id') || '').trim()

  if (!name) return

  const { error } = await supabase.from('speakers').insert({
    name,
    business,
    bio,
    photo_url: photoUrl || null,
    event_id: eventId || null,
  })

  if (error) {
    console.error('createSpeaker error:', error)
    return
  }

  revalidatePath('/app/palestrantes')
}
