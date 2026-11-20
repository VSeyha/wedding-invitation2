-- ============================================================
-- Migration: 006_add_our_story.sql
-- Description: Add our_story JSONB column to wedding_settings
-- ============================================================

alter table public.wedding_settings
  add column if not exists our_story jsonb default '[]'::jsonb;
