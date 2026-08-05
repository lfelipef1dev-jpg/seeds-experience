import { getAllMembers } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toggleMemberStatus } from '@/lib/actions/admin'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function AdminMembersPage() {
  const members = await getAllMembers()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Gerenciar Membras</h1>
        <p className="text-muted-foreground">Aprove, verifique e gerencie permissões.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.photo_url} />
                    <AvatarFallback style={{ backgroundColor: member.color }} className="text-white">
                      {member.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <div className="flex gap-2 mt-1">
                      {member.verified && <Badge variant="secondary" className="text-xs">Verificada</Badge>}
                      {member.is_admin && <Badge className="text-xs">Admin</Badge>}
                      {member.is_partner && <Badge variant="outline" className="text-xs">Parceira</Badge>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <form action={toggleMemberStatus}>
                    <input type="hidden" name="member_id" value={member.id} />
                    <input type="hidden" name="field" value="verified" />
                    <Button type="submit" variant="outline" size="sm">
                      {member.verified ? 'Desverificar' : 'Verificar'}
                    </Button>
                  </form>
                  <form action={toggleMemberStatus}>
                    <input type="hidden" name="member_id" value={member.id} />
                    <input type="hidden" name="field" value="is_admin" />
                    <Button type="submit" variant="outline" size="sm">
                      {member.is_admin ? 'Remover admin' : 'Tornar admin'}
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
