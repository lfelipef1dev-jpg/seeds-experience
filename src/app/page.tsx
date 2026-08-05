import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Leaf, Users, Sparkles, Calendar, Handshake, Award } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'SEEDS Experience — Comunidade Exclusiva de Mulheres Empreendedoras',
  description: 'Networking de alto valor, capacitação e conexões entre mulheres empreendedoras e marcas parceiras.',
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full">
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Leaf className="h-6 w-6 text-primary" />
            <span>SEEDS</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/login">Entrar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Comunidade exclusiva por convite
            </div>
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-tight">
              Networking de alto valor para mulheres que decidem.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              O SEEDS Experience reúne empreendedoras fundadoras e marcas parceiras em experiências imersivas curadas. Conexões, conhecimento e oportunidades em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/login">Acessar a plataforma</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="#sobre">Conheça mais</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="sobre" className="py-20 px-4 bg-card">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-semibold tracking-tight">O que você encontra no SEEDS</h2>
              <p className="text-muted-foreground mt-2">Uma plataforma construída para potencializar negócios e conexões.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Users, title: 'Diretório de Membras', desc: 'Encontre outras empreendedoras por setor, cidade e especialidade.' },
                { icon: Calendar, title: 'Encontros Exclusivos', desc: 'Agenda de edições, RSVP, histórico e palestrantes convidadas.' },
                { icon: Handshake, title: 'Match de Conexões', desc: 'Sugestões inteligentes por complementaridade de negócio.' },
                { icon: Award, title: 'Conteúdo e Trilhas', desc: 'Aulas, masterclasses e certificados para acelerar seu negócio.' },
                { icon: Sparkles, title: 'Board de Colaborações', desc: 'Procure sócias, fornecedoras, mentoria e oportunidades.' },
                { icon: Leaf, title: 'Vitrine de Parceiros', desc: 'Conecte-se com marcas e acesse benefícios exclusivos.' },
              ].map((f) => (
                <Card key={f.title} className="border bg-background">
                  <CardContent className="p-6 space-y-3">
                    <f.icon className="h-8 w-8 text-primary" />
                    <h3 className="text-lg font-semibold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">Acesso exclusivo por convite</h2>
            <p className="text-muted-foreground">
              O SEEDS é uma comunidade fechada. Se você recebeu um convite, acesse sua conta e complete seu perfil para começar a conectar.
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/login">Entrar com convite</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SEEDS Experience. Todos os direitos reservados.
      </footer>
    </div>
  )
}
