ALTER TABLE module_progress
ADD COLUMN IF NOT EXISTS assessments JSONB,
ADD COLUMN IF NOT EXISTS project_spine_answers JSONB,
ADD COLUMN IF NOT EXISTS gamification JSONB,
ADD COLUMN IF NOT EXISTS completed_lessons JSONB,
ADD COLUMN IF NOT EXISTS completed_slides JSONB;
