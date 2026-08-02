-- Migration: 014_certificates.sql
-- Description: Persist issued certificates so they survive course restarts.
-- A certificate is minted ONCE per (user, course) with a stable UUID identity;
-- course restarts wipe progress data but NEVER this record. Re-completion
-- refreshes the payload while the UUID and issued_at stay constant. There is
-- deliberately NO delete policy — learners can never remove their credential.

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id),
  payload jsonb not null default '{}'::jsonb,
  issued_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table public.certificates enable row level security;

create policy "certificates_select_own" on public.certificates
  for select using (auth.uid() = user_id);

create policy "certificates_insert_own" on public.certificates
  for insert with check (auth.uid() = user_id);

create policy "certificates_update_own" on public.certificates
  for update using (auth.uid() = user_id);
