-- Lidera Learning — RLS nas tabelas públicas ainda abertas + catálogo consistente
--
-- Contexto (docs/database/STATUS-2026-10-26.md):
-- o advisor do Supabase apontou ~25 tabelas em public sem RLS e a view
-- public.empresas com security definer. Esta migração é incremental:
-- não apaga dados, não recria tabelas e não reaplica 01_LMS_schema.sql
-- (aquele script tem DROP TABLE CASCADE).
--
-- O service role continua ignorando RLS (webhooks, formulários, admin server).
-- Aluno autenticado lê a própria linha quando existe user_id (ou vínculo
-- gestor/aluno). Admin passa por public.is_admin().
--
-- Catálogo: o seed antigo publica "Liderança Exponencial" a R$ 997 com vídeo
-- Big Buck Bunny. O programa documentado é "Supervisor: Da Operação à Liderança"
-- a R$ 3.330 (docs/database/13_seed_modules_content.sql). Não alteramos um
-- preço que o dono já tenha mudado no curso oficial.

-- ---------------------------------------------------------------------------
-- 1. Checagem de admin sem recursão em profiles
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

COMMENT ON FUNCTION public.is_admin() IS
  'True quando o usuário autenticado tem profiles.role = admin. SECURITY DEFINER evita recursão de RLS.';

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ---------------------------------------------------------------------------
-- 2. Liga RLS em toda tabela public que ainda está aberta e cria policies
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  r record;
  has_user_id boolean;
  has_gestor boolean;
  has_aluno boolean;
  admin_policy text;
BEGIN
  FOR r IN
    SELECT c.relname AS table_name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND c.relrowsecurity = false
    ORDER BY c.relname
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.table_name);

    admin_policy := 'admins manage ' || r.table_name;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND tablename = r.table_name AND policyname = admin_policy
    ) THEN
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',
        admin_policy,
        r.table_name
      );
    END IF;

    IF r.table_name = 'profiles' THEN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'students read own profile'
      ) THEN
        EXECUTE $policy$
          CREATE POLICY "students read own profile"
            ON public.profiles
            FOR SELECT
            TO authenticated
            USING (auth.uid() = id)
        $policy$;
      END IF;
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'students update own profile'
      ) THEN
        EXECUTE $policy$
          CREATE POLICY "students update own profile"
            ON public.profiles
            FOR UPDATE
            TO authenticated
            USING (auth.uid() = id)
            WITH CHECK (auth.uid() = id)
        $policy$;
      END IF;
    END IF;

    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = r.table_name AND column_name = 'user_id'
    ) INTO has_user_id;

    IF has_user_id AND r.table_name <> 'profiles' THEN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = r.table_name AND policyname = 'owner reads own rows'
      ) THEN
        EXECUTE format(
          'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (auth.uid() = user_id)',
          'owner reads own rows',
          r.table_name
        );
      END IF;
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = r.table_name AND policyname = 'owner inserts own rows'
      ) THEN
        EXECUTE format(
          'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)',
          'owner inserts own rows',
          r.table_name
        );
      END IF;
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = r.table_name AND policyname = 'owner updates own rows'
      ) THEN
        EXECUTE format(
          'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)',
          'owner updates own rows',
          r.table_name
        );
      END IF;
    END IF;

    IF r.table_name = 'progress' THEN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'progress' AND policyname = 'students manage own progress'
      ) THEN
        EXECUTE $policy$
          CREATE POLICY "students manage own progress"
            ON public.progress
            FOR ALL
            TO authenticated
            USING (
              EXISTS (
                SELECT 1 FROM public.enrollments e
                WHERE e.id = progress.enrollment_id
                  AND e.user_id = auth.uid()
              )
            )
            WITH CHECK (
              EXISTS (
                SELECT 1 FROM public.enrollments e
                WHERE e.id = progress.enrollment_id
                  AND e.user_id = auth.uid()
              )
            )
        $policy$;
      END IF;
    END IF;

    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = r.table_name AND column_name = 'gestor_user_id'
    ) INTO has_gestor;

    IF has_gestor THEN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = r.table_name AND policyname = 'gestor reads own links'
      ) THEN
        EXECUTE format(
          'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (auth.uid() = gestor_user_id)',
          'gestor reads own links',
          r.table_name
        );
      END IF;
    END IF;

    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = r.table_name AND column_name = 'aluno_user_id'
    ) INTO has_aluno;

    IF has_aluno THEN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = r.table_name AND policyname = 'aluno reads own links'
      ) THEN
        EXECUTE format(
          'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (auth.uid() = aluno_user_id)',
          'aluno reads own links',
          r.table_name
        );
      END IF;
    END IF;
  END LOOP;
END $$;

-- Gestor de RH lê o perfil dos alunos vinculados, se profiles acabou de ganhar RLS
-- ou se a policy ainda não existe.
DO $$
BEGIN
  IF to_regclass('public.profiles') IS NULL OR to_regclass('public.gestor_aluno_relationships') IS NULL THEN
    RETURN;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'hr reads linked students'
  ) THEN
    CREATE POLICY "hr reads linked students"
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.gestor_aluno_relationships g
          WHERE g.gestor_user_id = auth.uid()
            AND g.aluno_user_id = profiles.id
        )
      );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 3. Catálogo público continua legível; vídeo da aula não vaza para anônimo
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.courses') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'public' AND tablename = 'courses' AND policyname = 'Anyone can view published courses'
     ) THEN
    CREATE POLICY "Anyone can view published courses"
      ON public.courses
      FOR SELECT
      USING (is_published = true);
  END IF;

  IF to_regclass('public.modules') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'public' AND tablename = 'modules' AND policyname = 'Anyone can view modules of published courses'
     ) THEN
    CREATE POLICY "Anyone can view modules of published courses"
      ON public.modules
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.courses c
          WHERE c.id = modules.course_id
            AND c.is_published = true
        )
      );
  END IF;

  IF to_regclass('public.lessons') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'public' AND tablename = 'lessons' AND policyname = 'Enrolled students read course lessons'
     ) THEN
    CREATE POLICY "Enrolled students read course lessons"
      ON public.lessons
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.enrollments e
          JOIN public.modules m ON m.course_id = e.course_id
          WHERE m.id = lessons.module_id
            AND e.user_id = auth.uid()
            AND e.status IN ('active', 'completed')
        )
      );
  END IF;
END $$;

-- Ementa pública: título e duração, sem video_url. security invoker não
-- serviria aqui porque a policy de lessons esconde a linha do anônimo.
CREATE OR REPLACE FUNCTION public.published_course_outline(p_course_id uuid)
RETURNS TABLE (
  module_id uuid,
  module_title text,
  module_order integer,
  lesson_id uuid,
  lesson_title text,
  duration_seconds integer,
  lesson_order integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    m.id,
    m.title,
    m.order_index,
    l.id,
    l.title,
    COALESCE(l.duration_seconds, 0),
    l.order_index
  FROM public.modules m
  JOIN public.courses c ON c.id = m.course_id
  LEFT JOIN public.lessons l ON l.module_id = m.id
  WHERE c.id = p_course_id
    AND c.is_published = true;
$$;

REVOKE ALL ON FUNCTION public.published_course_outline(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.published_course_outline(uuid) TO anon, authenticated;

COMMENT ON FUNCTION public.published_course_outline(uuid) IS
  'Ementa de curso publicado (módulos e títulos de aula). Não devolve video_url.';

-- ---------------------------------------------------------------------------
-- 4. View empresas: deixa de rodar com privilégio do dono
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'empresas'
      AND c.relkind = 'v'
  ) THEN
    EXECUTE 'ALTER VIEW public.empresas SET (security_invoker = true)';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 5. Catálogo: tira o demo da vitrine e garante o programa oficial
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.courses') IS NULL THEN
    RETURN;
  END IF;

  UPDATE public.courses
  SET
    is_published = false,
    description = CASE
      WHEN COALESCE(description, '') ILIKE '%[DEMO]%' THEN description
      ELSE COALESCE(description, '') || E'\n\n[DEMO] Curso de exemplo do seed inicial (R$ 997 e vídeo de teste). Não vender. O programa oficial é "Supervisor: Da Operação à Liderança".'
    END
  WHERE id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
    AND title = 'Liderança Exponencial';

  INSERT INTO public.courses (id, title, description, thumbnail_url, price, is_published)
  VALUES (
    'c0000001-0000-0000-0000-000000000001',
    'Supervisor: Da Operação à Liderança',
    'Programa completo de formação de líderes. 16 horas de imersão presencial + mentoria individual. Transforme supervisores operacionais em líderes estratégicos.',
    NULL,
    3330.00,
    true
  )
  ON CONFLICT (id) DO NOTHING;
END $$;

DO $$
BEGIN
  IF to_regclass('public.modules') IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.modules (id, course_id, title, order_index) VALUES
    ('m0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Módulo 1 — A Função Estratégica', 1),
    ('m0000002-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'Módulo 2 — Inteligência Comportamental', 2),
    ('m0000003-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 'Módulo 3 — Alicerce Ético', 3),
    ('m0000004-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000001', 'Módulo 4 — Diversidade Geracional', 4),
    ('m0000005-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000001', 'Módulo 5 — Engenharia de Equipes', 5),
    ('m0000006-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000001', 'Módulo 6 — O Supervisor 4.0', 6),
    ('m0000007-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000001', 'Módulo 7 — Padrões de Sucesso', 7),
    ('m0000008-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000001', 'Módulo 8 — Estratégia e Plano Futuro', 8)
  ON CONFLICT (id) DO NOTHING;
END $$;

DO $$
BEGIN
  IF to_regclass('public.lessons') IS NULL THEN
    RETURN;
  END IF;

  UPDATE public.lessons
  SET
    video_url = NULL,
    content_text = CASE
      WHEN COALESCE(content_text, '') ILIKE '%[PLACEHOLDER DE VÍDEO]%' THEN content_text
      ELSE '[PLACEHOLDER DE VÍDEO] Esta aula usava um vídeo de teste (Big Buck Bunny). Cole a URL real no editor do admin, em Cursos → aula → Vídeo da aula.'
        || E'\n\n'
        || COALESCE(content_text, '')
    END
  WHERE video_url ILIKE '%bigbuckbunny%'
     OR video_url ILIKE '%big_buck_bunny%'
     OR video_url ILIKE '%test-videos.co.uk%'
     OR video_url ILIKE '%gtv-videos-bucket%';
END $$;
