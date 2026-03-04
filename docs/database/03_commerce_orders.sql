-- ============================================================
-- LIDERA TREINAMENTOS - P0.1 Commerce Foundation
-- Orders, order_items, payments, webhook_events
-- Execute in Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- 1) ORDERS
-- ------------------------------------------------------------
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'canceled', 'refunded')),
  currency text not null default 'BRL',
  subtotal_amount numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null default 0,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_type text not null check (product_type in ('course')),
  course_id uuid references public.courses(id) on delete set null,
  title text not null,
  unit_amount numeric(10,2) not null,
  quantity integer not null default 1 check (quantity > 0),
  line_total numeric(10,2) not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.payments (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete set null,
  provider text not null default 'stripe',
  provider_event_id text unique,
  provider_checkout_session_id text,
  provider_payment_intent_id text,
  amount numeric(10,2) not null default 0,
  currency text not null default 'BRL',
  status text not null check (status in ('pending', 'succeeded', 'failed', 'refunded')),
  raw_payload jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.webhook_events (
  id uuid default uuid_generate_v4() primary key,
  provider text not null,
  provider_event_id text not null unique,
  event_type text not null,
  status text not null default 'received' check (status in ('received', 'processed', 'ignored', 'error')),
  error_message text,
  payload jsonb,
  received_at timestamptz not null default timezone('utc'::text, now()),
  processed_at timestamptz
);

-- ------------------------------------------------------------
-- 2) updated_at trigger
-- ------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();

-- ------------------------------------------------------------
-- 3) Indexes
-- ------------------------------------------------------------
create index if not exists idx_orders_user_id_created_at on public.orders(user_id, created_at desc);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_payments_order_id on public.payments(order_id);
create index if not exists idx_payments_provider_payment_intent_id on public.payments(provider_payment_intent_id);
create index if not exists idx_webhook_events_provider_event_id on public.webhook_events(provider_event_id);

-- ------------------------------------------------------------
-- 4) RLS
-- ------------------------------------------------------------
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.webhook_events enable row level security;

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
  on public.orders
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own orders" on public.orders;
create policy "Users can insert own orders"
  on public.orders
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can view own order items" on public.order_items;
create policy "Users can view own order items"
  on public.order_items
  for select
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own order items" on public.order_items;
create policy "Users can insert own order items"
  on public.order_items
  for insert
  with check (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

drop policy if exists "Users can view own payments" on public.payments;
create policy "Users can view own payments"
  on public.payments
  for select
  using (
    order_id is not null
    and exists (
      select 1
      from public.orders o
      where o.id = payments.order_id
        and o.user_id = auth.uid()
    )
  );

-- webhook_events is for service-role processing only.

-- ------------------------------------------------------------
-- 5) Helpful checks
-- ------------------------------------------------------------
-- select * from public.orders order by created_at desc limit 20;
-- select * from public.payments order by created_at desc limit 20;
-- select * from public.webhook_events order by received_at desc limit 20;
