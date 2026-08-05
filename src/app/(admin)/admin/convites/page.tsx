import { getInvites } from '@/lib/data/queries'
import { sendInviteEmail } from '@/lib/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function AdminInvitesPage() {
  const invites = await getInvites()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Convites</h1>
        <p className="text-muted-foreground">Acompanhe os convites enviados.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enviar convite</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={sendInviteEmail} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email">E-mail da convidada</Label>
              <Input id="email" name="email" type="email" placeholder="convidada@email.com" required />
            </div>
            <div className="flex items-end">
              <Button type="submit">Enviar convite</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="font-medium">{invite.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Enviado em {format(new Date(invite.created_at), 'PPp', { locale: ptBR })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      invite.status === 'accepted'
                        ? 'default'
                        : invite.status === 'pending'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {invite.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {invites.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum convite enviado ainda.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
