-- ============================================================
-- Migration: 005_add_couple_photos.sql
-- Description: Add groom and bride photo columns to wedding_settings
-- ============================================================

alter table public.wedding_settings
  add column if not exists groom_photo_url text,
  add column if not exists bride_photo_url text;
