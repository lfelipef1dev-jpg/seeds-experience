import { getNotifications, getCurrentProfile } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { markNotificationAsRead } from '@/lib/actions/notifications'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

export default async function NotificationsPage() {
  const currentProfile = await getCurrentProfile()
  if (!currentProfile) return null

  const notifications = await getNotifications(currentProfile.user_id)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Notificações</h1>
        <p className="text-muted-foreground">Atualizações e novidades da sua rede.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {notifications.map((n: any) => (
              <div
                key={n.id}
                className={`flex items-start justify-between p-4 ${n.read ? 'bg-card' : 'bg-muted/30'}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{n.type}</p>
                    {!n.read && <Badge variant="default" className="text-xs">Nova</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(n.created_at), 'PPp', { locale: ptBR })}
                  </p>
                  {n.link && (
                    <Button asChild variant="link" size="sm" className="p-0 h-auto">
                      <Link href={n.link}>Ver</Link>
                    </Button>
                  )}
                </div>

                {!n.read && (
                  <form action={markNotificationAsRead}>
                    <input type="hidden" name="id" value={n.id} />
                    <Button type="submit" variant="ghost" size="sm">
                      Marcar como lida
                    </Button>
                  </form>
                )}
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Você não tem notificações.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
