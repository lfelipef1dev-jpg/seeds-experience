import { getProfiles, getCurrentProfile } from '@/lib/data/queries'
import { MatchCard } from '@/components/match/match-card'
import { Sparkles } from 'lucide-react'

export default async function MatchPage() {
  const currentProfile = await getCurrentProfile()
  const profiles = await getProfiles()

  const matches = currentProfile
    ? profiles
        .filter((p) => p.user_id !== currentProfile.user_id)
        .filter((p) => (currentProfile.sector ? p.sector !== currentProfile.sector : true))
        .slice(0, 6)
    : []

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Match de Conexões</h1>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <p className="text-muted-foreground">
          Membras com setores complementares ao seu para você conectar.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((profile) => (
          <MatchCard key={profile.id} profile={profile} currentProfile={currentProfile} />
        ))}
      </div>

      {matches.length === 0 && (
        <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card">
          Complete seu perfil com setor para receber matches.
        </div>
      )}
    </div>
  )
}
