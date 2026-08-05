import { getCollaborationPosts, getCurrentProfile } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { collaborationTypes } from '@/lib/db/schema'
import { createCollaboration } from '@/lib/actions/collaborations'

export default async function CollaborationsPage() {
  const posts = await getCollaborationPosts()
  const currentProfile = await getCurrentProfile()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Board de Colaborações</h1>
          <p className="text-muted-foreground">Oportunidades, parcerias e trocas entre membras.</p>
        </div>
      </div>

      {currentProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Publicar no board</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createCollaboration} className="space-y-3">
              <Input name="title" placeholder="Título da oportunidade" required />
              <Textarea name="description" placeholder="Descrição" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {collaborationTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">Setor</Label>
                  <Select name="sector">
                    <SelectTrigger>
                      <SelectValue placeholder="Setor (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {['Comunidade / Eventos', 'Food & Beverage', 'Sustentabilidade / ESG', 'Food Service / Design', 'Beleza', 'Moda', 'Tecnologia', 'Educação', 'Saúde e Bem-Estar', 'Consultoria', 'Imobiliário / Construção', 'Marketing / Criativo'].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit">Publicar</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {posts.map((post: any) => (
          <Card key={post.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.profiles?.photo_url} />
                    <AvatarFallback style={{ backgroundColor: post.profiles?.color }} className="text-white">
                      {post.profiles?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.profiles?.name}</p>
                    <p className="text-sm text-muted-foreground">{post.profiles?.business}</p>
                  </div>
                </div>
                <Badge>{post.type.replace(/_/g, ' ')}</Badge>
              </div>

              <div>
                <h3 className="font-semibold">{post.title}</h3>
                {post.description && <p className="text-sm text-muted-foreground mt-1">{post.description}</p>}
                {post.sector && (
                  <p className="text-xs text-muted-foreground mt-2">Setor: {post.sector}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(post.created_at), 'PPp', { locale: ptBR })}
                </p>
              </div>

              {currentProfile && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/app/conexoes?convidar=${post.profiles?.user_id}`}>Conectar</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhuma publicação no board ainda.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
