-- LDERA TREINAMENTOS
-- Sprint 2: Core Educational Module (LMS)
-- Execute this script in your Supabase SQL Editor.

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- 1. Create Tables
drop table if exists public.progress cascade;
drop table if exists public.enrollments cascade;
drop table if exists public.lessons cascade;
drop table if exists public.modules cascade;
drop table if exists public.courses cascade;

create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid null, -- Null for global courses. To be linked to 'tenants' in Phase 2
  title text not null,
  description text null,
  thumbnail_url text null,
  price numeric(10,2) default 0.00,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  order_index integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  video_url text null,
  content_text text null,
  duration_seconds integer default 0,
  order_index integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  status text default 'active' check (status in ('active', 'completed', 'expired')),
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

create table public.progress (
  id uuid default uuid_generate_v4() primary key,
  enrollment_id uuid references public.enrollments(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  is_completed boolean default false,
  watch_time_seconds integer default 0,
  last_accessed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(enrollment_id, lesson_id)
);

-- 2. Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger updated_at for tables
create trigger set_updated_at
  before update on public.courses
  for each row execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.modules
  for each row execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.lessons
  for each row execute function public.handle_updated_at();

-- 3. Row Level Security Setup
-- Enable RLS on all tables
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.progress enable row level security;

-- Policies for Phase 1 (B2C Focus - Simplified)
-- Public can view published courses
create policy "Anyone can view published courses"
  on public.courses for select using (is_published = true);

-- Public can view modules of published courses
create policy "Anyone can view modules of published courses"
  on public.modules for select using (
    exists (select 1 from public.courses where id = modules.course_id and is_published = true)
  );

-- Users can only view lessons if they are enrolled in the course
create policy "Users can view lessons if enrolled"
  on public.lessons for select using (
    exists (
      select 1 from public.enrollments e
      join public.modules m on m.course_id = e.course_id
      where m.id = lessons.module_id and e.user_id = auth.uid() and e.status = 'active'
    )
  );

-- Users can only see their own enrollments
create policy "Users can view own enrollments"
  on public.enrollments for select using (auth.uid() = user_id);

-- Users can only see and update their own progress
create policy "Users can view own progress"
  on public.progress for select using (
    exists (select 1 from public.enrollments where id = progress.enrollment_id and user_id = auth.uid())
  );

create policy "Users can update own progress"
  on public.progress for all using (
    exists (select 1 from public.enrollments where id = progress.enrollment_id and user_id = auth.uid())
  );

-- 4. Seed Fake Data (1 Course, 1 Module, 2 Lessons) for Development
-- We will use hardcoded UUIDs so the application knows what to fetch in testing
insert into public.courses (id, title, description, thumbnail_url, price, is_published)
values 
  ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Liderança Exponencial', 'Desenvolva métricas de performance humana com metodologias de HRTech.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop', 997.00, true);

insert into public.modules (id, course_id, title, order_index)
values
  ('b2c3d4e5-f6a7-8901-2345-67890abcdef1', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Fundamentos de Gestão B2B', 1);

insert into public.lessons (id, module_id, title, video_url, content_text, duration_seconds, order_index)
values
  ('c3d4e5f6-a7b8-9012-3456-7890abcdef12', 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', '1. O Framework de Performance', 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', 'Nesta aula, apresentamos o framework básico.', 600, 1),
  ('d4e5f6a7-b8c9-0123-4567-890abcdef123', 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', '2. Aplicação em Startups', 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', 'Entenda como os dados auxiliam a tomada de decisão no ambiente Tech.', 1200, 2);
  
-- Note: Replace 'your-user-id-here' manually in the SQL editor below if you want automatic enrollment
-- insert into public.enrollments (user_id, course_id) values ('--your-user-id--', 'a1b2c3d4-e5f6-7890-1234-567890abcdef');
