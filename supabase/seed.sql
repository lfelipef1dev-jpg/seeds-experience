-- Substitua 'seu-email@exemplo.com' pelo e-mail que você quer usar.
-- Execute isso no SQL Editor do Supabase depois de rodar schema.sql e extra_schema.sql.

DO $$
DECLARE
  admin_email TEXT := 'lfelipef1.dev@gmail.com';
  new_id UUID;
BEGIN
  -- Verifica se o usuário já existe
  SELECT id INTO new_id FROM auth.users WHERE email = admin_email;

  IF new_id IS NULL THEN
    new_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data)
    VALUES (new_id, admin_email, now(), '{}');
  ELSE
    UPDATE auth.users SET email_confirmed_at = now() WHERE id = new_id;
  END IF;

  -- Registra o perfil e já ativa como admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = new_id) THEN
    INSERT INTO public.profiles (
      user_id, name, email, business, role, sector, city, bio,
      is_admin, verified, color
    ) VALUES (
      new_id, 'Administrador', admin_email, 'SEEDS Experience', 'Fundadora',
      'Tecnologia', 'Brasil', 'Primeiro administrador da plataforma.',
      TRUE, TRUE, '#0f766e'
    );
  ELSE
    UPDATE public.profiles SET
      is_admin = TRUE,
      verified = TRUE,
      name = 'Administrador'
    WHERE user_id = new_id;
  END IF;

  -- Marca o e-mail como convidado
  IF NOT EXISTS (SELECT 1 FROM public.invites WHERE email = admin_email) THEN
    INSERT INTO public.invites (email, invited_by)
    VALUES (admin_email, NULL);
  END IF;
END $$;
