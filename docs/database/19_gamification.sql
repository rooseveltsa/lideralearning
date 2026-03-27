-- ============================================
-- Gamification System (XP, Streaks, Achievements)
-- ============================================

CREATE TABLE IF NOT EXISTS user_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id),
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  weekly_xp INTEGER NOT NULL DEFAULT 0,
  weekly_reset_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  source TEXT NOT NULL CHECK (source IN (
    'lesson_completed', 'module_completed', 'course_completed',
    'assessment_completed', 'streak_bonus', 'certificate_earned',
    'referral_converted', 'daily_login', 'first_lesson'
  )),
  reference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏆',
  category TEXT NOT NULL CHECK (category IN ('learning', 'streak', 'social', 'milestone', 'special')),
  xp_reward INTEGER NOT NULL DEFAULT 0,
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('xp_total', 'streak_days', 'lessons_count', 'courses_count', 'certificates_count', 'referrals_count', 'custom')),
  requirement_value INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  achievement_id UUID NOT NULL REFERENCES achievements(id),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Seed achievements
INSERT INTO achievements (slug, title, description, icon, category, xp_reward, requirement_type, requirement_value, sort_order) VALUES
  ('first_lesson', 'Primeiro Passo', 'Complete sua primeira aula', '🎯', 'learning', 50, 'lessons_count', 1, 1),
  ('ten_lessons', 'Estudante Dedicado', 'Complete 10 aulas', '📚', 'learning', 100, 'lessons_count', 10, 2),
  ('fifty_lessons', 'Mestre do Conhecimento', 'Complete 50 aulas', '🧠', 'learning', 500, 'lessons_count', 50, 3),
  ('first_course', 'Graduado', 'Complete seu primeiro curso', '🎓', 'milestone', 200, 'courses_count', 1, 4),
  ('three_courses', 'Polímata', 'Complete 3 cursos', '🌟', 'milestone', 500, 'courses_count', 3, 5),
  ('streak_3', 'Consistente', '3 dias seguidos de estudo', '🔥', 'streak', 50, 'streak_days', 3, 6),
  ('streak_7', 'Semana Perfeita', '7 dias seguidos de estudo', '⚡', 'streak', 150, 'streak_days', 7, 7),
  ('streak_30', 'Imbatível', '30 dias seguidos de estudo', '💎', 'streak', 1000, 'streak_days', 30, 8),
  ('first_cert', 'Certificado', 'Conquiste seu primeiro certificado', '📜', 'milestone', 300, 'certificates_count', 1, 9),
  ('first_referral', 'Influenciador', 'Faça sua primeira indicação convertida', '🤝', 'social', 200, 'referrals_count', 1, 10),
  ('assessment_done', 'Autoconhecimento', 'Complete uma autoavaliação de liderança', '🪞', 'learning', 100, 'custom', 1, 11),
  ('level_5', 'Líder Emergente', 'Alcance o nível 5', '⭐', 'milestone', 0, 'xp_total', 2500, 12),
  ('level_10', 'Líder Estratégico', 'Alcance o nível 10', '🏅', 'milestone', 0, 'xp_total', 10000, 13)
ON CONFLICT (slug) DO NOTHING;

-- XP to Level mapping function
-- Level 1: 0 XP, Level 2: 500 XP, Level 3: 1200 XP, etc.
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN GREATEST(1, FLOOR(SQRT(xp / 100.0))::int + 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Auto-update level when XP changes
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level := calculate_level(NEW.total_xp);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER user_level_trigger
  BEFORE UPDATE ON user_xp
  FOR EACH ROW
  WHEN (NEW.total_xp IS DISTINCT FROM OLD.total_xp)
  EXECUTE FUNCTION update_user_level();

-- RLS
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own XP" ON user_xp FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "XP managed by system" ON user_xp FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users see own transactions" ON xp_transactions FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Achievements visible to all" ON achievements FOR SELECT USING (true);

CREATE POLICY "Users see own achievements" ON user_achievements FOR SELECT USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_xp_user ON user_xp(user_id);
CREATE INDEX IF NOT EXISTS idx_user_xp_level ON user_xp(level DESC);
CREATE INDEX IF NOT EXISTS idx_user_xp_total ON user_xp(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
