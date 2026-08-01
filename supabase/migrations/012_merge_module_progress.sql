-- Migration: 012_merge_module_progress.sql
-- Description: Server-authoritative atomic MERGE write path for module progress.
-- Industry-standard pattern (2026 sync-engine consensus): the server stays the
-- source of truth; clients send their full optimistic per-module state and the
-- server MERGES instead of replacing, so two browsers' completions UNION instead
-- of one clobbering the other.

-- Merge helper: union two JSONB arrays, preserving element types (strings AND
-- numbers — completed_lessons holds numeric indices, completed_slides strings).
CREATE OR REPLACE FUNCTION public.merge_jsonb_arrays(a jsonb, b jsonb)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog, public
AS $$
  SELECT COALESCE(jsonb_agg(DISTINCT elem), '[]'::jsonb)
  FROM (
    SELECT jsonb_array_elements(COALESCE(a, '[]'::jsonb)) AS elem
    UNION
    SELECT jsonb_array_elements(COALESCE(b, '[]'::jsonb))
  ) s;
$$;

-- Merge helper: deep-merge {"moduleId": [array]} maps with per-module array union.
CREATE OR REPLACE FUNCTION public.merge_module_maps(existing jsonb, incoming jsonb)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog, public
AS $$
  SELECT COALESCE(existing, '{}'::jsonb) || COALESCE(
    (SELECT jsonb_object_agg(k, public.merge_jsonb_arrays(existing->k, incoming->k))
     FROM jsonb_object_keys(incoming) k),
    '{}'::jsonb);
$$;

-- Merge helper: gamification — GREATEST xp/time/streak, union badges/tools,
-- latest login date wins.
CREATE OR REPLACE FUNCTION public.merge_gamification(existing jsonb, incoming jsonb)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog, public
AS $$
  SELECT CASE
    WHEN existing IS NULL THEN incoming
    WHEN incoming IS NULL THEN existing
    ELSE jsonb_build_object(
      'xp', GREATEST(COALESCE((existing->>'xp')::int, 0), COALESCE((incoming->>'xp')::int, 0)),
      'badges', public.merge_jsonb_arrays(existing->'badges', incoming->'badges'),
      'toolsMastered', public.merge_jsonb_arrays(existing->'toolsMastered', incoming->'toolsMastered'),
      'totalTimeSpentSeconds', GREATEST(COALESCE((existing->>'totalTimeSpentSeconds')::int, 0), COALESCE((incoming->>'totalTimeSpentSeconds')::int, 0)),
      'lastLoginDate', COALESCE(incoming->>'lastLoginDate', existing->>'lastLoginDate'),
      'currentStreak', GREATEST(COALESCE((existing->>'currentStreak')::int, 0), COALESCE((incoming->>'currentStreak')::int, 0))
    )
  END;
$$;

-- Merge helper: notes — LWW per (moduleId, lessonIndex, slideIndex) by updatedAt.
CREATE OR REPLACE FUNCTION public.merge_notes(existing jsonb, incoming jsonb)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog, public
AS $$
  SELECT COALESCE(jsonb_agg(note), '[]'::jsonb)
  FROM (
    SELECT DISTINCT ON (note_key) note
    FROM (
      SELECT jsonb_array_elements(COALESCE(existing, '[]'::jsonb)) AS note
      UNION ALL
      SELECT jsonb_array_elements(COALESCE(incoming, '[]'::jsonb))
    ) all_notes
    CROSS JOIN LATERAL (
      SELECT (note->>'moduleId') || ':' || (note->>'lessonIndex') || ':' || (note->>'slideIndex') AS note_key
    ) k
    ORDER BY note_key, (note->>'updatedAt') DESC
  ) s;
$$;

-- The authoritative merge write path.
-- SECURITY INVOKER: runs as the calling user; RLS policies apply; the user is
-- taken from auth.uid() — NEVER from the payload. Omitted payload fields leave
-- the existing values untouched (partial payloads merge, they never wipe).
CREATE OR REPLACE FUNCTION public.merge_module_progress(payload jsonb)
RETURNS SETOF public.module_progress
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_module_id text := payload ->> 'module_id';
  v_updated_at timestamptz := COALESCE((payload ->> 'updated_at')::timestamptz, now());
  v_completed boolean := COALESCE((payload ->> 'completed')::boolean, false);
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'module_id is required';
  END IF;

  RETURN QUERY
  INSERT INTO public.module_progress AS mp (
    user_id, module_id,
    active_slide_index, active_lesson_index, completed, completed_at, updated_at,
    assessments, project_spine, project_spine_answers, gamification,
    completed_lessons, completed_slides, notes
  )
  VALUES (
    v_user_id, v_module_id,
    NULLIF(payload ->> 'active_slide_index', '')::int,
    NULLIF(payload ->> 'active_lesson_index', '')::int,
    v_completed,
    CASE WHEN v_completed THEN now() ELSE NULL END,
    v_updated_at,
    NULLIF(payload -> 'assessments', 'null'::jsonb),
    NULLIF(payload ->> 'project_spine', ''),
    NULLIF(payload -> 'project_spine_answers', 'null'::jsonb),
    NULLIF(payload -> 'gamification', 'null'::jsonb),
    NULLIF(payload -> 'completed_lessons', 'null'::jsonb),
    NULLIF(payload -> 'completed_slides', 'null'::jsonb),
    NULLIF(payload -> 'notes', 'null'::jsonb)
  )
  ON CONFLICT (user_id, module_id) DO UPDATE SET
    active_slide_index = CASE
      WHEN EXCLUDED.updated_at >= mp.updated_at THEN COALESCE(EXCLUDED.active_slide_index, mp.active_slide_index)
      ELSE mp.active_slide_index END,
    active_lesson_index = CASE
      WHEN EXCLUDED.updated_at >= mp.updated_at THEN COALESCE(EXCLUDED.active_lesson_index, mp.active_lesson_index)
      ELSE mp.active_lesson_index END,
    completed = COALESCE(mp.completed, false) OR COALESCE(EXCLUDED.completed, false),
    completed_at = CASE
      WHEN (COALESCE(mp.completed, false) OR COALESCE(EXCLUDED.completed, false)) THEN COALESCE(mp.completed_at, EXCLUDED.completed_at)
      ELSE NULL END,
    updated_at = GREATEST(mp.updated_at, EXCLUDED.updated_at),
    assessments = CASE
      WHEN EXCLUDED.assessments IS NOT NULL THEN COALESCE(mp.assessments, '{}'::jsonb) || EXCLUDED.assessments
      ELSE mp.assessments END,
    project_spine = CASE
      WHEN EXCLUDED.project_spine IS NOT NULL THEN EXCLUDED.project_spine
      ELSE mp.project_spine END,
    project_spine_answers = CASE
      WHEN EXCLUDED.project_spine_answers IS NOT NULL THEN COALESCE(mp.project_spine_answers, '{}'::jsonb) || EXCLUDED.project_spine_answers
      ELSE mp.project_spine_answers END,
    gamification = public.merge_gamification(mp.gamification, EXCLUDED.gamification),
    completed_lessons = public.merge_module_maps(mp.completed_lessons, EXCLUDED.completed_lessons),
    completed_slides = public.merge_module_maps(mp.completed_slides, EXCLUDED.completed_slides),
    notes = public.merge_notes(mp.notes, EXCLUDED.notes)
  RETURNING *;
END;
$$;

-- PostgREST exposure: authenticated learners only (the function re-checks
-- auth.uid() internally); helpers are needed by the RPC under invoker RLS.
REVOKE EXECUTE ON FUNCTION public.merge_module_progress(jsonb) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.merge_jsonb_arrays(jsonb, jsonb) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.merge_module_maps(jsonb, jsonb) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.merge_gamification(jsonb, jsonb) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.merge_notes(jsonb, jsonb) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.merge_module_progress(jsonb) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.merge_jsonb_arrays(jsonb, jsonb) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.merge_module_maps(jsonb, jsonb) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.merge_gamification(jsonb, jsonb) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.merge_notes(jsonb, jsonb) TO authenticated, service_role;
