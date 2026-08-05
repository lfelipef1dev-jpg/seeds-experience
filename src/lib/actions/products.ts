'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createProduct(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const name = String(formData.get('name') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const price = Number(formData.get('price') || 0)
  const link = String(formData.get('link') || '').trim()
  const imageUrl = String(formData.get('image_url') || '').trim()

  if (!name) return

  const { error } = await supabase.from('products').insert({
    user_id: user.id,
    name,
    description,
    price: price > 0 ? price : null,
    link,
    image_url: imageUrl || null,
  })

  if (error) {
    console.error('createProduct error:', error)
    return
  }

  revalidatePath('/app/produtos')
}
