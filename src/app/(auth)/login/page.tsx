'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { Leaf, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    setEmailSent(true)
    toast.success('Link de acesso enviado. Verifique seu e-mail.')
  }

  return (
    <Card className="border shadow-xl">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Leaf className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">SEEDS Experience</CardTitle>
        <CardDescription>
          Acesso exclusivo por convite. Insira seu e-mail para receber o link de login.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {emailSent ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Enviamos um link mágico para <strong>{email}</strong>. Clique no link para entrar.
            </p>
            <Button variant="outline" className="w-full" onClick={() => setEmailSent(false)}>
              Usar outro e-mail
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enviar link de acesso
            </Button>
          </form>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <Link href="/" className="underline hover:text-foreground">
            Voltar para o início
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
