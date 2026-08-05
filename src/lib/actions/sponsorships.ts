'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createSponsorshipProposal(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const partnerId = String(formData.get('partner_id') || '')
  const eventId = String(formData.get('event_id') || '')
  const amount = Number(formData.get('amount') || 0)

  if (!partnerId || !eventId || amount <= 0) return

  const { error } = await supabase.from('sponsorships').insert({
    partner_id: partnerId,
    event_id: eventId,
    amount,
    status: 'proposed',
  })

  if (error) {
    console.error('createSponsorshipProposal error:', error)
    return
  }

  revalidatePath(`/app/parceiros/${partnerId}`)
}
