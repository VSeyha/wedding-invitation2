-- ============================================================
-- 010: Fix wedding_photos columns (storage_path, alt_text_km, alt_text_en)
-- ============================================================

alter table public.wedding_photos add column if not exists storage_path text default '';
alter table public.wedding_photos add column if not exists alt_text_km text;
alter table public.wedding_photos add column if not exists alt_text_en text;
alter table public.wedding_photos add column if not exists display_order integer not null default 0;

-- Backfill storage_path if photo_url exists
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'wedding_photos' and column_name = 'photo_url'
  ) then
    update public.wedding_photos
    set storage_path = photo_url
    where (storage_path is null or storage_path = '') and photo_url is not null;
  end if;
end;
$$;

-- Reload Supabase API schema cache
notify pgrst, 'reload schema';
