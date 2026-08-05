import { getAllMembers, getInvites, getEvents } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { inviteMember, sendInviteEmail } from '@/lib/actions/admin'
import { createEvent } from '@/lib/actions/events'
import { getCurrentProfile } from '@/lib/data/queries'
import Link from 'next/link'

export default async function AdminPage() {
  const profile = await getCurrentProfile()
  const members = await getAllMembers()
  const invites = await getInvites()
  const events = await getEvents()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Painel Administrativo</h1>
        <p className="text-muted-foreground">Gerencie membras, convites e encontros.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Membras cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{members.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Convites pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {invites.filter((i) => i.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Encontros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{events.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Convidar membra</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={inviteMember} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <Button type="submit">Salvar convite</Button>
            </form>

            <form action={sendInviteEmail} className="mt-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="invite_email">Enviar convite por e-mail (magic link)</Label>
                <Input id="invite_email" name="email" type="email" required />
              </div>
              <Button type="submit" variant="outline">Enviar link de acesso</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Criar encontro</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createEvent} className="space-y-3">
              <Input name="title" placeholder="Título" required />
              <Textarea name="description" placeholder="Descrição" />
              <Input name="date" type="datetime-local" required />
              <Input name="location" placeholder="Local" />
              <Input name="host_brand" placeholder="Marca anfitriã" />
              <Input name="theme" placeholder="Tema" />
              <Input name="max_attendees" type="number" placeholder="Máximo de participantes" />
              <Button type="submit">Publicar encontro</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membras recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {members.slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.email}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {m.verified ? 'Verificada' : 'Pendente'}
                </div>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/admin/membras">Ver todas</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
