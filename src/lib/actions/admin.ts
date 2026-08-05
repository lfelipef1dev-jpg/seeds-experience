'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function inviteMember(formData: FormData) {
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

  const email = String(formData.get('email') || '').trim().toLowerCase()
  if (!email) return

  const { error } = await supabase
    .from('invites')
    .insert({ email, invited_by: user.id })

  if (error) {
    console.error('Invite error:', error)
    return
  }

  revalidatePath('/admin/convites')
}

export async function sendInviteEmail(formData: FormData) {
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

  const email = String(formData.get('email') || '').trim().toLowerCase()
  if (!email) return

  const { error: insertError } = await supabase
    .from('invites')
    .insert({ email, invited_by: user.id, status: 'pending' })

  if (insertError) {
    console.error('Insert invite error:', insertError)
    return
  }

  const service = createServiceClient()

  const { error } = await service.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
  })

  if (error) {
    console.error('Send invite error:', error)
    return
  }

  revalidatePath('/admin/convites')
}

export async function toggleMemberStatus(formData: FormData) {
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

  const memberId = String(formData.get('member_id') || '')
  const field = String(formData.get('field') || '') as 'verified' | 'is_admin' | 'is_partner'

  const { data: member } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', memberId)
    .single()

  if (!member) return

  const currentValue = !!member[field]

  const { error } = await supabase
    .from('profiles')
    .update({ [field]: !currentValue })
    .eq('id', memberId)

  if (error) {
    console.error('Toggle status error:', error)
    return
  }

  revalidatePath('/admin')
  revalidatePath('/admin/membras')
}
