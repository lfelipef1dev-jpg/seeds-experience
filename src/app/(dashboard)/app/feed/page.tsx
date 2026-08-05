import { getFeedPosts, getCurrentProfile } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { createFeedPost } from '@/lib/actions/feed'

export default async function FeedPage() {
  const posts = await getFeedPosts()
  const currentProfile = await getCurrentProfile()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Feed da comunidade</h1>
        <p className="text-muted-foreground">Novidades e atualizações das membras.</p>
      </div>

      {currentProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Compartilhar</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createFeedPost} className="space-y-3">
              <Textarea name="content" placeholder="O que você quer compartilhar com a comunidade?" required />
              <div className="space-y-2">
                <Label htmlFor="image_url">URL da imagem (opcional)</Label>
                <Input id="image_url" name="image_url" type="url" placeholder="https://..." />
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

              <p className="text-sm">{post.content}</p>
              {post.image_url && (
                <img src={post.image_url} alt="" className="rounded-md max-h-64 object-cover" />
              )}
              <p className="text-xs text-muted-foreground">
                {format(new Date(post.created_at), 'PPp', { locale: ptBR })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhuma publicação no feed ainda.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
