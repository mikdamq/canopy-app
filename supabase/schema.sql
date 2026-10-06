-- Pilot requests sent from the website form.
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create extension if not exists pgcrypto;

create table if not exists public.pilot_requests (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  status        text not null default 'new' check (status in ('new', 'contacted', 'call_booked', 'pilot', 'declined')),
  locale        text not null,
  source        text,
  name          text not null,
  email         text not null,
  phone         text not null,
  role          text,
  country       text,
  farm_name     text not null,
  farm_type     text,
  area_m2       numeric,
  levels        integer,
  crops         text[] not null default '{}',
  crops_other   text,
  monitoring    text,
  sensor_brand  text,
  goals         text[] not null default '{}',
  message       text,
  user_agent    text
);

create index if not exists pilot_requests_created_at_idx on public.pilot_requests (created_at desc);

-- Lock the table down: only the server (service role key) can read or write.
alter table public.pilot_requests enable row level security;
