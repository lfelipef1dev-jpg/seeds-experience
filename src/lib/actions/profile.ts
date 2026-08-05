'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticada' }

  const name = String(formData.get('name') || '')
  const business = String(formData.get('business') || '')
  const role = String(formData.get('role') || '')
  const sector = String(formData.get('sector') || '')
  const city = String(formData.get('city') || '')
  const bio = String(formData.get('bio') || '')
  const color = String(formData.get('color') || '#2B4736')
  const linkedin = String(formData.get('linkedin') || '')
  const instagram = String(formData.get('instagram') || '')

  const social_links: Record<string, string> = {}
  if (linkedin) social_links.linkedin = linkedin
  if (instagram) social_links.instagram = instagram

  const { error } = await supabase
    .from('profiles')
    .update({
      name,
      business,
      role,
      sector,
      city,
      bio,
      color,
      social_links,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/app/perfil')
  revalidatePath('/app')

  return { success: true }
}
