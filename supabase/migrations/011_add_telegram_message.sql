-- ============================================================
-- Migration: 011_add_telegram_message.sql
-- Description: Add telegram_message_km and telegram_message_en columns to wedding_settings
-- ============================================================

alter table public.wedding_settings
  add column if not exists telegram_message_km text default '',
  add column if not exists telegram_message_en text default '';
