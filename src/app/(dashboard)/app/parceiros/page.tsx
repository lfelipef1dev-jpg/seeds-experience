import { getPartners } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function PartnersPage() {
  const partners = await getPartners()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Parceiros SEEDS</h1>
        <p className="text-muted-foreground">Marcas e organizações que apoiam a comunidade.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner: any) => (
          <Card key={partner.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={partner.logo_url} />
                  <AvatarFallback className="bg-primary text-white text-lg">
                    {partner.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold leading-tight">{partner.name}</h3>
                </div>
              </div>
              {partner.description && (
                <p className="text-sm text-muted-foreground">{partner.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {partners.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum parceiro cadastrado ainda.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
