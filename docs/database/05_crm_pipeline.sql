-- ============================================================
-- LIDERA TREINAMENTOS - CRM Pipeline (SDR + Closer + Funil)
-- Prospects, Activities, Lead Scoring
-- Execute in Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. CRM PROSPECTS (SDR LinkedIn Workspace)
-- ============================================================

create table if not exists public.crm_prospects (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  job_title text not null,
  job_function text not null check (job_function in (
    'supervisor', 'coordenador', 'gerente', 'diretor', 'vp', 'c_level', 'rh', 'treinamento', 'outro'
  )),
  company_name text not null,
  company_size text check (company_size in ('1-50', '51-200', '201-500', '501-1000', '1000+')),
  linkedin_url text,
  email text,
  phone text,
  city text,
  state text,
  outreach_status text not null default 'not_contacted' check (outreach_status in (
    'not_contacted', 'connection_sent', 'connected', 'message_sent', 'replied', 'meeting_scheduled', 'converted', 'not_interested'
  )),
  sdr_owner_id uuid references auth.users(id) on delete set null,
  notes text,
  converted_lead_id uuid references public.b2b_leads(id) on delete set null,
  last_outreach_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_crm_prospects_function on public.crm_prospects(job_function);
create index if not exists idx_crm_prospects_status on public.crm_prospects(outreach_status);
create index if not exists idx_crm_prospects_company on public.crm_prospects(company_name);
create index if not exists idx_crm_prospects_created on public.crm_prospects(created_at desc);

-- ============================================================
-- 2. CRM ACTIVITIES (Timeline de atividades)
-- ============================================================

create table if not exists public.crm_activities (
  id uuid default uuid_generate_v4() primary key,
  lead_id uuid references public.b2b_leads(id) on delete cascade,
  prospect_id uuid references public.crm_prospects(id) on delete cascade,
  activity_type text not null check (activity_type in (
    'note', 'call', 'email', 'linkedin_message', 'meeting', 'proposal', 'status_change', 'qualification'
  )),
  title text not null,
  description text,
  outcome text,
  scheduled_at timestamptz,
  completed_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc'::text, now()),

  constraint crm_activities_entity_check check (
    (lead_id is not null) or (prospect_id is not null)
  )
);

create index if not exists idx_crm_activities_lead on public.crm_activities(lead_id, created_at desc);
create index if not exists idx_crm_activities_prospect on public.crm_activities(prospect_id, created_at desc);

-- ============================================================
-- 3. CRM LEAD SCORES (Closer BANT Qualification)
-- ============================================================

create table if not exists public.crm_lead_scores (
  id uuid default uuid_generate_v4() primary key,
  lead_id uuid not null references public.b2b_leads(id) on delete cascade unique,
  budget_score smallint not null default 0 check (budget_score between 0 and 5),
  authority_score smallint not null default 0 check (authority_score between 0 and 5),
  need_score smallint not null default 0 check (need_score between 0 and 5),
  timeline_score smallint not null default 0 check (timeline_score between 0 and 5),
  total_score smallint generated always as (budget_score + authority_score + need_score + timeline_score) stored,
  qualification_status text not null default 'pending' check (qualification_status in (
    'pending', 'qualified', 'unqualified', 'nurturing'
  )),
  closer_notes text,
  qualified_by uuid references auth.users(id) on delete set null,
  qualified_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_crm_lead_scores_status on public.crm_lead_scores(qualification_status);
create index if not exists idx_crm_lead_scores_total on public.crm_lead_scores(total_score desc);

-- ============================================================
-- 4. ENHANCED B2B LEADS — add pipeline_stage + temperature
-- ============================================================

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'b2b_leads' and column_name = 'pipeline_stage'
  ) then
    alter table public.b2b_leads add column pipeline_stage text not null default 'prospecting'
      check (pipeline_stage in (
        'prospecting', 'first_contact', 'qualification', 'meeting', 'proposal', 'negotiation', 'won', 'lost'
      ));
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'b2b_leads' and column_name = 'temperature'
  ) then
    alter table public.b2b_leads add column temperature text not null default 'cold'
      check (temperature in ('cold', 'warm', 'hot'));
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'b2b_leads' and column_name = 'estimated_value'
  ) then
    alter table public.b2b_leads add column estimated_value numeric(12,2);
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'b2b_leads' and column_name = 'next_action'
  ) then
    alter table public.b2b_leads add column next_action text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'b2b_leads' and column_name = 'next_action_at'
  ) then
    alter table public.b2b_leads add column next_action_at timestamptz;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'b2b_leads' and column_name = 'lost_reason'
  ) then
    alter table public.b2b_leads add column lost_reason text;
  end if;
end $$;

create index if not exists idx_b2b_leads_pipeline_stage on public.b2b_leads(pipeline_stage);
create index if not exists idx_b2b_leads_temperature on public.b2b_leads(temperature);

-- ============================================================
-- 5. TRIGGERS
-- ============================================================

drop trigger if exists set_crm_prospects_updated_at on public.crm_prospects;
create trigger set_crm_prospects_updated_at
  before update on public.crm_prospects
  for each row execute function public.handle_updated_at();

drop trigger if exists set_crm_lead_scores_updated_at on public.crm_lead_scores;
create trigger set_crm_lead_scores_updated_at
  before update on public.crm_lead_scores
  for each row execute function public.handle_updated_at();

-- ============================================================
-- 6. RLS POLICIES
-- ============================================================

alter table public.crm_prospects enable row level security;
alter table public.crm_activities enable row level security;
alter table public.crm_lead_scores enable row level security;

drop policy if exists "Admins can manage crm_prospects" on public.crm_prospects;
create policy "Admins can manage crm_prospects"
  on public.crm_prospects for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Admins can manage crm_activities" on public.crm_activities;
create policy "Admins can manage crm_activities"
  on public.crm_activities for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Admins can manage crm_lead_scores" on public.crm_lead_scores;
create policy "Admins can manage crm_lead_scores"
  on public.crm_lead_scores for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
