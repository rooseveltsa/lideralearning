-- ============================================================
-- LIDERA TREINAMENTOS - Sprint 5: Admin + Profiles Setup
-- Execute no SQL Editor do seu projeto Supabase
-- ============================================================

-- 1. Criar tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin', 'hr_manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS para profiles
CREATE POLICY "Usuário pode ver seu próprio perfil"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuário pode atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Criar perfis automaticamente quando novo usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Políticas RLS para Admin gerenciar cursos (adiciona ao schema existente)
DROP POLICY IF EXISTS "Admins podem gerenciar cursos" ON public.courses;
CREATE POLICY "Admins podem gerenciar cursos"
  ON public.courses FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins podem gerenciar modulos" ON public.modules;
CREATE POLICY "Admins podem gerenciar modulos"
  ON public.modules FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins podem gerenciar aulas" ON public.lessons;
CREATE POLICY "Admins podem gerenciar aulas"
  ON public.lessons FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 6. DEFINIR SEU USUÁRIO COMO ADMIN
-- Substitua 'SEU-USER-ID-AQUI' pelo seu ID real
-- Você encontra em Authentication > Users no painel do Supabase
-- ============================================================
INSERT INTO public.profiles (id, full_name, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'roosevelt.miranda@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Confirmar que deu certo:
SELECT id, full_name, role FROM public.profiles;
