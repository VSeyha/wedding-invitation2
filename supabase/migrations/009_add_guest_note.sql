-- ============================================================
-- 009: Add note/side column to guests table
-- Supports classifying guests by wedding side ("ខាងប្រុស" / "ខាងស្រី") or notes
-- ============================================================

alter table public.guests add column if not exists note text default '';
create index if not exists guests_note_idx on public.guests (note);
