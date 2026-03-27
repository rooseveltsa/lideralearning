-- ============================================
-- Subscriptions System (Stripe Recurring)
-- ============================================

CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_monthly NUMERIC(10,2) NOT NULL,
  price_yearly NUMERIC(10,2),
  max_users INTEGER,
  features JSONB DEFAULT '[]'::jsonb,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  company_id UUID REFERENCES b2b_leads(id),
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'paused', 'trialing', 'incomplete')),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  seats_used INTEGER NOT NULL DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscription_seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  invited_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'removed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(subscription_id, user_id)
);

-- Seed default plans
INSERT INTO subscription_plans (name, slug, description, price_monthly, price_yearly, max_users, features, sort_order) VALUES
  ('Starter', 'starter', 'Para pequenas equipes de liderança', 997, 9970, 25,
   '["Acesso Academy completo", "Diagnósticos ilimitados", "PDI automático", "Relatórios básicos", "Suporte por email"]'::jsonb, 1),
  ('Growth', 'growth', 'Para empresas em crescimento', 2497, 24970, 100,
   '["Tudo do Starter", "Dashboard RH personalizado", "Mentoria mensal", "Relatórios avançados", "Suporte prioritário", "API de integração"]'::jsonb, 2),
  ('Enterprise', 'enterprise', 'Para grandes organizações', 0, 0, NULL,
   '["Tudo do Growth", "Usuários ilimitados", "Treinamentos in-company", "Mentor dedicado", "SLA garantido", "Customização completa"]'::jsonb, 3)
ON CONFLICT (slug) DO NOTHING;

-- RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_seats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans visible to all" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "Plans managed by admins" ON subscription_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Subscriptions visible to owner" ON subscriptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Subscriptions managed by admins" ON subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Seats visible to subscription owner" ON subscription_seats FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM subscriptions WHERE id = subscription_id AND user_id = auth.uid())
);
CREATE POLICY "Seats managed by admins" ON subscription_seats FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_seats_subscription ON subscription_seats(subscription_id);
CREATE INDEX IF NOT EXISTS idx_seats_user ON subscription_seats(user_id);
