'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createAchievement(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const imageUrl = String(formData.get('image_url') || '').trim()
  const category = String(formData.get('category') || '').trim()

  if (!title) return

  const { error } = await supabase.from('achievements').insert({
    user_id: user.id,
    title,
    description,
    image_url: imageUrl || null,
    category,
  })

  if (error) {
    console.error('createAchievement error:', error)
    return
  }

  revalidatePath('/app/mural')
}
