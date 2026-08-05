import { getReferrals, getCurrentProfile } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { createReferral, convertReferral } from '@/lib/actions/referrals'

export default async function ReferralsPage() {
  const referrals = await getReferrals()
  const currentProfile = await getCurrentProfile()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Indique uma amiga</h1>
        <p className="text-muted-foreground">
          Indique empreendedoras para a comunidade e acompanhe o status das indicações.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova indicação</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createReferral} className="flex flex-col sm:flex-row gap-3">
            <Input name="email" type="email" placeholder="e-mail da indicada" required className="flex-1" />
            <Button type="submit">Indicar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {referrals.map((referral: any) => (
              <div
                key={referral.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3"
              >
                <div>
                  <p className="font-medium">{referral.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Indicado por {referral.profiles?.name || '—'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      referral.status === 'converted'
                        ? 'default'
                        : referral.status === 'rewarded'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {referral.status}
                  </Badge>
                  {currentProfile?.is_admin && referral.status === 'pending' && (
                    <form action={convertReferral}>
                      <input type="hidden" name="id" value={referral.id} />
                      <Button type="submit" size="sm" variant="outline">
                        Marcar convertida
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>

          {referrals.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Nenhuma indicação ainda.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
