import { getProfiles, getCurrentProfile } from '@/lib/data/queries'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { sectors, cities } from '@/lib/db/schema'
import { MapPin, Building2 } from 'lucide-react'
import { requestConnection } from '@/lib/actions/connections'

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const currentProfile = await getCurrentProfile()
  const sp = await searchParams

  const search = typeof sp.q === 'string' ? sp.q : ''
  const sector = typeof sp.setor === 'string' ? sp.setor : ''
  const city = typeof sp.cidade === 'string' ? sp.cidade : ''

  const profiles = await getProfiles(search, sector, city)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Diretório de Membras</h1>
        <p className="text-muted-foreground">Encontre e conecte com empreendedoras do SEEDS.</p>
      </div>

      <form className="flex flex-col sm:flex-row gap-3">
        <Input name="q" placeholder="Buscar por nome, negócio ou bio" defaultValue={search} className="flex-1" />
        <Select name="setor" defaultValue={sector}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Setor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {sectors.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select name="cidade" defaultValue={city}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Cidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">Filtrar</Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={profile.photo_url} />
                  <AvatarFallback style={{ backgroundColor: profile.color }} className="text-white text-lg">
                    {profile.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <h3 className="font-semibold leading-tight">{profile.name}</h3>
                  {profile.verified && <Badge variant="secondary" className="text-xs">Verificada</Badge>}
                </div>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                {profile.business && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {profile.business}
                  </div>
                )}
                {profile.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {profile.city}
                  </div>
                )}
                {profile.sector && <p>{profile.sector}</p>}
              </div>

              {profile.bio && <p className="text-sm line-clamp-3">{profile.bio}</p>}

              <form action={requestConnection} className="w-full">
                <input type="hidden" name="requested_id" value={profile.user_id} />
                <Button type="submit" variant="outline" size="sm" className="w-full">
                  Conectar
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>

      {profiles.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhuma membra encontrada com esses filtros.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
