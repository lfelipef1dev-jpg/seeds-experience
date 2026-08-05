import { getPartnerById, getEvents } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createSponsorshipProposal } from '@/lib/actions/sponsorships'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const partner = await getPartnerById(id)
  if (!partner) notFound()

  const events = await getEvents()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button asChild variant="link" className="p-0 h-auto">
          <Link href="/app/parceiros">← Voltar para parceiros</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{partner.name}</h1>
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={partner.logo_url || undefined} />
              <AvatarFallback className="bg-primary text-white text-2xl">
                {partner.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              {partner.status && (
                <p className="text-sm text-muted-foreground capitalize">{partner.status}</p>
              )}
              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {partner.website}
                </a>
              )}
              {partner.contact_email && (
                <p className="text-sm text-muted-foreground">{partner.contact_email}</p>
              )}
            </div>
          </div>

          {partner.description && (
            <p className="text-sm text-muted-foreground">{partner.description}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enviar proposta comercial</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createSponsorshipProposal} className="space-y-3">
            <input type="hidden" name="partner_id" value={partner.id} />
            <div className="space-y-2">
              <Label htmlFor="event_id">Evento</Label>
              <select
                id="event_id"
                name="event_id"
                required
                defaultValue=""
                className={cn(
                  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                )}
              >
                <option value="" disabled>Selecione um evento</option>
                {events.map((event: any) => (
                  <option key={event.id} value={event.id}>
                    {event.title} — {format(new Date(event.date), 'PPP', { locale: ptBR })}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor do patrocínio (R$)</Label>
              <Input id="amount" name="amount" type="number" min={1} required />
            </div>
            <Button type="submit">Enviar proposta</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
