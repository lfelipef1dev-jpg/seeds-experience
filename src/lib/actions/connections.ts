'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function requestConnection(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const requestedId = String(formData.get('requested_id') || '')
  if (!requestedId || requestedId === user.id) return

  const { error } = await supabase.from('connections').insert({
    requester_id: user.id,
    requested_id: requestedId,
    status: 'pending',
  })

  if (error) {
    console.error('requestConnection error:', error)
    return
  }

  revalidatePath('/app/diretorio')
  revalidatePath('/app/conexoes')
}

export async function respondConnection(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const connectionId = String(formData.get('connection_id') || '')
  const status = String(formData.get('status') || '') as 'accepted' | 'declined'

  if (!connectionId || !['accepted', 'declined'].includes(status)) return

  const { error } = await supabase
    .from('connections')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', connectionId)
    .eq('requested_id', user.id)

  if (error) {
    console.error('respondConnection error:', error)
    return
  }

  revalidatePath('/app/conexoes')
}
