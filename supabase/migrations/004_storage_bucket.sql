-- ============================================================
-- Migration: 004_storage_bucket.sql
-- Description: Create public storage bucket for wedding photos
-- ============================================================

-- 1. Insert bucket if it doesn't already exist
insert into storage.buckets (id, name, public)
values ('wedding-photos', 'wedding-photos', true)
on conflict (id) do update set public = true;

-- 2. Allow public access to view photos
drop policy if exists "Public Access to Wedding Photos" on storage.objects;
create policy "Public Access to Wedding Photos"
  on storage.objects for select
  using (bucket_id = 'wedding-photos');

-- 3. Allow authenticated users (admin) to upload photos
drop policy if exists "Authenticated Upload to Wedding Photos" on storage.objects;
create policy "Authenticated Upload to Wedding Photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'wedding-photos');

-- 4. Allow authenticated users (admin) to delete photos
drop policy if exists "Authenticated Delete Wedding Photos" on storage.objects;
create policy "Authenticated Delete Wedding Photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'wedding-photos');
