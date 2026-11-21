-- ============================================================
-- Migration: 007_add_gift_info.sql
-- Description: Add gift_info JSONB column to wedding_settings
-- ============================================================

alter table public.wedding_settings
  add column if not exists gift_info jsonb default '{"enabled":true,"qr_code_url":"","bank_name":"","account_name_km":"","account_name_en":"","account_number":"","message_km":"","message_en":""}'::jsonb;
