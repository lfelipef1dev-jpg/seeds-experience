import { getAchievements, getCurrentProfile } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createAchievement } from '@/lib/actions/achievements'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function MuralPage() {
  const achievements = await getAchievements()
  const currentProfile = await getCurrentProfile()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Mural de Conquistas</h1>
        <p className="text-muted-foreground">Compartilhe e celebre as conquistas da comunidade.</p>
      </div>

      {currentProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Compartilhar conquista</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createAchievement} className="space-y-3">
              <Input name="title" placeholder="Título da conquista" required />
              <Textarea name="description" placeholder="Conte um pouco sobre a conquista" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input id="category" name="category" placeholder="Ex: Negócio, Aprendizado" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL da imagem</Label>
                  <Input id="image_url" name="image_url" type="url" placeholder="https://..." />
                </div>
              </div>
              <Button type="submit">Publicar conquista</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {achievements.map((post: any) => (
          <Card key={post.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.profiles?.photo_url || undefined} />
                  <AvatarFallback style={{ backgroundColor: post.profiles?.color }} className="text-white">
                    {post.profiles?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.profiles?.name}</p>
                  <p className="text-sm text-muted-foreground">{post.profiles?.business}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">{post.title}</h3>
                {post.category && <p className="text-xs text-muted-foreground">{post.category}</p>}
                {post.description && <p className="text-sm text-muted-foreground mt-1">{post.description}</p>}
                {post.image_url && (
                  <img src={post.image_url} alt="" className="rounded-md mt-2 max-h-64 object-cover" />
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(post.created_at), 'PPp', { locale: ptBR })}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {achievements.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhuma conquista compartilhada ainda.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
