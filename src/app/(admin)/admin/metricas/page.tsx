import { getMetrics } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, Handshake, Store, MessageSquare, ClipboardList, BadgeDollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function AdminMetricsPage() {
  const metrics = await getMetrics()

  const cards = [
    { label: 'Membras', value: metrics.members, icon: Users },
    { label: 'Eventos', value: metrics.events, icon: Calendar },
    { label: 'Conexões', value: metrics.connections, icon: Handshake },
    { label: 'Parceiros', value: metrics.partners, icon: Store },
    { label: 'Posts no feed', value: metrics.feedPosts, icon: MessageSquare },
    { label: 'Colaborações', value: metrics.collaborations, icon: ClipboardList },
    { label: 'Propostas', value: metrics.sponsorships, icon: BadgeDollarSign },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Métricas gerais</h1>
        <p className="text-muted-foreground">
          Atualizado em {format(new Date(), 'PPp', { locale: ptBR })}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-semibold">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
