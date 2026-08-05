'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function markNotificationAsRead(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const id = String(formData.get('id') || '')

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('markNotificationAsRead error:', error)
    return
  }

  revalidatePath('/app/notificacoes')
}

export async function createNotification({
  user_id,
  type,
  content,
  link,
}: {
  user_id: string
  type: string
  content: string
  link?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('notifications').insert({
    user_id,
    type,
    content,
    link,
  })

  if (error) {
    console.error('createNotification error:', error)
  }
}
