-- ============================================================
-- Migration: 012_add_invitation_sent_at.sql
-- Description: Track when an invitation link was shared/sent
-- ============================================================

alter table public.invitations
  add column if not exists sent_at timestamptz;
