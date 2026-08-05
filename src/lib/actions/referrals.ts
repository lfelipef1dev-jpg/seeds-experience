'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createReferral(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const email = String(formData.get('email') || '').trim().toLowerCase()
  if (!email) return

  const { error } = await supabase.from('referrals').insert({
    user_id: user.id,
    email,
    status: 'pending',
  })

  if (error) {
    console.error('createReferral error:', error)
    return
  }

  revalidatePath('/app/indicacoes')
}

export async function convertReferral(formData: FormData) {
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

  const id = String(formData.get('id') || '')

  const { error } = await supabase
    .from('referrals')
    .update({ status: 'converted', converted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('convertReferral error:', error)
    return
  }

  revalidatePath('/app/indicacoes')
}
