-- ============================================================
-- 010: Fix wedding_photos columns (photo_url, storage_path, alt_text_km, alt_text_en)
-- ============================================================
alter table public.wedding_photos
add column if not exists storage_path text default '';
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
-- Sync storage_path and photo_url if either is missing
update public.wedding_photos
set storage_path = photo_url
where (
    storage_path is null
    or storage_path = ''
  )
  and photo_url is not null;
update public.wedding_photos
set photo_url = storage_path
where (
    photo_url is null
    or photo_url = ''
  )
  and storage_path is not null;
-- Reload Supabase API schema cache
notify pgrst,
'reload schema';