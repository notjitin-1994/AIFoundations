-- Migration: 011_allow_badge_earned.sql
-- Description: Adds 'badge_earned' to the progress_events.event_type CHECK constraint
-- (awardBadge in src/store/progress.ts logs this event type; the original constraint omitted it)

ALTER TABLE progress_events DROP CONSTRAINT progress_events_event_type_check;
ALTER TABLE progress_events ADD CONSTRAINT progress_events_event_type_check CHECK (event_type IN (
  'slide_completed',
  'lesson_completed',
  'module_completed',
  'assessment_submitted',
  'project_spine_selected',
  'gamification_xp_earned',
  'gamification_time_spent',
  'gamification_streak_updated',
  'badge_earned'
));
