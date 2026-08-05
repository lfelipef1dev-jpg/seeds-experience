# Variáveis de ambiente do SEEDS

Crie um arquivo `.env.local` na raiz do projeto com:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...
GOOGLE_AI_API_KEY=AI...

UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Configuração no Vercel

1. Crie o projeto na Vercel importando o repositório GitHub.
2. Em **Settings > Environment Variables**, adicione as variáveis acima.
3. Em **Domains**, configure o domínio personalizado (ex: `seeds.com.br`).
4. No Supabase Auth, adicione as **Redirect URLs** de produção:
   - `https://seeds.com.br/auth/callback`
7. Ative o **Realtime** nas tabelas `messages` e `rooms` para o chat funcionar.
   - `https://www.seeds.com.br/auth/callback`
5. Desabilite o **Signup Público** no Supabase Auth para manter convite-only.
6. Garanta que as **RLS policies** estão ativadas em todas as tabelas do `public`.

## Deploy local

```bash
npm install
npm run build
```
