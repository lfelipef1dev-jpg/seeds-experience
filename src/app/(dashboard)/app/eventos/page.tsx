import { getEventsWithRsvp, getCurrentProfile } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { rsvpEvent, cancelRsvp } from '@/lib/actions/events'

export default async function EventsPage() {
  const currentProfile = await getCurrentProfile()
  const events = await getEventsWithRsvp(currentProfile?.user_id ?? '')

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Encontros SEEDS</h1>
        <p className="text-muted-foreground">Confirme sua presença e conheça os próximos encontros.</p>
      </div>

      <div className="grid gap-4">
        {events.map((event: any) => (
          <Card key={event.id}>
            <CardContent className="p-5 flex flex-col md:flex-row gap-5">
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{event.status === 'published' ? 'Próximo' : event.status}</Badge>
                  {event.theme && <Badge variant="outline">{event.theme}</Badge>}
                </div>
                <h2 className="text-xl font-semibold">{event.title}</h2>
                {event.description && <p className="text-muted-foreground text-sm">{event.description}</p>}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(event.date), 'PPP p', { locale: ptBR })}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  )}
                  {event.host_brand && (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {event.host_brand}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end justify-center gap-2 min-w-[12rem]">
                {event.max_attendees > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {event.attendeesCount}/{event.max_attendees} confirmadas
                  </p>
                )}
                {currentProfile && (
                  event.userRsvp === 'confirmed' ? (
                    <form action={cancelRsvp}>
                      <input type="hidden" name="event_id" value={event.id} />
                      <Button type="submit" variant="outline">Cancelar presença</Button>
                    </form>
                  ) : event.max_attendees > 0 && event.attendeesCount >= event.max_attendees ? (
                    <Button disabled variant="outline">Lotado</Button>
                  ) : (
                    <form action={rsvpEvent}>
                      <input type="hidden" name="event_id" value={event.id} />
                      <Button type="submit">Confirmar presença</Button>
                    </form>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum encontro publicado ainda.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
