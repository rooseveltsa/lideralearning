-- ══════════════════════════════════════════════════════════════
-- Training Registrations & Assessments
-- Tables for presential training event management
-- ══════════════════════════════════════════════════════════════

-- ── Training Registrations ──
CREATE TABLE IF NOT EXISTS training_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT NOT NULL,
  company_name TEXT,
  role TEXT NOT NULL,
  leadership_time TEXT NOT NULL,
  team_size TEXT,
  main_challenge TEXT,
  training_id TEXT NOT NULL DEFAULT 'lideranca-abril-2026',
  source_page TEXT DEFAULT 'inscricao',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, cancelled
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for filtering by training and status
CREATE INDEX IF NOT EXISTS idx_training_reg_training_id ON training_registrations(training_id);
CREATE INDEX IF NOT EXISTS idx_training_reg_status ON training_registrations(status);

-- ── Training Assessments (Avaliação Diagnóstica) ──
CREATE TABLE IF NOT EXISTS training_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  answers JSONB NOT NULL DEFAULT '[]',
  result_summary JSONB NOT NULL DEFAULT '{}',
  overall_score NUMERIC(3,1) NOT NULL DEFAULT 0,
  training_id TEXT NOT NULL DEFAULT 'lideranca-abril-2026',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for filtering by training
CREATE INDEX IF NOT EXISTS idx_training_assess_training_id ON training_assessments(training_id);
CREATE INDEX IF NOT EXISTS idx_training_assess_score ON training_assessments(overall_score);

-- ── RLS Policies ──
ALTER TABLE training_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_assessments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public forms)
CREATE POLICY "Allow anonymous insert on training_registrations"
  ON training_registrations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on training_assessments"
  ON training_assessments FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin full access
CREATE POLICY "Admin full access on training_registrations"
  ON training_registrations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access on training_assessments"
  ON training_assessments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Service role full access (for API routes)
CREATE POLICY "Service role full access on training_registrations"
  ON training_registrations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on training_assessments"
  ON training_assessments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
