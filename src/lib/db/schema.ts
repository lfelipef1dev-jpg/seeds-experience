// Schema de tipos Drizzle (referência para o Supabase SQL)
// As tabelas devem ser criadas manualmente no SQL Editor do Supabase

export const sectors = [
  'Comunidade / Eventos',
  'Food & Beverage',
  'Sustentabilidade / ESG',
  'Food Service / Design',
  'Tecnologia',
  'Moda',
  'Beleza',
  'Educação',
  'Saúde',
  'Finanças',
  'Consultoria',
  'Marketing',
  'Varejo',
  'Outro',
] as const

export const cities = [
  'São Paulo, SP',
  'Rio de Janeiro, RJ',
  'Belo Horizonte, MG',
  'Curitiba, PR',
  'Brasília, DF',
  'Porto Alegre, RS',
  'Recife, PE',
  'Salvador, BA',
  'Outro',
] as const

export const collaborationTypes = [
  'procuro_socia',
  'procuro_fornecedora',
  'ofereco_mentoria',
  'procuro_investimento',
  'outro',
] as const
