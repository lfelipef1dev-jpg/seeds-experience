import { getCurrentProfile, getConnections } from '@/lib/data/queries'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Building2 } from 'lucide-react'

export default async function MessagesListPage() {
  const currentProfile = await getCurrentProfile()
  if (!currentProfile) {
    redirect('/login')
  }

  const connections = await getConnections(currentProfile.user_id)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Mensagens</h1>
        <p className="text-muted-foreground">Converse com suas conexões.</p>
      </div>

      <Card>
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
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/app/mensagens/${other?.user_id}`}>Conversar</Link>
                  </Button>
                </div>
              )
            })}
          </div>

          {connections.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Conecte com membras no diretório para iniciar uma conversa.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
