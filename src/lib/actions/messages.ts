'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function sendMessage(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const receiverId = String(formData.get('receiver_id') || '')
  const content = String(formData.get('content') || '').trim()

  if (!receiverId || !content) return

  const sorted = [user.id, receiverId].sort()
  const roomId = sorted.join('__')

  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .upsert({ id: roomId, type: 'direct' }, { onConflict: 'id' })
    .select()
    .single()

  if (roomError || !room) return

  const { error } = await supabase.from('messages').insert({
    room_id: room.id,
    user_id: user.id,
    content,
  })

  if (error) {
    console.error('sendMessage error:', error)
    return
  }

  revalidatePath(`/app/mensagens/${receiverId}`)
}
