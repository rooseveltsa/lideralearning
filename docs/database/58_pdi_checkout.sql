-- ═══════════════════════════════════════════════════════════════════════════
-- 58_pdi_checkout.sql — Funil PDI pago (valor simbólico) via Stripe
-- Pré-requisitos: 03_commerce_orders.sql, 41_personal_diagnostics.sql
--
-- Env vars (Vercel):
--   PDI_CHECKOUT_ENABLED=true     → liga o paywall do PDI (default: desligado)
--   PDI_PRICE_CENTS=2990          → preço simbólico em centavos (default R$ 29,90)
--   STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET → já usados pelo checkout de cursos
-- ═══════════════════════════════════════════════════════════════════════════

-- Desbloqueio do PDI completo após pagamento
ALTER TABLE public.personal_diagnostics
  ADD COLUMN IF NOT EXISTS pdi_paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS pdi_order_id uuid;

COMMENT ON COLUMN public.personal_diagnostics.pdi_paid_at IS
  'Quando o PDI completo foi desbloqueado via pagamento (funil de entrada Stripe).';

-- Pedidos de PDI não têm curso nem usuário autenticado (checkout convidado)
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_product_type_check;
ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_product_type_check CHECK (product_type IN ('course', 'pdi'));

ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

COMMENT ON CONSTRAINT order_items_product_type_check ON public.order_items IS
  'course = matrícula em curso; pdi = desbloqueio do PDI (tripwire do funil).';
