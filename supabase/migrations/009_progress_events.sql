-- Migration: 009_progress_events.sql
-- Description: Adds an append-only event sourcing table for global progress tracking

CREATE TABLE progress_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'slide_completed', 
    'lesson_completed', 
    'module_completed', 
    'assessment_submitted', 
    'project_spine_selected',
    'gamification_xp_earned',
    'gamification_time_spent',
    'gamification_streak_updated'
  )),
  event_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient querying of a user's events in order
CREATE INDEX idx_progress_events_user_time ON progress_events(user_id, module_id, created_at ASC);
CREATE INDEX idx_progress_events_type ON progress_events(user_id, event_type, created_at ASC);

-- Enable RLS
ALTER TABLE progress_events ENABLE ROW LEVEL SECURITY;

-- Learners can only insert and read their own events
CREATE POLICY "Learners can read their own progress events"
  ON progress_events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Learners can insert their own progress events"
  ON progress_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
