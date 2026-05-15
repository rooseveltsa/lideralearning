-- ════════════════════════════════════════════════════════════════
-- Fix RLS Recursion — public.profiles
-- ════════════════════════════════════════════════════════════════
--
-- BUG identificado: policy "Admins can manage all profiles" continha
-- EXISTS (SELECT 1 FROM profiles WHERE ... AND role = 'admin') dentro
-- da própria policy de profiles, criando recursão infinita ao avaliar.
--
-- Sintoma: queries em profiles falham com erro
-- "infinite recursion detected in policy for relation profiles"
-- Bloqueia carregamento do admin/layout.tsx que faz SELECT em profiles.
--
-- SOLUÇÃO: função SECURITY DEFINER que bypassa RLS internamente,
-- evitando que a checagem de admin acione a própria policy recursivamente.
--
-- Aplicado em prod em 2026-05-15 via CLI Supabase.
-- ════════════════════════════════════════════════════════════════

-- 1. Função helper que faz a checagem sem acionar RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

COMMENT ON FUNCTION public.is_admin() IS
  'Verifica se o usuário autenticado é admin. SECURITY DEFINER evita recursão RLS quando usada dentro de policies de profiles.';

-- 2. Drop policy problemática
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- 3. Recria policy usando a função (sem recursão)
CREATE POLICY "Admins can manage all profiles"
  ON public.profiles
  FOR ALL
  USING (public.is_admin());
