import { getCurrentProfile, getConnections, getPendingConnections } from '@/lib/data/queries'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { respondConnection } from '@/lib/actions/connections'
import Link from 'next/link'
import { Building2 } from 'lucide-react'

export default async function ConnectionsPage() {
  const currentProfile = await getCurrentProfile()
  if (!currentProfile) {
    redirect('/login')
  }

  const [connections, pending] = await Promise.all([
    getConnections(currentProfile.user_id),
    getPendingConnections(currentProfile.user_id),
  ])

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Minhas Conexões</h1>
        <p className="text-muted-foreground">Membras conectadas com você e solicitações pendentes.</p>
      </div>

      {pending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Solicitações pendentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {pending.map((conn: any) => (
                <div key={conn.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={conn.requester?.photo_url} />
                      <AvatarFallback style={{ backgroundColor: conn.requester?.color }} className="text-white">
                        {conn.requester?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{conn.requester?.name}</p>
                      <p className="text-sm text-muted-foreground">{conn.requester?.business}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <form action={respondConnection}>
                      <input type="hidden" name="connection_id" value={conn.id} />
                      <input type="hidden" name="status" value="accepted" />
                      <Button type="submit" size="sm">Aceitar</Button>
                    </form>
                    <form action={respondConnection}>
                      <input type="hidden" name="connection_id" value={conn.id} />
                      <input type="hidden" name="status" value="declined" />
                      <Button type="submit" size="sm" variant="outline">Recusar</Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Conexões</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {connections.map((conn: any) => {
              const isRequester = conn.requester_id === currentProfile.user_id
              const other = isRequester ? conn.requested : conn.requester

              return (
                <div
                  key={conn.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={other?.photo_url} />
                      <AvatarFallback style={{ backgroundColor: other?.color }} className="text-white">
                        {other?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{other?.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {other?.business}
                      </p>
                      <div className="flex gap-2 mt-1">
                        {other?.city && <Badge variant="outline" className="text-xs">{other.city}</Badge>}
                        {other?.sector && <Badge variant="secondary" className="text-xs">{other.sector}</Badge>}
                      </div>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline" disabled>
                    <Link href="#">Mensagem</Link>
                  </Button>
                </div>
              )
            })}
          </div>

          {connections.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Você ainda não tem conexões. Explore o{' '}
              <Link href="/app/diretorio" className="underline">diretório</Link> para conectar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
