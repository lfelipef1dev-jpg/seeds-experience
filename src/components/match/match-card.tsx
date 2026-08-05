'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sparkles, Building2, MapPin, Handshake } from 'lucide-react'
import { requestConnection } from '@/lib/actions/connections'
import { getMatchReason } from '@/lib/actions/ai'
import { Profile } from '@/types'
import { toast } from 'sonner'

export function MatchCard({
  profile,
  currentProfile,
}: {
  profile: Profile
  currentProfile: Profile | null
}) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleMatchReason() {
    setLoading(true)
    const formData = new FormData()
    formData.append('member_name', String(profile.name || ''))
    formData.append('member_business', String(profile.business || ''))
    formData.append('member_sector', String(profile.sector || ''))
    formData.append('user_sector', String(currentProfile?.sector || ''))
    const result = await getMatchReason(formData)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    setReason(result.response || 'Sem sugestão no momento.')
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14">
            <AvatarImage src={profile.photo_url || undefined} />
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

        {reason && (
          <div className="text-sm bg-muted p-3 rounded-md">
            <strong>Por que conectar?</strong>
            <p className="text-muted-foreground mt-1">{reason}</p>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleMatchReason}
          disabled={loading}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? 'Analisando...' : 'Ver match com IA'}
        </Button>

        <form action={requestConnection} className="w-full">
          <input type="hidden" name="requested_id" value={profile.user_id} />
          <Button type="submit" variant="outline" size="sm" className="w-full">
            <Handshake className="mr-2 h-4 w-4" />
            Conectar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
