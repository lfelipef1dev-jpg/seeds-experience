import { getCurrentProfile, getFeedPosts, getEvents } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { format, isPast, isFuture } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function DashboardPage() {
  const profile = await getCurrentProfile()
  const posts = await getFeedPosts(5)
  const events = await getEvents()

  const upcoming = events.filter((e) => isFuture(new Date(e.date)) || !isPast(new Date(e.date)))

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Bem-vinda de volta, {profile?.name?.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground">
          Confira as novidades da comunidade e seus próximos encontros.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Próximos encontros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{upcoming.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Membras verificadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">25+</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conexões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">-</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Poder de decisão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">R$300M+</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Feed da comunidade</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/app/colaboracoes">Ver colaborações</Link>
            </Button>
          </div>

          {posts.map((post: any) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={post.profiles?.photo_url} />
                    <AvatarFallback style={{ backgroundColor: post.profiles?.color || '#2B4736' }} className="text-white">
                      {post.profiles?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{post.profiles?.name}</span>
                      <span className="text-xs text-muted-foreground">· {post.profiles?.business}</span>
                    </div>
                    <p className="text-sm">{post.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(post.created_at), 'PPp', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {posts.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Nenhuma publicação ainda. Seja a primeira a compartilhar!
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Próximos encontros</h2>
          {upcoming.slice(0, 3).map((event: any) => (
            <Card key={event.id}>
              <CardContent className="p-4 space-y-2">
                <Badge variant="secondary">{event.theme}</Badge>
                <h3 className="font-semibold">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(event.date), 'PPP', { locale: ptBR })}
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                )}
                {event.host_brand && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4" />
                    Marca anfitriã: {event.host_brand}
                  </div>
                )}
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href={`/app/eventos/${event.id}`}>Ver detalhes</Link>
                </Button>
              </CardContent>
            </Card>
          ))}

          {upcoming.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                Nenhum encontro publicado no momento.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
