-- ============================================================
-- Migration: 008_add_gallery_config.sql
-- Description: Add gallery_config JSONB column to wedding_settings
-- ============================================================

alter table public.wedding_settings
  add column if not exists gallery_config jsonb default '{"layout":"grid","columns_mobile":2,"columns_desktop":3,"aspect_ratio":"square","card_style":"gold-frame","gap":"normal","max_display":"all"}'::jsonb;
