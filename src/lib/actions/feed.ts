'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createFeedPost(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const content = String(formData.get('content') || '').trim()
  const imageUrl = String(formData.get('image_url') || '').trim()

  if (!content) return

  const { error } = await supabase.from('feed_posts').insert({
    user_id: user.id,
    content,
    image_url: imageUrl || null,
  })

  if (error) {
    console.error('createFeedPost error:', error)
    return
  }

  revalidatePath('/app/feed')
}
