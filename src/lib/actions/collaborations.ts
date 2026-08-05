'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createCollaboration(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const type = String(formData.get('type') || '').trim()
  const sector = String(formData.get('sector') || '').trim()

  if (!title || !type) return

  const { error } = await supabase.from('collaboration_posts').insert({
    user_id: user.id,
    title,
    description,
    type,
    sector: sector || null,
    is_active: true,
  })

  if (error) {
    console.error('createCollaboration error:', error)
    return
  }

  revalidatePath('/app/colaboracoes')
}
