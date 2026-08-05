import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade e tratamento de dados do SEEDS Experience.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-full flex flex-col">
      <main className="flex-1 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Política de Privacidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                O SEEDS Experience valoriza a privacidade e a segurança dos dados das membras e parceiras.
                Esta política descreve como coletamos, usamos, armazenamos e protegemos as informações pessoais.
              </p>

              <h2 className="text-lg font-semibold text-foreground">1. Dados coletados</h2>
              <p>
                Coletamos nome, e-mail, foto, nome do negócio, setor, cidade, bio e redes sociais, fornecidos
                voluntariamente no cadastro do perfil.
              </p>

              <h2 className="text-lg font-semibold text-foreground">2. Uso dos dados</h2>
              <p>
                Os dados são utilizados para conectar membras, organizar eventos, viabilizar colaborações e
                gerar matches. Nunca comercializamos dados pessoais.
              </p>

              <h2 className="text-lg font-semibold text-foreground">3. Controle de visibilidade</h2>
              <p>
                Cada membra pode definir a visibilidade do perfil (público, apenas membras ou privado) e
                atualizar seus dados a qualquer momento.
              </p>

              <h2 className="text-lg font-semibold text-foreground">4. Segurança</h2>
              <p>
                Utilizamos criptografia, Row Level Security (RLS) e autenticação segura via Supabase para
                proteger as informações.
              </p>

              <h2 className="text-lg font-semibold text-foreground">5. Direitos do titular</h2>
              <p>
                Você pode solicitar acesso, correção ou exclusão dos seus dados entrando em contato com a
                equipe do SEEDS.
              </p>

              <p className="pt-4">
                Última atualização: {new Date().getFullYear()}.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
