import { getEditions, getCurrentProfile } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createEdition } from '@/lib/actions/editions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function EditionsPage() {
  const editions = await getEditions()
  const currentProfile = await getCurrentProfile()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Edições anteriores</h1>
        <p className="text-muted-foreground">Histórico de encontros e experiências do SEEDS.</p>
      </div>

      {currentProfile?.is_admin && (
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar edição</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createEdition} className="space-y-3">
              <Input name="title" placeholder="Título da edição" required />
              <Textarea name="description" placeholder="Descrição" />
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">Data</label>
                <Input id="date" name="date" type="date" />
              </div>
              <Button type="submit">Cadastrar</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {editions.map((edition: any) => (
          <Card key={edition.id}>
            <CardContent className="p-5 space-y-2">
              <h2 className="text-xl font-semibold">{edition.title}</h2>
              {edition.date && (
                <p className="text-sm text-primary">
                  {format(new Date(edition.date), 'PPP', { locale: ptBR })}
                </p>
              )}
              {edition.description && (
                <p className="text-sm text-muted-foreground">{edition.description}</p>
              )}
              {edition.photos && edition.photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {edition.photos.map((photo: string, i: number) => (
                    <img key={i} src={photo} alt="" className="h-24 w-24 rounded-md object-cover" />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {editions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhuma edição cadastrada ainda.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
