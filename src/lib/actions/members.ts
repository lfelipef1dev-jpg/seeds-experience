'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import members from '@/lib/data/members.json'

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '')
}

export async function importMembers() {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Acesso restrito' }

  const service = createServiceClient()
  let imported = 0
  let skipped = 0

  for (const member of members as any[]) {
    const email = `${slugify(member.name)}.${member.id}@seeds.local`

    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      skipped++
      continue
    }

    const { data: authUser, error: authError } = await service.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { name: member.name },
    })

    if (authError || !authUser.user) {
      console.error('Erro ao criar usuário', authError)
      continue
    }

    const { error } = await supabase.from('profiles').upsert(
      {
        user_id: authUser.user.id,
        email,
        name: member.name,
        business: member.business,
        role: member.role,
        sector: member.sector,
        city: member.city,
        bio: member.bio,
        verified: member.verified,
        color: member.color,
      },
      { onConflict: 'user_id' }
    )

    if (error) {
      console.error('Erro ao inserir perfil', error)
    } else {
      imported++
    }
  }

  revalidatePath('/admin/importar')
  revalidatePath('/app/diretorio')

  return { imported, skipped }
}
