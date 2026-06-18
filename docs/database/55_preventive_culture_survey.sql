-- ════════════════════════════════════════════════════════════════
-- Preventive Culture Survey — Termômetro da Cultura Preventiva (ANÔNIMO + setor)
-- Diagnóstico de cultura de segurança comportamental + segurança psicológica.
-- Instrumento Lidera (central de formulários do portal do gestor).
-- ════════════════════════════════════════════════════════════════
-- IMPORTANTE: respostas anônimas. NÃO há user_id nem qualquer identificador
-- pessoal. O único recorte é por setor. Inserção via service role (API);
-- leitura apenas para admin via RLS.
-- ESCOPO: diagnóstico de cultura. NÃO substitui o levantamento legal de riscos
-- psicossociais (NR-1/GRO/PGR) feito pelo SESMT/RH — é complemento.

CREATE TABLE IF NOT EXISTS public.preventive_culture_responses (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Recorte (sem identificar a pessoa)
  setor             text NOT NULL,
  setor_outro       text,

  -- Respostas cruas (itemId -> 1..5 ou null para "Não sei / não vivi")
  -- Itens críticos/reversos são guardados como nota crua; a inversão é aplicada
  -- no scoring (server) e na leitura.
  respostas         jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Scores calculados no servidor (snapshot no momento da resposta).
  -- Itens reversos já entram invertidos no cálculo das dimensões.
  dimension_scores  jsonb NOT NULL DEFAULT '[]'::jsonb,
  overall_score     int,                       -- 0..100 (null = sem base) — maturidade

  -- Pergunta(s) aberta(s) anônima(s), incluindo RED-FLAG de encaminhamento.
  -- Lidas só pelo responsável pelo tratamento, em sigilo.
  abertas           jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Audit mínimo (sem PII)
  user_agent        text,
  created_at        timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT preventive_culture_overall_range
    CHECK (overall_score IS NULL OR (overall_score BETWEEN 0 AND 100))
);

COMMENT ON TABLE public.preventive_culture_responses IS
  'Termômetro da Cultura Preventiva ANÔNIMO. Sem user_id por design. Recorte só por setor; setores com < 5 respostas devem ser agregados na leitura (regra de privacidade). Diagnóstico de cultura — NÃO substitui o levantamento legal de riscos psicossociais (NR-1/GRO/PGR).';

CREATE INDEX IF NOT EXISTS idx_preventive_culture_setor
  ON public.preventive_culture_responses (setor, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_preventive_culture_created
  ON public.preventive_culture_responses (created_at DESC);

-- RLS
ALTER TABLE public.preventive_culture_responses ENABLE ROW LEVEL SECURITY;

-- Admins leem tudo (agregação no portal). Não há policy de SELECT para anon.
CREATE POLICY "admins_all_preventive_culture"
  ON public.preventive_culture_responses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Inserção é feita pela API com service role (bypassa RLS). Não criamos policy
-- de INSERT para anon, para o formulário público não escrever direto na tabela.
