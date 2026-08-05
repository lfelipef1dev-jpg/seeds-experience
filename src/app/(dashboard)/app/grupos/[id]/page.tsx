import { getGroupById, getCurrentProfile } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { joinGroup } from '@/lib/actions/groups'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function GroupDetailPage({ params }: { params: { id: string } }) {
  const group = await getGroupById(params.id)
  if (!group) notFound()

  const currentProfile = await getCurrentProfile()
  const isMember = currentProfile && group.members.some((m: any) => m.user_id === currentProfile.user_id)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button asChild variant="link" className="p-0 h-auto">
          <Link href="/app/grupos">← Voltar para grupos</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{group.name}</h1>
        {group.theme && <p className="text-sm text-primary">Tema: {group.theme}</p>}
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          <p className="text-muted-foreground">{group.description}</p>
          {!isMember && currentProfile && (
            <form action={joinGroup}>
              <input type="hidden" name="group_id" value={group.id} />
              <Button type="submit">Entrar no grupo</Button>
            </form>
          )}
          {isMember && <p className="text-sm text-primary">Você já faz parte deste grupo.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Membras ({group.members.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {group.members.map((member: any) => (
              <div key={member.user_id} className="flex items-center gap-3 p-4">
                <Avatar>
                  <AvatarImage src={member.profiles?.photo_url || undefined} />
                  <AvatarFallback style={{ backgroundColor: member.profiles?.color }} className="text-white">
                    {member.profiles?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.profiles?.name}</p>
                  <p className="text-sm text-muted-foreground">{member.profiles?.business}</p>
                </div>
              </div>
            ))}
          </div>

          {group.members.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Nenhuma membra ainda.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
