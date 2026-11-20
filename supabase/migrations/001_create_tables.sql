-- ============================================================
-- Migration: 001_create_tables.sql
-- Description: Create all core tables for the Khmer wedding
--              invitation system
-- ============================================================

-- NOTE: gen_random_uuid() is built-in to Supabase (PostgreSQL 14+)
-- No extension needed. Do NOT run "create extension pgcrypto" as it
-- requires superuser privileges and will fail in Supabase.

-- ============================================================
-- TABLE: wedding_settings
-- Stores general wedding information (single row)
-- ============================================================
create table if not exists public.wedding_settings (
  id                     uuid primary key default gen_random_uuid(),
  bride_name_km          text not null default '',
  bride_name_en          text not null default '',
  groom_name_km          text not null default '',
  groom_name_en          text not null default '',
  wedding_date           timestamptz,
  venue_name_km          text not null default '',
  venue_name_en          text not null default '',
  venue_address_km       text not null default '',
  venue_address_en       text not null default '',
  google_maps_url        text not null default '',
  invitation_message_km  text not null default '',
  invitation_message_en  text not null default '',
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- ============================================================
-- TABLE: guests
-- Stores guest information
-- ============================================================
create table if not exists public.guests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists guests_name_idx on public.guests (name);

-- ============================================================
-- TABLE: invitations
-- Stores individual invitation links (one per guest)
-- ============================================================
create table if not exists public.invitations (
  id          uuid primary key default gen_random_uuid(),
  guest_id    uuid not null references public.guests(id) on delete cascade,
  token       uuid not null unique default gen_random_uuid(),
  status      text not null default 'active' check (status in ('active', 'revoked')),
  opened_at   timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists invitations_token_idx    on public.invitations (token);
create index if not exists invitations_guest_id_idx on public.invitations (guest_id);
create index if not exists invitations_status_idx   on public.invitations (status);

-- ============================================================
-- TABLE: rsvps
-- Stores guest RSVP responses (one per invitation)
-- ============================================================
create table if not exists public.rsvps (
  id                 uuid primary key default gen_random_uuid(),
  invitation_id      uuid not null unique references public.invitations(id) on delete cascade,
  attendance_status  text not null check (attendance_status in ('attending', 'not_attending')),
  submitted_at       timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists rsvps_invitation_id_idx on public.rsvps (invitation_id);
create index if not exists rsvps_status_idx        on public.rsvps (attendance_status);

-- ============================================================
-- TABLE: wedding_programmes
-- Stores ceremony programme items
-- ============================================================
create table if not exists public.wedding_programmes (
  id               uuid primary key default gen_random_uuid(),
  title_km         text not null default '',
  title_en         text not null default '',
  description_km   text,
  description_en   text,
  event_time       timestamptz not null,
  display_order    integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists wedding_programmes_order_idx on public.wedding_programmes (display_order);

-- ============================================================
-- TABLE: wedding_photos
-- Stores gallery photo references (files stored in Supabase Storage)
-- ============================================================
create table if not exists public.wedding_photos (
  id             uuid primary key default gen_random_uuid(),
  storage_path   text not null,
  alt_text_km    text,
  alt_text_en    text,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now()
);

create index if not exists wedding_photos_order_idx on public.wedding_photos (display_order);

-- ============================================================
-- TABLE: wedding_appearance
-- Stores theme, background, animation configuration (JSONB)
-- Only one row should be "published" at any time
-- ============================================================
create table if not exists public.wedding_appearance (
  id                        uuid primary key default gen_random_uuid(),
  theme_name                text not null default 'Khmer Royal Burgundy & Gold',
  theme_config              jsonb not null default '{}',
  background_config         jsonb not null default '{}',
  animation_config          jsonb not null default '{}',
  opening_animation_config  jsonb not null default '{}',
  is_published              boolean not null default false,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index if not exists wedding_appearance_published_idx on public.wedding_appearance (is_published);

-- ============================================================
-- Auto-update updated_at timestamps (trigger function)
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Drop triggers before recreating (safe re-run guard)
drop trigger if exists set_updated_at_wedding_settings  on public.wedding_settings;
drop trigger if exists set_updated_at_guests            on public.guests;
drop trigger if exists set_updated_at_rsvps             on public.rsvps;
drop trigger if exists set_updated_at_wedding_programmes on public.wedding_programmes;
drop trigger if exists set_updated_at_wedding_appearance on public.wedding_appearance;

create trigger set_updated_at_wedding_settings
  before update on public.wedding_settings
  for each row execute function public.set_updated_at();

create trigger set_updated_at_guests
  before update on public.guests
  for each row execute function public.set_updated_at();

create trigger set_updated_at_rsvps
  before update on public.rsvps
  for each row execute function public.set_updated_at();

create trigger set_updated_at_wedding_programmes
  before update on public.wedding_programmes
  for each row execute function public.set_updated_at();

create trigger set_updated_at_wedding_appearance
  before update on public.wedding_appearance
  for each row execute function public.set_updated_at();
