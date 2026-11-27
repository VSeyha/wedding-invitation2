-- ============================================================
-- Migration: 011_add_telegram_message.sql
-- Description: Add telegram_message column to wedding_settings
-- ============================================================

alter table public.wedding_settings
  add column if not exists telegram_message text default '';
