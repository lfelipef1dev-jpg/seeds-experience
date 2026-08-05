import { getPartners } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createPartner } from '@/lib/actions/partners'

export default async function AdminPartnersPage() {
  const partners = await getPartners()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Gerenciar Parceiros</h1>
        <p className="text-muted-foreground">Cadastre marcas e empresas parceiras.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cadastrar parceiro</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPartner} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do parceiro</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo_url">URL do logo</Label>
              <Input id="logo_url" name="logo_url" type="url" />
            </div>
            <Button type="submit">Cadastrar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {partners.map((partner: any) => (
              <div key={partner.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{partner.name}</p>
                  <p className="text-sm text-muted-foreground">{partner.status}</p>
                </div>
              </div>
            ))}
          </div>

          {partners.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum parceiro cadastrado.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
