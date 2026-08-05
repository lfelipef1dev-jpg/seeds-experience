'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function rsvpEvent(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const eventId = String(formData.get('event_id') || '')

  const { error } = await supabase
    .from('event_attendees')
    .upsert(
      {
        event_id: eventId,
        user_id: user.id,
        rsvp_status: 'confirmed',
      },
      { onConflict: 'event_id,user_id' }
    )

  if (error) {
    console.error('RSVP error:', error)
    return
  }

  revalidatePath('/app/eventos')
}

export async function cancelRsvp(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const eventId = String(formData.get('event_id') || '')

  const { error } = await supabase
    .from('event_attendees')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Cancel RSVP error:', error)
    return
  }

  revalidatePath('/app/eventos')
}

export async function createEvent(formData: FormData) {
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

  const title = String(formData.get('title') || '')
  const description = String(formData.get('description') || '')
  const date = String(formData.get('date') || '')
  const location = String(formData.get('location') || '')
  const hostBrand = String(formData.get('host_brand') || '')
  const theme = String(formData.get('theme') || '')
  const maxAttendees = Number(formData.get('max_attendees') || 0)

  const { error } = await supabase.from('events').insert({
    title,
    description,
    date,
    location,
    host_brand: hostBrand,
    theme,
    max_attendees: maxAttendees > 0 ? maxAttendees : null,
    status: 'published',
    created_by: user.id,
  })

  if (error) {
    console.error('Create event error:', error)
    return
  }

  revalidatePath('/app/eventos')
  revalidatePath('/admin')
}
