-- ============================================================
-- LIDERA TREINAMENTOS - P0.3 Certificates Foundation
-- Certificates issuance + public verification support
-- Execute in Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

create table if not exists public.certificates (
  id uuid default uuid_generate_v4() primary key,
  enrollment_id uuid not null unique references public.enrollments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  verification_code text not null unique,
  pdf_url text,
  issued_at timestamptz not null default timezone('utc'::text, now()),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_certificates_user_id on public.certificates(user_id);
create index if not exists idx_certificates_course_id on public.certificates(course_id);
create index if not exists idx_certificates_verification_code on public.certificates(verification_code);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_certificates_updated_at on public.certificates;
create trigger set_certificates_updated_at
  before update on public.certificates
  for each row execute function public.handle_updated_at();

alter table public.certificates enable row level security;

drop policy if exists "Users can view own certificates" on public.certificates;
create policy "Users can view own certificates"
  on public.certificates
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own certificates" on public.certificates;
create policy "Users can insert own certificates"
  on public.certificates
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Admins can view all certificates" on public.certificates;
create policy "Admins can view all certificates"
  on public.certificates
  for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

-- Optional check queries:
-- select * from public.certificates order by issued_at desc limit 20;
