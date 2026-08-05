-- Execute no SQL Editor do Supabase

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Perfis
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  photo_url TEXT,
  business TEXT,
  role TEXT,
  sector TEXT,
  city TEXT,
  bio TEXT,
  social_links JSONB,
  verified BOOLEAN DEFAULT FALSE,
  color TEXT DEFAULT '#2B4736',
  is_admin BOOLEAN DEFAULT FALSE,
  is_partner BOOLEAN DEFAULT FALSE,
  visibility TEXT DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'private')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Convites
CREATE TABLE IF NOT EXISTS public.invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  invited_by UUID REFERENCES public.profiles(user_id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ
);

-- Eventos
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  host_brand TEXT,
  theme TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'finished')),
  max_attendees INTEGER,
  created_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Participantes de eventos
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  rsvp_status TEXT DEFAULT 'confirmed' CHECK (rsvp_status IN ('confirmed', 'declined', 'waitlist')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (event_id, user_id)
);

-- Conexões
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  requested_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (requester_id, requested_id)
);

-- Posts do feed
CREATE TABLE IF NOT EXISTS public.feed_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Board de colaborações
CREATE TABLE IF NOT EXISTS public.collaboration_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('procuro_socia', 'procuro_fornecedora', 'ofereco_mentoria', 'procuro_investimento', 'outro')),
  title TEXT NOT NULL,
  description TEXT,
  sector TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Parceiros
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id),
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
  website TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Patrocínios de eventos
CREATE TABLE IF NOT EXISTS public.sponsorships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  amount DECIMAL(12,2),
  status TEXT DEFAULT 'proposed' CHECK (status IN ('proposed', 'approved', 'executed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Salas de chat
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Membros de salas
CREATE TABLE IF NOT EXISTS public.room_members (
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (room_id, user_id)
);

-- Mensagens
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notificações
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mural de conquistas
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ativar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "perfis_public_select" ON public.profiles
  FOR SELECT USING (visibility = 'public' OR is_admin = TRUE OR auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid()
  ));

CREATE POLICY "perfis_self_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "perfis_admin_insert" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = TRUE
  ));

CREATE POLICY "convites_admin_all" ON public.invites
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = TRUE
  ));

CREATE POLICY "convites_self_email" ON public.invites
  FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "events_public_published" ON public.events
  FOR SELECT USING (status = 'published' OR EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = TRUE
  ));

CREATE POLICY "events_admin_write" ON public.events
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = TRUE
  ));

CREATE POLICY "event_attendees_participants" ON public.event_attendees
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.events e WHERE e.id = event_attendees.event_id
  ) AND (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = TRUE
  )));

CREATE POLICY "connections_users" ON public.connections
  FOR ALL USING (requester_id = auth.uid() OR requested_id = auth.uid());

CREATE POLICY "feed_posts_all_members" ON public.feed_posts
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "collab_posts_all_members" ON public.collaboration_posts
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "partners_all_members" ON public.partners
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "partners_admin_write" ON public.partners
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = TRUE
  ));

CREATE POLICY "sponsorships_admin_read" ON public.sponsorships
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = TRUE
  ) OR partner_id IN (
    SELECT id FROM public.partners WHERE user_id = auth.uid()
  ));

CREATE POLICY "rooms_members_only" ON public.rooms
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.room_members rm WHERE rm.room_id = rooms.id AND rm.user_id = auth.uid()
  ));

CREATE POLICY "room_members_users" ON public.room_members
  FOR ALL USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = TRUE
  ));

CREATE POLICY "messages_room_members" ON public.messages
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.room_members rm WHERE rm.room_id = messages.room_id AND rm.user_id = auth.uid()
  ));

CREATE POLICY "notifications_self" ON public.notifications
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "achievements_all_members" ON public.achievements
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Função para criar perfil automaticamente no signup confirmado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil no signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
