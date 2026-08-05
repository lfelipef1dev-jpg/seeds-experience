-- Execute no SQL Editor do Supabase após o schema.sql base

-- Grupos temáticos / subcomunidades
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  theme TEXT,
  created_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.group_members (
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

-- Vitrine de produtos e serviços das membras
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2),
  image_url TEXT,
  link TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Painel de vagas e oportunidades
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  sector TEXT,
  location TEXT,
  type TEXT CHECK (type IN ('clt', 'pj', 'freela', 'estagio', 'outro')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Histórico de edições passadas
CREATE TABLE IF NOT EXISTS public.editions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ,
  photos JSONB,
  testimonials JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Perfis de palestrantes convidadas
CREATE TABLE IF NOT EXISTS public.speakers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  business TEXT,
  bio TEXT,
  photo_url TEXT,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Programa de indicação
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'converted', 'rewarded')),
  created_at TIMESTAMPTZ DEFAULT now(),
  converted_at TIMESTAMPTZ
);

-- Ativar RLS
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "groups_all_members" ON public.groups
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "group_members_users" ON public.group_members
  FOR ALL USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = TRUE
  ));

CREATE POLICY "products_all_members" ON public.products
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "jobs_all_members" ON public.jobs
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "editions_public" ON public.editions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "editions_admin_write" ON public.editions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = TRUE
  ));

CREATE POLICY "speakers_public" ON public.speakers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "speakers_admin_write" ON public.speakers
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = TRUE
  ));

CREATE POLICY "referrals_self_or_admin" ON public.referrals
  FOR ALL USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = TRUE
  ));
