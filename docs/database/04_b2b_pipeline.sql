-- ============================================================
-- LIDERA TREINAMENTOS - P0.2 B2B Pipeline
-- Leads + Proposals for internal sales funnel
-- Execute in Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

create table if not exists public.b2b_leads (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  company_name text not null,
  managers_range text not null,
  whatsapp text not null,
  email text,
  source_page text not null default 'homepage',
  notes text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost')),
  owner_user_id uuid references auth.users(id) on delete set null,
  last_contact_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.proposals (
  id uuid default uuid_generate_v4() primary key,
  lead_id uuid not null references public.b2b_leads(id) on delete cascade,
  title text not null,
  scope_summary text,
  estimated_value numeric(12,2),
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'rejected')),
  valid_until date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_b2b_leads_status_created_at on public.b2b_leads(status, created_at desc);
create index if not exists idx_b2b_leads_company on public.b2b_leads(company_name);
create index if not exists idx_proposals_lead_id on public.proposals(lead_id);
create index if not exists idx_proposals_status on public.proposals(status);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_b2b_leads_updated_at on public.b2b_leads;
create trigger set_b2b_leads_updated_at
  before update on public.b2b_leads
  for each row execute function public.handle_updated_at();

drop trigger if exists set_proposals_updated_at on public.proposals;
create trigger set_proposals_updated_at
  before update on public.proposals
  for each row execute function public.handle_updated_at();

alter table public.b2b_leads enable row level security;
alter table public.proposals enable row level security;

drop policy if exists "Admins can manage b2b leads" on public.b2b_leads;
create policy "Admins can manage b2b leads"
  on public.b2b_leads
  for all
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

drop policy if exists "Admins can manage proposals" on public.proposals;
create policy "Admins can manage proposals"
  on public.proposals
  for all
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

-- Optional check queries:
-- select * from public.b2b_leads order by created_at desc limit 20;
-- select * from public.proposals order by created_at desc limit 20;
