'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createJob(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const requirements = String(formData.get('requirements') || '').trim()
  const sector = String(formData.get('sector') || '').trim()
  const location = String(formData.get('location') || '').trim()
  const type = String(formData.get('type') || '').trim()

  if (!title || !description) return

  const { error } = await supabase.from('jobs').insert({
    user_id: user.id,
    title,
    description,
    requirements,
    sector,
    location,
    type,
  })

  if (error) {
    console.error('createJob error:', error)
    return
  }

  revalidatePath('/app/vagas')
}
