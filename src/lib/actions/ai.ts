'use server'

import { askHybrid } from '@/lib/ai'
import { createClient } from '@/lib/supabase/server'
import { rateLimitUser } from '@/lib/rate-limit'

export async function askChatbot(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const { success } = await rateLimitUser(user.id)
  if (!success) return { error: 'Você atingiu o limite de mensagens. Aguarde alguns minutos.' }

  const question = String(formData.get('question') || '').trim()
  if (!question) return { error: 'Pergunta vazia' }

  const context = `
Você é a assistente virtual do SEEDS Experience, uma comunidade exclusiva de mulheres empreendedoras.
Você responde de forma breve, acolhedora e direta sobre a comunidade, eventos, conexões e empreendedorismo feminino.
Não forneça dados pessoais de membras.
  `.trim()

  const { response, error } = await askHybrid(question, context)

  if (error) return { error }
  return { response }
}

export async function getMatchReason(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const { success } = await rateLimitUser(user.id)
  if (!success) return { error: 'Você atingiu o limite de mensagens. Aguarde alguns minutos.' }

  const memberName = String(formData.get('member_name') || '')
  const memberBusiness = String(formData.get('member_business') || '')
  const memberSector = String(formData.get('member_sector') || '')
  const userSector = String(formData.get('user_sector') || '')

  const prompt = `Por que a membra ${memberName} do negócio ${memberBusiness} (setor ${memberSector}) seria uma boa conexão para uma empreendedora do setor ${userSector}? Responda em 2 frases.`

  const { response, error } = await askHybrid(prompt)

  if (error) return { error }
  return { response }
}
