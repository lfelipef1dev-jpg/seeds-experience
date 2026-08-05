'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile } from '@/lib/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { sectors, cities } from '@/lib/db/schema'
import { Profile } from '@/types'

export function ProfileForm({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Perfil atualizado com sucesso!')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" name="name" defaultValue={profile.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business">Empresa / Negócio</Label>
          <Input id="business" name="business" defaultValue={profile.business || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Cargo / Função</Label>
          <Input id="role" name="role" defaultValue={profile.role || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Cor do perfil</Label>
          <Input id="color" name="color" type="color" defaultValue={profile.color} className="h-10" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sector">Setor</Label>
          <Select name="sector" defaultValue={profile.sector || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um setor" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Select name="city" defaultValue={profile.city || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma cidade" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" defaultValue={profile.bio || ''} rows={4} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" name="linkedin" defaultValue={profile.social_links?.linkedin || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input id="instagram" name="instagram" defaultValue={profile.social_links?.instagram || ''} />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar perfil'}
      </Button>
    </form>
  )
}
