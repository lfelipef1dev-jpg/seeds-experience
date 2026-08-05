import { getSpeakers, getEvents, getCurrentProfile } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createSpeaker } from '@/lib/actions/speakers'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function SpeakersPage() {
  const speakers = await getSpeakers()
  const events = await getEvents()
  const currentProfile = await getCurrentProfile()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Palestrantes</h1>
        <p className="text-muted-foreground">Mulheres que inspiraram nas edições do SEEDS.</p>
      </div>

      {currentProfile?.is_admin && (
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar palestrante</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createSpeaker} className="space-y-3">
              <Input name="name" placeholder="Nome" required />
              <Input name="business" placeholder="Empresa/negócio" />
              <Textarea name="bio" placeholder="Mini bio" />
              <Input name="photo_url" type="url" placeholder="URL da foto" />
              <div className="space-y-2">
                <Label htmlFor="event_id">Evento</Label>
                <select
                  id="event_id"
                  name="event_id"
                  defaultValue=""
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="">Nenhum</option>
                  {events.map((event: any) => (
                    <option key={event.id} value={event.id}>
                      {event.title} — {format(new Date(event.date), 'PPP', { locale: ptBR })}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit">Cadastrar</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {speakers.map((speaker: any) => (
          <Card key={speaker.id}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={speaker.photo_url || undefined} />
                  <AvatarFallback className="bg-primary text-white text-2xl">
                    {speaker.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{speaker.name}</h3>
                  <p className="text-sm text-muted-foreground">{speaker.business}</p>
                </div>
              </div>
              {speaker.bio && <p className="text-sm text-muted-foreground">{speaker.bio}</p>}
              {speaker.events && (
                <p className="text-sm text-primary">Palestrante em: {speaker.events.title}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {speakers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhuma palestrante cadastrada ainda.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
