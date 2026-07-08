-- Initial Supabase schema for AI Foundations
-- Tables: organizations, profiles, xapi_statements, module_progress, assessment_results

-- 1. Organizations (no foreign keys)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'individual' CHECK (plan IN ('individual', 'team', 'enterprise')),
  max_seats INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Profiles (references auth.users and organizations)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  app_role TEXT NOT NULL DEFAULT 'learner' CHECK (app_role IN ('learner', 'team_admin', 'admin')),
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. xAPI statements (references auth.users and organizations)
CREATE TABLE xapi_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  actor_id TEXT NOT NULL,
  verb_id TEXT NOT NULL,
  verb_display TEXT,
  object_id TEXT NOT NULL,
  object_name TEXT,
  object_description TEXT,
  result_score REAL,
  result_success BOOLEAN,
  result_completion BOOLEAN,
  context_module_id TEXT,
  context_slide_id TEXT,
  context_lesson_index INTEGER,
  stored TIMESTAMPTZ NOT NULL DEFAULT now(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  statement JSONB NOT NULL
);

-- 4. Indexes on xapi_statements
CREATE INDEX idx_xapi_user_time ON xapi_statements(user_id, timestamp DESC);
CREATE INDEX idx_xapi_org_time ON xapi_statements(organization_id, timestamp DESC);
CREATE INDEX idx_xapi_verb_time ON xapi_statements(verb_id, timestamp DESC);
CREATE INDEX idx_xapi_object_time ON xapi_statements(object_id, timestamp DESC);
CREATE INDEX idx_xapi_statement_gin ON xapi_statements USING GIN(statement);

-- 5. Module progress (references auth.users and organizations)
CREATE TABLE module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  module_id TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  project_spine TEXT,
  active_lesson_index INTEGER DEFAULT 0,
  active_slide_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- 6. Assessment results (references auth.users and organizations)
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  assessment_kind TEXT NOT NULL CHECK (assessment_kind IN ('baseline', 'module', 'final')),
  module_id TEXT,
  overall_score INTEGER NOT NULL,
  by_module JSONB,
  questions_answered INTEGER NOT NULL,
  duration_ms BIGINT,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE xapi_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
