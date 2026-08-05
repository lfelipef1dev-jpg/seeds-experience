# Guia de deploy para produção

## 1. Banco de dados (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Vá em **Database > SQL Editor** e execute, na ordem:
   - `supabase/schema.sql`
   - `supabase/extra_schema.sql`
   - `supabase/seed.sql` (altere o e-mail no início do arquivo)
3. Em **Database > Realtime**, ative as tabelas `messages` e `rooms`.
4. Em **Authentication > Providers > Email**, desative **Confirm signup** e **Enable email confirmations** para manter login apenas por magic link.
5. Em **Authentication > URL Configuration**, adicione:
   - Site URL: `https://seeds.com.br/`
   - Redirect URLs: `https://seeds.com.br/auth/callback` e `https://www.seeds.com.br/auth/callback`
6. Vá em **Project Settings > API** e copie a URL e a anon key.
7. Vá em **Project Settings > API > Project API keys** e copie a service role key.

## 2. Variáveis de ambiente

Crie o `.env.local` na raiz do projeto e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...
GOOGLE_AI_API_KEY=AI...

UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

NEXT_PUBLIC_SITE_URL=https://seeds.com.br
```

## 3. Deploy na Netlify (git)

A forma correta de subir o Next.js completo é pela Netlify conectada ao GitHub (não pelo Drop, que só aceita sites estáticos):

1. Faça push do projeto para um repositório no GitHub.
2. No Netlify, **Add new site > Import an existing project** e escolha o repositório.
3. Em **Build settings**, confira se o build command é `npm run build` e publish directory é `.next`.
4. Em **Site settings > Environment variables**, adicione todas as variáveis do `.env.local`.
5. Clique em **Deploy**.

## 4. Primeiro acesso

Depois do deploy, acesse `https://seeds.com.br/login` e use o e-mail que você colocou no `supabase/seed.sql`. O Supabase enviará um magic link. A primeira conta já é admin.

## 5. Convites

Com o primeiro admin logado, use `/admin/convites` para enviar convites para novas membras. O login é convite-only: e-mails fora da tabela `invites` são bloqueados.

## 6. Domínio

No Netlify, em **Domain management**, conecte o domínio do cliente e certifique-se de adicionar a redirect URL dele no Supabase Auth.
