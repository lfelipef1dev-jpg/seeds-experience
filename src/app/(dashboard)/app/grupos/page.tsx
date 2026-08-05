import { getGroups } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createGroup } from '@/lib/actions/groups'
import Link from 'next/link'
import { Users } from 'lucide-react'

export default async function GroupsPage() {
  const groups = await getGroups()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Grupos temáticos</h1>
        <p className="text-muted-foreground">Subcomunidades de interesse e troca.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Criar grupo</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createGroup} className="space-y-3">
            <Input name="name" placeholder="Nome do grupo" required />
            <Textarea name="description" placeholder="Sobre o que é o grupo?" />
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Input id="theme" name="theme" placeholder="Ex: Marketing, Finanças" />
            </div>
            <Button type="submit">Criar grupo</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group: any) => (
          <Card key={group.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Users className="h-5 w-5" />
                <h3 className="font-semibold">{group.name}</h3>
              </div>
              {group.theme && <p className="text-sm text-muted-foreground">Tema: {group.theme}</p>}
              {group.description && <p className="text-sm text-muted-foreground">{group.description}</p>}
              <Button asChild size="sm" variant="outline" className="w-full">
                <Link href={`/app/grupos/${group.id}`}>Entrar no grupo</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum grupo criado ainda.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
