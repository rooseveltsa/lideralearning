-- ═══════════════════════════════════════════════════════════════════
-- PDI — Plano de ação personalizado por IA (camada opcional)
-- Guarda patches de IA por dimensão para enriquecer o plano de ação.
-- Fallback: se a coluna não existir ou estiver nula, o PDI usa o plano
-- determinístico baseado no método LIDERA (sempre funciona sem IA).
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE public.leadership_pdi
  ADD COLUMN IF NOT EXISTS action_plan_ai JSONB;

COMMENT ON COLUMN public.leadership_pdi.action_plan_ai IS
  'Patches de IA por dimensão para o plano de ação: array de {dimensao, porQueImporta, acoes}. Opcional — gerado 1x quando a avaliação executiva fecha o PDI. Fallback é o plano determinístico LIDERA.';
