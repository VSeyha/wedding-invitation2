-- ============================================================
-- Migration: 002_rls_policies.sql
-- Description: Row-Level Security policies for all tables
--
-- Security model:
--   - Admin (authenticated Supabase user) → full access to all tables
--   - Public (anon) → read published appearance + own invitation only
--   - RSVP writes → validated against active invitation token
-- ============================================================

-- Enable RLS on all tables
alter table public.wedding_settings    enable row level security;
alter table public.guests              enable row level security;
alter table public.invitations         enable row level security;
alter table public.rsvps               enable row level security;
alter table public.wedding_programmes  enable row level security;
alter table public.wedding_photos      enable row level security;
alter table public.wedding_appearance  enable row level security;

-- ============================================================
-- wedding_settings policies
-- ============================================================

-- Admin: full access
create policy "admin_all_wedding_settings"
  on public.wedding_settings
  for all
  to authenticated
  using (true)
  with check (true);

-- Public: read only
create policy "public_read_wedding_settings"
  on public.wedding_settings
  for select
  to anon
  using (true);

-- ============================================================
-- guests policies
-- ============================================================

-- Admin: full access
create policy "admin_all_guests"
  on public.guests
  for all
  to authenticated
  using (true)
  with check (true);

-- Public: NO access to guest list (privacy protection)
-- Guests are only accessible through the invitation API (server-side)

-- ============================================================
-- invitations policies
-- ============================================================

-- Admin: full access
create policy "admin_all_invitations"
  on public.invitations
  for all
  to authenticated
  using (true)
  with check (true);

-- Public: read own invitation by token only (enforced via server API)
-- Direct DB access from anon is blocked; all public invitation reads
-- go through the server API route which validates the token server-side.

-- ============================================================
-- rsvps policies
-- ============================================================

-- Admin: full access
create policy "admin_all_rsvps"
  on public.rsvps
  for all
  to authenticated
  using (true)
  with check (true);

-- Public: insert/update RSVP (validated via server API with invitation token)
-- Direct anon DB access blocked; server API validates token ownership before write.

-- ============================================================
-- wedding_programmes policies
-- ============================================================

-- Admin: full access
create policy "admin_all_wedding_programmes"
  on public.wedding_programmes
  for all
  to authenticated
  using (true)
  with check (true);

-- Public: read only
create policy "public_read_wedding_programmes"
  on public.wedding_programmes
  for select
  to anon
  using (true);

-- ============================================================
-- wedding_photos policies
-- ============================================================

-- Admin: full access
create policy "admin_all_wedding_photos"
  on public.wedding_photos
  for all
  to authenticated
  using (true)
  with check (true);

-- Public: read only
create policy "public_read_wedding_photos"
  on public.wedding_photos
  for select
  to anon
  using (true);

-- ============================================================
-- wedding_appearance policies
-- ============================================================

-- Admin: full access
create policy "admin_all_wedding_appearance"
  on public.wedding_appearance
  for all
  to authenticated
  using (true)
  with check (true);

-- Public: read only published appearance
create policy "public_read_published_appearance"
  on public.wedding_appearance
  for select
  to anon
  using (is_published = true);
