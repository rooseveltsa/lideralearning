-- LIDERA TREINAMENTOS
-- Seed: Programa "Supervisor: Da Operação à Liderança" — 8 Módulos
-- Execute this script in your Supabase SQL Editor.

-- ============================================================
-- Main Course
-- ============================================================
INSERT INTO public.courses (id, title, description, thumbnail_url, price, is_published)
VALUES (
  'c0000001-0000-0000-0000-000000000001',
  'Supervisor: Da Operação à Liderança',
  'Programa completo de formação de líderes. 16 horas de imersão presencial + mentoria individual. Transforme supervisores operacionais em líderes estratégicos.',
  null,
  3330.00,
  true
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Day 1 — O Elo e o Alicerce Ético
-- ============================================================

-- Module 1: A Função Estratégica do Supervisor
INSERT INTO public.modules (id, course_id, title, order_index) VALUES
('m0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Módulo 1 — A Função Estratégica', 1)
ON CONFLICT (id) DO NOTHING;

-- Module 2: Inteligência Comportamental e Comunicação
INSERT INTO public.modules (id, course_id, title, order_index) VALUES
('m0000002-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'Módulo 2 — Inteligência Comportamental', 2)
ON CONFLICT (id) DO NOTHING;

-- Module 3: Alicerce Ético e Responsabilidade
INSERT INTO public.modules (id, course_id, title, order_index) VALUES
('m0000003-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 'Módulo 3 — Alicerce Ético', 3)
ON CONFLICT (id) DO NOTHING;

-- Module 4: Gestão da Diversidade Geracional
INSERT INTO public.modules (id, course_id, title, order_index) VALUES
('m0000004-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000001', 'Módulo 4 — Diversidade Geracional', 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Day 2 — Tecnologia e Futuro
-- ============================================================

-- Module 5: Engenharia de Equipes, Mapeamento e Sucessão
INSERT INTO public.modules (id, course_id, title, order_index) VALUES
('m0000005-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000001', 'Módulo 5 — Engenharia de Equipes', 5)
ON CONFLICT (id) DO NOTHING;

-- Module 6: O Supervisor 4.0 (Tecnologia e IA)
INSERT INTO public.modules (id, course_id, title, order_index) VALUES
('m0000006-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000001', 'Módulo 6 — O Supervisor 4.0', 6)
ON CONFLICT (id) DO NOTHING;

-- Module 7: Padrões de Sucesso
INSERT INTO public.modules (id, course_id, title, order_index) VALUES
('m0000007-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000001', 'Módulo 7 — Padrões de Sucesso', 7)
ON CONFLICT (id) DO NOTHING;

-- Module 8: Estratégia de Carreira e Plano Futuro
INSERT INTO public.modules (id, course_id, title, order_index) VALUES
('m0000008-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000001', 'Módulo 8 — Estratégia e Plano Futuro', 8)
ON CONFLICT (id) DO NOTHING;
