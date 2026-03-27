-- ============================================
-- Events & Tickets System
-- ============================================

-- Events: workshops, imersões, treinamentos presenciais
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'workshop' CHECK (event_type IN ('workshop', 'immersion', 'training', 'webinar')),
  location TEXT,
  city TEXT,
  state TEXT DEFAULT 'GO',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  max_capacity INTEGER NOT NULL DEFAULT 10,
  current_enrollment INTEGER NOT NULL DEFAULT 0,
  price NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'sold_out', 'completed', 'canceled')),
  mentor_name TEXT DEFAULT 'Claudemir Domingos',
  cover_image_url TEXT,
  related_course_id UUID REFERENCES courses(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Event tickets: individual reservations
CREATE TABLE IF NOT EXISTS event_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  ticket_code TEXT UNIQUE NOT NULL,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT,
  attendee_whatsapp TEXT,
  attendee_company TEXT,
  status TEXT NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'confirmed', 'checked_in', 'canceled', 'no_show')),
  payment_id UUID REFERENCES payments(id),
  checked_in_at TIMESTAMPTZ,
  checked_in_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Generate unique ticket code
CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_code := 'LDR-' || UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER ticket_code_trigger
  BEFORE INSERT ON event_tickets
  FOR EACH ROW
  WHEN (NEW.ticket_code IS NULL OR NEW.ticket_code = '')
  EXECUTE FUNCTION generate_ticket_code();

-- Auto-increment current_enrollment
CREATE OR REPLACE FUNCTION update_event_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status IN ('reserved', 'confirmed', 'checked_in') THEN
    UPDATE events SET current_enrollment = current_enrollment + 1, updated_at = now() WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status NOT IN ('canceled', 'no_show') AND NEW.status IN ('canceled', 'no_show') THEN
    UPDATE events SET current_enrollment = GREATEST(current_enrollment - 1, 0), updated_at = now() WHERE id = NEW.event_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER enrollment_counter_trigger
  AFTER INSERT OR UPDATE ON event_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_event_enrollment();

-- Auto mark event as sold_out
CREATE OR REPLACE FUNCTION check_event_capacity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events
  SET status = CASE
    WHEN current_enrollment >= max_capacity THEN 'sold_out'
    WHEN status = 'sold_out' AND current_enrollment < max_capacity THEN 'published'
    ELSE status
  END,
  updated_at = now()
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER capacity_check_trigger
  AFTER INSERT OR UPDATE ON event_tickets
  FOR EACH ROW
  EXECUTE FUNCTION check_event_capacity();

-- RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events visible to all" ON events FOR SELECT USING (true);
CREATE POLICY "Events managed by admins" ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Tickets visible to owner" ON event_tickets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Tickets managed by admins" ON event_tickets FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON event_tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON event_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_code ON event_tickets(ticket_code);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON event_tickets(status);
