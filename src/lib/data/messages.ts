import { createClient } from '@/lib/supabase/server'

export async function getMessages(roomId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*, profiles:user_id (id, name, photo_url, color)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })

  if (error) return []
  return data || []
}

export async function getConversations(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('room_members')
    .select('room_id, profiles:user_id (id, name, photo_url, business, color, user_id)')
    .eq('user_id', userId)

  if (error) return []
  return data || []
}
