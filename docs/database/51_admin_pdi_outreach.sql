-- ════════════════════════════════════════════════════════════════
-- Admin PDI Outreach — campos para captura de WhatsApp + envio admin
-- ════════════════════════════════════════════════════════════════
--
-- Adiciona campos para viabilizar o fluxo de outreach do admin:
-- 1. WhatsApp do cliente (pessoal) e do supervisor avaliado (empresa)
-- 2. Timestamp de quando o PDI foi enviado por email pelo admin
--
-- Aplicado em prod em 2026-05-15.
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.personal_diagnostics
  ADD COLUMN IF NOT EXISTS whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS pdi_enviado_em TIMESTAMPTZ;

ALTER TABLE public.b2b_diagnostics
  ADD COLUMN IF NOT EXISTS supervisor_whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS pdi_enviado_em TIMESTAMPTZ;

COMMENT ON COLUMN public.personal_diagnostics.whatsapp IS 'E.164 do cliente para outreach via WhatsApp pelo admin';
COMMENT ON COLUMN public.b2b_diagnostics.supervisor_whatsapp IS 'E.164 do supervisor avaliado, opcional';
COMMENT ON COLUMN public.personal_diagnostics.pdi_enviado_em IS 'Quando o admin enviou o PDI por email customizado';
COMMENT ON COLUMN public.b2b_diagnostics.pdi_enviado_em IS 'Idem para b2b';
