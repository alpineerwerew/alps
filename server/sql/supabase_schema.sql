-- Alpine Connexion - Supabase/Postgres schema
-- Run in Supabase SQL editor (or psql) before import.

create extension if not exists pgcrypto;

create table if not exists public.app_users (
  chat_id text primary key,
  username text,
  first_name text,
  last_name text,
  first_seen timestamptz,
  last_seen timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_activity (
  chat_id text primary key references public.app_users(chat_id) on delete cascade,
  cart_non_empty boolean not null default false,
  items_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.cashback_wallets (
  chat_id text primary key references public.app_users(chat_id) on delete cascade,
  balance_chf numeric(12,2) not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.cashback_transactions (
  id text primary key,
  chat_id text not null references public.app_users(chat_id) on delete cascade,
  at timestamptz not null default now(),
  delta_chf numeric(12,2) not null,
  balance_after numeric(12,2) not null,
  kind text not null,
  note text,
  payment_method text
);
create index if not exists idx_cashback_transactions_chat_at on public.cashback_transactions(chat_id, at desc);

create table if not exists public.orders_history (
  id bigint primary key,
  ref text not null unique,
  chat_id text not null references public.app_users(chat_id) on delete cascade,
  username text,
  first_name text,
  last_name text,
  order_text text not null,
  items jsonb not null default '[]'::jsonb,
  products jsonb not null default '[]'::jsonb,
  product_image text,
  total_chf numeric(12,2),
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);
create index if not exists idx_orders_history_chat_created on public.orders_history(chat_id, created_at desc);

create table if not exists public.loyalty_points (
  chat_id text primary key references public.app_users(chat_id) on delete cascade,
  total_points integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.loyalty_history (
  id uuid primary key default gen_random_uuid(),
  chat_id text not null references public.app_users(chat_id) on delete cascade,
  at timestamptz not null default now(),
  points integer not null,
  kind text not null,
  order_ref text,
  order_total_chf numeric(12,2),
  note text
);
create index if not exists idx_loyalty_history_chat_at on public.loyalty_history(chat_id, at desc);

create table if not exists public.reviews (
  id bigint primary key,
  chat_id text not null references public.app_users(chat_id) on delete cascade,
  name text not null,
  rating integer not null check (rating between 1 and 5),
  title text not null,
  text text not null,
  date date not null,
  created_at timestamptz not null default now(),
  verified boolean not null default false,
  approved boolean not null default false,
  order_ref text not null,
  ordered_items jsonb not null default '[]'::jsonb,
  product_id bigint,
  product_name text,
  product_image text
);

-- one review per order reference + product for same user
create unique index if not exists uq_reviews_user_order_product
  on public.reviews(chat_id, order_ref, coalesce(product_id, -1));

create index if not exists idx_reviews_approved_created on public.reviews(approved, created_at desc);

