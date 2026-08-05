# SEEDS Experience

Comunidade exclusiva de mulheres empreendedoras. Plataforma construída com **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, **shadcn/ui** e **Supabase**.

## Stack

- Next.js 16.3 com App Router e Turbopack
- React 19 + TypeScript
- Tailwind CSS 4
- shadcn/ui (Base UI / Nova)
- Supabase Auth (magic link), PostgreSQL, RLS
- Server Actions
- date-fns

## Estrutura

```
src/
  app/
    (auth)/         # Páginas públicas de login
    (dashboard)/    # Área logada (layout + rotas /app/*)
      app/
    (admin)/        # Área administrativa (/admin/*)
      admin/
    auth/callback/  # Callback de autenticação
    page.tsx        # Landing page
  components/
    ui/             # Componentes shadcn
    dashboard/      # Sidebar
  lib/
    supabase/       # Clientes server e browser
    data/           # Queries
    actions/        # Server Actions
    db/             # Schema types
  types/            # Tipos do projeto
  supabase/
    schema.sql      # SQL para criar tabelas no Supabase
```

## Configuração

1. Crie um projeto no [Supabase](https://supabase.com)
2. Vá em **Project Settings > API** e copie a URL e a anon key
3. Vá em **Database > SQL Editor** e execute o conteúdo de `supabase/schema.sql` e, em seguida, `supabase/extra_schema.sql`
4. Em **Authentication > Email Templates**, deixe o template padrão
5. Crie o arquivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<seu-projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<sua-service-role-key>
```

6. No Supabase, desative o **Confirm signup** caso queira login apenas por magic link (recomendado para convite-only). Ou mantenha ativado e use o painel admin para enviar convites.

## Como rodar local

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Build

```bash
npm run build
```

## Deploy

A forma mais fácil é na Vercel:

1. Conecte o repositório na Vercel
2. Adicione as variáveis de ambiente do `.env.local`
3. Deploy

## Primeiro admin

Após criar a primeira conta via login, rode no SQL Editor do Supabase:

```sql
UPDATE public.profiles
SET is_admin = TRUE
WHERE email = 'seu-email@exemplo.com';
```

## Funcionalidades implementadas

- [x] Landing page
- [x] Login com magic link (e-mail)
- [x] Auth por convite
- [x] Perfil de membra
- [x] Diretório pesquisável e filtrável
- [x] Agenda de encontros com RSVP
- [x] Painel administrativo (convites, membras, encontros, parceiros, métricas)
- [x] Match IA com híbrido Claude/Groq
- [x] Feed e board de colaborações
- [x] Rede de conexões
- [x] Chat/mensagens com Supabase Realtime
- [Sc]uptl úteis

```be h
npm run dev      # decenvolvimentoquistas
npm rux build    # build d  produção
npm punotestt    # testes unitátios
npmsuntest:e2e# tstes e2e co Playwrght
npm ru lnt     #lit
```

## Próximspssos (opionais)

- [x] Vitrine de produtos
- Webhook de nx] Painel de vagas
-Assinatura/tripe rmnsdad
- P intlrfinnn de prdcoxlh dóições
- [x] Cadastro de palestrantes
- [x] Programa de indicação
- [x] SEO, sitemap.xml, robots.txt, OpenGraph
- [x] Rate limiting nas rotas de IA
- [x] Testes com Vitest + Playwright
- [x] CI/CD no GitHub

## Próximos passos

- Integrar IA híbrida (Groq / Gemini) no match
- Upload de fotos para Supabase Storage
- Notificações em tempo real com Supabase Realtime
- Área de parceiros e propostas
- Pagamentos (Stripe)
