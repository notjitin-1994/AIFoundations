-- Migration: 013_harden_security_definer_functions.sql
-- Description: Remove PUBLIC/anon exposure from SECURITY DEFINER and helper
-- functions, keep only the roles that legitimately need EXECUTE, and pin
-- search_path (clears function_search_path_mutable + anon_security_definer
-- advisories; the remaining authenticated-executable warnings on is_admin /
-- get_user_org_id are required by the RLS policies that call them).

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_org_id() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_user_org_id() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin, supabase_admin, service_role, postgres;
GRANT EXECUTE ON FUNCTION public.update_updated_at() TO authenticated, service_role;

ALTER FUNCTION public.get_user_org_id() SET search_path = pg_catalog, public;
ALTER FUNCTION public.is_admin() SET search_path = pg_catalog, public;
ALTER FUNCTION public.update_updated_at() SET search_path = pg_catalog, public;
ALTER FUNCTION public.rls_auto_enable() SET search_path = pg_catalog, public;
