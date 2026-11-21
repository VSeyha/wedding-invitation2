-- ============================================================
-- FULL PRODUCTION SCHEMA & INITIAL SETUP FOR SUPABASE
-- Run this entire script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================================
-- 0. GRANT ROLES PERMISSIONS
grant usage on schema public to postgres,
  anon,
  authenticated,
  service_role;
grant all on all tables in schema public to postgres,
  anon,
  authenticated,
  service_role;
grant all on all routines in schema public to postgres,
  anon,
  authenticated,
  service_role;
grant all on all sequences in schema public to postgres,
  anon,
  authenticated,
  service_role;
alter default privileges in schema public
grant all on tables to postgres,
  anon,
  authenticated,
  service_role;
alter default privileges in schema public
grant all on routines to postgres,
  anon,
  authenticated,
  service_role;
alter default privileges in schema public
grant all on sequences to postgres,
  anon,
  authenticated,
  service_role;
-- 1. TABLE: wedding_settings
create table if not exists public.wedding_settings (
  id uuid primary key default gen_random_uuid(),
  bride_name_km text not null default '',
  bride_name_en text not null default '',
  groom_name_km text not null default '',
  groom_name_en text not null default '',
  wedding_date timestamptz,
  venue_name_km text not null default '',
  venue_name_en text not null default '',
  venue_address_km text not null default '',
  venue_address_en text not null default '',
  google_maps_url text not null default '',
  invitation_message_km text not null default '',
  invitation_message_en text not null default '',
  groom_photo_url text default '',
  bride_photo_url text default '',
  our_story jsonb default '[]'::jsonb,
  gift_info jsonb default '{"enabled":true,"qr_code_url":"","bank_name":"","account_name_km":"","account_name_en":"","account_number":"","message_km":"","message_en":""}'::jsonb,
  gallery_config jsonb default '{"layout":"grid","columns_mobile":2,"columns_desktop":3,"aspect_ratio":"square","card_style":"gold-frame","gap":"normal","max_display":"all"}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Ensure all extended columns exist if table was previously created
alter table public.wedding_settings
add column if not exists groom_photo_url text default '';
alter table public.wedding_settings
add column if not exists bride_photo_url text default '';
alter table public.wedding_settings
add column if not exists our_story jsonb default '[]'::jsonb;
alter table public.wedding_settings
add column if not exists gift_info jsonb default '{"enabled":true,"qr_code_url":"","bank_name":"","account_name_km":"","account_name_en":"","account_number":"","message_km":"","message_en":""}'::jsonb;
alter table public.wedding_settings
add column if not exists gallery_config jsonb default '{"layout":"grid","columns_mobile":2,"columns_desktop":3,"aspect_ratio":"square","card_style":"gold-frame","gap":"normal","max_display":"all"}'::jsonb;
-- 2. TABLE: guests
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists guests_name_idx on public.guests (name);
-- 3. TABLE: invitations
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.guests(id) on delete cascade,
  token uuid not null unique default gen_random_uuid(),
  status text not null default 'active' check (status in ('active', 'revoked')),
  opened_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists invitations_token_idx on public.invitations (token);
create index if not exists invitations_guest_id_idx on public.invitations (guest_id);
create index if not exists invitations_status_idx on public.invitations (status);
-- 4. TABLE: rsvps
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null unique references public.invitations(id) on delete cascade,
  attendance_status text not null check (
    attendance_status in ('attending', 'not_attending')
  ),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists rsvps_invitation_id_idx on public.rsvps (invitation_id);
create index if not exists rsvps_status_idx on public.rsvps (attendance_status);
-- 5. TABLE: wedding_programmes
create table if not exists public.wedding_programmes (
  id uuid primary key default gen_random_uuid(),
  title_km text not null default '',
  title_en text not null default '',
  description_km text,
  description_en text,
  event_time timestamptz not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists wedding_programmes_order_idx on public.wedding_programmes (display_order);
-- 6. TABLE: wedding_photos
create table if not exists public.wedding_photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null default '',
  alt_text_km text,
  alt_text_en text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.wedding_photos
add column if not exists storage_path text not null default '';
alter table public.wedding_photos
add column if not exists photo_url text default '';
alter table public.wedding_photos
alter column photo_url drop not null;
alter table public.wedding_photos
add column if not exists alt_text_km text;
alter table public.wedding_photos
add column if not exists alt_text_en text;
alter table public.wedding_photos
add column if not exists display_order integer not null default 0;
create index if not exists wedding_photos_order_idx on public.wedding_photos (display_order);
-- 7. TABLE: wedding_appearance
create table if not exists public.wedding_appearance (
  id uuid primary key default gen_random_uuid(),
  theme_name text not null default 'Khmer Royal Burgundy & Gold',
  theme_config jsonb not null default '{}'::jsonb,
  background_config jsonb not null default '{}'::jsonb,
  animation_config jsonb not null default '{}'::jsonb,
  opening_animation_config jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);
create index if not exists wedding_appearance_published_idx on public.wedding_appearance (is_published);
-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
alter table public.wedding_settings enable row level security;
alter table public.guests enable row level security;
alter table public.invitations enable row level security;
alter table public.rsvps enable row level security;
alter table public.wedding_programmes enable row level security;
alter table public.wedding_photos enable row level security;
alter table public.wedding_appearance enable row level security;
-- Drop existing policies if any to ensure clean idempotent execution
drop policy if exists "admin_all_wedding_settings" on public.wedding_settings;
drop policy if exists "public_read_wedding_settings" on public.wedding_settings;
create policy "admin_all_wedding_settings" on public.wedding_settings for all to authenticated using (true) with check (true);
create policy "public_read_wedding_settings" on public.wedding_settings for
select to anon,
  authenticated using (true);
drop policy if exists "admin_all_guests" on public.guests;
create policy "admin_all_guests" on public.guests for all to authenticated using (true) with check (true);
drop policy if exists "admin_all_invitations" on public.invitations;
create policy "admin_all_invitations" on public.invitations for all to authenticated using (true) with check (true);
drop policy if exists "admin_all_rsvps" on public.rsvps;
create policy "admin_all_rsvps" on public.rsvps for all to authenticated using (true) with check (true);
drop policy if exists "admin_all_wedding_programmes" on public.wedding_programmes;
drop policy if exists "public_read_wedding_programmes" on public.wedding_programmes;
create policy "admin_all_wedding_programmes" on public.wedding_programmes for all to authenticated using (true) with check (true);
create policy "public_read_wedding_programmes" on public.wedding_programmes for
select to anon using (true);
drop policy if exists "admin_all_wedding_photos" on public.wedding_photos;
drop policy if exists "public_read_wedding_photos" on public.wedding_photos;
create policy "admin_all_wedding_photos" on public.wedding_photos for all to authenticated using (true) with check (true);
create policy "public_read_wedding_photos" on public.wedding_photos for
select to anon using (true);
drop policy if exists "admin_all_wedding_appearance" on public.wedding_appearance;
drop policy if exists "public_read_wedding_appearance" on public.wedding_appearance;
create policy "admin_all_wedding_appearance" on public.wedding_appearance for all to authenticated using (true) with check (true);
create policy "public_read_wedding_appearance" on public.wedding_appearance for
select to anon using (is_published = true);
-- ============================================================
-- STORAGE BUCKET: wedding-photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('wedding-photos', 'wedding-photos', true) on conflict (id) do
update
set public = true;
drop policy if exists "Public Access to Wedding Photos" on storage.objects;
create policy "Public Access to Wedding Photos" on storage.objects for
select using (bucket_id = 'wedding-photos');
drop policy if exists "Authenticated Upload to Wedding Photos" on storage.objects;
create policy "Authenticated Upload to Wedding Photos" on storage.objects for
insert to authenticated with check (bucket_id = 'wedding-photos');
drop policy if exists "Authenticated Delete Wedding Photos" on storage.objects;
create policy "Authenticated Delete Wedding Photos" on storage.objects for delete to authenticated using (bucket_id = 'wedding-photos');
-- ============================================================
-- DEFAULT SEED DATA
-- ============================================================
do $$ begin if not exists (
  select 1
  from public.wedding_settings
  limit 1
) then
insert into public.wedding_settings (
    bride_name_km,
    bride_name_en,
    groom_name_km,
    groom_name_en,
    wedding_date,
    venue_name_km,
    venue_name_en,
    venue_address_km,
    venue_address_en,
    google_maps_url,
    invitation_message_km,
    invitation_message_en
  )
values (
    'ស ណារី',
    'Sar Nary',
    'វ៉េត សីហា',
    'Vet Seyha',
    now() + interval '55 days',
    'គេហដ្ថានខាងស្រី',
    'Bride House',
    'ភូមិព្រៃបន្ទាយ ឃុំស្វាយយា ស្រុកស្វាយជ្រុំ ខេត្តស្វាយរៀង',
    'Prey BonTeay Village, Svay Yea Commune, Svay Chrum District, Svay Rieng Province',
    'https://maps.google.com',
    'យើងខ្ញុំមានកិត្តិយសដ៏ខ្ពង់ខ្ពស់សូមគោរពអញ្ជើញ ចូលរួមជាអធិបតី និងជាសាក្សីក្នុងពិធីសិរីមង្គលអាពាហ៍ពិពាហ៍របស់យើងខ្ញុំ',
    'We joyfully request the honor of your presence to celebrate our wedding ceremony and witness our union.'
  );
end if;
end;
$$;
do $$ begin if not exists (
  select 1
  from public.wedding_appearance
  limit 1
) then
insert into public.wedding_appearance (
    theme_name,
    theme_config,
    background_config,
    animation_config,
    opening_animation_config,
    is_published
  )
values (
    'Khmer Royal Burgundy & Gold',
    '{"primary":"#641D2D","secondary":"#C9A24A","bg":"#F7F0E3","text":"#3C2925","heading":"#641D2D","border":"#C9A24A","accent":"#E5C77A","highlight":"#E5C77A"}'::jsonb,
    '{"type":"none","opacity":0.15,"overlay_color":"#641D2D","overlay_opacity":0.05}'::jsonb,
    '{"enabled":true,"preset":"lotus_petals","speed":1,"particle_quantity":25,"object_size":24,"opacity":0.7,"direction":"down","intensity":1,"desktop_quality":"high","mobile_quality":"medium"}'::jsonb,
    '{"style":"golden_seal","duration":1.6,"speed":1,"sound_enabled":false}'::jsonb,
    true
  );
end if;
end;
$$;