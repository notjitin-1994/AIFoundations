-- RLS policies for 3-tier access: learner (self), team (org), admin (all)

-- Helper function: get current user's organization_id
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
SELECT organization_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: is current user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND app_role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- profiles RLS
CREATE POLICY "Profiles: self select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles: self update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Profiles: org members select" ON profiles FOR SELECT USING (organization_id = get_user_org_id() AND organization_id IS NOT NULL);
CREATE POLICY "Profiles: admin select all" ON profiles FOR SELECT USING (is_admin());

-- organizations RLS
CREATE POLICY "Orgs: member select" ON organizations FOR SELECT USING (id = get_user_org_id());
CREATE POLICY "Orgs: admin select all" ON organizations FOR SELECT USING (is_admin());

-- xapi_statements RLS
CREATE POLICY "xAPI: self insert" ON xapi_statements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "xAPI: self select" ON xapi_statements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "xAPI: org select" ON xapi_statements FOR SELECT USING (organization_id = get_user_org_id() AND organization_id IS NOT NULL);
CREATE POLICY "xAPI: admin select all" ON xapi_statements FOR SELECT USING (is_admin());

-- module_progress RLS
CREATE POLICY "Progress: self insert" ON module_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Progress: self select" ON module_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Progress: self update" ON module_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Progress: org select" ON module_progress FOR SELECT USING (organization_id = get_user_org_id() AND organization_id IS NOT NULL);
CREATE POLICY "Progress: admin select all" ON module_progress FOR SELECT USING (is_admin());

-- assessment_results RLS
CREATE POLICY "Assessments: self insert" ON assessment_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Assessments: self select" ON assessment_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Assessments: org select" ON assessment_results FOR SELECT USING (organization_id = get_user_org_id() AND organization_id IS NOT NULL);
CREATE POLICY "Assessments: admin select all" ON assessment_results FOR SELECT USING (is_admin());
