-- Migration: 20260803032909_add_delete_policies_for_restart.sql
-- Description: Adds DELETE policies for module_progress, progress_events, certificates, and assessment_results
-- This allows users to actually restart their course by deleting their own progress records.

CREATE POLICY "Progress: self delete" ON module_progress FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Events: self delete" ON progress_events FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Certificates: self delete" ON certificates FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Assessments: self delete" ON assessment_results FOR DELETE USING (auth.uid() = user_id);
