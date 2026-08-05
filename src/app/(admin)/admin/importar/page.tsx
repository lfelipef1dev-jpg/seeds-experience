'use client'

import { useState } from 'react'
import { importMembers } from '@/lib/actions/members'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function ImportarPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null)

  async function handleImport() {
    setLoading(true)
    const data = await importMembers()
    setLoading(false)

    if (data?.error) {
      toast.error(data.error)
      return
    }

    setResult(data as any)
    toast.success(`Importados: ${data.imported}, pulados: ${data.skipped}`)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Importar membras</h1>
        <p className="text-muted-foreground">Importar dados do members.json para o banco de dados.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Members.json</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Isso vai criar usuários temporários no Supabase Auth e inserir perfis para cada membra do members.json.
            Os e-mails serão gerados automaticamente no formato <code>nome.id@seeds.local</code>.
          </p>
          <Button onClick={handleImport} disabled={loading}>
            {loading ? 'Importando...' : 'Importar membras'}
          </Button>

          {result && (
            <div className="text-sm">
              <p><strong>Importadas:</strong> {result.imported}</p>
              <p><strong>Puladas:</strong> {result.skipped}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
