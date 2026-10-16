-- FinControl: execute este script no SQL Editor do seu projeto Supabase.
-- As políticas RLS garantem que cada pessoa leia e altere somente os próprios dados.

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  description text not null check (char_length(description) between 1 and 120),
  amount numeric(12,2) not null check (amount > 0),
  type text not null check (type in ('income', 'expense')),
  category text not null,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.budgets (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  monthly_limit numeric(12,2) not null default 0 check (monthly_limit >= 0),
  updated_at timestamptz not null default now()
);

alter table public.transactions enable row level security;
alter table public.budgets enable row level security;

drop policy if exists "Users manage own transactions" on public.transactions;
create policy "Users manage own transactions" on public.transactions
  for all to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users manage own budget" on public.budgets;
create policy "Users manage own budget" on public.budgets
  for all to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
