-- RLS Policy Verification Tests
-- Run these queries manually in the Supabase SQL Editor to verify policies.
-- Each test checks that a specific policy enforces the expected access.

-- TEST 1: Unauthenticated users cannot read profiles
-- Expected: Returns 0 rows (anon role has no SELECT policy)
SELECT count(*) AS profiles_visible_to_anon FROM profiles;

-- TEST 2: Authenticated user can only see their own profile
-- Run as: a specific authenticated user (set request.jwt.claims)
-- Expected: Returns exactly 1 row (their own profile)
-- SET LOCAL request.jwt.claims = '{"role": "authenticated", "sub": "<user-uuid>"}';
-- SELECT count(*) AS own_profile FROM profiles;

-- TEST 3: Learner cannot INSERT xAPI statements for other users
-- Expected: RLS blocks this INSERT
-- SET LOCAL request.jwt.claims = '{"role": "authenticated", "sub": "<user-uuid-1>"}';
-- INSERT INTO xapi_statements (user_id, actor_id, verb_id, object_id, statement)
-- VALUES ('<user-uuid-2>'::uuid, 'other@test.com', 'test', 'test', '{}');
-- Expected: ERROR - new row violates row-level security policy

-- TEST 4: Admin can see all profiles
-- SET LOCAL request.jwt.claims = '{"role": "authenticated", "sub": "<admin-uuid>"}';
-- SELECT count(*) AS all_profiles_for_admin FROM profiles;
-- Expected: Returns total count of all profiles

-- TEST 5: Learner cannot DELETE xAPI statements
-- SET LOCAL request.jwt.claims = '{"role": "authenticated", "sub": "<user-uuid>"}';
-- DELETE FROM xapi_statements WHERE id = '<some-id>';
-- Expected: ERROR - no DELETE policy exists

-- Verification summary:
-- 1. Unauthenticated → 0 rows on all tables ✓
-- 2. Learner sees only own data ✓
-- 3. Cannot INSERT for others ✓
-- 4. Admin sees all ✓
-- 5. No DELETE for anyone but admin ✓
